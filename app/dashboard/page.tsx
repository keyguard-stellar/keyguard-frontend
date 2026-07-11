"use client";

import Link from "next/link";
import {
  KeyRound,
  ShieldCheck,
  Users,
  LifeBuoy,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { useWallet } from "@/lib/wallet-context";
import { PageHeader } from "@/components/keyguard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AddressChip } from "@/components/keyguard/address-chip";
import { StatusDot } from "@/components/keyguard/status-badge";
import { formatRelativeTime } from "@/lib/utils";
import { AUDIT_META } from "@/components/keyguard/audit-meta";

export default function OverviewPage() {
  const { keys, multisig, guardians, recovery, audit, ready } = useVault();
  const { displayAddress } = useWallet();

  if (!ready) {
    return <div className="text-sm text-muted-foreground">Loading your vault\u2026</div>;
  }

  const activeKeys = keys.filter((k) => k.status === "active");
  const totalWeight = multisig.signers.length + 1;

  const stats = [
    {
      label: "Registered keys",
      value: activeKeys.length,
      sub: `${keys.length - activeKeys.length} revoked`,
      icon: KeyRound,
      href: "/dashboard/keys",
    },
    {
      label: "Signing threshold",
      value: `${multisig.threshold} of ${totalWeight}`,
      sub: `${multisig.signers.length} co-signer${multisig.signers.length === 1 ? "" : "s"}`,
      icon: ShieldCheck,
      href: "/dashboard/multisig",
    },
    {
      label: "Guardians",
      value: guardians.filter((g) => g.status === "active").length,
      sub: "Majority required to recover",
      icon: Users,
      href: "/dashboard/guardians",
    },
    {
      label: "Recovery status",
      value: recovery && recovery.status !== "executed" && recovery.status !== "cancelled"
        ? "In progress"
        : "None active",
      sub: recovery
        ? `${recovery.approvals.length}/${recovery.requiredApprovals} approved`
        : "Nothing to recover",
      icon: LifeBuoy,
      href: "/dashboard/recovery",
      alert: !!recovery && recovery.status !== "executed" && recovery.status !== "cancelled",
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Vault Overview"
        title="Your Keys, Guarded"
        description={`Signed in as ${displayAddress}. Every rule below is enforced by the KeyGuard Soroban contract — not by us.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="group h-full transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary-muted">
                    <stat.icon className="size-4.5 text-primary" />
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-display text-3xl tracking-wide text-foreground">
                    {stat.value}
                  </p>
                  <p
                    className={`mt-0.5 text-xs ${
                      stat.alert ? "font-medium text-status-pending" : "text-muted-foreground"
                    }`}
                  >
                    {stat.sub}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-2xl tracking-wide">
                <Activity className="size-4.5 text-primary" />
                Recent Activity
              </h2>
              <Link
                href="/dashboard/audit"
                className="text-xs font-medium text-primary hover:underline"
              >
                View full log
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {audit.slice(0, 6).map((event) => {
                const meta = AUDIT_META[event.type];
                return (
                  <li key={event.id} className="flex items-start gap-3 py-3">
                    <StatusDot status={meta.status} className="mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">{event.message}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatRelativeTime(event.timestamp)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h2 className="mb-4 font-display text-2xl tracking-wide">Key Registry</h2>
            <ul className="space-y-2">
              {keys.slice(0, 5).map((key) => (
                <li
                  key={key.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{key.label}</p>
                    <AddressChip value={key.publicKey} className="mt-1" />
                  </div>
                  <StatusDot status={key.status === "active" ? "verified" : "revoked"} />
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/keys"
              className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Manage keys
              <ArrowUpRight className="size-3" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
