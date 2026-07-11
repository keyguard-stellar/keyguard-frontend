"use client";

import * as React from "react";
import { toast } from "sonner";
import { KeyRound, Plus, ShieldOff, Pencil, Star } from "lucide-react";
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
import { StatusBadge } from "@/components/keyguard/status-badge";
import { formatDateTime, formatRelativeTime, isValidStellarPublicKey } from "@/lib/utils";
import { RegisteredKey } from "@/lib/types";

export default function KeysPage() {
  const { keys, registerKey, revokeKey, renameKey } = useVault();
  const [addOpen, setAddOpen] = React.useState(false);
  const [renameTarget, setRenameTarget] = React.useState<RegisteredKey | null>(null);
  const [revokeTarget, setRevokeTarget] = React.useState<RegisteredKey | null>(null);

  return (
    <div>
      <PageHeader
        eyebrow="Key Registry"
        title="Registered Keys"
        description="Label every key you control. Revocation is enforced on-chain and can never be quietly reversed by KeyGuard."
        actions={
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="size-4" />
                Register Key
              </Button>
            </DialogTrigger>
            <RegisterKeyDialog
              onSubmit={(label, key) => {
                registerKey(label, key);
                toast.success("Key registered", { description: label });
                setAddOpen(false);
              }}
            />
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {keys.map((key) => (
          <Card
            key={key.id}
            className={key.status === "revoked" ? "opacity-60" : ""}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-secondary">
                    <KeyRound className="size-4 text-foreground/80" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-foreground">{key.label}</p>
                      {key.isPrimary && (
                        <Star className="size-3.5 fill-status-pending text-status-pending" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Added {formatDateTime(key.addedAt)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={key.status === "active" ? "verified" : "revoked"} />
              </div>

              <div className="mt-4">
                <AddressChip value={key.publicKey} lead={10} tail={6} className="w-full" />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Last used: {formatRelativeTime(key.lastUsedAt)}</span>
                {key.status === "active" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setRenameTarget(key)}
                      className="flex items-center gap-1 font-medium text-foreground/80 hover:text-primary"
                    >
                      <Pencil className="size-3" />
                      Rename
                    </button>
                    {!key.isPrimary && (
                      <button
                        onClick={() => setRevokeTarget(key)}
                        className="flex items-center gap-1 font-medium text-destructive hover:text-destructive/80"
                      >
                        <ShieldOff className="size-3" />
                        Revoke
                      </button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RenameKeyDialog
        target={renameTarget}
        onClose={() => setRenameTarget(null)}
        onSubmit={(label) => {
          if (!renameTarget) return;
          renameKey(renameTarget.id, label);
          toast.success("Key renamed");
          setRenameTarget(null);
        }}
      />

      <RevokeKeyDialog
        target={revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => {
          if (!revokeTarget) return;
          revokeKey(revokeTarget.id);
          toast.success("Key revoked", { description: revokeTarget.label });
          setRevokeTarget(null);
        }}
      />
    </div>
  );
}

function RegisterKeyDialog({
  onSubmit,
}: {
  onSubmit: (label: string, publicKey: string) => void;
}) {
  const [label, setLabel] = React.useState("");
  const [key, setKey] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const keyValid = isValidStellarPublicKey(key);
  const canSubmit = label.trim().length > 0 && keyValid;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Register a Key</DialogTitle>
        <DialogDescription>
          Give the key a label you&apos;ll recognize later. This is stored on the KeyGuard
          contract, not just in a database.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="key-label">Label</Label>
          <Input
            id="key-label"
            placeholder="e.g. Trading Account"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="key-public">Stellar public key</Label>
          <Input
            id="key-public"
            placeholder="G..."
            className="font-mono text-xs"
            value={key}
            onChange={(e) => setKey(e.target.value.trim())}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && key.length > 0 && !keyValid}
          />
          {touched && key.length > 0 && !keyValid && (
            <p className="text-xs text-destructive">
              That doesn&apos;t look like a valid Stellar public key (starts with G, 56 characters).
            </p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={!canSubmit}
          onClick={() => onSubmit(label.trim(), key)}
        >
          Register key
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function RenameKeyDialog({
  target,
  onClose,
  onSubmit,
}: {
  target: RegisteredKey | null;
  onClose: () => void;
  onSubmit: (label: string) => void;
}) {
  return (
    <Dialog open={!!target} onOpenChange={(open) => !open && onClose()}>
      {target && (
        <RenameKeyDialogBody key={target.id} target={target} onSubmit={onSubmit} />
      )}
    </Dialog>
  );
}

function RenameKeyDialogBody({
  target,
  onSubmit,
}: {
  target: RegisteredKey;
  onSubmit: (label: string) => void;
}) {
  const [label, setLabel] = React.useState(target.label);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Rename Key</DialogTitle>
        <DialogDescription>Update the label for this key. This is off-chain metadata only.</DialogDescription>
      </DialogHeader>
      <div className="space-y-1.5">
        <Label htmlFor="rename-label">Label</Label>
        <Input id="rename-label" value={label} onChange={(e) => setLabel(e.target.value)} />
      </div>
      <DialogFooter>
        <Button disabled={!label.trim()} onClick={() => onSubmit(label.trim())}>
          Save label
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function RevokeKeyDialog({
  target,
  onClose,
  onConfirm,
}: {
  target: RegisteredKey | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={!!target} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke &ldquo;{target?.label}&rdquo;?</DialogTitle>
          <DialogDescription>
            This submits a permanent, on-chain revocation. It cannot be undone by KeyGuard or
            reversed once confirmed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-destructive text-white hover:bg-destructive/85"
            onClick={onConfirm}
          >
            Revoke key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
