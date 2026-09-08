import { apiClient } from "./axios";
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
} from "@/types/verification";

export interface BVNFaceMatchPayload {
  bvn: string;
  image_base64: string;
}

export interface NINFaceMatchPayload {
  nin: string;
  image_base64: string;
}

export interface VoterCardVerifyPayload {
  vin: string;
  state: string;
  last_name: string;
}

export interface NationalIDVerifyPayload {
  id_number: string;
  first_name: string;
  last_name: string;
}

export interface UtilityBillVerifyPayload {
  customer_id: string;
  provider: string;
}

export interface CreditBureauIndividualPayload {
  bvn: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface CreditBureauBusinessPayload {
  rc_number: string;
  company_name: string;
}

export interface BVNAccountMatchPayload {
  bvn: string;
  account_number: string;
  bank_code: string;
}

export const verificationApi = {
  // Verification Logs
  getLogs: async (skip = 0, limit = 10): Promise<VerificationLogsResponse> => {
    const { data } = await apiClient.get<VerificationLogsResponse>(
      "/identity/verify/logs",
      {
        params: { skip, limit },
      },
    );
    return data;
  },

  // BVN Routes
  verifyBVN: async (payload: BVNVerifyPayload): Promise<BaseKYCResponse> => {
    const res = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/bvn",
      payload,
    );
    const result =
      (res as any)?.data?.status !== undefined ? (res as any).data : res;
    return result;
  },

  verifyAdvanceBVN: async (
    payload: BVNVerifyPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/bvn/advance",
      payload,
    );
    return data;
  },
  verifyBVNWithFace: async (
    payload: BVNFaceMatchPayload,
  ): Promise<BaseKYCResponse> => {
    const formData = new FormData();
    formData.append("bvn", payload.bvn);
    formData.append("image_base64", payload.image_base64);
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/bvn/face-match",
      formData,
    );
    return data;
  },

  // NIN Routes
  verifyNIN: async (payload: NINVerifyPayload): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/nin",
      payload,
    );
    return data;
  },
  verifyAdvanceNIN: async (
    payload: NINVerifyPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/nin/advance",
      payload,
    );
    return data;
  },
  verifyNINWithFace: async (
    payload: NINFaceMatchPayload,
  ): Promise<BaseKYCResponse> => {
    const formData = new FormData();
    formData.append("nin", payload.nin);
    formData.append("image_base64", payload.image_base64);
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/nin/face-match",
      formData,
    );
    return data;
  },

  // Document & statutory verification routes
  verifyPhone: async (
    payload: PhoneVerifyPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/phone",
      payload,
    );
    return data;
  },
  verifyPassport: async (
    payload: PassportVerifyPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/passport",
      payload,
    );
    return data;
  },
  verifyDriverLicense: async (
    payload: DriverLicenseVerifyPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/driver-license",
      payload,
    );
    return data;
  },
  verifyVoterCard: async (
    payload: VoterCardVerifyPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/voter-card",
      payload,
    );
    return data;
  },
  verifyNationalID: async (
    payload: NationalIDVerifyPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/national-id",
      payload,
    );
    return data;
  },
  verifyUtilityBill: async (
    payload: UtilityBillVerifyPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/utility-bill",
      payload,
    );
    return data;
  },

  // Business & Credit Bureau
  verifyCAC: async (payload: CACVerifyPayload): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/cac",
      payload,
    );
    return data;
  },
  verifyCreditBureauIndividual: async (
    payload: CreditBureauIndividualPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/credit-bureau/individual",
      payload,
    );
    return data;
  },
  verifyCreditBureauBusiness: async (
    payload: CreditBureauBusinessPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/credit-bureau/business",
      payload,
    );
    return data;
  },

  // Bank & BVN Match
  verifyBankAccount: async (
    payload: BankAccountVerifyPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/bank-account",
      payload,
    );
    return data;
  },
  verifyBVNWithAccountMatch: async (
    payload: BVNAccountMatchPayload,
  ): Promise<BaseKYCResponse> => {
    const { data } = await apiClient.post<BaseKYCResponse>(
      "/identity/verify/bvn-account-match",
      payload,
    );
    return data;
  },
};
