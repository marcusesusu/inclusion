import { apiClient } from './axios';
import {
  BaseKYCResponse,
  VerificationLogsResponse,
  BVNVerifyPayload,
  NINVerifyPayload,
  PhoneVerifyPayload,
  BankAccountVerifyPayload,
  CACVerifyPayload,
  PassportVerifyPayload,
  DriverLicenseVerifyPayload,
} from '@/types/verification';

export const verificationApi = {
  // Verification Logs
  getLogs: async (skip = 0, limit = 10): Promise<VerificationLogsResponse> => {
    const { data } = await apiClient.get<VerificationLogsResponse>('/identity/verify/logs', {
      params: { skip, limit },
    });
    return data;
  },

  // Statutory Verifications
  verifyBVN: async (payload: BVNVerifyPayload): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>('/identity/verify/bvn', payload);
    return data;
  },

  verifyNIN: async (payload: NINVerifyPayload): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>('/identity/verify/nin', payload);
    return data;
  },

  verifyPhone: async (payload: PhoneVerifyPayload): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>('/identity/verify/phone', payload);
    return data;
  },

  verifyBankAccount: async (payload: BankAccountVerifyPayload): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>('/identity/verify/bank-account', payload);
    return data;
  },

  verifyCAC: async (payload: CACVerifyPayload): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>('/identity/verify/cac', payload);
    return data;
  },

  verifyPassport: async (payload: PassportVerifyPayload): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>('/identity/verify/passport', payload);
    return data;
  },

  verifyDriverLicense: async (payload: DriverLicenseVerifyPayload): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>('/identity/verify/driver-license', payload);
    return data;
  },
};
