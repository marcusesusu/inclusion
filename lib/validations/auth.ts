import { z } from 'zod';

const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .refine((val) => STRICT_EMAIL_REGEX.test(val), {
      message: 'Please enter a valid email domain (e.g. name@company.com)',
    }),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .refine((val) => STRICT_EMAIL_REGEX.test(val), {
      message: 'Please enter a valid email domain',
    }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });


export const otpVerifySchema = z.object({
  otp: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export const twoFactorCodeSchema = z.object({
  code: z.string().min(6, 'Enter a valid 6-digit or backup code'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type TwoFactorCodeInput = z.infer<typeof twoFactorCodeSchema>;
