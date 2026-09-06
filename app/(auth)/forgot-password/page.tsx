'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AxiosError } from 'axios';

import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations/auth';
import { FormInput } from '@/components/ui/form-input';
import { authApi } from '@/lib/auth';
import { ApiErrorResponse } from '@/types/auth';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const methods = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(data);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        setServerError(errorData.detail || errorData.message || 'Unable to send password reset request.');
      } else {
        setServerError('An unexpected network error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your account email to receive reset instructions."
      serverError={serverError}
    >
      {isSuccess ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">
            If an account exists for <strong className="text-foreground">{methods.getValues('email')}</strong>, you will receive a reset link shortly.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
        </div>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput name="email" label="Email Address" type="email" placeholder="name@company.com" autoComplete="email" />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send Reset Link <ArrowRight className="h-4 w-4" /></>}
            </button>
            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        </FormProvider>
      )}
    </AuthLayout>
  );
}
