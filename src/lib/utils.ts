import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Merges Tailwind class strings safely — clsx handles conditional/array class
// logic, twMerge then resolves conflicting utility classes (e.g. "p-2 p-4" -> "p-4")
// so later classes in the list correctly override earlier ones.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Shorten a Stellar public key / tx hash for display: GCXK4F...9ABDE */
export function truncateKey(key: string, lead = 6, tail = 5): string {
  // If the key is already shorter than (or barely longer than) the truncated
  // form would be, there's nothing to gain by truncating — return as-is.
  if (!key || key.length <= lead + tail + 3) return key;
  return `${key.slice(0, lead)}...${key.slice(-tail)}`;
}

// Validates the shape of a Stellar ed25519 public key: starts with "G",
// followed by 55 base32 characters (A-Z, 2-7). This is a format check only —
// it does NOT verify the checksum, so a malformed-but-shape-matching string
// can still pass. Good enough for form validation, not for on-chain trust.
export function isValidStellarPublicKey(key: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(key.trim());
}

// Converts an ISO timestamp into a short relative label ("5m ago", "3d ago").
// Falls back to an absolute date once the gap exceeds 30 days, since
// "42d ago" is less useful to a reader than an actual calendar date.
export function formatRelativeTime(iso: string | null): string {
  if (!iso) return "Never";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Full absolute date + time, used anywhere we want precision instead of a
// relative label — audit log entries, detail views, tooltips, etc.
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Deterministic pseudo tx hash for mock on-chain events. */
// NOT cryptographically random and NOT a real Stellar transaction hash —
// just a 64-char hex string used to make mock audit events look plausible
// in the UI before there's a real chain to read from. Swap this out once
// mutations actually submit transactions.
export function mockTxHash(): string {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Short random client-side ID for local-only records (keys, signers,
// guardians, audit events) before they have a "real" on-chain identifier.
// Not collision-proof at scale — fine for a single user's local vault data.
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}