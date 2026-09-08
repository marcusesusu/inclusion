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
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
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
