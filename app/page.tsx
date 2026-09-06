'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { AxiosError } from 'axios';

import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { FormInput } from '@/components/ui/form-input';
import { authApi } from '@/lib/auth';
import { ApiErrorResponse } from '@/types/auth';
import { SLIDES } from '@/settings';

export default function LoginPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Swipe / Drag touch states for mobile slide header
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Min swipe distance threshold in px
  const minSwipeDistance = 50;

  // Background Image Slider Timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Touch Swipe Handlers for Mobile
  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchEnd(clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNextSlide();
    if (isRightSwipe) handlePrevSlide();
  };

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
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
        router.push(
          `/auth/2fa/verify?token=${resData.access_token}&method=${
            resData.default_method || 'totp'
          }`
        );
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

        setServerError(
          errorData.detail ||
            errorData.message ||
            'Invalid credentials. Please verify your details and try again.'
        );
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('An unexpected network error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      {/* MOBILE SLIDER TOP HEADER (Visible on screens smaller than lg) */}
      <div
        className="relative flex h-52 w-full flex-col justify-between bg-slate-900 p-4 lg:hidden select-none cursor-grab active:cursor-grabbing overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 z-10" />

        <Image
          src={SLIDES[currentSlide].image}
          alt="inclusion.id identity verification"
          fill
          priority
          className="object-cover transition-all duration-700 ease-in-out pointer-events-none"
        />

        {/* Brand Header */}
        <div className="relative z-20 flex items-center justify-between">
          <a href="https://inclusion.id" className="flex items-center gap-2 font-bold text-white text-base">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span>inclusion.id</span>
          </a>
        </div>

        {/* Slide Info & Touch Indicators */}
        <div className="relative z-20 space-y-1.5">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {SLIDES[currentSlide].title}
          </h2>
          <p className="text-xs text-slate-300 line-clamp-2">
            {SLIDES[currentSlide].description}
          </p>

          <div className="flex gap-1.5 pt-1">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide ? 'w-6 bg-primary' : 'w-1.5 bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP LEFT SIDE: Image Slider Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-900 p-10 lg:flex">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 z-10" />

        <Image
          src={SLIDES[currentSlide].image}
          alt="inclusion.id identity verification"
          fill
          priority
          className="object-cover transition-all duration-700 ease-in-out"
        />

        <div className="relative z-20 flex items-center gap-2">
          <a href="https://inclusion.id" className="flex items-center gap-2 font-bold text-white text-xl">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <span>inclusion.id</span>
          </a>
        </div>

        <div className="relative z-20 max-w-md text-white space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {SLIDES[currentSlide].title}
          </h1>
          <p className="text-sm text-slate-300">
            {SLIDES[currentSlide].description}
          </p>

          <div className="flex gap-2 pt-2">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form Panel */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-12 lg:w-1/2 bg-background">
        <div className="mx-auto w-full max-w-sm my-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Sign in to your account
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your credentials to access the verification workspace.
            </p>
          </div>

          {serverError && (
            <div className="rounded-xl border border-secondary/30 bg-secondary/10 p-3 text-xs font-medium text-secondary flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
              />

              <div className="space-y-1">
                <FormInput
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <div className="flex justify-end pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </FormProvider>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-6">
          Protected by <a href="https://inclusion.id" className="underline">inclusion.id</a> Enterprise Security
        </div>
      </div>
    </div>
  );
}
