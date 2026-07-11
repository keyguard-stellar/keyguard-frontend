import {
  KeyRound,
  ShieldCheck,
  Users,
  UserMinus,
  LifeBuoy,
  CheckCircle2,
  XCircle,
  LogIn,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { AuditEventType } from "@/lib/types";
import { StatusKind } from "@/components/keyguard/status-badge";

interface AuditMeta {
  icon: LucideIcon;
  status: StatusKind;
  label: string;
}

export const AUDIT_META: Record<AuditEventType, AuditMeta> = {
  "key.registered": { icon: KeyRound, status: "verified", label: "Key registered" },
  "key.revoked": { icon: XCircle, status: "revoked", label: "Key revoked" },
  "key.renamed": { icon: KeyRound, status: "stellar", label: "Key renamed" },
  "multisig.configured": { icon: ShieldCheck, status: "stellar", label: "Multi-sig configured" },
  "signer.added": { icon: Users, status: "verified", label: "Co-signer added" },
  "signer.removed": { icon: UserMinus, status: "revoked", label: "Co-signer removed" },
  "guardian.added": { icon: Users, status: "verified", label: "Guardian designated" },
  "guardian.removed": { icon: UserMinus, status: "revoked", label: "Guardian removed" },
  "recovery.requested": { icon: LifeBuoy, status: "pending", label: "Recovery requested" },
  "recovery.approved": { icon: CheckCircle2, status: "pending", label: "Recovery approved" },
  "recovery.executed": { icon: ShieldCheck, status: "verified", label: "Recovery executed" },
  "recovery.cancelled": { icon: RotateCcw, status: "revoked", label: "Recovery cancelled" },
  "session.authenticated": { icon: LogIn, status: "stellar", label: "Session authenticated" },
};
