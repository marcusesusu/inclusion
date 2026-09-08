"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShieldCheck,
  Building2,
  UserCheck,
  CreditCard,
  Phone,
  FileText,
  Car,
  Vote,
  Receipt,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  XCircle,
  Eye,
  Camera,
  Info,
} from "lucide-react";

import toast from "react-hot-toast";

import { FormInput } from "@/components/ui/form-input";
import { FormButton } from "@/components/ui/form-button";
import { Modal } from "@/components/ui/modal";
import { DataTable, Column } from "@/components/ui/data-table";
import { verificationApi } from "@/lib/verification";
import { VerificationLogItem, BaseKYCResponse } from "@/types/verification";

// Validation Schemas
const bvnSchema = z.object({
  bvn: z.string().length(11, "BVN must be 11 digits"),
});
const bvnFaceSchema = z.object({
  bvn: z.string().length(11, "BVN must be 11 digits"),
  image_base64: z.string().min(10, "Base64 image is required"),
});

const ninSchema = z.object({
  nin: z.string().length(11, "NIN must be 11 digits"),
  date_of_birth: z.string().optional(),
});
const ninFaceSchema = z.object({
  nin: z.string().length(11, "NIN must be 11 digits"),
  image_base64: z.string().min(10, "Base64 image is required"),
});

const phoneSchema = z.object({
  phone_number: z.string().min(10, "Valid phone number is required"),
});
const bankSchema = z.object({
  account_number: z.string().length(10, "Account number must be 10 digits"),
  bank_code: z.string().min(3, "Bank code is required"),
});
const bvnAccountMatchSchema = z.object({
  bvn: z.string().length(11, "BVN must be 11 digits"),
  account_number: z.string().length(10, "Account number must be 10 digits"),
  bank_code: z.string().min(3, "Bank code is required"),
});

