const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: {
    user: any;
    token: string;
  };
}

interface ForgotPasswordData {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

interface LoginData {
  username?: string;
  email?: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: any;
    token: string;
  };
}

export const authService = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to register. Please try again.');
    }

    return result;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to send reset link. Please try again.');
    }

    return result;
  },

  resetPassword: async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to reset password. Please try again.');
    }

    return result;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to login. Please check your credentials.');
    }

    return result;
  },
};

