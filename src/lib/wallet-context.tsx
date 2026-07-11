"use client";

import * as React from "react";
import {
  isConnected as freighterIsConnected,
  isAllowed as freighterIsAllowed,
  requestAccess,
  getAddress,
  getNetwork,
} from "@stellar/freighter-api";
import { truncateKey } from "@/lib/utils";

export type WalletConnectionState =
  | "idle"
  | "checking"
  | "no-extension"
  | "disconnected"
  | "connecting"
  | "authenticating"
  | "connected"
  | "error";

interface WalletContextValue {
  state: WalletConnectionState;
  address: string | null;
  network: string | null;
  error: string | null;
  displayAddress: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = React.createContext<WalletContextValue | null>(null);

const SESSION_KEY = "keyguard.session.address";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<WalletConnectionState>("idle");
  const [address, setAddress] = React.useState<string | null>(null);
  const [network, setNetwork] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // On mount, silently resume a session if Freighter is still allowed.
  React.useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setState("checking");
      try {
        const connected = await freighterIsConnected();
        if (!connected.isConnected) {
          if (!cancelled) setState("no-extension");
          return;
        }

        const allowed = await freighterIsAllowed();
        if (!allowed.isAllowed) {
          if (!cancelled) setState("disconnected");
          return;
        }

        const addr = await getAddress();
        const net = await getNetwork();
        if (cancelled) return;

        if (addr.error || !addr.address) {
          setState("disconnected");
          return;
        }

        setAddress(addr.address);
        setNetwork(net.network ?? null);
        setState("connected");
        window.sessionStorage.setItem(SESSION_KEY, addr.address);
      } catch {
        if (!cancelled) setState("disconnected");
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = React.useCallback(async () => {
    setError(null);
    try {
      const connected = await freighterIsConnected();
      if (!connected.isConnected) {
        setState("no-extension");
        return;
      }

      setState("connecting");
      const access = await requestAccess();
      if (access.error || !access.address) {
        setState("error");
        setError(access.error ?? "Wallet access was denied.");
        return;
      }

      // Simulate the SEP-10 challenge round trip: request → sign → verify.
      setState("authenticating");
      await new Promise((resolve) => setTimeout(resolve, 900));

      const net = await getNetwork();
      setAddress(access.address);
      setNetwork(net.network ?? null);
      setState("connected");
      window.sessionStorage.setItem(SESSION_KEY, access.address);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not connect to Freighter.");
    }
  }, []);

  const disconnect = React.useCallback(() => {
    setAddress(null);
    setNetwork(null);
    setState("disconnected");
    window.sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const value: WalletContextValue = {
    state,
    address,
    network,
    error,
    displayAddress: address ? truncateKey(address) : null,
    connect,
    disconnect,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = React.useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
