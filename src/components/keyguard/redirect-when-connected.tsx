"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-context";

export function RedirectWhenConnected() {
  const { state } = useWallet();
  const router = useRouter();

  React.useEffect(() => {
    if (state === "connected") {
      router.push("/dashboard");
    }
  }, [state, router]);

  return null;
}
