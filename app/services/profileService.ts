import { getToken, getUser } from '../utils/auth';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

type ErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Array<
    | string
    | {
        field?: string;
        path?: string;
        message?: string;
      }
  >;
};

const extractErrorMessage = (result: ErrorResponse, fallback: string) => {
  if (result?.errors && Array.isArray(result.errors)) {
    const formattedMessages = result.errors
      .map((err) => {
        if (!err) return null;
        if (typeof err === 'string') return err;
        if (err.message && (err.field || err.path)) {
          return `${err.field || err.path}: ${err.message}`;
        }
        return err.message || null;
      })
      .filter(Boolean);

    if (formattedMessages.length) {
      if (result.message && result.message.toLowerCase() !== 'validation error') {
        return `${result.message}: ${formattedMessages.join(', ')}`;
      }
      return formattedMessages.join(', ');
    }
  }

  if (result?.message) {
    return result.message;
  }

  return fallback;
};

const parseResponse = async <T>(response: Response, fallbackMessage: string): Promise<T> => {
  const result = await response.json();

  if (!response.ok) {
    const message = extractErrorMessage(result, fallbackMessage);
    const error: any = new Error(message);
    if (result?.errors) {
      error.errors = result.errors;
    }
    if (result) {
      error.response = result;
    }
    throw error;
  }

  if (
    result?.success === false &&
    result?.message &&
    result.message.toLowerCase() === 'validation error' &&
    result.errors
  ) {
    result.message = extractErrorMessage(result, fallbackMessage);
  }

  return result;
};

const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

interface ProfileData {
  fullName?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  city?: string;
  gender?: string;
  profileImage?: string;
  profilePicture?: string;
  academics?: {
    collegeName?: string;
    branch?: string;
    semester?: number;
    yearOfGraduation?: number;
    yearOfJoining?: number;
    gpa?: number;
    degree?: string;
    yearsOfExperience?: number;
  };
  skills?: {
    academic?: string[];
    hobby?: string[];
    other?: string[];
  };
  certificates?: Array<{
    name: string;
    issuer: string;
    issueDate: string | Date;
    expiryDate?: string | Date;
    credentialId?: string;
    credentialUrl?: string;
  }>;
}

interface ProfileResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: Array<{
    field?: string;
    path?: string;
    message?: string;
  }>;
}

interface OfferingData {
  title: string;
  description: string;
  tags?: string[];
  slots: string[];
  duration: string;
  image?: string;
}

interface OfferingResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: Array<{
    field?: string;
    path?: string;
    message?: string;
  }>;
}

