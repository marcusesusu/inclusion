'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight, RotateCw } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

import { otpVerifySchema, OtpVerifyInput } from '@/lib/validations/auth';
import { FormOtpInput } from '@/components/ui/form-otp-input';
import { authApi } from '@/lib/auth';
import { ApiErrorResponse } from '@/types/auth';
import { AuthLayout } from '@/components/auth/auth-layout';

function VerifyOtpFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [countdown, setCountdown] = React.useState(60);

  const methods = useForm<OtpVerifyInput>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { otp: '' },
  });

  // 60-Second Countdown Timer
  React.useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return;

    if (!email) {
      toast.error('Email address missing. Please request a new verification link.');
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendOtp({ email });
      toast.success('A new verification code has been sent to your email.');
      setCountdown(60);
    } catch (err: unknown) {
      let message = 'Failed to resend code. Please try again.';
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        message = errorData.detail || errorData.message || message;
      }
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: OtpVerifyInput) => {
    if (!email) {
      const err = 'Email address missing. Please request a new verification link.';
      setServerError(err);
      toast.error(err);
      return;
    }

    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await authApi.verifyOtp({ otp: data.otp, email });

      toast.success('Email verified successfully!');

      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      let message = 'An unexpected error occurred.';
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        message = errorData.detail || errorData.message || 'Invalid or expired OTP code.';
      }
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`Enter the 6-digit code sent to ${email || 'your email'}.`}
      serverError={serverError}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <FormOtpInput name="otp" label="6-Digit Verification Code" maxLength={6} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Verify Code <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </FormProvider>

      <div className="flex items-center justify-center pt-2 text-xs">
        {countdown > 0 ? (
          <p className="text-muted-foreground">
            Didn&apos;t receive the code? Resend available in{' '}
            <span className="font-semibold text-foreground">{countdown}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="flex items-center gap-1.5 font-medium text-primary hover:underline disabled:opacity-50 cursor-pointer"
          >
            {isResending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Resending code...
              </>
            ) : (
              <>
                <RotateCw className="h-3.5 w-3.5" /> Resend Code
              </>
            )}
          </button>
        )}
      </div>
    </AuthLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyOtpFormContent />
    </Suspense>
  );
}
