"use client";

import * as React from "react";
import {
  AuditEvent,
  AuditEventType,
  Guardian,
  MultiSigConfig,
  RecoveryRequest,
  RegisteredKey,
  Signer,
} from "@/lib/types";
import {
  seedAuditLog,
  seedGuardians,
  seedKeys,
  seedMultiSig,
} from "@/lib/mock-data";
import { generateId, mockTxHash } from "@/lib/utils";
import { useWallet } from "@/lib/wallet-context";

interface VaultData {
  keys: RegisteredKey[];
  multisig: MultiSigConfig;
  guardians: Guardian[];
  recovery: RecoveryRequest | null;
  audit: AuditEvent[];
}

interface VaultContextValue extends VaultData {
  ready: boolean;
  registerKey: (label: string, publicKey: string) => void;
  revokeKey: (id: string) => void;
  renameKey: (id: string, label: string) => void;
  setThreshold: (threshold: number) => void;
  addSigner: (label: string, publicKey: string, weight: number) => void;
  removeSigner: (id: string) => void;
  addGuardian: (label: string, publicKey: string) => void;
  removeGuardian: (id: string) => void;
  requestRecovery: (lostKey: string, replacementKey: string) => void;
  approveRecovery: (guardianId: string) => void;
  executeRecovery: () => void;
  cancelRecovery: () => void;
}

const VaultContext = React.createContext<VaultContextValue | null>(null);

function storageKey(address: string) {
  return `keyguard.vault.${address}`;
}

function loadVault(address: string): VaultData | null {
  try {
    const raw = window.localStorage.getItem(storageKey(address));
    if (!raw) return null;
    return JSON.parse(raw) as VaultData;
  } catch {
    return null;
  }
}

