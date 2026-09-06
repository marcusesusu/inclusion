import { LoginResponse } from '@/types/auth';
import { apiClient } from './axios';
import { ForgotPasswordInput, LoginInput, OtpVerifyInput, ResetPasswordInput } from './validations/auth';

export const authApi = {
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/login', null, {
      params: {
        email: credentials.email,
        password: credentials.password,
      },
    });
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordInput): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/forgot-password', payload);
    return data;
  },
  
  resendOtp: async (payload: { email: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/resend-otp', payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordInput & { token: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/reset-password', payload);
    return data;
  },

  verifyOtp: async (payload: OtpVerifyInput & { email: string }): Promise<{ access_token: string }> => {
    const { data } = await apiClient.post('/verify-otp', payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/logout');
    localStorage.removeItem('access_token');
  },
};
