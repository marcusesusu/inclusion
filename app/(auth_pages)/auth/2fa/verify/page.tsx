'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mail, Smartphone, KeyRound } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

import { twoFactorCodeSchema, TwoFactorCodeInput } from '@/lib/validations/auth';
import { FormOtpInput } from '@/components/ui/form-otp-input';
import { FormButton } from '@/components/ui/form-button';
import { authApi } from '@/lib/auth';
import { ApiErrorResponse } from '@/types/auth';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function Verify2FAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get('token');
  const initialMethod = (searchParams.get('method') || 'totp') as 'totp' | 'email' | 'sms';

  const [method, setMethod] = React.useState<'totp' | 'email' | 'sms'>(initialMethod);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  React.useEffect(() => {
    if (tokenParam) {
      localStorage.setItem('access_token', tokenParam);
    }
  }, [tokenParam]);

  const methods = useForm<TwoFactorCodeInput>({
    resolver: zodResolver(twoFactorCodeSchema),
    defaultValues: { code: '' },
  });

  const handleSwitchChannel = async (targetMethod: 'email' | 'sms') => {
    setServerError(null);
    setIsResending(true);
    try {
      const res = await authApi.send2FAOtp({ method: targetMethod });
      setMethod(targetMethod);
      toast.success(res.message);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        toast.error(errorData.detail || 'Could not send verification code.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: TwoFactorCodeInput) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await authApi.verify2FALogin({ code: data.code, method });
      if (res.access_token) {
        localStorage.setItem('access_token', res.access_token);
        toast.success('Authenticated successfully');
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        setServerError(errorData.detail || 'Invalid 2FA code.');
      } else {
        setServerError('An unexpected authentication error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Two-Factor Verification"
      subtitle={
        method === 'totp'
          ? 'Enter the 6-digit code from your authenticator app.'
          : `Enter the code sent to your ${method.toUpperCase()}.`
      }
      serverError={serverError}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <FormOtpInput name="code" label="Security Code" maxLength={6} />

          <FormButton isLoading={isSubmitting} icon={<ArrowRight className="h-4 w-4" />}>
            Verify & Sign In
          </FormButton>
        </form>
      </FormProvider>

      <div className="pt-4 border-t border-border space-y-2 text-center text-xs">
        <p className="text-muted-foreground">Having trouble? Try another channel:</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            disabled={isResending}
            onClick={() => setMethod('totp')}
            className={`flex items-center gap-1 font-medium cursor-pointer ${
              method === 'totp' ? 'text-primary' : 'text-muted-foreground hover:underline'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" /> Authenticator
          </button>
          <button
            type="button"
            disabled={isResending}
            onClick={() => handleSwitchChannel('email')}
            className={`flex items-center gap-1 font-medium cursor-pointer ${
              method === 'email' ? 'text-primary' : 'text-muted-foreground hover:underline'
            }`}
          >
            <Mail className="h-3.5 w-3.5" /> Email
          </button>
          <button
            type="button"
            disabled={isResending}
            onClick={() => handleSwitchChannel('sms')}
            className={`flex items-center gap-1 font-medium cursor-pointer ${
              method === 'sms' ? 'text-primary' : 'text-muted-foreground hover:underline'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> SMS
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
