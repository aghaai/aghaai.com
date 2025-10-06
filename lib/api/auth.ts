import axiosInstance from './axios';

export interface RegisterRequestData {
  email: string;
}

export interface RegisterVerifyData {
  email: string;
  otp: string;
  name: string;
  password: string;
  phoneNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordRequestData {
  email: string;
}

export interface ForgotPasswordVerifyData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResendOtpData {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    _aT: string;
    _rT: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
  timestamp: string;
}

export interface MessageResponse {
  success: boolean;
  data: {
    message: string;
  };
  timestamp: string;
}

export const authAPI = {
  // Register - Step 1: Send OTP
  registerRequest: async (data: RegisterRequestData): Promise<MessageResponse> => {
    const payload: RegisterRequestData = {
      email: data.email.trim().toLowerCase(),
    };

    const response = await axiosInstance.post('/api/auth/register-request', payload);
    return response.data;
  },

  // Register - Step 2: Verify OTP and complete registration
  registerVerify: async (data: RegisterVerifyData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/api/auth/register-verify', data);
    return response.data;
  },

  // Resend OTP
  resendOtp: async (data: ResendOtpData): Promise<MessageResponse> => {
    const response = await axiosInstance.post('/api/auth/resend-otp', data);
    return response.data;
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const payload = {
      email: data.email.trim(),
      password: data.password,
    };

    const response = await axiosInstance.post('/api/auth/login', payload);
    return response.data;
  },

  // Forgot Password - Step 1: Send OTP
  forgotPasswordRequest: async (data: ForgotPasswordRequestData): Promise<MessageResponse> => {
    const response = await axiosInstance.post('/api/auth/forgot-password-request', data);
    return response.data;
  },

  // Forgot Password - Step 2: Verify OTP and reset password
  forgotPasswordVerify: async (data: ForgotPasswordVerifyData): Promise<MessageResponse> => {
    const response = await axiosInstance.post('/api/auth/forgot-password-verify', data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<MessageResponse> => {
    const response = await axiosInstance.get('/api/auth/logout');
    return response.data;
  },

  // Refresh Token (handled automatically by axios interceptor)
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.get('/api/auth/token/refresh');
    return response.data;
  },
};
