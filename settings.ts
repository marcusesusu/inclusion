import { LayoutDashboard, Settings, type LucideIcon } from "lucide-react";
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
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    allowedRoles: ["superadmin", "admin"],
  },
];