export const profileService = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return parseResponse<ProfileResponse>(response, 'Failed to fetch profile.');
  },

  updateProfile: async (data: ProfileData): Promise<ProfileResponse> => {
    const user = getUser();
    const userId = user?._id || user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await fetch(`${NEXT_PUBLIC_API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return parseResponse<ProfileResponse>(response, 'Failed to update profile.');
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<ProfileResponse> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/users/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    return parseResponse<ProfileResponse>(response, 'Failed to update password.');
  },

  // Offerings methods
  createOffering: async (data: OfferingData): Promise<OfferingResponse> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/offerings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return parseResponse<OfferingResponse>(response, 'Failed to create offering.');
  },

  getMyOfferings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/offerings/my/offerings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch offerings.');
    
    // Handle different response formats
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  getAllOfferings: async (): Promise<any[]> => {
    // Try with auth first, fallback to public if needed
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/offerings`, {
        method: 'GET',
        headers,
      });

      const result = await parseResponse<any>(response, 'Failed to fetch offerings.');
      
      // Handle different response formats
      if (Array.isArray(result)) {
        return result;
      }
      if (result?.data && Array.isArray(result.data)) {
        return result.data;
      }
      if (result?.success && result?.data) {
        return Array.isArray(result.data) ? result.data : [result.data];
      }
      
      return [];
    } catch (error: any) {
      // If auth fails, try public endpoint
      if (error.message?.includes('Not authenticated')) {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/offerings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await parseResponse<any>(response, 'Failed to fetch offerings.');
        
        if (Array.isArray(result)) {
          return result;
        }
        if (result?.data && Array.isArray(result.data)) {
          return result.data;
        }
        if (result?.success && result?.data) {
          return Array.isArray(result.data) ? result.data : [result.data];
        }
        
        return [];
      }
      throw error;
    }
  },

  // Booking methods
  createBooking: async (offeringId: string, slot: string, date: string | Date): Promise<any> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        offeringId,
        slot,
        date: typeof date === 'string' ? date : date.toISOString().split('T')[0],
      }),
    });

    return parseResponse<any>(response, 'Failed to create booking.');
  },

  // Bookings I made
  getMyBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/my/bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch my bookings.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  getMyPendingBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/my/pending`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch my pending bookings.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  getMyRejectedBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/my/rejected`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch my rejected bookings.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  getMyCompletedBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/my/completed`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch my completed bookings.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  getMyCancelledBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch bookings.');
    
    let bookings: any[] = [];
    if (Array.isArray(result)) {
      bookings = result;
    } else if (result?.data && Array.isArray(result.data)) {
      bookings = result.data;
    } else if (result?.success && result?.data) {
      bookings = Array.isArray(result.data) ? result.data : [result.data];
    }
    
    // Filter cancelled bookings I made
    const user = getUser();
    const userId = user?._id || user?.id;
    return bookings.filter((b: any) => {
      const bookingUserId = b.userId?._id || b.userId?.id || b.userId;
      return bookingUserId === userId && (b.status === 'cancelled' || b.status === 'canceled');
    });
  },

  getCancelledBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch bookings.');
    
    let bookings: any[] = [];
    if (Array.isArray(result)) {
      bookings = result;
    } else if (result?.data && Array.isArray(result.data)) {
      bookings = result.data;
    } else if (result?.success && result?.data) {
      bookings = Array.isArray(result.data) ? result.data : [result.data];
    }
    
    // Filter cancelled bookings for my offerings
    const user = getUser();
    const userId = user?._id || user?.id;
    return bookings.filter((b: any) => {
      const offeringOwnerId = b.offeringOwnerId?._id || b.offeringOwnerId?.id || b.offeringOwnerId;
      return offeringOwnerId === userId && (b.status === 'cancelled' || b.status === 'canceled');
    });
  },

  // Bookings for my offerings (as offering owner)
  getBookedSessions: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/my/offerings/sessions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch booked sessions.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  getReceivedBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/received`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch received bookings.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  getPendingBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/pending`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch pending bookings.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  getRejectedBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/rejected`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch rejected bookings.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  getCompletedBookings: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/completed`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch completed bookings.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  updateBookingStatus: async (bookingId: string, status: string): Promise<any> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    return parseResponse<any>(response, 'Failed to update booking status.');
  },

  getAllMyBookings: async (): Promise<any[]> => {
    // Get all bookings I made (for filtering offerings)
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/bookings/my/bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch bookings.');
    
    if (Array.isArray(result)) {
    return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<any> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return parseResponse<any>(response, 'Failed to fetch user.');
  },

  // Get booking counts for dashboard
  getBookingCounts: async (): Promise<any> => {
    try {
      const [myBookings, myPending, myRejected, myCompleted, receivedBookings, pendingRequests, rejectedBookings, completedBookings] = await Promise.all([
        profileService.getMyBookings().catch(() => []),
        profileService.getMyPendingBookings().catch(() => []),
        profileService.getMyRejectedBookings().catch(() => []),
        profileService.getMyCompletedBookings().catch(() => []),
        profileService.getReceivedBookings().catch(() => []),
        profileService.getPendingBookings().catch(() => []),
        profileService.getRejectedBookings().catch(() => []),
        profileService.getCompletedBookings().catch(() => []),
      ]);

      // For instructors: 
      // - receivedBookings: approved bookings for their offerings (from /bookings/received endpoint)
      // - completedBookings: completed bookings for their offerings (from /bookings/completed endpoint)
      // These should be mutually exclusive, but let's filter to be safe
      
      // Filter receivedBookings to exclude completed ones (in case there's overlap)
      const receivedNotCompleted = receivedBookings.filter((b: any) => {
        const status = b.status?.toLowerCase();
        return (status === 'approved' || status === 'accepted') && status !== 'completed';
      });

      // Total booked sessions = approved (not completed) + completed
      const totalBooked = receivedNotCompleted.length + completedBookings.length;

      return {
        myBookings: myBookings.length,
        myPending: myPending.length,
        myRejected: myRejected.length,
        myCompleted: myCompleted.length,
        receivedBookings: receivedNotCompleted.length, // Only approved, not completed
        pendingRequests: pendingRequests.length,
        rejectedBookings: rejectedBookings.length,
        completedBookings: completedBookings.length,
        totalBookedSessions: totalBooked,
      };
    } catch (error) {
      console.error('Failed to fetch booking counts:', error);
      return {
        myBookings: 0,
        myPending: 0,
        myRejected: 0,
        myCompleted: 0,
        receivedBookings: 0,
        pendingRequests: 0,
        rejectedBookings: 0,
        completedBookings: 0,
        totalBookedSessions: 0,
      };
    }
  },

  // Get total offerings count
  getTotalOfferingsCount: async (): Promise<number> => {
    try {
      const offerings = await profileService.getMyOfferings();
      return offerings.length;
    } catch (error) {
      console.error('Failed to fetch offerings count:', error);
      return 0;
    }
  },

  // Get top offerings by sessions booked
  getTopOfferings: async (limit: number = 6): Promise<any[]> => {
    try {
      const offerings = await profileService.getAllOfferings();
      // Sort by completedCount (sessions booked) descending
      const sorted = offerings
        .filter((off: any) => (off.completedCount || 0) > 0)
        .sort((a: any, b: any) => (b.completedCount || 0) - (a.completedCount || 0))
        .slice(0, limit);
      return sorted;
    } catch (error) {
      console.error('Failed to fetch top offerings:', error);
      return [];
    }
  },

  // Get top contributors (users with most offerings)
  getTopContributors: async (limit: number = 6): Promise<any[]> => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const result = await parseResponse<any>(response, 'Failed to fetch users.');
      const users = Array.isArray(result) ? result : (result?.data && Array.isArray(result.data) ? result.data : []);
      
      // For now, return first N users. In a real app, you'd want to sort by offerings count
      // This would require backend support to get users with their offering counts
      return users.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch top contributors:', error);
      return [];
    }
  },

  // Get top instructors by completed sessions
  getTopInstructors: async (limit: number = 6): Promise<any[]> => {
    try {
      // First, fetch all teachers
      const userResponse = await fetch(`${NEXT_PUBLIC_API_URL}/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const userResult = await parseResponse<any>(userResponse, 'Failed to fetch users.');
      const users = Array.isArray(userResult) 
        ? userResult 
        : (userResult?.data && Array.isArray(userResult.data) ? userResult.data : []);
      
      const teachers = users.filter((user: any) => user.role === 'teacher');
      
      // Fetch all bookings and filter for completed ones
      const bookingsResponse = await fetch(`${NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const bookingsResult = await parseResponse<any>(bookingsResponse, 'Failed to fetch bookings.');
      const allBookings = Array.isArray(bookingsResult) 
        ? bookingsResult 
        : (bookingsResult?.data && Array.isArray(bookingsResult.data) ? bookingsResult.data : []);
      
      // Filter for completed bookings
      const completedBookings = allBookings.filter((booking: any) => {
        const status = booking.status?.toLowerCase();
        return status === 'completed';
      });
      
      // Count sessions per instructor
      const instructorSessionCount: { [key: string]: { user: any; count: number } } = {};
      
      // Initialize all teachers with 0 sessions
      teachers.forEach((teacher: any) => {
        const teacherId = teacher._id || teacher.id;
        if (teacherId) {
          instructorSessionCount[teacherId] = {
            user: teacher,
            count: 0,
          };
        }
      });
      
      // Count completed sessions for each instructor
      completedBookings.forEach((booking: any) => {
        // Get instructor from offeringOwnerId (populated by backend)
        const instructor = booking.offeringOwnerId || booking.offeringOwner || {};
        const instructorId = instructor._id || instructor.id;
        
        if (instructorId && instructorSessionCount[instructorId]) {
          instructorSessionCount[instructorId].count += 1;
        } else if (instructorId) {
          // If instructor not in our list, add them
          instructorSessionCount[instructorId] = {
            user: instructor,
            count: 1,
          };
        }
      });
      
      // Convert to array and sort by count
      const instructorsArray = Object.values(instructorSessionCount)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, limit)
        .map((item: any) => ({
          ...item.user,
          completedSessions: item.count,
        }));
      
      return instructorsArray;
    } catch (error) {
      console.error('Failed to fetch top instructors:', error);
      return [];
    }
  },

  // Review methods
  getReviews: async (filters?: { limit?: number; skip?: number }): Promise<any> => {
    try {
      let url = `${NEXT_PUBLIC_API_URL}/reviews`;
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.skip) params.append('skip', filters.skip.toString());
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await parseResponse<any>(response, 'Failed to fetch reviews.');
      
      if (Array.isArray(result)) {
        return result;
      }
      
      return result?.data || [];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return [];
    }
  },

  getReviewsByProfile: async (profileId: string): Promise<any> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/reviews/profile/${profileId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await parseResponse<any>(response, 'Failed to fetch reviews.');
    
    if (result?.data) {
      return result.data;
    }
    
    return {
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
    };
  },

  createReview: async (profileId: string, rating: number, message: string): Promise<any> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        profileId,
        rating,
        message,
      }),
    });

    return parseResponse<any>(response, 'Failed to create review.');
  },

  getMyReviews: async (): Promise<any[]> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/reviews/my/reviews`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseResponse<any>(response, 'Failed to fetch my reviews.');
    
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.data && Array.isArray(result.data)) {
      return result.data;
    }
    if (result?.success && result?.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    }
    
    return [];
  },

  updateReview: async (reviewId: string, rating: number, message: string): Promise<any> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        rating,
        message,
      }),
    });

    return parseResponse<any>(response, 'Failed to update review.');
  },

  deleteReview: async (reviewId: string): Promise<any> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return parseResponse<any>(response, 'Failed to delete review.');
  },
};

