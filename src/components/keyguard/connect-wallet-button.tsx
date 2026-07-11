"use client";

import * as React from "react";
import { ChevronDown, LogOut, ShieldCheck, ExternalLink, Loader2, KeyRound } from "lucide-react";
import { useWallet } from "@/lib/wallet-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddressChip } from "@/components/keyguard/address-chip";
import { toast } from "sonner";

export function ConnectWalletButton({ className }: { className?: string }) {
  const { state, address, network, displayAddress, connect, disconnect, error } = useWallet();

  React.useEffect(() => {
    if (state === "connected" && address) {
      toast.success("Wallet connected", {
        description: displayAddress ?? undefined,
      });
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (state === "error" && error) {
      toast.error("Connection failed", { description: error });
    }
  }, [state, error]);

  if (state === "checking" || state === "idle") {
    return (
      <Button disabled className={className} size="lg">
        <Loader2 className="size-4 animate-spin" />
        Checking wallet
      </Button>
    );
  }

  if (state === "no-extension") {
    return (
      <Button asChild size="lg" className={className}>
        <a
          href="https://www.freighter.app/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5"
        >
          <KeyRound className="size-4" />
          Install Freighter
          <ExternalLink className="size-3.5" />
        </a>
      </Button>
    );
  }

  if (state === "connecting" || state === "authenticating") {
    return (
      <Button disabled className={className} size="lg">
        <Loader2 className="size-4 animate-spin" />
        {state === "connecting" ? "Confirm in Freighter\u2026" : "Verifying signature\u2026"}
      </Button>
    );
  }

  if (state === "connected" && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className={className}>
            <span className="size-2 rounded-full bg-status-verified" />
            <span className="font-mono">{displayAddress}</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Connected account</DropdownMenuLabel>
          <div className="px-2 pb-2">
            <AddressChip value={address} lead={10} tail={8} className="w-full justify-between" />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-muted-foreground">
            <ShieldCheck className="size-4" />
            {network ?? "Stellar"} · SEP-10 verified
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => disconnect()}
            className="text-destructive focus:bg-status-revoked-bg focus:text-destructive"
          >
            <LogOut className="size-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button size="lg" className={className} onClick={() => connect()}>
      <KeyRound className="size-4" />
      Connect Freighter
    </Button>
  );
}
