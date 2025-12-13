/**
 * Q-SLICE Quantum Lab Module
 * ==========================
 * Export all lab components
 *
 * SPEC_LOCK v2.2.0 | FAIL_CLOSED ENFORCED
 */

// Constants
export {
  PHI,
  TAU_0_US,
  LAMBDA_PHI,
  THETA_LOCK,
  PHI_THRESHOLD,
  GAMMA_FIXED,
  GAMMA_CRITICAL,
  WINDOW_US,
  F_MAX_PREDICTED,
  SIGMA_THRESHOLD_G3,
  SIGMA_THRESHOLD_STRONG,
  SIGMA_THRESHOLD_WEAK,
  G3_REQUIREMENTS,
  QPU_BACKENDS,
  GRADE_DEFINITIONS,
  assertFailClosed,
  type QPUArchitecture,
  type QPUBackend,
  type EvidenceGrade,
  type GradeRequirements
} from './constants'

// Types
export type {
  QuantumGate,
  ExperimentSpec,
  QPUJob,
  JobStatus,
  QPUResult,
  MeasurementCounts,
  LedgerEntry,
  LabAPIResponse,
  SpecFromNLPResponse,
  SubmitJobResponse,
  PollJobResponse,
  LedgerBindResponse,
  TauSweepConfig,
  TauSweepResult
} from './types'

// Fail-closed utilities
export {
  checkFailClosed,
  failClosedResponse,
  withFailClosed,
  generateTelemetryCapsule,
  assertClassA,
  type FailClosedResult
} from './fail-closed'
