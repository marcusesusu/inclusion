export type VerificationType =
  | 'bvn'
  | 'bvn_advance'
  | 'bvn_face'
  | 'nin'
  | 'nin_advance'
  | 'nin_face'
  | 'phone'
  | 'passport'
  | 'driver_license'
  | 'voter_card'
  | 'national_id'
  | 'utility_bill'
  | 'cac'
  | 'credit_bureau_individual'
  | 'credit_bureau_business'
  | 'bank_account'
  | 'bvn_account_match';

export interface BaseKYCResponse {
  status: boolean;
  message: string;
  verification_type?: string;
  data: {
    bvn?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    date_of_birth?: string;
    phone_number?: string;
    raw_response?: Record<string, any>;
    [key: string]: any;
  };
}

export interface VerificationLogItem {
  id: number;
  provider: string;
  verification_type: string;
  identifier_used: string;
  fee_amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  is_success: boolean;
  message?: string;
  request_payload?: Record<string, any>;
  response_data?: Record<string, any>;
  created_at: string;
}

export interface VerificationLogsResponse {
  total: number;
  skip: number;
  limit: number;
  items: VerificationLogItem[];
}

// Request Payload Interfaces
export interface BVNVerifyPayload {
  bvn: string;
  name?: string;
  date_of_birth?: string;
  mobile_no?: string;
}

export interface NINVerifyPayload {
  nin: string;
  date_of_birth?: string;
}

export interface PhoneVerifyPayload {
  phone_number: string;
}

export interface BankAccountVerifyPayload {
  account_number: string;
  bank_code: string;
}

export interface CACVerifyPayload {
  rc_number: string;
  company_type?: string;
}

export interface PassportVerifyPayload {
  passport_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

export interface DriverLicenseVerifyPayload {
  license_number: string;
  date_of_birth: string;
}
