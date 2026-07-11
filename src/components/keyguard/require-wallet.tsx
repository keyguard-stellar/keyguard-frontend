"use client";

import * as React from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useWallet } from "@/lib/wallet-context";
import { ConnectWalletButton } from "@/components/keyguard/connect-wallet-button";

export function RequireWallet({ children }: { children: React.ReactNode }) {
  const { state } = useWallet();

  if (state === "connected") {
    return <>{children}</>;
  }

  if (state === "checking" || state === "idle") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">Checking for Freighter session\u2026</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary-muted">
        <ShieldAlert className="size-7 text-primary" />
      </div>
      <div className="space-y-1.5">
        <h2 className="font-display text-3xl tracking-wide">Connect your wallet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          KeyGuard needs a signed SEP-10 challenge from Freighter before it can show your key
          registry, guardians, or recovery status.
        </p>
      </div>
      <ConnectWalletButton />
    </div>
  );
}
