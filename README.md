# keyguard-app

> The user-facing web interface for KeyGuard — a multi-sig key management and account recovery platform built on the Stellar blockchain.

---

## Overview

`keyguard-app` is the frontend application for KeyGuard. It provides a clean, accessible dashboard where Stellar account holders can manage their registered keys, configure multi-signature thresholds, designate recovery guardians, and initiate account recovery flows. Authentication is fully passwordless, powered by Freighter wallet and the Stellar SEP-10 standard.

This repo is part of the KeyGuard monorepo ecosystem:

| Repo | Description |
|---|---|
| **keyguard-app** | Next.js frontend (this repo) |
| [keyguard-api](https://github.com/keyguard-stellar/keyguard-api) | NestJS REST API |
| [keyguard-contract](https://github.com/keyguard-stellar/keyguard-contract) | Soroban smart contract |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Wallet:** Freighter (`@stellar/freighter-api`)
- **Auth:** Stellar SEP-10 challenge/verify flow
- **HTTP Client:** Native fetch with typed wrappers

---

## Features

- Passwordless login via Freighter wallet and SEP-10
- Key management dashboard — register, label, and revoke Stellar keys
- Multi-signature configuration UI — add co-signers and set approval thresholds
- Guardian management — designate and manage trusted recovery accounts
- Account recovery wizard — guided multi-step flow for lost key recovery
- Audit log viewer — paginated history of all sensitive account operations
- Fully responsive — mobile and desktop layouts

---

## Project Structure

```
keyguard-app/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── dashboard/          # Authenticated dashboard routes
│   │   │   ├── keys/           # Key management page
│   │   │   ├── multisig/       # Multi-sig configuration page
│   │   │   ├── guardians/      # Guardian management page
│   │   │   └── audit/          # Audit log page
│   │   ├── recovery/           # Public recovery wizard
│   │   └── api/                # Next.js API routes (auth cookie handling)
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── layout/             # Sidebar, TopNav, MobileMenu
│   │   ├── keys/               # Key table, modals, dialogs
│   │   ├── multisig/           # Signer list, threshold slider
│   │   ├── guardians/          # Guardian list and forms
│   │   ├── recovery/           # Recovery wizard steps
│   │   └── audit/              # Audit table and filters
│   ├── context/                # React context providers
│   │   └── WalletContext.tsx   # Global wallet state
│   ├── hooks/                  # Custom React hooks
│   │   ├── useWallet.ts        # Freighter wallet connection
│   │   ├── useAuth.ts          # SEP-10 authentication flow
│   │   ├── useKeys.ts          # Key CRUD operations
│   │   ├── useMultiSig.ts      # Multi-sig config fetching
│   │   ├── useGuardians.ts     # Guardian management
│   │   └── useAuditLogs.ts     # Audit log pagination
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts             # Auth helpers and token management
│   │   └── toast.ts            # Toast notification helpers
│   └── types/                  # Shared TypeScript types
├── public/                     # Static assets
├── tailwind.config.ts
└── tsconfig.json
```

---

## Design System & Color Theme

KeyGuard is a security-critical application. The design language reflects that — dark, precise, and trustworthy. The aesthetic direction is **refined dark utility**: think a hardware security key meets a modern developer dashboard. No gradients for decoration, no playful roundness. Every visual decision signals control, clarity, and confidence.

---

### Color Palette

#### Base (Dark Theme — Default)

```css
:root {
  /* Backgrounds */
  --color-bg-base:        #0A0C0F;   /* Deepest background — main canvas */
  --color-bg-surface:     #111318;   /* Cards, panels, modals */
  --color-bg-elevated:    #1A1D24;   /* Hover states, dropdowns, tooltips */
  --color-bg-subtle:      #22262F;   /* Table rows, input fills */

  /* Borders */
  --color-border-default: #2A2E38;   /* Default border — subtle separation */
  --color-border-strong:  #3C4150;   /* Active inputs, focused elements */
  --color-border-accent:  #4A7CFF;   /* Focused ring on interactive elements */

  /* Brand & Primary Action */
  --color-primary:        #4A7CFF;   /* Primary buttons, links, active nav */
  --color-primary-hover:  #5B8AFF;   /* Hover state */
  --color-primary-muted:  #1C2E5E;   /* Primary tint for backgrounds */

  /* Semantic — Status Colors */
  --color-success:        #2DD98F;   /* Confirmed transactions, verified keys */
  --color-success-muted:  #0D3D28;   /* Success background tint */
  --color-warning:        #F5A623;   /* Pending recovery, expiring sessions */
  --color-warning-muted:  #3D2A08;   /* Warning background tint */
  --color-danger:         #FF4D4D;   /* Revoked keys, failed auth, errors */
  --color-danger-muted:   #3D1212;   /* Danger background tint */
  --color-info:           #38BDF8;   /* Informational callouts */
  --color-info-muted:     #0C2A3D;   /* Info background tint */

  /* Text */
  --color-text-primary:   #F0F2F5;   /* Headings, labels, key data */
  --color-text-secondary: #8B92A5;   /* Subtext, metadata, timestamps */
  --color-text-tertiary:  #555C6E;   /* Placeholders, disabled states */
  --color-text-inverse:   #0A0C0F;   /* Text on light/primary backgrounds */

  /* Accent — Stellar Brand */
  --color-stellar:        #7B5EA7;   /* Stellar ecosystem references */
  --color-stellar-muted:  #261D38;   /* Stellar tint backgrounds */
}
```

#### Light Theme (Optional / System-Aware)

```css
[data-theme="light"] {
  --color-bg-base:        #F4F6FA;
  --color-bg-surface:     #FFFFFF;
  --color-bg-elevated:    #EDF0F7;
  --color-bg-subtle:      #E4E8F0;

  --color-border-default: #D1D6E0;
  --color-border-strong:  #A8AFBF;
  --color-border-accent:  #4A7CFF;

  --color-primary:        #3A6BEE;
  --color-primary-hover:  #2D5CD6;
  --color-primary-muted:  #DDEAFF;

  --color-text-primary:   #0D1017;
  --color-text-secondary: #4A5260;
  --color-text-tertiary:  #8B92A5;
  --color-text-inverse:   #FFFFFF;
}
```

---

### Typography

KeyGuard uses a two-font pairing that balances technical precision with readability.

```css
/* Display / Headings — sharp, architectural, authoritative */
--font-display: 'Syne', sans-serif;

/* Body / UI — clean, functional, highly legible */
--font-body: 'IBM Plex Mono', monospace;  /* for addresses, keys, code */
--font-ui:   'DM Sans', sans-serif;       /* for labels, body copy, nav */
```

| Role | Font | Weight | Size |
|---|---|---|---|
| Page titles | Syne | 700 | 24–32px |
| Section headings | Syne | 600 | 18–20px |
| Body copy | DM Sans | 400 | 14–16px |
| Labels & captions | DM Sans | 500 | 12–13px |
| Public keys & addresses | IBM Plex Mono | 400 | 12–13px |
| Code snippets | IBM Plex Mono | 400 | 13px |

> **Why IBM Plex Mono for keys?** Stellar public keys (G...) and transaction hashes are long alphanumeric strings. A monospaced font makes them scannable, copy-friendly, and signals to the user that this is machine data — not decorative text.

---

### Spacing & Radius Scale

```css
/* Spacing — 4px base unit */
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-6:   24px;
--space-8:   32px;
--space-12:  48px;
--space-16:  64px;

/* Border Radius — deliberately restrained for a serious, precise feel */
--radius-sm:  4px;    /* Badges, tags, small chips */
--radius-md:  6px;    /* Buttons, inputs, cards */
--radius-lg:  10px;   /* Modals, panels, drawers */
--radius-xl:  16px;   /* Full-bleed surface containers */
--radius-full: 9999px; /* Pills, avatars */
```

---

### Shadows & Elevation

```css
/* Elevation — used for surface layering, not decoration */
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.4);
--shadow-md:  0 4px 12px rgba(0, 0, 0, 0.5);
--shadow-lg:  0 8px 24px rgba(0, 0, 0, 0.6);

/* Glow — used sparingly on primary CTAs and active states */
--glow-primary: 0 0 16px rgba(74, 124, 255, 0.25);
--glow-success: 0 0 16px rgba(45, 217, 143, 0.2);
--glow-danger:  0 0 16px rgba(255, 77, 77, 0.2);
```

---

### Component Color Conventions

| Component | Color Guidance |
|---|---|
| **Primary Button** | `--color-primary` fill, white text, `--glow-primary` on hover |
| **Destructive Button** | `--color-danger` fill, white text — used for revoke and delete |
| **Ghost Button** | Transparent fill, `--color-border-default` border |
| **Active Nav Item** | `--color-primary-muted` background, `--color-primary` text and left border |
| **Key Status: Active** | `--color-success` dot + text |
| **Key Status: Revoked** | `--color-danger` dot + text |
| **Recovery Pending** | `--color-warning` badge |
| **Audit Log Row** | Alternating `--color-bg-surface` / `--color-bg-subtle` |
| **Input Focus Ring** | `--color-border-accent` 2px ring with `--glow-primary` |
| **Modal Overlay** | `rgba(0,0,0,0.7)` backdrop with blur |

---

### Tailwind Configuration

Map the design tokens into `tailwind.config.ts` for use across components:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     'var(--color-bg-base)',
          surface:  'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
          subtle:   'var(--color-bg-subtle)',
        },
        border: {
          default: 'var(--color-border-default)',
          strong:  'var(--color-border-strong)',
          accent:  'var(--color-border-accent)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover:   'var(--color-primary-hover)',
          muted:   'var(--color-primary-muted)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary:  'var(--color-text-tertiary)',
        },
        success:  'var(--color-success)',
        warning:  'var(--color-warning)',
        danger:   'var(--color-danger)',
        stellar:  'var(--color-stellar)',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        ui:      ['DM Sans', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'glow-primary': 'var(--glow-primary)',
        'glow-success': 'var(--glow-success)',
        'glow-danger':  'var(--glow-danger)',
      },
    },
  },
}

