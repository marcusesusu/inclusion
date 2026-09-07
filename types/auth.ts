export interface LoginResponse {
  access_token?: string;
  token_type?: string;
  requires_2fa?: boolean;
  '2fa_status'?: 'VERIFICATION_REQUIRED' | 'SETUP_REQUIRED';
  next_screen?: string;
  default_method?: 'totp' | 'email' | 'sms';
  masked_target?: string;
  available_methods?: string[];
  message?: string;
  user?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  detail?: string;
  email_unverified?: boolean;
  message?: string;
}

export type RoleType = 'SUPER_ADMIN' | 'COOP_ADMIN' | 'BRANCH_MANAGER' | 'MEMBER' | string;

export interface BackupCodesJSON {
  codes?: string[];
  used_codes?: string[];
  [key: string]: unknown;
}
export type TwoFactorMethod = 'totp' | 'email' | 'sms';

export interface User {
  id: number;
  uuid: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  /** ISO Date string format: "YYYY-MM-DD" */
  dob: string | null;
  gender: string | null;
  credit_source: string | null;
  business_name: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  currency: string | null;
  postal_code: string | null;
  /** Decimal mapped as numeric string to preserve precision (e.g. "0.0000") */
  guaranteed_amount: string;

  // 2FA Security Configuration
  is_twofa_enabled: boolean;
  twofa_method: TwoFactorMethod | 'sms' | 'totp' | 'email';
  backup_codes: BackupCodesJSON | null;

  // Profile & Status Flags
  profile_picture: string | null;
  /** ISO 8601 DateTime string (e.g. "2026-09-07T00:00:00Z") */
  last_login_at: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;

  role: RoleType;
  pin_failed_attempts: number;
  pin_locked_until: string | null;

  // Organizational Links
  owned_cooperative: boolean;
  cooperative_id: number | null;
  branch_id: number | null;
  is_active: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;

  cooperative?: CooperativeRef | null;
  branch?: BranchRef | null;
}

export interface CooperativeRef {
  id: number;
  name: string;
  code?: string;
}

export interface BranchRef {
  id: number;
  name: string;
  cooperative_id: number;
}


export interface Setup2FAResponse {
  secret: string;
  qr_code_base64: string;
  totp_uri: string;
}

export interface Enable2FAResponse {
  message: string;
  backup_codes: string[];
}
export type Role = "superadmin" | "admin" | "staff" | string;


export interface UserSession {
  id: number;
  first_name: string;
  last_name: string;
  role: Role;
  has_transaction_pin: boolean;
  [key: string]: any;
}
