'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight } from 'lucide-react';
import { AxiosError } from 'axios';

import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { FormInput } from '@/components/ui/form-input';
import { authApi } from '@/lib/auth';
import { ApiErrorResponse } from '@/types/auth';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const resData = await authApi.login(data);
      if (resData.requires_2fa) {
        if (resData['2fa_status'] === 'SETUP_REQUIRED') {
          router.push('/auth/2fa/setup');
          return;
        }
        router.push(`/auth/2fa/verify?token=${resData.access_token}&method=${resData.default_method || 'totp'}`);
        return;
      }
      if (resData.access_token) {
        localStorage.setItem('access_token', resData.access_token);
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        if (err.response.status === 403 && errorData.email_unverified) {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
          return;
        }
        setServerError(errorData.detail || errorData.message || 'Invalid credentials.');
      } else {
        setServerError('An unexpected network error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your credentials to access the verification workspace."
      serverError={serverError}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="email" label="Email Address" type="email" placeholder="name@company.com" autoComplete="email" />
          <div className="space-y-1">
            <FormInput name="password" label="Password" type="password" placeholder="••••••••" autoComplete="current-password" />
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </FormProvider>
    </AuthLayout>
  );
}
