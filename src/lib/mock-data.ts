import {
  AuditEvent,
  Guardian,
  MultiSigConfig,
  RecoveryRequest,
  RegisteredKey,
} from "@/lib/types";
import { mockTxHash } from "@/lib/utils";

// Seed data used to populate a brand-new vault the first time a wallet
// address connects (see vault-context.tsx). None of this is persisted
// anywhere real — it exists purely so the UI has something believable to
// render before there's an actual keyguard-api / Soroban contract behind it.

const DAY = 1000 * 60 * 60 * 24;
const now = () => Date.now();

// The connected wallet's own address is always seeded in as the "Primary"
// key. Everything else (backup, trading, a retired key) is fabricated to
// give the Key Registry page a realistic mix of active/revoked entries.
export function seedKeys(primaryAddress: string): RegisteredKey[] {
  return [
    {
      id: "k-primary",
      publicKey: primaryAddress,
      label: "Primary",
      status: "active",
      addedAt: new Date(now() - 41 * DAY).toISOString(),
      lastUsedAt: new Date(now() - 2 * 60 * 60 * 1000).toISOString(),
      isPrimary: true,
    },
    {
      id: "k-backup",
      publicKey: "GBQTIOSVZ5FSZKA53XU7CEZDXPY6RA5DFYZDNJXAMBOQGBAO3ZWLC3DE",
      label: "Hardware Backup",
      status: "active",
      addedAt: new Date(now() - 30 * DAY).toISOString(),
      lastUsedAt: new Date(now() - 6 * DAY).toISOString(),
      isPrimary: false,
    },
    {
      id: "k-trading",
      publicKey: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
      label: "Trading Account",
      status: "active",
      addedAt: new Date(now() - 18 * DAY).toISOString(),
      lastUsedAt: new Date(now() - 12 * 60 * 60 * 1000).toISOString(),
      isPrimary: false,
    },
    {
      id: "k-old-phone",
      publicKey: "GAZQ7CVODXHXWY6NKUZKLKQFAMBOQPY7CEZDXPY6RA5DFYZDNJC3XUB4",
      label: "Old Phone (retired)",
      status: "revoked",
      addedAt: new Date(now() - 90 * DAY).toISOString(),
      lastUsedAt: new Date(now() - 62 * DAY).toISOString(),
      isPrimary: false,
    },
  ];
}

// Default multi-sig setup: a 2-of-3 threshold (the seeded primary key plus
// these two co-signers), matching the "Hardware Backup" key above so the
// Multi-Sig and Key Registry pages feel like the same coherent account.
export function seedMultiSig(): MultiSigConfig {
  return {
    threshold: 2,
    masterWeight: 1,
    signers: [
      {
        id: "s-backup",
        publicKey: "GBQTIOSVZ5FSZKA53XU7CEZDXPY6RA5DFYZDNJXAMBOQGBAO3ZWLC3DE",
        label: "Hardware Backup",
        weight: 1,
      },
      {
        id: "s-cofounder",
        publicKey: "GCFXHS4GXL6BW5CVSDIWO7WQZJKG5HREZQVFT4TAAP7YPCFSZAHIBC3A",
        label: "Emmanuel (co-signer)",
        weight: 1,
      },
    ],
  };
}

// Three guardians (below the max of 5), all "active" so the Recovery wizard
// has enough guardians to actually demo a majority-approval flow out of the box.
export function seedGuardians(): Guardian[] {
  const day = 1000 * 60 * 60 * 24;
  return [
    {
      id: "g-1",
      publicKey: "GBQTIOSVZ5FSZKA53XU7CEZDXPY6RA5DFYZDNJXAMBOQGBAO3ZWLC3DE",
      label: "Hardware Backup",
      status: "active",
      addedAt: new Date(now() - 28 * day).toISOString(),
    },
    {
      id: "g-2",
      publicKey: "GDLTHHOTNMYU3IEJACUYZHVGKS5POAAWNCYSTNCEDPUOMYPCQ4X3JEG9",
      label: "Sister — Yinka",
      status: "active",
      addedAt: new Date(now() - 28 * day).toISOString(),
    },
    {
      id: "g-3",
      publicKey: "GCFXHS4GXL6BW5CVSDIWO7WQZJKG5HREZQVFT4TAAP7YPCFSZAHIBC3A",
      label: "Emmanuel (colleague)",
      status: "active",
      addedAt: new Date(now() - 15 * day).toISOString(),
    },
  ];
}

// No recovery in progress for a fresh vault. Kept as a function (rather than
// just `null` inline in vault-context) so the seeding API stays consistent —
// every piece of seed state has a `seedX()` entry point.
export function seedRecovery(): RecoveryRequest | null {
  return null;
}

// Backdated audit trail so the Overview and Audit Log pages don't look empty
// on a brand-new vault. Ordering/timestamps roughly tell a story: guardians
// and signers were set up ~3-4 weeks ago, keys were added along the way, and
// the old phone key was revoked further back. `txHash` is null only for the
// one purely off-chain event (session auth); everything else gets a mock hash.
export function seedAuditLog(primaryAddress: string): AuditEvent[] {
  const day = 1000 * 60 * 60 * 24;
  return [
    {
      id: "a-1",
      type: "session.authenticated",
      message: "Signed in via SEP-10 challenge",
      actor: primaryAddress,
      timestamp: new Date(now() - 2 * 60 * 60 * 1000).toISOString(),
      txHash: null,
    },
    {
      id: "a-2",
      type: "guardian.added",
      message: "Guardian \u201cEmmanuel (colleague)\u201d designated",
      actor: primaryAddress,
      timestamp: new Date(now() - 15 * day).toISOString(),
      txHash: mockTxHash(),
    },
    {
      id: "a-3",
      type: "signer.added",
      message: "Co-signer \u201cEmmanuel (co-signer)\u201d added to multi-sig",
      actor: primaryAddress,
      timestamp: new Date(now() - 20 * day).toISOString(),
      txHash: mockTxHash(),
    },
    {
      id: "a-4",
      type: "multisig.configured",
      message: "Signing threshold set to 2 of 3",
      actor: primaryAddress,
      timestamp: new Date(now() - 20 * day).toISOString(),
      txHash: mockTxHash(),
    },
    {
      id: "a-5",
      type: "key.registered",
      message: "\u201cTrading Account\u201d registered",
      actor: primaryAddress,
      timestamp: new Date(now() - 18 * day).toISOString(),
      txHash: mockTxHash(),
    },
    {
      id: "a-6",
      type: "guardian.added",
      message: "Guardian \u201cSister \u2014 Yinka\u201d designated",
      actor: primaryAddress,
      timestamp: new Date(now() - 28 * day).toISOString(),
      txHash: mockTxHash(),
    },
    {
      id: "a-7",
      type: "key.revoked",
      message: "\u201cOld Phone (retired)\u201d revoked",
      actor: primaryAddress,
      timestamp: new Date(now() - 62 * day).toISOString(),
      txHash: mockTxHash(),
    },
  ];
}