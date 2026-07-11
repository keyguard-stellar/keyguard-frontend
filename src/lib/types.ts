export type KeyStatus = "active" | "revoked";

export interface RegisteredKey {
  id: string;
  publicKey: string;
  label: string;
  status: KeyStatus;
  addedAt: string;
  lastUsedAt: string | null;
  isPrimary: boolean;
}

export interface Signer {
  id: string;
  publicKey: string;
  label: string;
  weight: number;
}

export interface MultiSigConfig {
  threshold: number;
  signers: Signer[];
  masterWeight: number;
}

export type GuardianStatus = "active" | "pending";

export interface Guardian {
  id: string;
  publicKey: string;
  label: string;
  status: GuardianStatus;
  addedAt: string;
}

export type RecoveryStatus =
  | "none"
  | "requested"
  | "collecting"
  | "ready"
  | "executed"
  | "cancelled";

export interface GuardianApproval {
  guardianId: string;
  approvedAt: string;
}

export interface RecoveryRequest {
  id: string;
  lostKey: string;
  replacementKey: string;
  requestedAt: string;
  status: RecoveryStatus;
  approvals: GuardianApproval[];
  requiredApprovals: number;
  executedAt: string | null;
}

export type AuditEventType =
  | "key.registered"
  | "key.revoked"
  | "key.renamed"
  | "multisig.configured"
  | "signer.added"
  | "signer.removed"
  | "guardian.added"
  | "guardian.removed"
  | "recovery.requested"
  | "recovery.approved"
  | "recovery.executed"
  | "recovery.cancelled"
  | "session.authenticated";

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  message: string;
  actor: string;
  timestamp: string;
  txHash: string | null;
}
