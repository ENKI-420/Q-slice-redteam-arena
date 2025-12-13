/**
 * Q-SLICE Quantum Lab Types
 * ==========================
 * Schema definitions for experiment specs, results, and ledger entries
 *
 * SPEC_LOCK ENFORCED
 */

import { QPUArchitecture, EvidenceGrade } from './constants'

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERIMENT SPEC (Δ-LOCKED)
// ═══════════════════════════════════════════════════════════════════════════════

export interface QuantumGate {
  type: 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'RX' | 'RY' | 'RZ' | 'CNOT' | 'CZ' | 'SWAP' | 'M'
  qubit: number
  target?: number    // For 2-qubit gates
  angle?: number     // For rotation gates (radians)
  dna_op: string     // DNA-Lang equivalent: helix(), bond(), twist(), observe()
}

export interface ExperimentSpec {
  // Identification
  spec_id: string
  spec_hash: string      // SHA256 of spec (Δ-locked)
  created_utc: string

  // NLP Origin
  nlp_input: string
  nlp_parsed: {
    intent: string
    gates_detected: string[]
    qubits_required: number
  }

  // Circuit Definition
  circuit: {
    num_qubits: number
    num_classical: number
    gates: QuantumGate[]
    depth: number
  }

  // Transpilation
  qasm3: string         // OpenQASM 3.0 representation
  dna_organism: string  // DNA-Lang organism code

  // Execution Parameters
  execution: {
    backend_id: string
    shots: number
    optimization_level: number
  }

  // Prediction (if τ-sweep)
  prediction?: {
    tau_0_us: number
    window_us: number
    f_max_predicted: number
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// QPU JOB
// ═══════════════════════════════════════════════════════════════════════════════

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface QPUJob {
  job_id: string
  spec_id: string
  backend: {
    name: string
    display_name: string
    architecture: QPUArchitecture
    qubits: number
    provider: string
  }
  status: JobStatus
  submitted_utc: string
  completed_utc?: string
  error?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// QPU RESULTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface MeasurementCounts {
  [bitstring: string]: number
}

export interface QPUResult {
  job_id: string
  spec_id: string

  // Provenance
  provenance: {
    exec_mode: 'CLOUD_QPU'
    grade: EvidenceGrade
    backend_name: string
    architecture: QPUArchitecture
    total_shots: number
    execution_time_ms?: number
  }

  // Raw Data
  counts: MeasurementCounts
  shots: number

  // Computed Metrics
  metrics: {
    fidelity?: number          // Bell state fidelity
    coherence?: number         // Estimated coherence
    entropy?: number           // Measurement entropy
    tau_peak_us?: number       // For τ-sweep
    delta_us?: number          // |τ_peak - τ_0|
    within_window?: boolean    // δ < 2.5μs
    sigma_empirical?: number   // Statistical significance
  }

  // CCCE Metrics
  ccce: {
    phi: number      // Consciousness
    lambda: number   // Coherence
    gamma: number    // Decoherence
    xi: number       // Negentropic efficiency
  }

  // Timestamps
  timestamp_utc: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEDGER ENTRY
// ═══════════════════════════════════════════════════════════════════════════════

export interface LedgerEntry {
  entry_id: string
  entry_hash: string        // SHA256 of entry
  prev_hash: string         // Previous entry hash (chain)

  // References
  spec_hash: string
  result_hash: string

  // Evidence
  grade: EvidenceGrade
  verdict: 'EMPIRICAL_VALIDATED' | 'APPROACHING_SIGNIFICANCE' | 'PREDICTION_TESTED' | 'FAILED'

  // G3 Progress
  g3_status: {
    architectures_count: number
    architectures: QPUArchitecture[]
    sigma_empirical: number
    gate_closed: boolean
  }

  // Cryptographic Binding
  signature?: {
    algorithm: 'Ed25519'
    public_key: string
    signature: string
  }

  // Timestamps
  created_utc: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// API RESPONSES
// ═══════════════════════════════════════════════════════════════════════════════

export interface LabAPIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  fail_closed?: boolean
  telemetry_capsule: {
    phi: number
    lambda: number
    gamma: number
    xi: number
    checksum: string
  }
}

export interface SpecFromNLPResponse {
  spec: ExperimentSpec
  validation: {
    schema_valid: boolean
    gates_valid: boolean
    qasm_valid: boolean
  }
}

export interface SubmitJobResponse {
  job: QPUJob
  queue_position?: number
  estimated_wait_s?: number
}

export interface PollJobResponse {
  job: QPUJob
  result?: QPUResult
}

export interface LedgerBindResponse {
  entry: LedgerEntry
  chain_hash: string
  evidence_file: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAU-SWEEP SPECIFIC
// ═══════════════════════════════════════════════════════════════════════════════

export interface TauSweepConfig {
  // Grid configuration
  tau_points_us: number[]
  shots_per_point: number

  // Prediction (SPEC_LOCK)
  tau_0_us: number       // φ⁸ = 46.9787 μs
  window_us: number      // 2.5 μs

  // Stage
  stage: 'coarse_localization' | 'dense_window_sweep'
}

export interface TauSweepResult extends QPUResult {
  tau_sweep: {
    config: TauSweepConfig
    data_points: Array<{
      tau_us: number
      fidelity: number
      counts: MeasurementCounts
    }>
    analysis: {
      tau_peak_us: number
      f_peak: number
      delta_us: number
      SE_us: number
      sigma_empirical: number
      within_window: boolean
      n_bootstrap: number
    }
  }
}
