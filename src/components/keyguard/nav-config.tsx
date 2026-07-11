import {
  LayoutDashboard,
  KeyRound,
  Users,
  ShieldCheck,
  LifeBuoy,
  ScrollText,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/keys", label: "Key Registry", icon: KeyRound },
  { href: "/dashboard/multisig", label: "Multi-Sig", icon: ShieldCheck },
  { href: "/dashboard/guardians", label: "Guardians", icon: Users },
  { href: "/dashboard/recovery", label: "Recovery", icon: LifeBuoy },
  { href: "/dashboard/audit", label: "Audit Log", icon: ScrollText },
];
