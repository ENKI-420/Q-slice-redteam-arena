/**
 * Experiment Compiler: ExperimentSpec → IRCircuit
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * Compiles Δ-locked experiment specifications into executable IR circuits.
 * Applies Q-SLICE threat injection as compile-time transforms.
 */

import { ExperimentSpecV1, CONSTANTS } from "./spec"
import { IRCircuit, IRGate, CircuitBuilder, CircuitTemplates } from "./ir"
import crypto from "crypto"

// === COMPILATION RESULT ===
export interface CompilationResult {
  circuit: IRCircuit
  meta: {
    spec_sha256: string
    family: string
    parameters: Record<string, unknown>
    qslice_applied: boolean
    threat_vectors: string[]
  }
}

/**
 * Compile ExperimentSpec to IRCircuit
 */
export function compileToIR(spec: ExperimentSpecV1): CompilationResult {
  const spec_sha256 = crypto
    .createHash("sha256")
    .update(JSON.stringify(spec))
    .digest("hex")

  const family = spec.experiment.family
  const params = spec.experiment.parameters

  let circuit: IRCircuit

  switch (family) {
    case "bell":
      circuit = compileBell(spec)
      break

    case "tau-sweep":
      circuit = compileTauSweep(spec)
      break

    case "ghz":
      circuit = compileGHZ(spec)
      break

    case "qaoa":
      circuit = compileQAOA(spec)
      break

    case "grover":
      circuit = compileGrover(spec)
      break

    case "custom":
      circuit = compileCustom(spec)
      break

    default:
      throw new Error(`Unsupported experiment family: ${family}`)
  }

  // Apply Q-SLICE threat transforms if enabled
  if (spec.qslice.enabled && spec.qslice.threat_vectors.length > 0) {
    circuit = applyQSliceThreats(circuit, spec.qslice.threat_vectors, spec.qslice.intensity)
  }

  // Update circuit metadata with spec hash
  circuit.metadata.spec_sha256 = spec_sha256

  return {
    circuit,
    meta: {
      spec_sha256,
      family,
      parameters: params,
      qslice_applied: spec.qslice.enabled,
      threat_vectors: spec.qslice.threat_vectors,
    },
  }
}

// === FAMILY COMPILERS ===

function compileBell(spec: ExperimentSpecV1): IRCircuit {
  return CircuitTemplates.bell()
}

function compileTauSweep(spec: ExperimentSpecV1): IRCircuit {
  const params = spec.experiment.parameters
  const tau_us = params.tau_us ?? CONSTANTS.TAU_0_US
  const dt_us = params.dt_us ?? 0.004 // IBM Fez default

  return CircuitTemplates.tauSweep(tau_us, dt_us)
}

function compileGHZ(spec: ExperimentSpecV1): IRCircuit {
  const n = spec.experiment.parameters.n_qubits ?? 3
  return CircuitTemplates.ghz(n)
}

function compileQAOA(spec: ExperimentSpecV1): IRCircuit {
  const params = spec.experiment.parameters
  const n = params.n_qubits ?? 4
  const p = params.layers ?? 1
  const gamma = params.gamma ?? Math.PI / 4
  const beta = params.beta ?? Math.PI / 8

  const builder = new CircuitBuilder("qaoa", n, n)

  // Initial superposition
  for (let i = 0; i < n; i++) {
    builder.helix(i)
  }

  // QAOA layers
  for (let layer = 0; layer < p; layer++) {
    // Problem unitary (ZZ interactions for MaxCut-like)
    for (let i = 0; i < n - 1; i++) {
      builder.bond(i, i + 1)
      builder.twist(i + 1, 2 * gamma)
      builder.bond(i, i + 1)
    }

    // Mixer unitary
    for (let i = 0; i < n; i++) {
      builder.splice(i, 2 * beta)
    }
  }

  // Measure
  for (let i = 0; i < n; i++) {
    builder.observe(i, i)
  }

  return builder.build({
    family: "qaoa",
    parameters: { n_qubits: n, layers: p, gamma, beta },
  })
}

