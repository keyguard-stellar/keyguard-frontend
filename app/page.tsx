import Link from "next/link";
import {
  ShieldHalf,
  KeyRound,
  ShieldCheck,
  Users,
  Code2,
  ArrowRight,
  Lock,
  UserX,
} from "lucide-react";
import { ConnectWalletButton } from "@/components/keyguard/connect-wallet-button";
import { VaultCardPreview } from "@/components/keyguard/vault-card-preview";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background bg-vault-grid">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
        <img
  src="/keyguard-logo.png"
  alt="KeyGuard Logo"
  className="w-12 h-12 object-contain transition-transform duration-200 hover:scale-105"
/>
          <span className="font-display text-2xl tracking-wide">KEYGUARD</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#pillars" className="transition-colors hover:text-foreground">
            Architecture
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Code2 className="size-3.5" />
            Open source
          </a>
        </nav>
        <ConnectWalletButton />
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Self-custody, enforced on Stellar
          </p>
          <h1 className="font-display text-6xl leading-[0.95] tracking-wide text-balance md:text-7xl">
            KEYS YOU CAN
            <br />
            NEVER LOSE.
            <br />
            <span className="text-primary">FUNDS NO ONE</span>
            <br />
            <span className="text-primary">ELSE HOLDS.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            KeyGuard replaces the choice between trusting a custodian and risking total,
            irreversible loss. Multi-signature thresholds and guardian-based recovery — enforced
            by a Soroban contract, not by us.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ConnectWalletButton className="w-full sm:w-auto" />
            <a
              href="#how-it-works"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              See how recovery works
              <ArrowRight className="size-3.5" />
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <div>
              <p className="font-display text-2xl tracking-wide text-foreground">3</p>
              <p>Independent repositories</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-display text-2xl tracking-wide text-foreground">5</p>
              <p>Max guardians per vault</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-display text-2xl tracking-wide text-foreground">0</p>
              <p>Passwords, ever</p>
            </div>
          </div>
        </div>

        <VaultCardPreview />
      </section>

      {/* The problem */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          The problem
        </p>
        <h2 className="font-display text-4xl tracking-wide md:text-5xl">
          Two options. Both unacceptable.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-status-revoked-bg">
              <UserX className="size-5 text-status-revoked" />
            </div>
            <h3 className="font-display text-2xl tracking-wide">Trust a custodian</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Hand your keys to an exchange and accept counterparty risk — surrendering the core
              promise of blockchain ownership the moment something goes wrong on their end.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-status-revoked-bg">
              <Lock className="size-5 text-status-revoked" />
            </div>
            <h3 className="font-display text-2xl tracking-wide">Go it completely alone</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Manage your own keys in total isolation, where one lost or compromised key means
              permanent, mathematically irreversible loss of everything attached to it.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          KeyGuard is built on the conviction that neither is acceptable — and that self-custody
          deserves infrastructure that makes it genuinely safe, without requiring trust in anyone
          but the blockchain itself.
        </p>
      </section>

      {/* Three pillars */}
      <section id="pillars" className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Enforced by contract, not by us
        </p>
        <h2 className="font-display text-4xl tracking-wide md:text-5xl">Three layers of control</h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <PillarCard
            icon={KeyRound}
            title="Key Registration"
            description="Label every key you control — Primary, Emergency Backup, Trading Account. Revocation is permanent and verifiable on-chain, never a database flag."
          />
          <PillarCard
            icon={ShieldCheck}
            title="Multi-Sig Threshold"
            description="Set how many co-signers must approve before funds move. A 1-of-2 backup setup, or a 5-of-7 DAO treasury — the Stellar network enforces it, always."
          />
          <PillarCard
            icon={Users}
            title="Guardian Recovery"
            description="Up to five trusted guardians who can co-sign a key replacement if you lose access — majority required, so no single contact can hijack your identity."
          />
        </div>
      </section>

      {/* How recovery works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          A real process, in order
        </p>
        <h2 className="font-display text-4xl tracking-wide md:text-5xl">
          How guardian recovery works
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <RecoveryStep
            number="01"
            title="Request"
            description="You specify the lost key and a replacement key you control. The request is recorded on-chain, visible to every guardian."
          />
          <RecoveryStep
            number="02"
            title="Guardians approve"
            description="A majority of your designated guardians co-sign the recovery payload independently, in their own wallets."
          />
          <RecoveryStep
            number="03"
            title="Contract executes"
            description="Once the threshold is met, the contract replaces the key. No support ticket, no team deciding — the math decides."
          />
        </div>

        <div className="mt-12 rounded-xl border border-primary/30 bg-primary-muted p-8 text-center">
          <h3 className="font-display text-3xl tracking-wide text-foreground">
            Ready to guard your keys?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Connect Freighter to register your first key and see your vault take shape.
          </p>
          <div className="mt-5 flex justify-center">
            <ConnectWalletButton />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <ShieldHalf className="size-4 text-primary" />
            <span className="font-display text-lg tracking-wide text-foreground">KEYGUARD</span>
          </div>
          <p>Fully open source across all three repositories. Not a wallet — key management infrastructure.</p>
          <Link href="/dashboard" className="font-medium text-primary hover:underline">
            Open dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}

function PillarCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary-muted">
        <Icon className="size-5 text-primary" />
      </div>
      <h3 className="font-display text-2xl tracking-wide">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function RecoveryStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-xl border border-border bg-card p-6">
      <span className="font-mono text-xs text-primary/70">{number}</span>
      <h3 className="mt-2 font-display text-2xl tracking-wide">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
