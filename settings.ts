import { CircleDollarSign, LayoutDashboard, Settings, ShieldAlertIcon, Users, type LucideIcon } from "lucide-react";
import { Role } from "./types/auth";

export const SLIDES = [
  {
    image: '/bg/passport.jpeg',
    title: 'Enterprise Identity Verification',
    description: 'Instant, compliant NIN, BVN, and document verification powered by inclusion.id',
  },
  {
    image: '/bg/kyc.jpeg',
    title: 'Automated Fraud Prevention',
    description: 'Real-time biometric and document authenticity checks for your platform.',
  },
];


interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["superadmin", "admin", "staff"],
  },
  {
    label: "Verifications",
    href: "/dashboard/verifications",
    icon: ShieldAlertIcon,
    allowedRoles: ["superadmin", "admin", "staff"],
  },
  {
    label: "Teams",
    href: "/dashboard/team",
    icon: Users,
    allowedRoles: ["superadmin", "admin"],
  },
  {
    label: "Wallets",
    href: "/dashboard/wallets",
    icon: CircleDollarSign,
    allowedRoles: ["superadmin", "admin"],
  },
];

export const NIGERIAN_DISCOS = [
  { label: "Ikeja Electric (IKEDC)", value: "IKEDC" },
  { label: "Eko Electricity Distribution (EKEDC)", value: "EKEDC" },
  { label: "Abuja Electricity Distribution (AEDC)", value: "AEDC" },
  { label: "Ibadan Electricity Distribution (IBEDC)", value: "IBEDC" },
  { label: "Enugu Electricity Distribution (EEDC)", value: "EEDC" },
  { label: "Port Harcourt Electricity Distribution (PHED)", value: "PHED" },
  { label: "Kano Electricity Distribution (KEDCO)", value: "KEDCO" },
  { label: "Kaduna Electric (KAEDCO)", value: "KAEDCO" },
  { label: "Jos Electricity Distribution (JEDC)", value: "JEDC" },
  { label: "Benin Electricity Distribution (BEDC)", value: "BEDC" },
  { label: "Yola Electricity Distribution (YEDC)", value: "YEDC" },
  { label: "Aba Power Limited (APL)", value: "APL" },
] as const;

// @/config/verification-providers.ts

export type TabType =
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

export interface ProviderRule {
  key: TabType;
  label: string;
  regex: RegExp;
  logo: string; // Located in public/checker/{types}.png
}

export const VERIFICATION_PROVIDERS: ProviderRule[] = [
  { key: "bvn", label: "BVN Lookup", regex: /\bbvn\b/i, logo: "/checker/bvn.png" },
  { key: "bvn_advance", label: "BVN Advance", regex: /bvn[_\s]?advance/i, logo: "/checker/bvn_advance.png" },
  { key: "bvn_face", label: "BVN Face Match", regex: /bvn[_\s]?face/i, logo: "/checker/bvn_face.png" },
  { key: "nin", label: "NIN Lookup", regex: /\bnin\b/i, logo: "/checker/nin.png" },
  { key: "nin_advance", label: "NIN Advance", regex: /nin[_\s]?advance/i, logo: "/checker/nin_advance.png" },
  { key: "nin_face", label: "NIN Face Match", regex: /nin[_\s]?face/i, logo: "/checker/nin_face.png" },
  { key: "phone", label: "Phone Verification", regex: /phone|sim|msisdn/i, logo: "/checker/phone.png" },
  { key: "bank", label: "Bank Account Validation", regex: /bank|account[_\s]?validate/i, logo: "/checker/bank.png" },
  { key: "bvn_account_match", label: "BVN Account Match", regex: /bvn[_\s]?account[_\s]?match/i, logo: "/checker/bvn_account_match.png" },
  { key: "passport", label: "International Passport", regex: /passport/i, logo: "/checker/passport.png" },
  { key: "driver_license", label: "Driver License", regex: /driver[_\s]?license|frsc/i, logo: "/checker/driver_license.png" },
  { key: "voter_card", label: "Voter Card", regex: /voter[_\s]?card|pvc|vin/i, logo: "/checker/voter_card.png" },
  { key: "national_id", label: "National ID Card", regex: /national[_\s]?id/i, logo: "/checker/national_id.png" },
  { key: "utility_bill", label: "Utility Bill / Disco", regex: /utility|disco|meter/i, logo: "/checker/utility_bill.png" },
  { key: "cac", label: "CAC Business", regex: /cac|corporate|rc[_\s]?number/i, logo: "/checker/cac.png" },
  { key: "credit_individual", label: "Credit Bureau (Individual)", regex: /credit[_\s]?(ind|individual)/i, logo: "/checker/credit_individual.png" },
  { key: "credit_business", label: "Credit Bureau (Business)", regex: /credit[_\s]?(biz|business)/i, logo: "/checker/credit_business.png" },
];

/**
 * Searches for a provider using Regex matching on raw status or message text
 */
export function getProviderByRegex(text?: string, fallbackType?: TabType): ProviderRule | null {
  if (!text && !fallbackType) return null;

  const targetText = text || "";
  const match = VERIFICATION_PROVIDERS.find((p) => p.regex.test(targetText));

  if (match) return match;

  // Fallback to exact key match
  if (fallbackType) {
    return VERIFICATION_PROVIDERS.find((p) => p.key === fallbackType) || null;
  }

  return null;
}
