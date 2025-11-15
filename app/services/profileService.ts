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
    college?: string;
    branch?: string;
    semester?: number;
    yearOfGraduation?: number;
    yearOfJoining?: number;
    cgpa?: number;
    degree?: string;
    yearsOfExperience?: number;
  };
}

interface ProfileResponse {
  success: boolean;
  message?: string;
  data?: any;
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

