# KeyGuard Frontend

Multi-signature key management and guardian-based recovery UI for Stellar, built with
Next.js 14 (App Router), TypeScript, Tailwind CSS v4, and Freighter wallet integration.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll need the
[Freighter browser extension](https://www.freighter.app/) installed to connect a wallet —
without it, the connect button prompts you to install it.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## What's here

- **Landing page** (`app/page.tsx`) — hero, the two-bad-options framing, the three
  enforcement pillars, and the guardian recovery sequence.
- **Dashboard** (`app/dashboard/*`) — gated behind a Freighter connection:
  - `Overview` — vault stats and recent activity
  - `Key Registry` — register, rename, revoke keys
  - `Multi-Sig` — signer list and an interactive approval-threshold slider
  - `Guardians` — designate up to 5 recovery guardians
  - `Recovery` — a 4-step wizard: select lost key → set replacement → guardian
    approvals → execute
  - `Audit Log` — every action, filterable, with mock tx-hash links

## Wallet integration

`src/lib/wallet-context.tsx` wraps `@stellar/freighter-api` and exposes connection state
(`checking / no-extension / connecting / authenticating / connected / error`), the
connected address, and network. `connect()` calls `requestAccess()` and simulates the
SEP‑10 challenge round trip before marking the session connected — swap that simulated
delay for a real challenge request/verify call against your API when it's ready.

## Data layer

There's no backend yet, so `src/lib/vault-context.tsx` holds keys, multi-sig config,
guardians, the active recovery request, and the audit log in memory, persisted to
`localStorage` per connected address (`keyguard.vault.<address>`) so state survives a
refresh. Every mutation appends an audit event with a mock tx hash. When the real
`keyguard-api` is ready, this is the layer to swap for real fetch calls — the component
tree already treats every mutation as if it were async and toast-driven.

## Design system

- **Bebas Neue** — hero titles and section markers only (`font-display`)
- **Epilogue** — all UI, body copy, buttons (`font-sans`, the default)
- **Martian Mono** — keys, addresses, tx hashes, thresholds (`font-mono`)
- **Vault Green** (`#00E5A0`) on **Obsidian** (`#0B0D10` / `#13161C` / `#1C2028`)
- Semantic status colors for verified / revoked / pending / on-chain events
  (`bg-status-*` / `text-status-*` utilities in `app/globals.css`)

Fonts are self-hosted via `@fontsource/*` packages rather than fetched from Google Fonts
at build time, so builds work offline and behind restrictive network policies.

## Structure

```
app/
  page.tsx                 landing page
  dashboard/
    layout.tsx              AppShell wrapper
    page.tsx                overview
    keys/page.tsx
    multisig/page.tsx
    guardians/page.tsx
    recovery/page.tsx
    audit/page.tsx
src/
  components/
    keyguard/                app-specific components (nav, cards, badges, wizard bits)
    providers/                AppProviders (wallet + vault context)
    ui/                      shadcn-style primitives (button, dialog, slider, etc.)
  lib/
    types.ts                 domain types
    mock-data.ts              seed data for a fresh vault
    wallet-context.tsx        Freighter connection state
    vault-context.tsx        keys / multisig / guardians / recovery / audit state
    utils.ts
```
