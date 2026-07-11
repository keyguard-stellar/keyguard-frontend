"use client";

import * as React from "react";
import { WalletProvider } from "@/lib/wallet-context";
import { VaultProvider } from "@/lib/vault-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <VaultProvider>{children}</VaultProvider>
    </WalletProvider>
  );
}
