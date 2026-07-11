"use client";

import * as React from "react";
import { ScrollText, ExternalLink, Filter } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { PageHeader } from "@/components/keyguard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AddressChip } from "@/components/keyguard/address-chip";
import { StatusDot, STATUS_ICON_BG, STATUS_ICON_FG } from "@/components/keyguard/status-badge";
import { AUDIT_META } from "@/components/keyguard/audit-meta";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AuditEventType } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const FILTERS: { label: string; types: AuditEventType[] | null }[] = [
  { label: "All events", types: null },
  { label: "Keys", types: ["key.registered", "key.revoked", "key.renamed"] },
  {
    label: "Multi-sig",
    types: ["multisig.configured", "signer.added", "signer.removed"],
  },
  { label: "Guardians", types: ["guardian.added", "guardian.removed"] },
  {
    label: "Recovery",
    types: [
      "recovery.requested",
      "recovery.approved",
      "recovery.executed",
      "recovery.cancelled",
    ],
  },
];

export default function AuditPage() {
  const { audit } = useVault();
  const [filter, setFilter] = React.useState(FILTERS[0]);

  const filtered = filter.types
    ? audit.filter((e) => filter.types!.includes(e.type))
    : audit;

  return (
    <div>
      <PageHeader
        eyebrow="Transparency"
        title="Audit Trail"
        description="Every request, approval, and key replacement recorded as an on-chain event — verifiable by you, your guardians, or anyone else."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="size-4" />
                {filter.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {FILTERS.map((f) => (
                <DropdownMenuItem key={f.label} onSelect={() => setFilter(f)}>
                  {f.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <ScrollText className="size-8" />
            <p className="text-sm">No events in this category yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {filtered.map((event) => {
                const meta = AUDIT_META[event.type];
                const Icon = meta.icon;
                return (
                  <li key={event.id} className="flex items-start gap-4 px-5 py-4">
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                        STATUS_ICON_BG[meta.status]
                      )}
                    >
                      <Icon className={cn("size-4", STATUS_ICON_FG[meta.status])} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-foreground">{event.message}</p>
                        <StatusDot status={meta.status} className="hidden" />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{formatDateTime(event.timestamp)}</span>
                        <span className="text-muted-foreground/50">&middot;</span>
                        <span>{meta.label}</span>
                        {event.txHash && (
                          <>
                            <span className="text-muted-foreground/50">&middot;</span>
                            <span className="inline-flex items-center gap-1">
                              <AddressChip value={event.txHash} lead={4} tail={4} copyable={false} />
                              <ExternalLink className="size-3" />
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
