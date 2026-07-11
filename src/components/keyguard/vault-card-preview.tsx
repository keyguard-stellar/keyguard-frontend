import { KeyRound, ShieldCheck } from "lucide-react";
import { StatusDot } from "@/components/keyguard/status-badge";

const MOCK_KEYS = [
  { label: "Primary", addr: "GCXK4F...9ABDE", status: "verified" as const },
  { label: "Hardware Backup", addr: "GBQTIO...C3DE", status: "verified" as const },
  { label: "Old Phone", addr: "GAZQ7C...XUB4", status: "revoked" as const },
];

export function VaultCardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/5 blur-2xl" />

      <div className="rounded-2xl border border-border bg-card p-1.5 shadow-2xl">
        <div className="rounded-xl border border-border/60 bg-secondary/20 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <KeyRound className="size-3.5" />
              Key Registry
            </span>
            <span className="rounded-full bg-status-stellar-bg px-2 py-0.5 text-[10px] font-medium text-status-stellar">
              Live on Stellar
            </span>
          </div>

          <ul className="space-y-2">
            {MOCK_KEYS.map((key) => (
              <li
                key={key.addr}
                className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{key.label}</p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">
                    {key.addr}
                  </p>
                </div>
                <StatusDot status={key.status} className="shrink-0" />
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Approval threshold</span>
            <span className="font-mono text-xs text-foreground">2-of-3</span>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-6 hidden items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-xl sm:flex">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary-muted">
          <ShieldCheck className="size-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">Recovery ready</p>
          <p className="font-mono text-[10px] text-muted-foreground">3-of-5 guardians approved</p>
        </div>
      </div>
    </div>
  );
}
