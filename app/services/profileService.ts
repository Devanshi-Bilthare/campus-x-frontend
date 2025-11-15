import { getToken, getUser } from '../utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileData {
  fullName?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  city?: string;
  gender?: string;
  profileImage?: string;
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
    field: string;
    message: string;
  }>;
}

export const profileService = {
  getProfile: async (): Promise<ProfileResponse> => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch profile.');
    }

    return result;
  },

  updateProfile: async (data: ProfileData): Promise<ProfileResponse> => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const user = getUser();
    const userId = user?._id || user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      // If there are validation errors, throw them with the error structure
      if (result.errors && Array.isArray(result.errors)) {
        const error: any = new Error(result.message || 'Validation error');
        error.errors = result.errors;
        error.response = result;
        throw error;
      }
      throw new Error(result.message || 'Failed to update profile.');
    }

    return result;
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<ProfileResponse> => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update password.');
    }

    return result;
  },
};

