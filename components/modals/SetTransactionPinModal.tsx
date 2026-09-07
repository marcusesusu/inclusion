"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";

import { FormInput } from "@/components/ui/form-input";
import { FormButton } from "@/components/ui/form-button";
import { walletApi } from "@/lib/wallet";
import { ApiErrorResponse } from "@/types/auth";

const pinSchema = z
  .object({
    pin: z
      .string()
      .length(4, "PIN must be 4 digits")
      .regex(/^\d+$/, "PIN must contain numbers only"),
    confirmPin: z.string().length(4, "PIN must be 4 digits"),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs do not match",
    path: ["confirmPin"],
  });

type PinInput = z.infer<typeof pinSchema>;

interface Props {
  isOpen: boolean;
  onSuccess: () => void;
}

export function SetTransactionPinModal({ isOpen, onSuccess }: Props) {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const methods = useForm<PinInput>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "", confirmPin: "" },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: PinInput) => {
    setError(null);
    setLoading(true);
    try {
      await walletApi.setTransactionPin({ pin: data.pin });
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        setError(errorData.detail || errorData.message || "Failed to set PIN. Try again.");
      } else {
        setError("An unexpected network error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg border border-border">
        <h2 className="text-lg font-bold">Set Transaction PIN</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          You need to set up a 4-digit PIN to perform transactions and transfers.
        </p>

        {error && (
          <div className="p-2 mb-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="pin"
              label="New PIN"
              type="password"
              placeholder="••••"
              maxLength={4}
            />
            <FormInput
              name="confirmPin"
              label="Confirm PIN"
              type="password"
              placeholder="••••"
              maxLength={4}
            />
            <FormButton isLoading={loading}>
              Save Transaction PIN
            </FormButton>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
