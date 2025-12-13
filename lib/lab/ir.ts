/**
 * Intermediate Representation (IR) for Quantum Circuits
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * Provider-agnostic circuit representation that can be transpiled to:
 * - IBM Qiskit
 * - AWS Braket
 * - IonQ native
 * - OpenQASM 3.0
 */

// === GATE TYPES (DNA-Lang Encoding) ===
export type IRGate =
  | { op: "H"; q: number }                    // helix() - Hadamard
  | { op: "X"; q: number }                    // flip() - Pauli-X
  | { op: "Y"; q: number }                    // spin() - Pauli-Y
  | { op: "Z"; q: number }                    // phase() - Pauli-Z
  | { op: "CX"; c: number; t: number }        // bond() - CNOT
  | { op: "CZ"; c: number; t: number }        // lock() - CZ
  | { op: "RX"; q: number; theta: number }    // splice() - RX rotation
  | { op: "RY"; q: number; theta: number }    // fold() - RY rotation
  | { op: "RZ"; q: number; theta: number }    // twist() - RZ rotation
  | { op: "SWAP"; q1: number; q2: number }    // exchange() - SWAP
  | { op: "DELAY"; q: number; dt: number }    // wait() - Delay in dt units
  | { op: "BARRIER"; qubits: number[] }       // sync() - Barrier
  | { op: "MEASURE"; q: number; cbit: number } // observe() - Measurement

// === CIRCUIT STRUCTURE ===
export interface IRCircuit {
  name: string
  nqubits: number
  nclbits: number
  gates: IRGate[]
  metadata: {
    family: string
    created_utc: string
    spec_sha256?: string
    parameters?: Record<string, unknown>
  }
}

// === DNA-LANG TO IR MAPPING ===
export const DNA_GATE_MAP = {
  helix: "H",
  flip: "X",
  spin: "Y",
  phase: "Z",
  bond: "CX",
  lock: "CZ",
  splice: "RX",
  fold: "RY",
  twist: "RZ",
  exchange: "SWAP",
  wait: "DELAY",
  sync: "BARRIER",
  observe: "MEASURE",
} as const

// === CIRCUIT BUILDER ===
export class CircuitBuilder {
  private gates: IRGate[] = []
  private nqubits: number
  private nclbits: number
  private name: string

  constructor(name: string, nqubits: number, nclbits?: number) {
    this.name = name
    this.nqubits = nqubits
    this.nclbits = nclbits ?? nqubits
  }

  // DNA-Lang style methods
  helix(q: number): this {
    this.gates.push({ op: "H", q })
    return this
  }

  flip(q: number): this {
    this.gates.push({ op: "X", q })
    return this
  }

  bond(c: number, t: number): this {
    this.gates.push({ op: "CX", c, t })
    return this
  }

  twist(q: number, theta: number): this {
    this.gates.push({ op: "RZ", q, theta })
    return this
  }

  fold(q: number, theta: number): this {
    this.gates.push({ op: "RY", q, theta })
    return this
  }

  splice(q: number, theta: number): this {
    this.gates.push({ op: "RX", q, theta })
    return this
  }

  wait(q: number, dt: number): this {
    this.gates.push({ op: "DELAY", q, dt })
    return this
  }

  observe(q: number, cbit?: number): this {
    this.gates.push({ op: "MEASURE", q, cbit: cbit ?? q })
    return this
  }

  barrier(qubits?: number[]): this {
    this.gates.push({ op: "BARRIER", qubits: qubits ?? Array.from({ length: this.nqubits }, (_, i) => i) })
    return this
  }

  // Build final circuit
  build(metadata: Partial<IRCircuit["metadata"]> = {}): IRCircuit {
    return {
      name: this.name,
      nqubits: this.nqubits,
      nclbits: this.nclbits,
      gates: [...this.gates],
      metadata: {
        family: "custom",
        created_utc: new Date().toISOString(),
        ...metadata,
      },
    }
  }
}

