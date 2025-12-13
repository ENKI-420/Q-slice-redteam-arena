/**
 * ExperimentSpec - Canonical Data Model for QPU Experiments
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * This defines the Δ-locked experiment specification that flows through:
 * NLP → Spec_Δ → Circuit → QPU → Counts → Metrics → Ledger
 */

import { z } from "zod"

// === PHYSICAL CONSTANTS (SPEC_LOCK IMMUTABLE) ===
export const CONSTANTS = {
  PHI: 1.618033988749895,
  LAMBDA_PHI: 2.176435e-8,
  THETA_LOCK_GEOM: 51.827292373,
  THETA_LOCK_UI: 51.843,
  PHI_THRESHOLD: 0.7734,
  GAMMA_CRITICAL: 0.300,
  TAU_0_US: Math.pow(1.618033988749895, 8), // 46.9787...
  WINDOW_US: 2.5,
} as const

// === GATE STATUS ENUM ===
export const GateStatus = z.enum(["OPEN", "PENDING", "CLOSED"])

// === Q-SLICE THREAT VECTORS ===
export const ThreatVector = z.enum([
  "decoherence_induction",
  "measurement_injection",
  "gate_bias",
  "timing_jitter",
  "readout_skew",
])

// === PROVIDER ENUM ===
export const Provider = z.enum([
  "ibm-quantum",
  "aws-braket",
  "ionq-direct",
  "rigetti-direct",
  "quantinuum",
])

// === EXPERIMENT FAMILY ===
export const ExperimentFamily = z.enum([
  "tau-sweep",
  "bell",
  "ghz",
  "qaoa",
  "grover",
  "custom",
])

// === EXPERIMENT SPEC v1 (Δ-locked) ===
export const ExperimentSpecV1 = z.object({
  manifest_version: z.literal("qslice-dnalang-experiment/v1"),
  spec_lock: z.string().regex(/^Δ[0-9]+$/), // e.g., "Δ1"
  created_utc: z.string(),

  // Provenance
  author: z.string(),
  repo: z.string().optional(),
  git_commit: z.string().optional(),
  prereg_doi: z.string().optional(),
  cage_code: z.string().default("9HUP5"),

  // Gate discipline snapshot
  gate_state: z.object({
    G1_PREREG: GateStatus,
    G2_LINEAGE: GateStatus,
    S3_PIPELINE: GateStatus,
    G3_QPU: GateStatus,
    G4_REPL: GateStatus,
  }),

  // Provider target (REAL QPU ONLY)
  target: z.object({
    provider: Provider,
    device_id: z.string(), // e.g., "ibm_fez", "arn:aws:braket:..."
    shots: z.number().int().min(100).max(100000),
    architecture_label: z.string(), // e.g., "superconducting", "trapped-ion"
  }),

  // Experiment type & params
  experiment: z.object({
    family: ExperimentFamily,
    description: z.string(),
    parameters: z.record(z.any()).default({}),
  }),

  // Q-SLICE harness
  qslice: z.object({
    enabled: z.boolean(),
    threat_vectors: z.array(ThreatVector).default([]),
    intensity: z.number().min(0).max(1).default(0),
  }),

  // CCCE metric hooks
  ccce: z.object({
    compute_metrics: z.boolean().default(true),
    Phi_threshold: z.number().default(CONSTANTS.PHI_THRESHOLD),
    Gamma_critical: z.number().default(CONSTANTS.GAMMA_CRITICAL),
    LambdaPhi_constant: z.number().default(CONSTANTS.LAMBDA_PHI),
    Xi_formula: z.string().default("Xi=(Lambda*Phi)/Gamma"),
  }),

  // Acceptance criteria (G3 closure)
  acceptance: z.object({
    sigma_empirical_min: z.number().default(5.0),
    A_min: z.number().default(2.0),
    architectures_required: z.number().int().default(2),
    window_us: z.number().default(CONSTANTS.WINDOW_US),
  }),

  // Evidence binding
  evidence: z.object({
    expected_artifact_sha256: z.array(z.string()).default([]),
    ledger_entry_sha256: z.string().optional(),
    final_chain_sha256: z.string().optional(),
    signature_ed25519: z.string().optional(),
    public_key_id: z.string().optional(),
  }),
})

export type ExperimentSpecV1 = z.infer<typeof ExperimentSpecV1>

// === RUN RECORD ===
export const RunStatus = z.enum(["QUEUED", "RUNNING", "COMPLETED", "FAILED"])

export const RunRecordSchema = z.object({
  run_id: z.string(),
  spec_sha256: z.string(),
  provider_job_id: z.string(),
  provider: Provider,
  device: z.string(),
  status: RunStatus,
  created_utc: z.string(),
  completed_utc: z.string().optional(),

  // Real outputs only (NO MOCK/SIM)
  counts: z.record(z.number()).optional(),
  raw_result_uri: z.string().optional(),

  // Computed metrics
  sigma_empirical: z.number().optional(),
  A_stat: z.number().optional(),
  Lambda: z.number().optional(),
  Phi: z.number().optional(),
  Gamma: z.number().optional(),
  Xi: z.number().optional(),

  // Ledger binding
  result_sha256: z.string().optional(),
  ledger_entry_sha256: z.string().optional(),
})

export type RunRecord = z.infer<typeof RunRecordSchema>

// === HELPER: Create default spec ===
export function createDefaultSpec(overrides: Partial<ExperimentSpecV1> = {}): ExperimentSpecV1 {
  return ExperimentSpecV1.parse({
    manifest_version: "qslice-dnalang-experiment/v1",
    spec_lock: "Δ1",
    created_utc: new Date().toISOString(),
    author: "Q-SLICE Lab",
    cage_code: "9HUP5",
    gate_state: {
      G1_PREREG: "CLOSED",
      G2_LINEAGE: "CLOSED",
      S3_PIPELINE: "CLOSED",
      G3_QPU: "PENDING",
      G4_REPL: "OPEN",
    },
    target: {
      provider: "ibm-quantum",
      device_id: "ibm_fez",
      shots: 2000,
      architecture_label: "superconducting",
    },
    experiment: {
      family: "bell",
      description: "Bell state preparation and measurement",
      parameters: {},
    },
    qslice: {
      enabled: false,
      threat_vectors: [],
      intensity: 0,
    },
    ccce: {
      compute_metrics: true,
      Phi_threshold: CONSTANTS.PHI_THRESHOLD,
      Gamma_critical: CONSTANTS.GAMMA_CRITICAL,
      LambdaPhi_constant: CONSTANTS.LAMBDA_PHI,
      Xi_formula: "Xi=(Lambda*Phi)/Gamma",
    },
    acceptance: {
      sigma_empirical_min: 5.0,
      A_min: 2.0,
      architectures_required: 2,
      window_us: CONSTANTS.WINDOW_US,
    },
    evidence: {
      expected_artifact_sha256: [],
    },
    ...overrides,
  })
}
