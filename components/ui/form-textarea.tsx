'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  description?: string;
  isMono?: boolean;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ name, label, description, isMono = false, className = '', rows = 4, ...props }, ref) => {
    const {
      register,
      formState: { errors, touchedFields },
    } = useFormContext();

    const errorMessage = errors[name]?.message as string | undefined;
    const isTouched = touchedFields[name];
    const isValid = isTouched && !errorMessage;

    const { ref: registerRef, ...registerProps } = register(name);

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="text-sm font-medium text-foreground">
            {label}
          </label>
          {isValid && (
            <span className="flex items-center gap-1 text-xs text-tertiary font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Valid
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            id={name}
            rows={rows}
            {...registerProps}
            ref={(e) => {
              registerRef(e);
              if (typeof ref === 'function') ref(e);
              else if (ref) ref.current = e;
            }}
            {...props}
            className={`w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              isMono ? 'font-mono tracking-wider' : 'font-sans'
            } ${
              errorMessage
                ? 'border-secondary focus:ring-secondary/20'
                : 'border-border focus:border-primary focus:ring-primary/20'
            } ${className}`}
          />
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

FormTextarea.displayName = 'FormTextarea';
