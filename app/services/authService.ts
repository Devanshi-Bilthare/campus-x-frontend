const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type ErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Array<
    | string
    | {
        field?: string;
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
        if (err.message && err.field) {
          return `${err.field}: ${err.message}`;
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

    return parseResponse<RegisterResponse>(response, 'Failed to register. Please try again.');
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return parseResponse<ForgotPasswordResponse>(response, 'Failed to send reset link. Please try again.');
  },

  resetPassword: async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return parseResponse<ResetPasswordResponse>(response, 'Failed to reset password. Please try again.');
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return parseResponse<LoginResponse>(response, 'Failed to login. Please check your credentials.');
  },
};

