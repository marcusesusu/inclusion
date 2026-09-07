"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  Mail,
  Smartphone,
  KeyRound,
  Send,
} from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

import {
  twoFactorCodeSchema,
  TwoFactorCodeInput,
} from "@/lib/validations/auth";
import { FormInput } from "@/components/ui/form-input";
import { FormButton } from "@/components/ui/form-button";
import { authApi } from "@/lib/auth";
import { ApiErrorResponse, Setup2FAResponse } from "@/types/auth";
import { AuthLayout } from "@/components/auth/auth-layout";

type TwoFactorMethod = "email" | "sms" | "totp";

const METHOD_OPTIONS: {
  id: TwoFactorMethod;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "email",
    label: "Email Verification",
    desc: "Receive verification codes at your account email address",
    icon: <Mail className="h-5 w-5 text-primary" />,
  },
  {
    id: "sms",
    label: "SMS Text Message",
    desc: "Receive verification codes on your registered mobile device",
    icon: <Smartphone className="h-5 w-5 text-primary" />,
  },
  {
    id: "totp",
    label: "Authenticator App",
    desc: "Use Google Authenticator, Authy, or 1Password to generate codes",
    icon: <KeyRound className="h-5 w-5 text-primary" />,
  },
];

export default function Setup2FAPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] =
    React.useState<TwoFactorMethod>("email");
  const [setupData, setSetupData] = React.useState<Setup2FAResponse | null>(
    null,
  );
  const [backupCodes, setBackupCodes] = React.useState<string[] | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState(false);

  const methods = useForm<TwoFactorCodeInput>({
    resolver: zodResolver(twoFactorCodeSchema),
    defaultValues: { code: "" },
  });

  React.useEffect(() => {
    if (selectedMethod === "totp" && !setupData) {
      const initTotpSetup = async () => {
        try {
          const res = await authApi.setup2FA();
          setSetupData(res);
        } catch (err: unknown) {
          let msg = "Failed to initialize TOTP setup.";
          if (err instanceof AxiosError && err.response) {
            const errorData = err.response.data as ApiErrorResponse;
            msg = errorData.detail || msg;
          }
          setServerError(msg);
        }
      };
      initTotpSetup();
    }
  }, [selectedMethod, setupData]);

  const handleCopyKey = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
      toast.success("Secret key copied to clipboard");
    }
  };

  const handleSendOtp = async () => {
    if (selectedMethod === "totp") return;
    setServerError(null);
    setIsSendingOtp(true);
    try {
      // Backend resolves target email/phone via user DB record tied to the JWT
      const res = await authApi.send2FAOtp({
        method: selectedMethod,
      });
      setOtpSent(true);
      toast.success(
        res.message ||
          `Verification code sent via ${selectedMethod.toUpperCase()}`,
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        setServerError(errorData.detail || "Failed to send verification code.");
      } else {
        setServerError("An unexpected error occurred.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (data: TwoFactorCodeInput) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      if (selectedMethod === "totp") {
        if (!setupData) return;
        const res = await authApi.enable2FA({
          secret: setupData.secret,
          code: data.code,
        });
        toast.success("Two-factor authentication enabled successfully!");
        setBackupCodes(res.backup_codes);
      } else {
        const res = await authApi.verify2FALogin({
          code: data.code,
          method: selectedMethod,
        });
        if (res.access_token) {
          localStorage.setItem("access_token", res.access_token);
        }
        toast.success("Authenticated successfully");
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;
        setServerError(errorData.detail || "Invalid verification code.");
      } else {
        setServerError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (backupCodes) {
    return (
      <AuthLayout
        title="Save your backup codes"
        subtitle="Keep these codes in a secure password manager. You will need them if you lose access to your authenticator device."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-accent/50 p-4 font-mono text-xs font-semibold">
            {backupCodes.map((code, index) => (
              <div
                key={index}
                className="p-1 text-center bg-background rounded-md border border-border"
              >
                {code}
              </div>
            ))}
          </div>

          <FormButton
            type="button"
            onClick={() => router.push("/dashboard")}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            I&apos;ve Saved My Codes
          </FormButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set up Two-Factor Auth"
      subtitle="Choose your preferred verification method to secure your account."
      serverError={serverError}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">
            Select Verification Method
          </label>
          <div className="grid gap-3">
            {METHOD_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelectedMethod(option.id);
                  setServerError(null);
                  setOtpSent(false);
                  methods.reset();
                }}
                className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                  selectedMethod === option.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:bg-accent/50"
                }`}
              >
                <div className="mt-0.5 shrink-0">{option.icon}</div>
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    {option.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {option.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedMethod === "totp" ? (
          setupData ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4">
                <Image
                  src={setupData.qr_code_base64}
                  alt="2FA QR Code"
                  width={160}
                  height={160}
                  className="rounded-lg"
                />
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Secret Key:</span>
                  <code className="font-mono font-bold text-foreground">
                    {setupData.secret}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="p-1 hover:text-primary cursor-pointer"
                    aria-label="Copy secret key"
                  >
                    {copiedKey ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormInput
                    name="code"
                    label="Authenticator Code"
                    placeholder="123456"
                    autoComplete="one-time-code"
                  />
                  <FormButton
                    isLoading={isSubmitting}
                    icon={<ShieldCheck className="h-4 w-4" />}
                  >
                    Enable Authenticator
                  </FormButton>
                </form>
              </FormProvider>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Loading TOTP setup configuration...
            </div>
          )
        ) : (
          <div className="space-y-4">
            {!otpSent ? (
              <FormButton
                type="button"
                onClick={() => handleSendOtp()}
                isLoading={isSendingOtp}
                icon={<Send className="h-4 w-4" />}
              >
                Send Verification Code via {selectedMethod.toUpperCase()}
              </FormButton>
            ) : (
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormInput
                    name="code"
                    label={`${selectedMethod.toUpperCase()} Verification Code`}
                    placeholder="123456"
                    autoComplete="one-time-code"
                  />
                  <FormButton
                    isLoading={isSubmitting}
                    icon={<ShieldCheck className="h-4 w-4" />}
                  >
                    Verify & Enable 2FA
                  </FormButton>
                  <div className="pt-2">
                    <FormButton
                      type="button"
                      variant="outline"
                      onClick={() => handleSendOtp()}
                      isLoading={isSendingOtp}
                    >
                      Resend Code
                    </FormButton>
                  </div>
                </form>
              </FormProvider>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