function saveVault(address: string, data: VaultData) {
  window.localStorage.setItem(storageKey(address), JSON.stringify(data));
}

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const { address, state } = useWallet();
  const [data, setData] = React.useState<VaultData | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (state !== "connected" || !address) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing local vault state to an external system (the connected wallet address) changing out from under us
      setData(null);
      setReady(false);
      return;
    }

    const existing = loadVault(address);
    if (existing) {
      setData(existing);
    } else {
      const fresh: VaultData = {
        keys: seedKeys(address),
        multisig: seedMultiSig(),
        guardians: seedGuardians(),
        recovery: null,
        audit: seedAuditLog(address),
      };
      saveVault(address, fresh);
      setData(fresh);
    }
    setReady(true);
  }, [address, state]);

  const update = React.useCallback(
    (mutator: (draft: VaultData) => VaultData) => {
      setData((prev) => {
        if (!prev || !address) return prev;
        const next = mutator(prev);
        saveVault(address, next);
        return next;
      });
    },
    [address]
  );

  const logEvent = React.useCallback(
    (draft: VaultData, type: AuditEventType, message: string, onChain = true): VaultData => {
      const event: AuditEvent = {
        id: generateId(),
        type,
        message,
        actor: address ?? "unknown",
        timestamp: new Date().toISOString(),
        txHash: onChain ? mockTxHash() : null,
      };
      return { ...draft, audit: [event, ...draft.audit] };
    },
    [address]
  );

  const registerKey = React.useCallback(
    (label: string, publicKey: string) => {
      update((draft) => {
        const key: RegisteredKey = {
          id: generateId(),
          publicKey,
          label,
          status: "active",
          addedAt: new Date().toISOString(),
          lastUsedAt: null,
          isPrimary: false,
        };
        const next = { ...draft, keys: [key, ...draft.keys] };
        return logEvent(next, "key.registered", `\u201c${label}\u201d registered`);
      });
    },
    [update, logEvent]
  );

  const revokeKey = React.useCallback(
    (id: string) => {
      update((draft) => {
        const key = draft.keys.find((k) => k.id === id);
        if (!key) return draft;
        const keys = draft.keys.map((k) =>
          k.id === id ? { ...k, status: "revoked" as const } : k
        );
        const next = { ...draft, keys };
        return logEvent(next, "key.revoked", `\u201c${key.label}\u201d revoked`);
      });
    },
    [update, logEvent]
  );

  const renameKey = React.useCallback(
    (id: string, label: string) => {
      update((draft) => {
        const keys = draft.keys.map((k) => (k.id === id ? { ...k, label } : k));
        const next = { ...draft, keys };
        return logEvent(next, "key.renamed", `Key renamed to \u201c${label}\u201d`, false);
      });
    },
    [update, logEvent]
  );

  const setThreshold = React.useCallback(
    (threshold: number) => {
      update((draft) => {
        const next = {
          ...draft,
          multisig: { ...draft.multisig, threshold },
        };
        const total = draft.multisig.signers.length + 1;
        return logEvent(
          next,
          "multisig.configured",
          `Signing threshold set to ${threshold} of ${total}`
        );
      });
    },
    [update, logEvent]
  );

  const addSigner = React.useCallback(
    (label: string, publicKey: string, weight: number) => {
      update((draft) => {
        const signer: Signer = { id: generateId(), label, publicKey, weight };
        const next = {
          ...draft,
          multisig: {
            ...draft.multisig,
            signers: [...draft.multisig.signers, signer],
          },
        };
        return logEvent(next, "signer.added", `Co-signer \u201c${label}\u201d added to multi-sig`);
      });
    },
    [update, logEvent]
  );

  const removeSigner = React.useCallback(
    (id: string) => {
      update((draft) => {
        const signer = draft.multisig.signers.find((s) => s.id === id);
        if (!signer) return draft;
        const signers = draft.multisig.signers.filter((s) => s.id !== id);
        const maxThreshold = signers.length + 1;
        const next = {
          ...draft,
          multisig: {
            ...draft.multisig,
            signers,
            threshold: Math.min(draft.multisig.threshold, maxThreshold),
          },
        };
        return logEvent(next, "signer.removed", `Co-signer \u201c${signer.label}\u201d removed`);
      });
    },
    [update, logEvent]
  );

  const addGuardian = React.useCallback(
    (label: string, publicKey: string) => {
      update((draft) => {
        const guardian: Guardian = {
          id: generateId(),
          label,
          publicKey,
          status: "active",
          addedAt: new Date().toISOString(),
        };
        const next = { ...draft, guardians: [...draft.guardians, guardian] };
        return logEvent(next, "guardian.added", `Guardian \u201c${label}\u201d designated`);
      });
    },
    [update, logEvent]
  );

  const removeGuardian = React.useCallback(
    (id: string) => {
      update((draft) => {
        const guardian = draft.guardians.find((g) => g.id === id);
        if (!guardian) return draft;
        const guardians = draft.guardians.filter((g) => g.id !== id);
        const next = { ...draft, guardians };
        return logEvent(next, "guardian.removed", `Guardian \u201c${guardian.label}\u201d removed`);
      });
    },
    [update, logEvent]
  );

  const requestRecovery = React.useCallback(
    (lostKey: string, replacementKey: string) => {
      update((draft) => {
        const activeGuardians = draft.guardians.filter((g) => g.status === "active");
        const required = Math.floor(activeGuardians.length / 2) + 1;
        const recovery: RecoveryRequest = {
          id: generateId(),
          lostKey,
          replacementKey,
          requestedAt: new Date().toISOString(),
          status: "collecting",
          approvals: [],
          requiredApprovals: required,
          executedAt: null,
        };
        const next = { ...draft, recovery };
        return logEvent(
          next,
          "recovery.requested",
          `Recovery requested \u2014 needs ${required} of ${activeGuardians.length} guardian approvals`
        );
      });
    },
    [update, logEvent]
  );

  const approveRecovery = React.useCallback(
    (guardianId: string) => {
      update((draft) => {
        if (!draft.recovery) return draft;
        const guardian = draft.guardians.find((g) => g.id === guardianId);
        if (!guardian) return draft;
        if (draft.recovery.approvals.some((a) => a.guardianId === guardianId)) return draft;

        const approvals = [
          ...draft.recovery.approvals,
          { guardianId, approvedAt: new Date().toISOString() },
        ];
        const status =
          approvals.length >= draft.recovery.requiredApprovals ? "ready" : "collecting";
        const next = {
          ...draft,
          recovery: { ...draft.recovery, approvals, status: status as RecoveryRequest["status"] },
        };
        return logEvent(
          next,
          "recovery.approved",
          `Guardian \u201c${guardian.label}\u201d approved the recovery (${approvals.length}/${draft.recovery.requiredApprovals})`
        );
      });
    },
    [update, logEvent]
  );

  const executeRecovery = React.useCallback(() => {
    update((draft) => {
      if (!draft.recovery || draft.recovery.status !== "ready") return draft;
      const { lostKey, replacementKey } = draft.recovery;

      const keys = draft.keys.map((k) =>
        k.publicKey === lostKey ? { ...k, status: "revoked" as const } : k
      );
      const newKey: RegisteredKey = {
        id: generateId(),
        publicKey: replacementKey,
        label: "Recovered Key",
        status: "active",
        addedAt: new Date().toISOString(),
        lastUsedAt: null,
        isPrimary: true,
      };

      const next = {
        ...draft,
        keys: [newKey, ...keys],
        recovery: {
          ...draft.recovery,
          status: "executed" as const,
          executedAt: new Date().toISOString(),
        },
      };
      return logEvent(
        next,
        "recovery.executed",
        "Recovery executed \u2014 replacement key is now primary"
      );
    });
  }, [update, logEvent]);

  const cancelRecovery = React.useCallback(() => {
    update((draft) => {
      if (!draft.recovery) return draft;
      const next = { ...draft, recovery: { ...draft.recovery, status: "cancelled" as const } };
      return logEvent(next, "recovery.cancelled", "Recovery request cancelled", false);
    });
  }, [update, logEvent]);

  const value: VaultContextValue = {
    keys: data?.keys ?? [],
    multisig: data?.multisig ?? { threshold: 1, masterWeight: 1, signers: [] },
    guardians: data?.guardians ?? [],
    recovery: data?.recovery ?? null,
    audit: data?.audit ?? [],
    ready,
    registerKey,
    revokeKey,
    renameKey,
    setThreshold,
    addSigner,
    removeSigner,
    addGuardian,
    removeGuardian,
    requestRecovery,
    approveRecovery,
    executeRecovery,
    cancelRecovery,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const ctx = React.useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used within VaultProvider");
  return ctx;
}
