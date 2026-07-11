"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  LifeBuoy,
  CheckCircle2,
  Circle,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Info,
} from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { PageHeader } from "@/components/keyguard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressChip } from "@/components/keyguard/address-chip";
import { StatusBadge } from "@/components/keyguard/status-badge";
import { cn, formatDateTime, isValidStellarPublicKey } from "@/lib/utils";

const STEPS = ["Select lost key", "Set replacement", "Guardian approval", "Execute"] as const;

export default function RecoveryPage() {
  const { keys, guardians, recovery, requestRecovery, approveRecovery, executeRecovery, cancelRecovery } =
    useVault();

  const activeGuardians = guardians.filter((g) => g.status === "active");
  const isActive = recovery && !["executed", "cancelled"].includes(recovery.status);

  return (
    <div>
    

      {activeGuardians.length < 2 && !isActive && (
        <Card className="mb-6 border-status-pending/30 bg-status-pending-bg/40">
          <CardContent className="flex items-start gap-3 p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-status-pending" />
            <p className="text-sm text-foreground/90">
              You need at least 2 active guardians before you can request a recovery.{" "}
              <a href="/dashboard/guardians" className="font-medium text-primary hover:underline">
                Add guardians
              </a>
              .
            </p>
          </CardContent>
        </Card>
      )}

      {recovery && recovery.status === "executed" ? (
        <ExecutedState
          onStartNew={() => {
            /* a fresh request can be made any time via the form below */
          }}
        />
      ) : isActive && recovery ? (
        <ActiveRecovery
          recovery={recovery}
          guardians={guardians}
          onApprove={(id) => {
            approveRecovery(id);
            toast.success("Guardian approved recovery");
          }}
          onExecute={() => {
            executeRecovery();
            toast.success("Recovery executed", {
              description: "Your replacement key is now primary.",
            });
          }}
          onCancel={() => {
            cancelRecovery();
            toast("Recovery cancelled");
          }}
        />
      ) : (
        <RecoveryForm
          keys={keys}
          disabled={activeGuardians.length < 2}
          onSubmit={(lostKey, replacementKey) => {
            requestRecovery(lostKey, replacementKey);
            toast.success("Recovery requested", {
              description: "Waiting on guardian approvals",
            });
          }}
        />
      )}
    </div>
  );
}

function RecoveryForm({
  keys,
  disabled,
  onSubmit,
}: {
  keys: ReturnType<typeof useVault>["keys"];
  disabled: boolean;
  onSubmit: (lostKey: string, replacementKey: string) => void;
}) {
  const [lostKey, setLostKey] = React.useState("");
  const [replacementKey, setReplacementKey] = React.useState("");
  const activeKeys = keys.filter((k) => k.status === "active");
  const replacementValid = isValidStellarPublicKey(replacementKey);
  const canSubmit = !!lostKey && replacementValid && lostKey !== replacementKey;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <LifeBuoy className="size-4.5 text-primary" />
          <h2 className="font-display text-2xl tracking-wide">Request Recovery</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Key you&apos;ve lost access to</Label>
            <div className="space-y-2">
              {activeKeys.map((key) => (
                <button
                  key={key.id}
                  disabled={disabled}
                  onClick={() => setLostKey(key.publicKey)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                    lostKey === key.publicKey
                      ? "border-primary bg-primary-muted"
                      : "border-border bg-secondary/30 hover:border-border/80"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{key.label}</p>
                    <AddressChip value={key.publicKey} copyable={false} className="mt-1" />
                  </div>
                  {lostKey === key.publicKey && <CheckCircle2 className="size-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="replacement-key">Replacement public key</Label>
            <Input
              id="replacement-key"
              placeholder="G..."
              disabled={disabled}
              className="font-mono text-xs"
              value={replacementKey}
              onChange={(e) => setReplacementKey(e.target.value.trim())}
            />
            <p className="pt-1 text-xs text-muted-foreground">
              The account you&apos;ll regain control with once guardians approve. This should be a
              key only you control.
            </p>
          </div>
        </div>

        <Button
          className="mt-6"
          size="lg"
          disabled={!canSubmit || disabled}
          onClick={() => onSubmit(lostKey, replacementKey)}
        >
          Submit recovery request
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function ActiveRecovery({
  recovery,
  guardians,
  onApprove,
  onExecute,
  onCancel,
}: {
  recovery: NonNullable<ReturnType<typeof useVault>["recovery"]>;
  guardians: ReturnType<typeof useVault>["guardians"];
  onApprove: (guardianId: string) => void;
  onExecute: () => void;
  onCancel: () => void;
}) {
  const approvedIds = new Set(recovery.approvals.map((a) => a.guardianId));
  const activeGuardians = guardians.filter((g) => g.status === "active");
  const stepIndex = recovery.status === "ready" ? 3 : 2;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Stepper current={stepIndex} />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-secondary/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Lost key
              </p>
              <AddressChip value={recovery.lostKey} className="mt-2" />
            </div>
            <div className="rounded-lg bg-secondary/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Replacement key
              </p>
              <AddressChip value={recovery.replacementKey} className="mt-2" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Requested {formatDateTime(recovery.requestedAt)} &middot; needs{" "}
            {recovery.requiredApprovals} of {activeGuardians.length} guardian approvals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl tracking-wide">Guardian Approvals</h3>
            <StatusBadge
              status={recovery.status === "ready" ? "verified" : "pending"}
              label={
                recovery.status === "ready"
                  ? "Threshold met"
                  : `${recovery.approvals.length}/${recovery.requiredApprovals} approved`
              }
            />
          </div>

          <ul className="space-y-2">
            {activeGuardians.map((guardian) => {
              const approved = approvedIds.has(guardian.id);
              return (
                <li
                  key={guardian.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-secondary/30 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    {approved ? (
                      <CheckCircle2 className="size-4.5 text-status-verified" />
                    ) : (
                      <Circle className="size-4.5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{guardian.label}</p>
                      <AddressChip value={guardian.publicKey} copyable={false} />
                    </div>
                  </div>
                  {!approved && (
                    <Button size="sm" variant="outline" onClick={() => onApprove(guardian.id)}>
                      Simulate approval
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            In production, each guardian approves independently by signing the recovery payload
            in their own wallet. This demo lets you simulate that from one screen.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {recovery.status === "ready" && (
              <Button onClick={onExecute}>
                <ShieldCheck className="size-4" />
                Execute recovery
              </Button>
            )}
            <Button variant="outline" onClick={onCancel} className="text-muted-foreground">
              <RotateCcw className="size-4" />
              Cancel request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExecutedState({ onStartNew }: { onStartNew: () => void }) {
  return (
    <Card className="border-status-verified/30">
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-status-verified-bg">
          <ShieldCheck className="size-7 text-status-verified" />
        </div>
        <div>
          <p className="font-display text-2xl tracking-wide">Recovery complete</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Your replacement key is now primary and visible in the key registry. The lost key has
            been revoked on-chain.
          </p>
        </div>
        <Button variant="outline" onClick={onStartNew} className="mt-2">
          View key registry
        </Button>
      </CardContent>
    </Card>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-xs font-medium",
                i < current
                  ? "border-primary bg-primary text-primary-foreground"
                  : i === current
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
              )}
            >
              {i < current ? <CheckCircle2 className="size-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-center text-[11px] sm:block",
                i <= current ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "mx-2 h-px flex-1",
                i < current ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
