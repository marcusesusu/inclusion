import { Enable2FAResponse, LoginResponse, Setup2FAResponse, User } from '@/types/auth';
import { apiClient } from './axios';
import { ForgotPasswordInput, LoginInput, OtpVerifyInput, ResetPasswordInput } from './validations/auth';

export const authApi = {
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', null, {
      params: {
        email: credentials.email,
        password: credentials.password,
      },
    });
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordInput): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/forgot-password', payload);
    return data;
  },

  resendOtp: async (payload: { email: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/resend-otp', payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordInput & { token: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/reset-password', payload);
    return data;
  },

  verifyOtp: async (payload: OtpVerifyInput & { email: string }): Promise<{ access_token: string }> => {
    const { data } = await apiClient.post('/auth/verify-otp', payload);
    return data;
  },

  setup2FA: async (): Promise<Setup2FAResponse> => {
    const { data } = await apiClient.post('/auth/twofa/setup');
    return data;
  },

  enable2FA: async (payload: { secret: string; code: string }): Promise<Enable2FAResponse> => {
    const { data } = await apiClient.post('/auth/twofa/enable', payload);
    return data;
  },

   send2FAOtp: async (payload: {
    method: 'email' | 'sms';
  }): Promise<{ message: string; masked_target: string }> => {
    const { data } = await apiClient.post('/auth/twofa/send-otp', payload);
    return data;
  },

  verify2FALogin: async (payload: {
    code: string;
    method: string;
  }): Promise<{ access_token: string; token_type?: string; user?: User }> => {
    const { data } = await apiClient.post('/auth/twofa/verify-login', payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('access_token');
  },
};
