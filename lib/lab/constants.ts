/**
 * Q-SLICE Quantum Lab Constants
 * ================================
 * SPEC_LOCK ENFORCED - Physical constants immutable
 * FAIL_CLOSED - No mocks, no simulations
 *
 * CAGE: 9HUP5 | Agile Defense Systems, LLC
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS (IMMUTABLE)
// ═══════════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895
export const TAU_0_US = Math.pow(PHI, 8)  // 46.97871376417233 μs
export const LAMBDA_PHI = 2.176435e-8     // Universal Memory Constant [s⁻¹]
export const THETA_LOCK = 51.843          // Torsion-locked angle [degrees]
export const PHI_THRESHOLD = 0.7734       // Consciousness threshold
export const GAMMA_FIXED = 0.092          // Fixed-point decoherence
export const GAMMA_CRITICAL = 0.3         // Phase-conjugate healing trigger
export const WINDOW_US = 2.5              // Pre-registered acceptance window (LOCKED)
export const F_MAX_PREDICTED = 1 - Math.pow(PHI, -8)  // 0.9787...

// ═══════════════════════════════════════════════════════════════════════════════
// FAIL-CLOSED INVARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * FAIL_CLOSED_INVARIANT: No mock or simulation allowed
 *
 * Enforced at all /api/lab/** endpoints:
 * - ALLOW_SIM=1 ⇒ DENY
 * - ALLOW_MOCK=1 ⇒ DENY
 * - ¬QPU_TOKEN ⇒ DENY
 */
export function assertFailClosed(): { valid: boolean; error?: string } {
  // Check for simulation/mock flags (must NOT be set)
  if (process.env.ALLOW_SIM === '1') {
    return { valid: false, error: 'FAIL_CLOSED: Simulation mode forbidden' }
  }
  if (process.env.ALLOW_MOCK === '1') {
    return { valid: false, error: 'FAIL_CLOSED: Mock mode forbidden' }
  }

  // Check for QPU credentials (must be set)
  const hasQPUToken = !!(
    process.env.IBM_QUANTUM_TOKEN ||
    process.env.QISKIT_RUNTIME_TOKEN ||
    process.env.AWS_BRAKET_TOKEN ||
    process.env.QUANTUM_RINGS_TOKEN
  )

  if (!hasQPUToken) {
    return { valid: false, error: 'FAIL_CLOSED: No QPU credentials configured' }
  }

  return { valid: true }
}

// ═══════════════════════════════════════════════════════════════════════════════
// QPU BACKENDS (Real Hardware Only)
// ═══════════════════════════════════════════════════════════════════════════════

export type QPUArchitecture = 'superconducting' | 'trapped-ion' | 'photonic' | 'neutral-atom'

export interface QPUBackend {
  name: string
  displayName: string
  architecture: QPUArchitecture
  qubits: number
  provider: string
  region?: string
  available: boolean
}

// Real QPU backends (no vendor branding in display)
export const QPU_BACKENDS: Record<string, QPUBackend> = {
  // Superconducting (via Qiskit Runtime)
  'fez': {
    name: 'ibm_fez',
    displayName: 'Fez QPU',
    architecture: 'superconducting',
    qubits: 156,
    provider: 'qiskit_runtime',
    region: 'us-east',
    available: true
  },
  'torino': {
    name: 'ibm_torino',
    displayName: 'Torino QPU',
    architecture: 'superconducting',
    qubits: 133,
    provider: 'qiskit_runtime',
    region: 'eu-de',
    available: true
  },
  'marrakesh': {
    name: 'ibm_marrakesh',
    displayName: 'Marrakesh QPU',
    architecture: 'superconducting',
    qubits: 156,
    provider: 'qiskit_runtime',
    region: 'us-east',
    available: true
  },
  // Trapped-Ion (via AWS Braket)
  'ionq-aria': {
    name: 'arn:aws:braket:us-east-1::device/qpu/ionq/Aria-1',
    displayName: 'Aria QPU',
    architecture: 'trapped-ion',
    qubits: 25,
    provider: 'aws_braket',
    region: 'us-east-1',
    available: true
  },
  'ionq-forte': {
    name: 'arn:aws:braket:us-east-1::device/qpu/ionq/Forte-1',
    displayName: 'Forte QPU',
    architecture: 'trapped-ion',
    qubits: 32,
    provider: 'aws_braket',
    region: 'us-east-1',
    available: true
  },
  // Neutral Atom (via AWS Braket)
  'aquila': {
    name: 'arn:aws:braket:us-east-1::device/qpu/quera/Aquila',
    displayName: 'Aquila QPU',
    architecture: 'neutral-atom',
    qubits: 256,
    provider: 'aws_braket',
    region: 'us-east-1',
    available: true
  },
  // Quantum Rings (Direct)
  'qrings-1': {
    name: 'qrings-topology-1',
    displayName: 'QRings Topology-1',
    architecture: 'superconducting',
    qubits: 64,
    provider: 'quantum_rings',
    available: false // Pending access
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVIDENCE GRADES
// ═══════════════════════════════════════════════════════════════════════════════

export type EvidenceGrade = 'CLASS_A' | 'CLASS_B' | 'CLASS_C'

export interface GradeRequirements {
  grade: EvidenceGrade
  description: string
  requirements: string[]
}

export const GRADE_DEFINITIONS: Record<EvidenceGrade, GradeRequirements> = {
  CLASS_A: {
    grade: 'CLASS_A',
    description: 'Real QPU hardware execution',
    requirements: [
      'Executed on physical quantum processor',
      'Full provenance chain',
      'SHA256 hash locked',
      'Timestamp verified'
    ]
  },
  CLASS_B: {
    grade: 'CLASS_B',
    description: 'Pipeline validated with nonce',
    requirements: [
      'Ed25519 signed nonce',
      'Deterministic transpilation',
      'Ready for QPU submission'
    ]
  },
  CLASS_C: {
    grade: 'CLASS_C',
    description: 'Development/debugging only',
    requirements: [
      'NOT for evidence claims',
      'Local validation only',
      'No ledger binding allowed'
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGMA THRESHOLDS
// ═══════════════════════════════════════════════════════════════════════════════

export const SIGMA_THRESHOLD_G3 = 5.0       // Required for G3 closure
export const SIGMA_THRESHOLD_STRONG = 3.0   // Strong evidence
export const SIGMA_THRESHOLD_WEAK = 2.0     // Weak evidence

// ═══════════════════════════════════════════════════════════════════════════════
// G3 GATE REQUIREMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const G3_REQUIREMENTS = {
  min_architectures: 2,
  min_sigma_empirical: SIGMA_THRESHOLD_G3,
  required_architectures: ['superconducting', 'trapped-ion'] as QPUArchitecture[],
  prediction_window_us: WINDOW_US,
  tau_0_predicted_us: TAU_0_US
}
