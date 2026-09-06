'use client';

import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { OTPInput, SlotProps } from 'input-otp';
import { AlertCircle } from 'lucide-react';

interface FormOtpInputProps {
  name: string;
  label: string;
  description?: string;
  maxLength?: number;
}

export function FormOtpInput({
  name,
  label,
  description,
  maxLength = 6,
}: FormOtpInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <OTPInput
            value={value || ''}
            onChange={onChange}
            maxLength={maxLength}
            containerClassName="flex items-center justify-between w-full"
            render={({ slots }) => (
              <div className="flex justify-between w-full gap-2 sm:gap-3">
                {slots.map((slot, idx) => (
                  <Slot key={idx} {...slot} isError={!!errorMessage} />
                ))}
              </div>
            )}
          />
        )}
      />

      {description && !errorMessage && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-secondary font-medium pt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

function Slot(props: SlotProps & { isError?: boolean }) {
  return (
    <div
      className={`relative flex h-14 w-12 sm:h-16 sm:w-14 flex-1 items-center justify-center rounded-xl border text-xl sm:text-2xl font-mono font-bold transition-all ${
        props.isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      } ${props.isError ? 'border-secondary' : ''} bg-background text-foreground shadow-xs`}
    >
      {props.char}
      {props.hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-0.5 animate-caret-blink bg-primary" />
        </div>
      )}
    </div>
  );
}
