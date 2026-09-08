import { z } from "zod";

export const bvnSchema = z.object({
  bvn: z.string().length(11, "BVN must be 11 digits"),
});

export const bvnFaceSchema = z.object({
  bvn: z.string().length(11, "BVN must be 11 digits"),
  image_base64: z.string().min(10, "Base64 image is required"),
});

export const ninSchema = z.object({
  nin: z.string().length(11, "NIN must be 11 digits"),
  date_of_birth: z.string().optional(),
});

export const ninFaceSchema = z.object({
  nin: z.string().length(11, "NIN must be 11 digits"),
  image_base64: z.string().min(10, "Base64 image is required"),
});

export const phoneSchema = z.object({
  phone_number: z.string().min(10, "Valid phone number is required"),
});

export const bankSchema = z.object({
  account_number: z.string().length(10, "Account number must be 10 digits"),
  bank_code: z.string().min(3, "Bank code is required"),
});

export const bvnAccountMatchSchema = z.object({
  bvn: z.string().length(11, "BVN must be 11 digits"),
  account_number: z.string().length(10, "Account number must be 10 digits"),
  bank_code: z.string().min(3, "Bank code is required"),
});

export const passportSchema = z.object({
  passport_number: z.string().min(6, "Passport number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
});

export const driverLicenseSchema = z.object({
  license_number: z.string().min(5, "License number is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
});

export const voterCardSchema = z.object({
  vin: z.string().min(5, "Voter Identification Number is required"),
  state: z.string().min(2, "State is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const nationalIdSchema = z.object({
  id_number: z.string().min(5, "ID number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const utilityBillSchema = z.object({
  customer_id: z.string().min(3, "Customer ID is required"),
  provider: z.string().min(2, "Provider is required"),
});

export const cacSchema = z.object({
  rc_number: z.string().min(3, "RC / BN Number is required"),
  company_type: z.string().optional(),
});

export const creditBureauIndSchema = z.object({
  bvn: z.string().length(11, "BVN must be 11 digits"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(10, "Phone number is required"),
});

export const creditBureauBizSchema = z.object({
  rc_number: z.string().min(3, "RC Number is required"),
  company_name: z.string().min(1, "Company Name is required"),
});

export type BvnInput = z.infer<typeof bvnSchema>;
export type BvnFaceInput = z.infer<typeof bvnFaceSchema>;
export type NinInput = z.infer<typeof ninSchema>;
export type NinFaceInput = z.infer<typeof ninFaceSchema>;
export type PhoneInput = z.infer<typeof phoneSchema>;
export type BankInput = z.infer<typeof bankSchema>;
export type BvnAccountMatchInput = z.infer<typeof bvnAccountMatchSchema>;
export type PassportInput = z.infer<typeof passportSchema>;
export type DriverLicenseInput = z.infer<typeof driverLicenseSchema>;
export type VoterCardInput = z.infer<typeof voterCardSchema>;
export type NationalIdInput = z.infer<typeof nationalIdSchema>;
export type UtilityBillInput = z.infer<typeof utilityBillSchema>;
export type CacInput = z.infer<typeof cacSchema>;
export type CreditBureauIndInput = z.infer<typeof creditBureauIndSchema>;
export type CreditBureauBizInput = z.infer<typeof creditBureauBizSchema>;