const passportSchema = z.object({
  passport_number: z.string().min(6, "Passport number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
});
const driverLicenseSchema = z.object({
  license_number: z.string().min(5, "License number is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
});
const voterCardSchema = z.object({
  vin: z.string().min(5, "Voter Identification Number is required"),
  state: z.string().min(2, "State is required"),
  last_name: z.string().min(1, "Last name is required"),
});
const nationalIdSchema = z.object({
  id_number: z.string().min(5, "ID number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});
const utilityBillSchema = z.object({
  customer_id: z.string().min(3, "Customer ID is required"),
  provider: z.string().min(2, "Provider is required"),
});
const cacSchema = z.object({
  rc_number: z.string().min(3, "RC / BN Number is required"),
  company_type: z.string().optional(),
});
const creditBureauIndSchema = z.object({
  bvn: z.string().length(11, "BVN must be 11 digits"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(10, "Phone number is required"),
});
const creditBureauBizSchema = z.object({
  rc_number: z.string().min(3, "RC Number is required"),
  company_name: z.string().min(1, "Company Name is required"),
});

type TabType =
  | "bvn"
  | "bvn_advance"
  | "bvn_face"
  | "nin"
  | "nin_advance"
  | "nin_face"
  | "phone"
  | "bank"
  | "bvn_account_match"
  | "passport"
  | "driver_license"
  | "voter_card"
  | "national_id"
  | "utility_bill"
  | "cac"
  | "credit_individual"
  | "credit_business";

export default function IdentityVerificationPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>("bvn");

  // Verification Logs State
  const [logs, setLogs] = React.useState<VerificationLogItem[]>([]);
  const [totalLogs, setTotalLogs] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [isLoadingLogs, setIsLoadingLogs] = React.useState(true);

  // Result Detail Modal State
  const [resultModalData, setResultModalData] =
    React.useState<BaseKYCResponse | null>(null);
  const [viewLogDetail, setViewLogDetail] =
    React.useState<VerificationLogItem | null>(null);

  const fetchLogs = React.useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const res = await verificationApi.getLogs((page - 1) * limit, limit);
      setLogs(res.items || []);
      setTotalLogs(res.total || 0);
    } catch {
      toast.error("Failed to load verification logs.");
    } finally {
      setIsLoadingLogs(false);
    }
  }, [page, limit]);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Forms Setup
  const bvnForm = useForm({
    resolver: zodResolver(bvnSchema),
    defaultValues: { bvn: "" },
  });
  const bvnAdvanceForm = useForm({
    resolver: zodResolver(bvnSchema),
    defaultValues: { bvn: "" },
  });
  const bvnFaceForm = useForm({
    resolver: zodResolver(bvnFaceSchema),
    defaultValues: { bvn: "", image_base64: "" },
  });

  const ninForm = useForm({
    resolver: zodResolver(ninSchema),
    defaultValues: { nin: "", date_of_birth: "" },
  });
  const ninAdvanceForm = useForm({
    resolver: zodResolver(bvnSchema),
    defaultValues: { bvn: "" },
  });
  const ninFaceForm = useForm({
    resolver: zodResolver(ninFaceSchema),
    defaultValues: { nin: "", image_base64: "" },
  });

  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone_number: "" },
  });
  const bankForm = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: { account_number: "", bank_code: "" },
  });
  const bvnAccountMatchForm = useForm({
    resolver: zodResolver(bvnAccountMatchSchema),
    defaultValues: { bvn: "", account_number: "", bank_code: "" },
  });

  const passportForm = useForm({
    resolver: zodResolver(passportSchema),
    defaultValues: {
      passport_number: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
    },
  });
  const driverLicenseForm = useForm({
    resolver: zodResolver(driverLicenseSchema),
    defaultValues: { license_number: "", date_of_birth: "" },
  });
  const voterCardForm = useForm({
    resolver: zodResolver(voterCardSchema),
    defaultValues: { vin: "", state: "", last_name: "" },
  });
  const nationalIdForm = useForm({
    resolver: zodResolver(nationalIdSchema),
    defaultValues: { id_number: "", first_name: "", last_name: "" },
  });
  const utilityBillForm = useForm({
    resolver: zodResolver(utilityBillSchema),
    defaultValues: { customer_id: "", provider: "" },
  });

  const cacForm = useForm({
    resolver: zodResolver(cacSchema),
    defaultValues: { rc_number: "", company_type: "" },
  });
  const creditBureauIndForm = useForm({
    resolver: zodResolver(creditBureauIndSchema),
    defaultValues: { bvn: "", first_name: "", last_name: "", phone_number: "" },
  });
  const creditBureauBizForm = useForm({
    resolver: zodResolver(creditBureauBizSchema),
    defaultValues: { rc_number: "", company_name: "" },
  });

  const handleAction = async (
    fn: () => Promise<BaseKYCResponse>,
    fallbackMsg: string,
  ) => {
    try {
      const res = await fn();
      setResultModalData(res);
      fetchLogs();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || fallbackMsg);
    }
  };

  const logColumns = React.useMemo<Column<VerificationLogItem>[]>(
    () => [
      {
        key: "verification_type",
        header: "Verification Type",
        cell: (item) => (
          <span className="font-semibold text-foreground uppercase text-xs">
            {item.verification_type.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "identifier_used",
        header: "Identifier",
        cell: (item) => (
          <span className="font-mono text-xs">
            {item.identifier_used || "—"}
          </span>
        ),
      },
      {
        key: "provider",
        header: "Provider",
        cell: (item) => (
          <span className="capitalize text-xs font-medium">
            {item.provider}
          </span>
        ),
      },
      {
        key: "fee_amount",
        header: "Fee",
        cell: (item) => (
          <span className="text-xs">
            {item.currency} {item.fee_amount.toFixed(2)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (item) =>
          item.is_success ? (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" /> Success
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-rose-600 text-xs">
              <XCircle className="h-3.5 w-3.5" /> Failed
            </span>
          ),
      },
      {
        key: "created_at",
        header: "Date",
        cell: (item) => (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {new Date(item.created_at).toLocaleString()}
          </span>
        ),
      },
      {
        key: "actions",
        header: <div className="text-right">Actions</div>,
        cell: (item) => (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setViewLogDetail(item)}
              className="rounded-lg p-1.5 flex gap-1 items-center bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" /> View
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-foreground">
          Identity & KYC Verification
        </h1>
        <p className="text-xs text-muted-foreground">
          Comprehensive statutory KYC checks, document validations, credit
          bureau scoring, and face matching.
        </p>
      </div>

      {/* Scrollable Tabs Nav Bar */}
      <div className="flex border-b border-border overflow-x-auto no-scrollbar scroll-smooth gap-1 sm:gap-2 -mx-3 px-3 sm:mx-0 sm:px-0 pt-16 -mt-12">
        {[
          {
            id: "bvn",
            label: "BVN Lookup",
            icon: UserCheck,
            description:
              "Confirms basic personal details attached to a Bank Verification Number.",
          },
          {
            id: "bvn_advance",
            label: "BVN Advance",
            icon: UserCheck,
            description:
              "Checks deeper BVN records including registered address and photo.",
          },
          {
            id: "bvn_face",
            label: "BVN Face Match",
            icon: Camera,
            description:
              "Compares a user selfie with their official BVN photo to verify identity.",
          },
          {
            id: "nin",
            label: "NIN Lookup",
            icon: ShieldCheck,
            description:
              "Verifies standard details on a National Identity Number.",
          },
          {
            id: "nin_advance",
            label: "NIN Advance",
            icon: ShieldCheck,
            description:
              "Retrieves complete demographic profile linked to the NIN.",
          },
          {
            id: "nin_face",
            label: "NIN Face Match",
            icon: Camera,
            description:
              "Compares a live photo against the government NIN database image.",
          },
          {
            id: "phone",
            label: "Phone",
            icon: Phone,
            description:
              "Verifies owner details linked to a phone number SIM registration.",
          },
          {
            id: "bank",
            label: "Bank Account",
            icon: CreditCard,
            description:
              "Confirms account name and checks if a bank account is active.",
          },
          {
            id: "bvn_account_match",
            label: "BVN-Account Match",
            icon: CreditCard,
            description:
              "Checks if a BVN and a bank account belong to the same person.",
          },
          {
            id: "passport",
            label: "International Passport",
            icon: FileText,
            description:
              "Validates international passport number and cardholder name.",
          },
          {
            id: "driver_license",
            label: "Driver License",
            icon: Car,
            description: "Checks validity of a official driver license record.",
          },
          {
            id: "voter_card",
            label: "Voter Card",
            icon: Vote,
            description:
              "Confirms Voter Identification Number (VIN) registration data.",
          },
          {
            id: "national_id",
            label: "National ID",
            icon: ShieldCheck,
            description: "Validates official physical ID card details.",
          },
          {
            id: "utility_bill",
            label: "Utility Bill",
            icon: Receipt,
            description:
              "Verifies home address using electricity or utility account details.",
          },
          {
            id: "cac",
            label: "CAC Business",
            icon: Building2,
            description:
              "Checks business registration, status, and RC number with CAC.",
          },
          {
            id: "credit_individual",
            label: "Credit Bureau (Ind.)",
            icon: TrendingUp,
            description:
              "Checks credit history, loans, and financial risk score for an individual.",
          },
          {
            id: "credit_business",
            label: "Credit Bureau (Biz.)",
            icon: Briefcase,
            description:
              "Retrieves credit rating and active loan obligations for a business.",
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`group relative flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>

              {/* Info Icon Container */}
              <span className="relative inline-flex items-center">
                <Info className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors shrink-0" />

                {/* Floating Tooltip Above (In Front) */}
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex group-focus-within:flex flex-col items-center z-50">
                  <span className="bg-foreground text-background text-[11px] font-normal leading-tight rounded-md px-2.5 py-1.5 shadow-xl w-48 whitespace-normal text-center border border-border/20">
                    {tab.description}
                  </span>
                  <span className="w-2 h-2 -mt-1 bg-foreground rotate-45 shrink-0"></span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Forms Container */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        {activeTab === "bvn" && (
          <FormProvider {...bvnForm}>
            <form
              onSubmit={bvnForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyBVN(d),
                  "BVN lookup failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput name="bvn" label="BVN" placeholder="22123456789" />
              <FormButton
                isLoading={bvnForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify BVN
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "bvn_advance" && (
          <FormProvider {...bvnAdvanceForm}>
            <form
              onSubmit={bvnAdvanceForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyAdvanceBVN(d),
                  "Advance BVN failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput name="bvn" label="BVN" placeholder="22123456789" />
              <FormButton
                isLoading={bvnAdvanceForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify Advance BVN
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "bvn_face" && (
          <FormProvider {...bvnFaceForm}>
            <form
              onSubmit={bvnFaceForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyBVNWithFace(d),
                  "BVN Face match failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput name="bvn" label="BVN" placeholder="22123456789" />
              <FormInput
                name="image_base64"
                label="Selfie Image (Base64 string)"
                placeholder="data:image/png;base64,..."
              />
              <FormButton
                isLoading={bvnFaceForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify BVN Face Match
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "nin" && (
          <FormProvider {...ninForm}>
            <form
              onSubmit={ninForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyNIN(d),
                  "NIN lookup failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput name="nin" label="NIN" placeholder="11223344556" />
              <FormInput
                name="date_of_birth"
                label="Date of Birth"
                type="date"
              />
              <FormButton
                isLoading={ninForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify NIN
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "nin_advance" && (
          <FormProvider {...ninAdvanceForm}>
            <form
              onSubmit={ninAdvanceForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyAdvanceNIN({ nin: d.bvn }),
                  "Advance NIN failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="bvn"
                label="NIN Number"
                placeholder="11223344556"
              />
              <FormButton
                isLoading={ninAdvanceForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify Advance NIN
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "nin_face" && (
          <FormProvider {...ninFaceForm}>
            <form
              onSubmit={ninFaceForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyNINWithFace(d),
                  "NIN Face match failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput name="nin" label="NIN" placeholder="11223344556" />
              <FormInput
                name="image_base64"
                label="Selfie Image (Base64 string)"
                placeholder="data:image/png;base64,..."
              />
              <FormButton
                isLoading={ninFaceForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify NIN Face Match
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "phone" && (
          <FormProvider {...phoneForm}>
            <form
              onSubmit={phoneForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyPhone(d),
                  "Phone verification failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="phone_number"
                label="Phone Number"
                placeholder="08012345678"
              />
              <FormButton
                isLoading={phoneForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify Phone
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "bank" && (
          <FormProvider {...bankForm}>
            <form
              onSubmit={bankForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyBankAccount(d),
                  "Bank validation failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="account_number"
                label="Account Number"
                placeholder="0123456789"
              />
              <FormInput name="bank_code" label="Bank Code" placeholder="058" />
              <FormButton
                isLoading={bankForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Validate Account
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "bvn_account_match" && (
          <FormProvider {...bvnAccountMatchForm}>
            <form
              onSubmit={bvnAccountMatchForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyBVNWithAccountMatch(d),
                  "BVN Account match failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput name="bvn" label="BVN" placeholder="22123456789" />
              <FormInput
                name="account_number"
                label="Account Number"
                placeholder="0123456789"
              />
              <FormInput name="bank_code" label="Bank Code" placeholder="058" />
              <FormButton
                isLoading={bvnAccountMatchForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify Match
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "passport" && (
          <FormProvider {...passportForm}>
            <form
              onSubmit={passportForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyPassport(d),
                  "Passport verification failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="passport_number"
                label="Passport Number"
                placeholder="A12345678"
              />
              <FormInput
                name="first_name"
                label="First Name"
                placeholder="John"
              />
              <FormInput name="last_name" label="Last Name" placeholder="Doe" />
              <FormInput
                name="date_of_birth"
                label="Date of Birth"
                type="date"
              />
              <FormButton
                isLoading={passportForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify Passport
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "driver_license" && (
          <FormProvider {...driverLicenseForm}>
            <form
              onSubmit={driverLicenseForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyDriverLicense(d),
                  "Driver License failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="license_number"
                label="Driver License Number"
                placeholder="ABC12345678"
              />
              <FormInput
                name="date_of_birth"
                label="Date of Birth"
                type="date"
              />
              <FormButton
                isLoading={driverLicenseForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify License
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "voter_card" && (
          <FormProvider {...voterCardForm}>
            <form
              onSubmit={voterCardForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyVoterCard(d),
                  "Voter Card failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="vin"
                label="Voter Identification Number (VIN)"
                placeholder="90F5B..."
              />
              <FormInput name="state" label="State" placeholder="Lagos" />
              <FormInput name="last_name" label="Last Name" placeholder="Doe" />
              <FormButton
                isLoading={voterCardForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify Voter Card
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "national_id" && (
          <FormProvider {...nationalIdForm}>
            <form
              onSubmit={nationalIdForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyNationalID(d),
                  "National ID failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="id_number"
                label="National ID Number"
                placeholder="123456789"
              />
              <FormInput
                name="first_name"
                label="First Name"
                placeholder="John"
              />
              <FormInput name="last_name" label="Last Name" placeholder="Doe" />
              <FormButton
                isLoading={nationalIdForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify National ID
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "utility_bill" && (
          <FormProvider {...utilityBillForm}>
            <form
              onSubmit={utilityBillForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyUtilityBill(d),
                  "Utility Bill failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="customer_id"
                label="Customer ID / Meter Number"
                placeholder="101010101"
              />
              <FormInput
                name="provider"
                label="Provider / Disco"
                placeholder="IKEDC"
              />
              <FormButton
                isLoading={utilityBillForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify Utility Bill
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "cac" && (
          <FormProvider {...cacForm}>
            <form
              onSubmit={cacForm.handleSubmit((d) =>
                handleAction(() => verificationApi.verifyCAC(d), "CAC failed"),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="rc_number"
                label="RC / BN / Business Registration Number"
                placeholder="RC1234567"
              />
              <FormInput
                name="company_type"
                label="Company Type (Optional)"
                placeholder="IT or BN"
              />
              <FormButton
                isLoading={cacForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Verify CAC Record
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "credit_individual" && (
          <FormProvider {...creditBureauIndForm}>
            <form
              onSubmit={creditBureauIndForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyCreditBureauIndividual(d),
                  "Credit bureau failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput name="bvn" label="BVN" placeholder="22123456789" />
              <FormInput
                name="first_name"
                label="First Name"
                placeholder="John"
              />
              <FormInput name="last_name" label="Last Name" placeholder="Doe" />
              <FormInput
                name="phone_number"
                label="Phone Number"
                placeholder="08012345678"
              />
              <FormButton
                isLoading={creditBureauIndForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Perform Credit Search
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === "credit_business" && (
          <FormProvider {...creditBureauBizForm}>
            <form
              onSubmit={creditBureauBizForm.handleSubmit((d) =>
                handleAction(
                  () => verificationApi.verifyCreditBureauBusiness(d),
                  "Business credit bureau failed",
                ),
              )}
              className="space-y-4 max-w-lg"
            >
              <FormInput
                name="rc_number"
                label="RC / BN Number"
                placeholder="RC1234567"
              />
              <FormInput
                name="company_name"
                label="Company Name"
                placeholder="Acme Coop Ltd"
              />
              <FormButton
                isLoading={creditBureauBizForm.formState.isSubmitting}
                className="w-full sm:w-auto px-6"
              >
                Search Business Credit
              </FormButton>
            </form>
          </FormProvider>
        )}
      </div>

      {/* Audit Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            Recent Verification Activity
          </h2>
        </div>
        <div className="w-full overflow-x-auto">
          <DataTable
            columns={logColumns}
            data={logs}
            isLoading={isLoadingLogs}
            emptyMessage="No identity verification records found."
            pageCount={Math.ceil(totalLogs / limit)}
            pageIndex={page - 1}
            pageSize={limit}
            totalItems={totalLogs}
            onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          />
        </div>
      </div>

      {/* Verification Result Modal */}
      <Modal
        isOpen={Boolean(resultModalData)}
        onClose={() => setResultModalData(null)}
        title="Verification Result"
      >
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <div
            className={`flex items-start sm:items-center gap-2 p-3 rounded-xl border ${
              resultModalData?.status
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                : "bg-rose-500/10 border-rose-500/20 text-rose-600"
            }`}
          >
            {resultModalData?.status ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 sm:mt-0" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 mt-0.5 sm:mt-0" />
            )}
            <p className="text-xs font-semibold">
              {resultModalData?.message || "Verification Completed"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-accent p-3">
            <pre className="text-[10px] sm:text-[11px] font-mono whitespace-pre-wrap break-all overflow-x-auto text-foreground max-h-60">
              {JSON.stringify(
                resultModalData?.data || resultModalData?.detail,
                null,
                2,
              )}
            </pre>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setResultModalData(null)}
              className="w-full sm:w-auto rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer text-center"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Historical Log Detail Modal */}
      <Modal
        isOpen={Boolean(viewLogDetail)}
        onClose={() => setViewLogDetail(null)}
        title="Verification Audit Log Detail"
      >
        {viewLogDetail && (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs border border-border p-3 rounded-xl bg-card">
              <div>
                <span className="text-muted-foreground">Type:</span>{" "}
                <strong className="uppercase">
                  {viewLogDetail.verification_type}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground">Provider:</span>{" "}
                <strong className="capitalize">{viewLogDetail.provider}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Identifier:</span>{" "}
                <strong className="font-mono break-all">
                  {viewLogDetail.identifier_used}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground">Cost:</span>{" "}
                <strong>
                  {viewLogDetail.currency} {viewLogDetail.fee_amount}
                </strong>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-accent p-3">
              <p className="text-[10px] text-muted-foreground mb-1 font-semibold">
                Response Data
              </p>
              <pre className="text-[10px] sm:text-[11px] font-mono whitespace-pre-wrap break-all overflow-x-auto text-foreground max-h-60">
                {JSON.stringify(
                  viewLogDetail.response_data || viewLogDetail.message,
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
