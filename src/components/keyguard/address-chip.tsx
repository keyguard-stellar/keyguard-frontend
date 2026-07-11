"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn, truncateKey } from "@/lib/utils";

export function AddressChip({
  value,
  lead = 6,
  tail = 5,
  className,
  copyable = true,
}: {
  value: string;
  lead?: number;
  tail?: number;
  className?: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <span
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md bg-secondary/60 px-2 py-1 font-mono text-xs text-foreground/90",
        copyable && "cursor-pointer hover:bg-secondary",
        className
      )}
      onClick={copyable ? handleCopy : undefined}
      title={value}
    >
      {truncateKey(value, lead, tail)}
      {copyable &&
        (copied ? (
          <Check className="size-3 text-status-verified" />
        ) : (
          <Copy className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        ))}
    </span>
  );
}
