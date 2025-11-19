import { getToken, getUser } from '../utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
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

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return parseResponse<ProfileResponse>(response, 'Failed to update profile.');
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<ProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/password`, {
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
    const response = await fetch(`${API_BASE_URL}/offerings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return parseResponse<OfferingResponse>(response, 'Failed to create offering.');
  },

  getMyOfferings: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/offerings/my/offerings`, {
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
      const response = await fetch(`${API_BASE_URL}/offerings`, {
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
        const response = await fetch(`${API_BASE_URL}/offerings`, {
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
  createBooking: async (offeringId: string, slot: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        offeringId,
        slot,
      }),
    });

    return parseResponse<any>(response, 'Failed to create booking.');
  },

  // Bookings I made
  getMyBookings: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings/my/bookings`, {
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
    const response = await fetch(`${API_BASE_URL}/bookings/my/pending`, {
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
    const response = await fetch(`${API_BASE_URL}/bookings/my/rejected`, {
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
    const response = await fetch(`${API_BASE_URL}/bookings/my/completed`, {
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

  // Bookings for my offerings (as offering owner)
  getBookedSessions: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings/my/offerings/sessions`, {
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
    const response = await fetch(`${API_BASE_URL}/bookings/received`, {
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
    const response = await fetch(`${API_BASE_URL}/bookings/pending`, {
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
    const response = await fetch(`${API_BASE_URL}/bookings/rejected`, {
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
    const response = await fetch(`${API_BASE_URL}/bookings/completed`, {
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
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    return parseResponse<any>(response, 'Failed to update booking status.');
  },

  getAllMyBookings: async (): Promise<any[]> => {
    // Get all bookings I made (for filtering offerings)
    const response = await fetch(`${API_BASE_URL}/bookings/my/bookings`, {
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
};

