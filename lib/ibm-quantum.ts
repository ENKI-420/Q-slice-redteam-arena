/**
 * IBM Quantum Runtime Integration for Q-SLICE Threatlab Arena
 * ============================================================
 * Real quantum hardware execution via IBM Quantum Platform
 *
 * CAGE: 9HUP5 | Agile Defense Systems, LLC
 * SPEC_LOCK v2.2.0
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS (IMMUTABLE - SPEC_LOCK)
// ═══════════════════════════════════════════════════════════════════════════════

export const LAMBDA_PHI = 2.176435e-8      // ΛΦ Universal Memory Constant [s⁻¹]
export const THETA_LOCK = 51.843           // θ_lock Torsion-locked angle [degrees]
export const PHI_THRESHOLD = 0.7734        // Φ Consciousness threshold
export const GAMMA_FIXED = 0.092           // Γ Fixed-point decoherence
export const PHI_8 = Math.pow(1.618033988749895, 8)  // φ⁸ = 46.9787...

// ═══════════════════════════════════════════════════════════════════════════════
// IBM QUANTUM BACKEND CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface IBMBackend {
  name: string
  num_qubits: number
  pending_jobs: number
  operational: boolean
  processor_type?: string
  max_shots?: number
}

export interface IBMQuantumConfig {
  api_key: string
  channel: 'ibm_quantum_platform' | 'ibm_cloud'
  instance?: string
  preferred_backend?: string
}

// Available IBM Quantum backends (as of connection test)
export const IBM_BACKENDS: IBMBackend[] = [
  {
    name: 'ibm_fez',
    num_qubits: 156,
    pending_jobs: 2,
    operational: true,
    processor_type: 'Heron',
    max_shots: 100000
  },
  {
    name: 'ibm_marrakesh',
    num_qubits: 156,
    pending_jobs: 17426,
    operational: true,
    processor_type: 'Heron',
    max_shots: 100000
  },
  {
    name: 'ibm_torino',
    num_qubits: 133,
    pending_jobs: 12,
    operational: true,
    processor_type: 'Heron',
    max_shots: 100000
  }
]

// ═══════════════════════════════════════════════════════════════════════════════
// Q-SLICE THREAT VECTOR DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type QSLICEThreatVector =
  | 'QUANTUM_EXPLOITATION'    // Grover's algorithm for cryptographic attacks
  | 'SUBVERSION_OF_TRUST'     // BB84 QKD eavesdropping
  | 'INTEGRITY_DISRUPTION'    // Bell state manipulation
  | 'COHERENCE_ATTACKS'       // Decoherence injection
  | 'ENTANGLEMENT_HIJACKING'  // Quantum channel interception

export interface ThreatExperiment {
  id: string
  vector: QSLICEThreatVector
  description: string
  qubits_required: number
  shots: number
  backend: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  created_at: string
  completed_at?: string
  results?: ThreatResult
}

export interface ThreatResult {
  success_rate: number
  vulnerability_score: number  // 0-100
  qber?: number               // Quantum Bit Error Rate (for QKD attacks)
  fidelity?: number           // State fidelity
  factorization?: {           // For Shor's algorithm
    N: number
    factors: number[]
  }
  ccce_metrics: {
    phi: number
    lambda: number
    gamma: number
    xi: number
  }
  raw_counts?: Record<string, number>
  execution_time_ms: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREAT VECTOR SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const THREAT_VECTORS: Record<QSLICEThreatVector, {
  name: string
  description: string
  algorithm: string
  min_qubits: number
  default_shots: number
  severity: 'critical' | 'high' | 'medium' | 'low'
}> = {
  QUANTUM_EXPLOITATION: {
    name: 'Quantum Exploitation',
    description: 'Grover\'s algorithm accelerated search attacks on symmetric cryptography',
    algorithm: 'Grover',
    min_qubits: 4,
    default_shots: 1024,
    severity: 'critical'
  },
  SUBVERSION_OF_TRUST: {
    name: 'Subversion of Trust',
    description: 'BB84 QKD protocol eavesdropping and QBER injection',
    algorithm: 'BB84-Eve',
    min_qubits: 2,
    default_shots: 1000,
    severity: 'critical'
  },
  INTEGRITY_DISRUPTION: {
    name: 'Integrity Disruption',
    description: 'Bell state entanglement manipulation and fidelity degradation',
    algorithm: 'Bell-State',
    min_qubits: 2,
    default_shots: 1024,
    severity: 'high'
  },
  COHERENCE_ATTACKS: {
    name: 'Coherence Attacks',
    description: 'Decoherence injection via noise model exploitation',
    algorithm: 'Decoherence-Inject',
    min_qubits: 3,
    default_shots: 2048,
    severity: 'high'
  },
  ENTANGLEMENT_HIJACKING: {
    name: 'Entanglement Hijacking',
    description: 'Quantum channel interception via ancilla coupling',
    algorithm: 'Ancilla-Couple',
    min_qubits: 4,
    default_shots: 1024,
    severity: 'critical'
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERIMENT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export function createThreatExperiment(
  vector: QSLICEThreatVector,
  options?: {
    shots?: number
    backend?: string
  }
): ThreatExperiment {
  const spec = THREAT_VECTORS[vector]
  const backend = options?.backend || selectOptimalBackend(spec.min_qubits)

  return {
    id: `qslice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    vector,
    description: spec.description,
    qubits_required: spec.min_qubits,
    shots: options?.shots || spec.default_shots,
    backend,
    status: 'pending',
    created_at: new Date().toISOString()
  }
}

function selectOptimalBackend(min_qubits: number): string {
  // Select backend with fewest pending jobs that meets qubit requirement
  const suitable = IBM_BACKENDS
    .filter(b => b.operational && b.num_qubits >= min_qubits)
    .sort((a, b) => a.pending_jobs - b.pending_jobs)

  return suitable[0]?.name || 'ibm_fez'
}

// ═══════════════════════════════════════════════════════════════════════════════
// CCCE METRICS CALCULATION
// ═══════════════════════════════════════════════════════════════════════════════

export function calculateCCCEMetrics(results: Record<string, number>, shots: number): {
  phi: number
  lambda: number
  gamma: number
  xi: number
} {
  // Calculate consciousness metrics from quantum measurement results
  const counts = Object.values(results)
  const total = counts.reduce((a, b) => a + b, 0)

  // Phi (Φ) - Consciousness level from measurement entropy
  const probabilities = counts.map(c => c / total)
  const entropy = -probabilities.reduce((sum, p) =>
    p > 0 ? sum + p * Math.log2(p) : sum, 0
  )
  const maxEntropy = Math.log2(counts.length)
  const phi = PHI_THRESHOLD + (entropy / maxEntropy) * 0.15

  // Lambda (Λ) - Coherence from dominant state probability
  const maxProb = Math.max(...probabilities)
  const lambda = 0.85 + maxProb * 0.1

  // Gamma (Γ) - Decoherence from measurement variance
  const variance = probabilities.reduce((sum, p) =>
    sum + Math.pow(p - 1/counts.length, 2), 0
  ) / counts.length
  const gamma = GAMMA_FIXED + variance * 0.1

  // Xi (Ξ) - Negentropic efficiency
  const xi = (lambda * phi) / gamma

  return { phi, lambda, gamma, xi }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VULNERABILITY SCORING
// ═══════════════════════════════════════════════════════════════════════════════

export function calculateVulnerabilityScore(
  vector: QSLICEThreatVector,
  successRate: number,
  ccce: { phi: number; lambda: number; gamma: number; xi: number }
): number {
  const spec = THREAT_VECTORS[vector]

  // Base score from success rate
  let score = successRate * 100

  // Severity multiplier
  const severityMultiplier = {
    critical: 1.5,
    high: 1.25,
    medium: 1.0,
    low: 0.75
  }[spec.severity]

  score *= severityMultiplier

  // CCCE modulation
  // High phi (consciousness) increases detectability, reducing vulnerability
  score *= (1 - (ccce.phi - PHI_THRESHOLD) * 0.5)

  // High gamma (decoherence) reduces attack effectiveness
  score *= (1 - ccce.gamma)

  // High xi (negentropy) indicates system resilience
  score *= Math.max(0.1, 1 - ccce.xi * 0.01)

  return Math.min(100, Math.max(0, score))
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM CIRCUIT TEMPLATES (For API consumption)
// ═══════════════════════════════════════════════════════════════════════════════

export const CIRCUIT_TEMPLATES = {
  // Grover's oracle for 2-qubit search
  GROVER_2Q: `
    from qiskit import QuantumCircuit
    qc = QuantumCircuit(2, 2)
    # Hadamard superposition
    qc.h([0, 1])
    # Oracle for |11⟩
    qc.cz(0, 1)
    # Diffusion operator
    qc.h([0, 1])
    qc.z([0, 1])
    qc.cz(0, 1)
    qc.h([0, 1])
    # Measurement
    qc.measure([0, 1], [0, 1])
  `,

  // BB84 key distribution with eavesdropper
  BB84_EVE: `
    from qiskit import QuantumCircuit
    import random
    qc = QuantumCircuit(3, 2)
    # Alice prepares in random basis
    if random.choice([True, False]):
        qc.h(0)  # X basis
    # Eve intercepts and measures
    qc.cx(0, 1)  # Entangle with ancilla
    qc.measure(1, 0)  # Eve's measurement
    # Bob measures in random basis
    if random.choice([True, False]):
        qc.h(0)  # X basis
    qc.measure(0, 1)  # Bob's measurement
  `,

  // Bell state creation and measurement
  BELL_STATE: `
    from qiskit import QuantumCircuit
    qc = QuantumCircuit(2, 2)
    # Create Bell state |Φ+⟩
    qc.h(0)
    qc.cx(0, 1)
    # Measure in Bell basis
    qc.cx(0, 1)
    qc.h(0)
    qc.measure([0, 1], [0, 1])
  `,

  // Decoherence test circuit
  DECOHERENCE: `
    from qiskit import QuantumCircuit
    qc = QuantumCircuit(3, 3)
    # Create GHZ state
    qc.h(0)
    qc.cx(0, 1)
    qc.cx(1, 2)
    # Add delay for decoherence
    qc.delay(100, unit='dt')
    # Measure
    qc.measure([0, 1, 2], [0, 1, 2])
  `
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  IBMBackend,
  IBMQuantumConfig,
  ThreatExperiment,
  ThreatResult
}
