"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, UserMinus, ShieldQuestion, Users } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { PageHeader } from "@/components/keyguard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatDateTime, isValidStellarPublicKey } from "@/lib/utils";
import { Guardian } from "@/lib/types";

const MAX_GUARDIANS = 5;

export default function GuardiansPage() {
  const { guardians, addGuardian, removeGuardian } = useVault();
  const [addOpen, setAddOpen] = React.useState(false);
  const [removeTarget, setRemoveTarget] = React.useState<Guardian | null>(null);

  const majority = Math.floor(guardians.length / 2) + 1;
  const atCapacity = guardians.length >= MAX_GUARDIANS;

  return (
    <div>
      <PageHeader
        eyebrow="Account Recovery"
        title="Guardians"
        description="Up to five trusted accounts who can co-sign a key replacement if you lose access. They can't touch your funds otherwise."
        actions={
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="lg" disabled={atCapacity}>
                <Plus className="size-4" />
                Add Guardian
              </Button>
            </DialogTrigger>
            <AddGuardianDialog
              onSubmit={(label, key) => {
                addGuardian(label, key);
                toast.success("Guardian designated", { description: label });
                setAddOpen(false);
              }}
            />
          </Dialog>
        }
      />

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary-muted">
            <Users className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-foreground">
              <span className="font-display text-2xl tracking-wide text-primary">{majority}</span>{" "}
              of {guardians.length || 0} guardians must approve to recover your account.
            </p>
            <p className="text-xs text-muted-foreground">
              A single compromised guardian can never unilaterally hijack your identity —
              collusion among your most trusted contacts is required.
            </p>
          </div>
        </CardContent>
      </Card>

      {guardians.length === 0 ? (
        <EmptyState onAdd={() => setAddOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guardians.map((guardian, i) => (
            <Card key={guardian.id}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-secondary font-display text-lg text-foreground/80">
                    {i + 1}
                  </div>
                  <button
                    onClick={() => setRemoveTarget(guardian)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${guardian.label}`}
                  >
                    <UserMinus className="size-3.5" />
                  </button>
                </div>
                <p className="font-medium text-foreground">{guardian.label}</p>
                <p className="mb-3 text-xs text-muted-foreground">
                  Added {formatDateTime(guardian.addedAt)}
                </p>
                <AddressChip value={guardian.publicKey} lead={8} tail={6} className="w-full" />
              </CardContent>
            </Card>
          ))}
          {Array.from({ length: MAX_GUARDIANS - guardians.length }).map((_, i) => (
            <button
              key={`empty-${i}`}
              onClick={() => setAddOpen(true)}
              className="flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-5" />
              <span className="text-xs font-medium">Add guardian slot</span>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove &ldquo;{removeTarget?.label}&rdquo;?</DialogTitle>
            <DialogDescription>
              This guardian will no longer be able to co-sign a recovery for your account. Your
              majority threshold recalculates automatically.
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
                removeGuardian(removeTarget.id);
                toast.success("Guardian removed", { description: removeTarget.label });
                setRemoveTarget(null);
              }}
            >
              Remove guardian
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <ShieldQuestion className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium text-foreground">No guardians designated</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Without guardians, a lost key means permanent loss. Add family, colleagues, or a
            hardware wallet you trust.
          </p>
        </div>
        <Button onClick={onAdd} className="mt-2">
          <Plus className="size-4" />
          Add your first guardian
        </Button>
      </CardContent>
    </Card>
  );
}

function AddGuardianDialog({
  onSubmit,
}: {
  onSubmit: (label: string, key: string) => void;
}) {
  const [label, setLabel] = React.useState("");
  const [key, setKey] = React.useState("");
  const keyValid = isValidStellarPublicKey(key);
  const canSubmit = label.trim().length > 0 && keyValid;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Designate a Guardian</DialogTitle>
        <DialogDescription>
          Choose someone you trust — a family member, close colleague, or a second hardware
          wallet. They&apos;ll only ever be asked to approve a recovery you initiate.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="guardian-label">Label</Label>
          <Input
            id="guardian-label"
            placeholder="e.g. Sister — Yinka"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guardian-key">Stellar public key</Label>
          <Input
            id="guardian-key"
            placeholder="G..."
            className="font-mono text-xs"
            value={key}
            onChange={(e) => setKey(e.target.value.trim())}
          />
        </div>
      </div>
      <DialogFooter>
        <Button disabled={!canSubmit} onClick={() => onSubmit(label.trim(), key)}>
          Designate guardian
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
