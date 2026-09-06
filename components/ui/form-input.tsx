'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
  isMono?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    { name, label, description, isMono = false, type = 'text', className = '', ...props },
    ref
  ) => {
    const {
      register,
      formState: { errors, touchedFields },
    } = useFormContext();

    const [showPassword, setShowPassword] = React.useState(false);

    const errorMessage = errors[name]?.message as string | undefined;
    const isTouched = touchedFields[name];
    const isValid = isTouched && !errorMessage;

    const isPasswordType = type === 'password';
    const computedType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    const { ref: registerRef, ...registerProps } = register(name);

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="text-sm font-medium text-foreground">
            {label}
          </label>
          {isValid && (
            <span className="flex items-center gap-1 text-xs text-tertiary font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified Format
            </span>
          )}
        </div>

        <div className="relative">
          <input
            id={name}
            type={computedType}
            {...registerProps}
            ref={(e) => {
              registerRef(e);
              if (typeof ref === 'function') ref(e);
              else if (ref) ref.current = e;
            }}
            {...props}
            className={`w-full rounded-lg border bg-background pl-3.5 ${
              isPasswordType ? 'pr-10' : 'pr-3.5'
            } py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              isMono ? 'font-mono tracking-wider' : 'font-sans'
            } ${
              errorMessage
                ? 'border-secondary focus:ring-secondary/20'
                : 'border-border focus:border-primary focus:ring-primary/20'
            } ${className}`}
          />

          {/* Password Toggle Button */}
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {description && !errorMessage && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