export default config
```

---

### Accessibility Standards

- All text meets **WCAG AA** contrast ratio (4.5:1 minimum) against their background
- `--color-text-primary` on `--color-bg-base` achieves **15.3:1** — AAA compliant
- Focus states use a visible **2px ring** with `--color-border-accent` — never removed, only styled
- Color is never the **sole** indicator of status — always paired with an icon or label
- All interactive elements have a minimum touch target of **44×44px**

---



### Prerequisites

- Node.js 18+
- [Freighter wallet](https://www.freighter.app/) browser extension installed
- `keyguard-api` running locally (see [keyguard-api](https://github.com/keyguard-stellar/keyguard-api))

### Installation

```bash
git clone https://github.com/keyguard-stellar/keyguard-app.git
cd keyguard-app
npm install
```

### Environment Variables

Copy the example env file and fill in the values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_APP_NAME=KeyGuard
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build

```bash
npm run build
npm run start
```

---

## Authentication Flow

KeyGuard uses a fully passwordless authentication flow:

1. User clicks **Connect Wallet** — Freighter extension is prompted for access.
2. App fetches a SEP-10 challenge transaction from `keyguard-api`.
3. User signs the challenge transaction via Freighter.
4. Signed XDR is submitted to `keyguard-api` for verification.
5. API returns a JWT + refresh token stored securely in an httpOnly cookie.
6. All subsequent API calls are authenticated via the JWT.

---

## Contributing

This repository participates in the **Stellar Wave Program** on Drips Wave. Contributors can pick up scoped issues during active Wave cycles and earn points for merged work.

### How to contribute

1. Browse open issues labeled `Stellar Wave` in this repository.
2. Apply to work on an issue via the [Drips Wave app](https://wave.drips.network).
3. Wait for the maintainer to assign you — assignments happen quickly once a Wave starts.
4. Fork the repo, create a branch named `feat/KG-FE-XXX-short-description`, and open a PR against `main`.

### Branch naming

```
feat/KG-FE-001-project-scaffold
fix/KG-FE-005-key-table-pagination
docs/KG-FE-009-audit-log-readme
```

### Pull Request checklist

- [ ] TypeScript compiles with zero errors (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Component tested manually against the running API
- [ ] Responsive layout verified on mobile viewport
- [ ] PR description references the issue number (e.g. `Closes KG-FE-005`)

---

## Issue Complexity & Points

| Label | Complexity | Points |
|---|---|---|
| `complexity: trivial` | Small UI fixes, copy, a11y | 100 pts |
| `complexity: medium` | New pages, data hooks, modals | 150 pts |
| `complexity: high` | Auth flows, complex UI, tx signing | 200 pts |

---

## License

MIT — see [LICENSE](./LICENSE) for details.