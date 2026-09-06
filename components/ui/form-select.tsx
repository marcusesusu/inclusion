'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ name, label, options, placeholder = 'Select an option', description, className = '', ...props }, ref) => {
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
              <CheckCircle2 className="h-3.5 w-3.5" /> Selected
            </span>
          )}
        </div>

        <div className="relative">
          <select
            id={name}
            {...registerProps}
            ref={(e) => {
              registerRef(e);
              if (typeof ref === 'function') ref(e);
              else if (ref) ref.current = e;
            }}
            {...props}
            defaultValue=""
            className={`w-full appearance-none rounded-lg border bg-background pl-3.5 pr-10 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errorMessage
                ? 'border-secondary focus:ring-secondary/20'
                : 'border-border focus:border-primary focus:ring-primary/20'
            } ${className}`}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom Chevron Indicator */}
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </div>
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

FormSelect.displayName = 'FormSelect';
