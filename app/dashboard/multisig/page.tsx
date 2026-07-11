"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, UserMinus, ShieldCheck, Info } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { PageHeader } from "@/components/keyguard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddressChip } from "@/components/keyguard/address-chip";
import { useWallet } from "@/lib/wallet-context";
import { isValidStellarPublicKey } from "@/lib/utils";
import { Signer } from "@/lib/types";

export default function MultiSigPage() {
  const { multisig, setThreshold, addSigner, removeSigner } = useVault();
  const { address } = useWallet();
  const [addOpen, setAddOpen] = React.useState(false);
  const [removeTarget, setRemoveTarget] = React.useState<Signer | null>(null);

  const totalWeight = multisig.signers.length + 1;

  return (
    <div>
      <PageHeader
        eyebrow="Multi-Signature"
        title="Threshold Enforcement"
        description="Set how many co-signers must approve before a sensitive operation executes. The Stellar network enforces this — not a server."
        actions={
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="size-4" />
                Add Co-signer
              </Button>
            </DialogTrigger>
            <AddSignerDialog
              onSubmit={(label, key, weight) => {
                addSigner(label, key, weight);
                toast.success("Co-signer added", { description: label });
                setAddOpen(false);
              }}
            />
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <ThresholdCard
          key={multisig.threshold}
          threshold={multisig.threshold}
          totalWeight={totalWeight}
          onCommit={(next) => {
            setThreshold(next);
            toast.success("Threshold updated", {
              description: `${next} of ${totalWeight} signers now required`,
            });
          }}
        />

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="mb-4 font-display text-2xl tracking-wide">Signers</h2>
            <ul className="space-y-2">
              <li className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">You (master key)</p>
                  {address && <AddressChip value={address} className="mt-1" />}
                </div>
                <span className="shrink-0 rounded-full bg-primary-muted px-2 py-0.5 text-[11px] font-medium text-primary">
                  Weight {multisig.masterWeight}
                </span>
              </li>
              {multisig.signers.map((signer) => (
                <li
                  key={signer.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{signer.label}</p>
                    <AddressChip value={signer.publicKey} className="mt-1" />
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                      Weight {signer.weight}
                    </span>
                    <button
                      onClick={() => setRemoveTarget(signer)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${signer.label}`}
                    >
                      <UserMinus className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove &ldquo;{removeTarget?.label}&rdquo;?</DialogTitle>
            <DialogDescription>
              This signer will no longer count toward your approval threshold. Your threshold
              will be capped automatically if it now exceeds the remaining signer count.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-destructive text-white hover:bg-destructive/85"
              onClick={() => {
                if (!removeTarget) return;
                removeSigner(removeTarget.id);
                toast.success("Co-signer removed", { description: removeTarget.label });
                setRemoveTarget(null);
              }}
            >
              Remove signer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ThresholdCard({
  threshold,
  totalWeight,
  onCommit,
}: {
  threshold: number;
  totalWeight: number;
  onCommit: (next: number) => void;
}) {
  const [pendingThreshold, setPendingThreshold] = React.useState(threshold);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const thresholdChanged = pendingThreshold !== threshold;

  return (
    <Card className="lg:col-span-3">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="size-4.5 text-primary" />
          <h2 className="font-display text-2xl tracking-wide">Approval Threshold</h2>
        </div>

        <div className="mb-2 flex items-end justify-between">
          <span className="font-display text-5xl tracking-wide text-primary">
            {pendingThreshold}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">
            of {totalWeight} signers required
          </span>
        </div>

        <Slider
          min={1}
          max={totalWeight}
          step={1}
          value={[pendingThreshold]}
          onValueChange={(v) => setPendingThreshold(v[0])}
          className="my-5"
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 (any signer)</span>
          <span>{totalWeight} (unanimous)</span>
        </div>

        {thresholdChanged && (
          <div className="mt-5 flex items-center justify-between rounded-lg border border-primary/30 bg-primary-muted px-4 py-3">
            <p className="text-xs text-foreground/90">
              This will submit a <span className="font-mono">SetOptions</span> transaction
              changing the threshold to {pendingThreshold} of {totalWeight}.
            </p>
            <Button size="sm" onClick={() => setConfirmOpen(true)}>
              Review &amp; sign
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-start gap-2 rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <p>
            A solo user might choose a 1-of-2 setup with a backup device. A team treasury might
            require 3-of-5 before funds can move. Once submitted, only the contract can enforce or
            change this — KeyGuard&apos;s API can only propose the transaction.
          </p>
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm threshold change</DialogTitle>
              <DialogDescription>
                Review exactly what will be submitted to Freighter before you sign.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 rounded-lg border border-border bg-secondary/30 p-4 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">operation</span>
                <span>SetOptions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">med_threshold</span>
                <span>
                  {threshold} &rarr; {pendingThreshold}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">total_signers</span>
                <span>{totalWeight}</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onCommit(pendingThreshold);
                  setConfirmOpen(false);
                }}
              >
                Sign &amp; submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function AddSignerDialog({
  onSubmit,
}: {
  onSubmit: (label: string, key: string, weight: number) => void;
}) {
  const [label, setLabel] = React.useState("");
  const [key, setKey] = React.useState("");
  const [weight, setWeight] = React.useState(1);
  const keyValid = isValidStellarPublicKey(key);
  const canSubmit = label.trim().length > 0 && keyValid;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Co-signer</DialogTitle>
        <DialogDescription>
          This account will be able to approve operations that require your signing threshold.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="signer-label">Label</Label>
          <Input
            id="signer-label"
            placeholder="e.g. Co-founder"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signer-key">Stellar public key</Label>
          <Input
            id="signer-key"
            placeholder="G..."
            className="font-mono text-xs"
            value={key}
            onChange={(e) => setKey(e.target.value.trim())}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signer-weight">Weight</Label>
          <Input
            id="signer-weight"
            type="number"
            min={1}
            max={10}
            value={weight}
            onChange={(e) => setWeight(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
      </div>
      <DialogFooter>
        <Button disabled={!canSubmit} onClick={() => onSubmit(label.trim(), key, weight)}>
          Add signer
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
