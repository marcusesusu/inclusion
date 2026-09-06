'use client';

import * as React from 'react';
import Image from 'next/image';
import { ShieldCheck, Lock } from 'lucide-react';
import { SLIDES } from '@/settings';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  serverError?: string | null;
  children: React.ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  serverError,
  children,
}: AuthLayoutProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const minSwipeDistance = 50;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const handlePrevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

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
    if (distance > minSwipeDistance) handleNextSlide();
    if (distance < -minSwipeDistance) handlePrevSlide();
  };

  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      {/* MOBILE SLIDER TOP HEADER */}
      <div
        className="relative flex h-72 sm:h-80 w-full flex-col justify-between bg-slate-900 p-6 lg:hidden select-none cursor-grab active:cursor-grabbing overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
      >
        {/* Fading linear mask ("dying black" effect into page background) */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-background z-10" />

        <Image
          src={SLIDES[currentSlide].image}
          alt="inclusion.id auth illustration"
          fill
          priority
          className="object-cover transition-all duration-700 ease-in-out pointer-events-none"
        />

        <div className="relative z-20 flex items-center justify-between">
          <a href="https://inclusion.id" className="flex items-center gap-2 font-bold text-white text-base">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span>inclusion.id</span>
          </a>
        </div>

        <div className="relative z-20 space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">
            {SLIDES[currentSlide].title}
          </h2>
          <p className="text-xs text-slate-200 line-clamp-2 drop-shadow-sm">
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

      {/* DESKTOP SLIDER PANEL */}
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

      {/* FORM CONTAINER */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-12 lg:w-1/2 bg-background">
        <div className="mx-auto w-full max-w-sm my-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>

          {serverError && (
            <div className="rounded-xl border border-secondary/30 bg-secondary/10 p-3 text-xs font-medium text-secondary flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {children}
        </div>

        <div className="text-center text-xs text-muted-foreground pt-6">
          Protected by <a href="https://inclusion.id" className="underline">inclusion.id</a> Enterprise Security
        </div>
      </div>
    </div>
  );
}
