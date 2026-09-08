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
  Printer,
  Download,
} from "lucide-react";

import toast from "react-hot-toast";

import { FormInput } from "@/components/ui/form-input";
import { FormButton } from "@/components/ui/form-button";
import { Modal } from "@/components/ui/modal";
import { DataTable, Column } from "@/components/ui/data-table";
import { verificationApi } from "@/lib/verification";
import { VerificationLogItem, BaseKYCResponse } from "@/types/verification";

// Schemas
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

  // Temporary In-Memory Result Storage
  const [resultModalData, setResultModalData] =
    React.useState<BaseKYCResponse | null>(null);
  const [viewLogDetail, setViewLogDetail] =
    React.useState<VerificationLogItem | null>(null);

  const printRef = React.useRef<HTMLDivElement>(null);

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

  // Forms
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

  const handlePrint = () => {
    // 1. Format the verification name (e.g., "BVN Verification")
    const verificationName =
      resultModalData?.verification_type
        ?.replace(/_/g, " ")
        ?.replace(/\b\w/g, (l) => l.toUpperCase()) || "KYC Check";

    // 2. Format today's date for filename cleanliness (e.g., "2026-09-08")
    const formattedDate = new Date().toISOString().split("T")[0];

    // 3. Construct desired document title
    const printTitle = `Inclusion ID - ${verificationName} Certificate (${formattedDate})`;

    // 4. Save original document title & assign new title for print output
    const originalTitle = document.title;
    document.title = printTitle;

    // 5. Trigger browser print dialog
    window.print();

    // 6. Restore original page title after printing
    document.title = originalTitle;
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
              onClick={() => {
                const resData: BaseKYCResponse = {
                  status: item.is_success,
                  message: item.message || "Verification Record",
                  verification_type: item.verification_type,
                  data: item.response_data || {}, // <--- Add || {} fallback here
                };
                setResultModalData(resData);
              }}
              className="rounded-lg p-1.5 flex gap-1 items-center bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" /> View / Print
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

      {/* Tabs */}
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
              <span className="relative inline-flex items-center">
                <Info className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors shrink-0" />
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
              onSubmit={bvnForm.handleSubmit((d) => {
                console.log("BVN Form Submitted Payload:", d);
                return handleAction(async () => {
                  const response = await verificationApi.verifyBVN(d);
                  console.log("BVN API Raw Response in Component:", response);
                  return response;
                }, "BVN lookup failed");
              })}
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

      {/* Verification Result Modal & Printable Certificate */}
      <Modal
        isOpen={Boolean(resultModalData)}
        onClose={() => setResultModalData(null)}
        title="Verification Certificate Preview"
        maxWidth="xl"
      >
        <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-1">
          {/* Printable Certificate Container */}
          <div
            id="printable-certificate"
            className="p-8 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-sm font-sans w-full max-w-2xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:w-full"
          >
            {/* 1. Header: Top-Left Logo & Top-Right Verification Type */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6 gap-4">
              <div className="flex flex-col gap-1">
                <img
                  src="/inclusion_logo.png"
                  alt="Inclusion Logo"
                  className="h-9 w-auto object-contain max-w-45"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-1">
                  Statutory Verification Certificate
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 text-right">
                <span className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                  {resultModalData?.verification_type?.replace(/_/g, " ") ||
                    "KYC Check"}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full ${
                    resultModalData?.status
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  {resultModalData?.status ? "VERIFIED" : "FAILED"}
                </span>
              </div>
            </div>

            {/* 2. Verification Metadata Overview */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block mb-1 font-medium">
                  Verification Status
                </span>
                <strong className="font-semibold text-slate-800 capitalize">
                  {resultModalData?.message || "Operation Completed"}
                </strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block mb-1 font-medium">
                  Issued On
                </span>
                <strong className="font-semibold text-slate-800 font-mono text-xs">
                  {new Date().toLocaleString()}
                </strong>
              </div>
            </div>

            {/* ID Photo Preview Section (Shows only if image data exists) */}
            {(() => {
              const rawImg =
                resultModalData?.data?.base64Image ||
                resultModalData?.data?.photo ||
                resultModalData?.data?.image ||
                resultModalData?.data?.base64_image;

              if (!rawImg || typeof rawImg !== "string") return null;

              const imgSrc = rawImg.startsWith("data:image")
                ? rawImg
                : `data:image/jpeg;base64,${rawImg}`;

              return (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-300 bg-slate-200 shadow-inner">
                    <img
                      src={imgSrc}
                      alt="Verified Holder Portrait"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.parentElement!.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Identity Image Record
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Official statutory facial record matching the verified
                      profile.
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Facial Biometric Match
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* 3. Detailed Data Table */}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Verification Payload
              </h4>
              {resultModalData?.data &&
              typeof resultModalData.data === "object" ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                  {Object.entries(resultModalData.data)
                    .filter(([key, value]) => {
                      // 1. Omit internal raw_response and image string keys from table view
                      const lowerKey = key.toLowerCase();
                      if (
                        key === "raw_response" ||
                        lowerKey.includes("base64image") ||
                        lowerKey === "photo" ||
                        lowerKey === "image" ||
                        lowerKey === "base64_image"
                      )
                        return false;

                      // 2. Omit null or undefined
                      if (value === null || value === undefined) return false;

                      // 3. Omit empty or literal string representations ("null", "undefined", "")
                      const strVal = String(value).trim();
                      if (
                        strVal === "" ||
                        strVal === "null" ||
                        strVal === "undefined"
                      )
                        return false;

                      return true;
                    })
                    .map(([key, value]) => {
                      const stringValue =
                        typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value);
                      const isNumericOrId =
                        /^[0-9+--]+$/.test(stringValue) ||
                        key.includes("bvn") ||
                        key.includes("nin") ||
                        key.includes("phone") ||
                        key.includes("date");

                      return (
                        <div
                          key={key}
                          className="flex justify-between items-center px-4 py-3 text-xs hover:bg-slate-50/50 transition-colors"
                        >
                          <span className="text-slate-500 font-medium capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span
                            className={`text-slate-900 ${
                              isNumericOrId
                                ? "font-mono font-semibold text-[13px]"
                                : "font-semibold text-xs"
                            }`}
                          >
                            {stringValue}
                          </span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {resultModalData?.message || "No output fields recorded."}
                </p>
              )}
            </div>

            {/* 4. Centered Branding Footer */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col items-center justify-center gap-1 text-center">
              <div className="text-xs font-medium text-slate-600">
                Powered by{" "}
                <strong className="text-slate-900 font-bold">
                  Inclusion ID
                </strong>
              </div>
              <p className="text-[10px] text-slate-400">
                Official statutory record generated by Inclusion Identity
                Services.
              </p>
            </div>
          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={() => setResultModalData(null)}
              className="w-full sm:w-auto rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer text-center"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Production-Ready Print Styles */}
      <style jsx global>{`
        @media print {
          /* 1. Reset A4 margins & suppress default browser headers/footers */
          @page {
            size: A4 portrait;
            margin: 0;
          }

          /* 2. Reset document root layout */
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* 3. Hide all UI components except the printable element */
          body * {
            visibility: hidden !important;
          }

          .print\\:hidden,
          header,
          nav,
          aside,
          button,
          [role="dialog"] > div:first-child {
            display: none !important;
          }

          /* 4. Display the certificate at the top boundary */
          #printable-certificate,
          #printable-certificate * {
            visibility: visible !important;
          }

          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 32px !important; /* Controlled padding inside A4 */
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
