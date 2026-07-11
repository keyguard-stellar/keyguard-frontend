import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusKind = "verified" | "revoked" | "pending" | "stellar";

const STATUS_LABEL: Record<StatusKind, string> = {
  verified: "Active",
  revoked: "Revoked",
  pending: "Pending",
  stellar: "On-chain",
};

const STATUS_CLASSES: Record<StatusKind, string> = {
  verified: "bg-status-verified-bg text-status-verified",
  revoked: "bg-status-revoked-bg text-status-revoked",
  pending: "bg-status-pending-bg text-status-pending",
  stellar: "bg-status-stellar-bg text-status-stellar",
};

const DOT_CLASSES: Record<StatusKind, string> = {
  verified: "bg-status-verified",
  revoked: "bg-status-revoked",
  pending: "bg-status-pending",
  stellar: "bg-status-stellar",
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: StatusKind;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_CLASSES[status],
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT_CLASSES[status])} />
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}

export function StatusDot({ status, className }: { status: StatusKind; className?: string }) {
  return <span className={cn("inline-block size-2 rounded-full", DOT_CLASSES[status], className)} />;
}

/** Static class lookups for icon chips — kept literal so Tailwind's compiler can see them. */
export const STATUS_ICON_BG: Record<StatusKind, string> = {
  verified: "bg-status-verified-bg",
  revoked: "bg-status-revoked-bg",
  pending: "bg-status-pending-bg",
  stellar: "bg-status-stellar-bg",
};

export const STATUS_ICON_FG: Record<StatusKind, string> = {
  verified: "text-status-verified",
  revoked: "text-status-revoked",
  pending: "text-status-pending",
  stellar: "text-status-stellar",
};
