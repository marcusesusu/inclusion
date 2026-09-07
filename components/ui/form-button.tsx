'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function FormButton({
  children,
  isLoading = false,
  loadingText,
  icon,
  type = 'submit',
  disabled,
  className = '',
  variant = 'primary',
  ...props
}: FormButtonProps) {
  const variantStyles = {
    primary: 'bg-primary text-white hover:opacity-90',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700',
    outline: 'border border-border text-foreground hover:bg-accent',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText ? <span>{loadingText}</span> : children}
        </>
      ) : (
        <>
          <span>{children}</span>
          {icon && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}
