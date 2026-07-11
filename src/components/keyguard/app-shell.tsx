"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldHalf } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/keyguard/nav-config";
import { ConnectWalletButton } from "@/components/keyguard/connect-wallet-button";
import { RequireWallet } from "@/components/keyguard/require-wallet";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background bg-vault-grid">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/60 backdrop-blur md:flex">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 pb-2 pt-7 transition-opacity hover:opacity-80"
          >
            <ShieldHalf className="size-5 text-primary" strokeWidth={2.25} />
            <span className="font-display text-2xl tracking-wide text-foreground">
              KEYGUARD
            </span>
          </Link>
          <p className="px-6 pb-6 text-[11px] uppercase tracking-widest text-muted-foreground">
            Stellar Network
          </p>

          <nav className="flex flex-1 flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-muted text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mx-3 mb-6 rounded-lg border border-sidebar-border bg-secondary/40 p-3">
            <p className="text-xs font-medium text-foreground">Contract-enforced</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Thresholds and guardian rules live on Soroban — KeyGuard&apos;s servers can&apos;t
              override them.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-5 py-4 backdrop-blur md:px-8">
            <Link href="/" className="flex items-center gap-2 md:hidden">
              <img src="/keyguard-logo.png"/>
              <span className="font-display text-xl tracking-wide">KEYGUARD</span>
            </Link>
            <div className="hidden md:block" />
            <ConnectWalletButton />
          </header>

          <main className="flex-1 px-5 py-8 md:px-8">
            <RequireWallet>{children}</RequireWallet>
          </main>

          <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur md:hidden">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                  {item.label.split(" ")[0]}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