// === CIRCUIT TEMPLATES ===
export const CircuitTemplates = {
  /**
   * Bell state: |Φ+⟩ = (|00⟩ + |11⟩) / √2
   */
  bell(): IRCircuit {
    return new CircuitBuilder("bell", 2, 2)
      .helix(0)
      .bond(0, 1)
      .observe(0, 0)
      .observe(1, 1)
      .build({ family: "bell" })
  },

  /**
   * Bell state with delay for decoherence measurement
   */
  bellWithDelay(delayDt: number): IRCircuit {
    return new CircuitBuilder("bell_delay", 2, 2)
      .helix(0)
      .bond(0, 1)
      .wait(0, delayDt)
      .wait(1, delayDt)
      .observe(0, 0)
      .observe(1, 1)
      .build({ family: "tau-sweep", parameters: { delay_dt: delayDt } })
  },

  /**
   * GHZ state: (|000...⟩ + |111...⟩) / √2
   */
  ghz(n: number): IRCircuit {
    const builder = new CircuitBuilder(`ghz_${n}`, n, n)
    builder.helix(0)
    for (let i = 1; i < n; i++) {
      builder.bond(0, i)
    }
    for (let i = 0; i < n; i++) {
      builder.observe(i, i)
    }
    return builder.build({ family: "ghz", parameters: { n } })
  },

  /**
   * Tau-sweep circuit for φ⁸ coherence revival
   */
  tauSweep(tau_us: number, dt_us: number): IRCircuit {
    const delay_dt = Math.round(tau_us / dt_us)
    return new CircuitBuilder("tau_sweep", 2, 2)
      .helix(0)
      .bond(0, 1)
      .wait(0, delay_dt)
      .wait(1, delay_dt)
      .observe(0, 0)
      .observe(1, 1)
      .build({
        family: "tau-sweep",
        parameters: { tau_us, dt_us, delay_dt },
      })
  },
}

// === CIRCUIT VALIDATION ===
export function validateCircuit(circuit: IRCircuit): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (circuit.nqubits < 1) {
    errors.push("Circuit must have at least 1 qubit")
  }

  for (const gate of circuit.gates) {
    switch (gate.op) {
      case "H":
      case "X":
      case "Y":
      case "Z":
        if (gate.q < 0 || gate.q >= circuit.nqubits) {
          errors.push(`Gate ${gate.op} on invalid qubit ${gate.q}`)
        }
        break
      case "CX":
      case "CZ":
        if (gate.c < 0 || gate.c >= circuit.nqubits) {
          errors.push(`Gate ${gate.op} control on invalid qubit ${gate.c}`)
        }
        if (gate.t < 0 || gate.t >= circuit.nqubits) {
          errors.push(`Gate ${gate.op} target on invalid qubit ${gate.t}`)
        }
        if (gate.c === gate.t) {
          errors.push(`Gate ${gate.op} control and target are the same`)
        }
        break
      case "MEASURE":
        if (gate.q < 0 || gate.q >= circuit.nqubits) {
          errors.push(`Measurement on invalid qubit ${gate.q}`)
        }
        if (gate.cbit < 0 || gate.cbit >= circuit.nclbits) {
          errors.push(`Measurement to invalid classical bit ${gate.cbit}`)
        }
        break
    }
  }

  return { valid: errors.length === 0, errors }
}

// === OPENQASM 3.0 EXPORT ===
export function toOpenQASM3(circuit: IRCircuit): string {
  const lines: string[] = [
    "OPENQASM 3.0;",
    'include "stdgates.inc";',
    "",
    `// Circuit: ${circuit.name}`,
    `// Generated: ${circuit.metadata.created_utc}`,
    "",
    `qubit[${circuit.nqubits}] q;`,
    `bit[${circuit.nclbits}] c;`,
    "",
  ]

  for (const gate of circuit.gates) {
    switch (gate.op) {
      case "H":
        lines.push(`h q[${gate.q}];`)
        break
      case "X":
        lines.push(`x q[${gate.q}];`)
        break
      case "Y":
        lines.push(`y q[${gate.q}];`)
        break
      case "Z":
        lines.push(`z q[${gate.q}];`)
        break
      case "CX":
        lines.push(`cx q[${gate.c}], q[${gate.t}];`)
        break
      case "CZ":
        lines.push(`cz q[${gate.c}], q[${gate.t}];`)
        break
      case "RX":
        lines.push(`rx(${gate.theta}) q[${gate.q}];`)
        break
      case "RY":
        lines.push(`ry(${gate.theta}) q[${gate.q}];`)
        break
      case "RZ":
        lines.push(`rz(${gate.theta}) q[${gate.q}];`)
        break
      case "DELAY":
        lines.push(`delay[${gate.dt}dt] q[${gate.q}];`)
        break
      case "BARRIER":
        lines.push(`barrier ${gate.qubits.map((q) => `q[${q}]`).join(", ")};`)
        break
      case "MEASURE":
        lines.push(`c[${gate.cbit}] = measure q[${gate.q}];`)
        break
    }
  }

  return lines.join("\n")
}