function compileGrover(spec: ExperimentSpecV1): IRCircuit {
  const params = spec.experiment.parameters
  const n = params.n_qubits ?? 3
  const target = params.target_state ?? "111"
  const iterations = params.iterations ?? Math.floor(Math.PI / 4 * Math.sqrt(Math.pow(2, n)))

  const builder = new CircuitBuilder("grover", n, n)

  // Initial superposition
  for (let i = 0; i < n; i++) {
    builder.helix(i)
  }

  // Grover iterations
  for (let iter = 0; iter < iterations; iter++) {
    // Oracle (simplified: flip phase of target state)
    // This is a placeholder - real oracle depends on problem
    for (let i = 0; i < n; i++) {
      if (target[i] === "0") builder.flip(i)
    }
    // Multi-controlled Z (simplified as sequence)
    builder.helix(n - 1)
    for (let i = 0; i < n - 1; i++) {
      builder.bond(i, n - 1)
    }
    builder.helix(n - 1)
    for (let i = 0; i < n; i++) {
      if (target[i] === "0") builder.flip(i)
    }

    // Diffusion operator
    for (let i = 0; i < n; i++) {
      builder.helix(i)
      builder.flip(i)
    }
    builder.helix(n - 1)
    for (let i = 0; i < n - 1; i++) {
      builder.bond(i, n - 1)
    }
    builder.helix(n - 1)
    for (let i = 0; i < n; i++) {
      builder.flip(i)
      builder.helix(i)
    }
  }

  // Measure
  for (let i = 0; i < n; i++) {
    builder.observe(i, i)
  }

  return builder.build({
    family: "grover",
    parameters: { n_qubits: n, target_state: target, iterations },
  })
}

function compileCustom(spec: ExperimentSpecV1): IRCircuit {
  const params = spec.experiment.parameters
  const gates = params.gates as IRGate[] | undefined

  if (!gates || !Array.isArray(gates)) {
    throw new Error("Custom experiment requires 'gates' array in parameters")
  }

  const nqubits = params.n_qubits ?? Math.max(...gates.map(g => {
    if ("q" in g) return g.q
    if ("c" in g && "t" in g) return Math.max(g.c, g.t)
    if ("q1" in g && "q2" in g) return Math.max(g.q1, g.q2)
    return 0
  })) + 1

  return {
    name: "custom",
    nqubits,
    nclbits: nqubits,
    gates,
    metadata: {
      family: "custom",
      created_utc: new Date().toISOString(),
      parameters: params,
    },
  }
}

// === Q-SLICE THREAT INJECTION ===

/**
 * Apply Q-SLICE threat vectors as compile-time circuit transforms.
 * These are controlled perturbations for security testing, NOT exploitation.
 */
export function applyQSliceThreats(
  circuit: IRCircuit,
  vectors: string[],
  intensity: number
): IRCircuit {
  let gates = [...circuit.gates]

  for (const vector of vectors) {
    switch (vector) {
      case "gate_bias":
        // Bias rotation angles slightly
        gates = gates.map((g) => {
          if (g.op === "RZ" || g.op === "RY" || g.op === "RX") {
            return { ...g, theta: g.theta * (1 + 0.05 * intensity) }
          }
          return g
        })
        break

      case "timing_jitter":
        // Add small phase noise after rotations
        gates = gates.flatMap((g) => {
          if (g.op === "RZ") {
            const jitter: IRGate = { op: "RZ", q: g.q, theta: 0.01 * intensity * Math.random() }
            return [g, jitter]
          }
          return [g]
        })
        break

      case "decoherence_induction":
        // Insert additional delay to induce decoherence
        const delayGate: IRGate = { op: "DELAY", q: 0, dt: Math.floor(100 * intensity) }
        const measureIdx = gates.findIndex((g) => g.op === "MEASURE")
        if (measureIdx > 0) {
          gates.splice(measureIdx, 0, delayGate)
        }
        break

      case "readout_skew":
        // This would affect post-processing, not circuit
        // Placeholder for now
        break

      case "measurement_injection":
        // Insert spurious measurements (collapses state)
        if (intensity > 0.5 && circuit.nqubits > 1) {
          const measureInject: IRGate = { op: "MEASURE", q: 1, cbit: circuit.nclbits - 1 }
          const lastMeasure = gates.findLastIndex((g) => g.op === "MEASURE")
          if (lastMeasure > 0) {
            gates.splice(lastMeasure, 0, measureInject)
          }
        }
        break
    }
  }

  return {
    ...circuit,
    gates,
    metadata: {
      ...circuit.metadata,
      parameters: {
        ...circuit.metadata.parameters,
        qslice_vectors: vectors,
        qslice_intensity: intensity,
      },
    },
  }
}

// === SPEC HASH ===
export function computeSpecHash(spec: ExperimentSpecV1): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(spec))
    .digest("hex")
}

// === BATCH COMPILATION (for tau-sweep) ===
export function compileTauSweepBatch(
  spec: ExperimentSpecV1,
  tauPoints: number[],
  dtUs: number
): { circuits: IRCircuit[]; spec_sha256: string } {
  const spec_sha256 = computeSpecHash(spec)

  const circuits = tauPoints.map((tau_us) => {
    const circuit = CircuitTemplates.tauSweep(tau_us, dtUs)
    circuit.name = `tau_${tau_us}us`
    circuit.metadata.spec_sha256 = spec_sha256
    circuit.metadata.parameters = { ...circuit.metadata.parameters, tau_us }
    return circuit
  })

  return { circuits, spec_sha256 }
}
