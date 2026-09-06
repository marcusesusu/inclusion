'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight } from 'lucide-react';
import { AxiosError } from 'axios';

import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations/auth';
import { FormInput } from '@/components/ui/form-input';
import { authApi } from '@/lib/auth';
import { ApiErrorResponse } from '@/types/auth';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const methods = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirm_password: '' },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setServerError('Reset token is missing or invalid.');
      return;
    }
    setServerError(null);
    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ ...data, token });
      router.push('/login?reset=success');
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        setServerError(errorData.detail || errorData.message || 'Failed to reset password.');
      } else {
        setServerError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Please set a new secure password for your account."
      serverError={serverError}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="password" label="New Password" type="password" placeholder="••••••••" />
          <FormInput name="confirm_password" label="Confirm New Password" type="password" placeholder="••••••••" />
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </FormProvider>
    </AuthLayout>
  );
}
