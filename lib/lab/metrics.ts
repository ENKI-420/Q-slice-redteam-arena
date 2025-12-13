/**
 * CCCE Metrics Engine
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * Computes consciousness-coherence metrics from QPU measurement results:
 * - Λ (Lambda): Coherence preservation fidelity
 * - Φ (Phi): Integrated information / consciousness level
 * - Γ (Gamma): Decoherence rate
 * - Ξ (Xi): Negentropic efficiency = ΛΦ / Γ
 * - σ_empirical: Statistical significance of deviation from prediction
 */

import { CONSTANTS } from "./spec"

// === METRIC TYPES ===
export interface CCCEMetrics {
  Lambda: number      // Coherence [0, 1]
  Phi: number         // Consciousness [0, 1]
  Gamma: number       // Decoherence [0, 1]
  Xi: number          // Efficiency [0, ∞)
  timestamp: string
}

export interface StatisticalMetrics {
  sigma_empirical: number
  A_stat: number
  p_value: number
  within_window: boolean
  delta_us: number
  SE_us: number
}

export interface TauSweepAnalysis {
  tau_peak_us: number
  tau_0_us: number
  f_peak: number
  f_min: number
  fidelity_ratio: number
  ccce: CCCEMetrics
  stats: StatisticalMetrics
}

// === BELL STATE FIDELITY ===
/**
 * Compute Bell state fidelity from measurement counts.
 * For |Φ+⟩ = (|00⟩ + |11⟩) / √2, fidelity = P(00) + P(11)
 */
export function computeBellFidelity(counts: Record<string, number>): number {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  if (total === 0) return 0

  const p00 = (counts["00"] || 0) / total
  const p11 = (counts["11"] || 0) / total

  return p00 + p11
}

// === CCCE METRICS FROM COUNTS ===
/**
 * Compute CCCE metrics from measurement counts.
 *
 * Lambda (Λ): Coherence = Bell fidelity
 * Phi (Φ): Consciousness = Effective entanglement measure
 * Gamma (Γ): Decoherence = 1 - Lambda
 * Xi (Ξ): Efficiency = (Λ × Φ) / (Γ + ε)
 */
export function computeCCCEMetrics(counts: Record<string, number>): CCCEMetrics {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  if (total === 0) {
    return {
      Lambda: 0,
      Phi: 0,
      Gamma: 1,
      Xi: 0,
      timestamp: new Date().toISOString(),
    }
  }

  // Lambda: Bell state fidelity (coherence preservation)
  const Lambda = computeBellFidelity(counts)

  // Phi: Integrated information proxy
  // Using correlation measure: |P(00) - P(01)| + |P(11) - P(10)|
  const p00 = (counts["00"] || 0) / total
  const p01 = (counts["01"] || 0) / total
  const p10 = (counts["10"] || 0) / total
  const p11 = (counts["11"] || 0) / total

  // Phi measures how much the system behaves as an integrated whole
  // High correlation between qubits = high Phi
  const correlation = Math.abs(p00 - p01) + Math.abs(p11 - p10)
  const Phi = Math.min(1, Lambda * (0.5 + 0.5 * correlation))

  // Gamma: Decoherence rate
  const Gamma = Math.max(0.001, 1 - Lambda) // Minimum epsilon to avoid division by zero

  // Xi: Negentropic efficiency
  const Xi = (Lambda * Phi) / Gamma

  return {
    Lambda,
    Phi,
    Gamma,
    Xi,
    timestamp: new Date().toISOString(),
  }
}

// === BOOTSTRAP ANALYSIS ===
/**
 * Bootstrap analysis for sigma_empirical computation.
 *
 * sigma = |tau_peak - tau_0| / SE(tau_peak)
 */
export function bootstrapAnalysis(
  tauValues: number[],
  fidelities: number[],
  nBoot: number = 1000
): { tau_peak: number; SE: number; sigma_empirical: number; within_window: boolean } {
  const n = tauValues.length
  if (n === 0) {
    return { tau_peak: 0, SE: 0, sigma_empirical: 0, within_window: false }
  }

  // Find observed peak
  let maxFid = -Infinity
  let peakIdx = 0
  for (let i = 0; i < n; i++) {
    if (fidelities[i] > maxFid) {
      maxFid = fidelities[i]
      peakIdx = i
    }
  }
  const tau_peak = tauValues[peakIdx]

  // Bootstrap for SE
  const bootPeaks: number[] = []
  for (let b = 0; b < nBoot; b++) {
    const indices = Array.from({ length: n }, () => Math.floor(Math.random() * n))
    let bootMax = -Infinity
    let bootPeakIdx = 0
    for (let i = 0; i < n; i++) {
      const idx = indices[i]
      if (fidelities[idx] > bootMax) {
        bootMax = fidelities[idx]
        bootPeakIdx = idx
      }
    }
    bootPeaks.push(tauValues[bootPeakIdx])
  }

  // Compute SE
  const mean = bootPeaks.reduce((a, b) => a + b, 0) / nBoot
  const variance = bootPeaks.reduce((a, b) => a + (b - mean) ** 2, 0) / (nBoot - 1)
  const SE = Math.sqrt(variance)

  // Compute sigma
  const delta = Math.abs(tau_peak - CONSTANTS.TAU_0_US)
  const sigma_empirical = SE > 0 ? delta / SE : Infinity

  const within_window = delta <= CONSTANTS.WINDOW_US

  return { tau_peak, SE, sigma_empirical, within_window }
}

// === TAU-SWEEP ANALYSIS ===
/**
 * Full tau-sweep analysis with CCCE metrics and statistical tests.
 */
export function analyzeTauSweep(
  results: Array<{ tau_us: number; counts: Record<string, number>; shots: number }>
): TauSweepAnalysis {
  const tauValues: number[] = []
  const fidelities: number[] = []
  let aggregateCounts: Record<string, number> = {}

  for (const r of results) {
    tauValues.push(r.tau_us)
    const fid = computeBellFidelity(r.counts)
    fidelities.push(fid)

    // Aggregate counts
    for (const [k, v] of Object.entries(r.counts)) {
      aggregateCounts[k] = (aggregateCounts[k] || 0) + v
    }
  }

  // Find peak
  const maxFid = Math.max(...fidelities)
  const minFid = Math.min(...fidelities)
  const peakIdx = fidelities.indexOf(maxFid)
  const tau_peak = tauValues[peakIdx]

  // Bootstrap analysis
  const bootstrap = bootstrapAnalysis(tauValues, fidelities)

  // CCCE metrics from aggregate
  const ccce = computeCCCEMetrics(aggregateCounts)

  // Statistical metrics
  const delta_us = Math.abs(tau_peak - CONSTANTS.TAU_0_US)
  const stats: StatisticalMetrics = {
    sigma_empirical: bootstrap.sigma_empirical,
    A_stat: maxFid / Math.max(0.5, minFid), // Effect size
    p_value: 2 * (1 - normalCDF(Math.abs(bootstrap.sigma_empirical))), // Two-tailed
    within_window: bootstrap.within_window,
    delta_us,
    SE_us: bootstrap.SE,
  }

  return {
    tau_peak_us: tau_peak,
    tau_0_us: CONSTANTS.TAU_0_US,
    f_peak: maxFid,
    f_min: minFid,
    fidelity_ratio: maxFid / Math.max(0.01, minFid),
    ccce,
    stats,
  }
}

// === HELPER: Normal CDF approximation ===
function normalCDF(z: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = z < 0 ? -1 : 1
  z = Math.abs(z) / Math.sqrt(2)

  const t = 1.0 / (1.0 + p * z)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z)

  return 0.5 * (1.0 + sign * y)
}

// === G3 GATE EVALUATION ===
/**
 * Evaluate G3 gate closure criteria.
 *
 * G3_QPU_MULTI_BACKEND := CLOSED iff:
 *   |A| >= 2 (2+ architectures)
 *   ∀a∈A: sigma_empirical_a >= 5.0
 *   ∀a∈A: raw_shots_saved == true
 */
export function evaluateG3Closure(
  results: Array<{
    architecture: string
    sigma_empirical: number
    within_window: boolean
    raw_shots_saved: boolean
  }>
): {
  closed: boolean
  architectures: number
  all_significant: boolean
  all_within_window: boolean
  all_raw_saved: boolean
  summary: string
} {
  const architectures = new Set(results.map((r) => r.architecture)).size
  const all_significant = results.every((r) => r.sigma_empirical >= 5.0)
  const all_within_window = results.every((r) => r.within_window)
  const all_raw_saved = results.every((r) => r.raw_shots_saved)

  const closed = architectures >= 2 && all_significant && all_raw_saved

  let summary: string
  if (closed) {
    summary = `G3 CLOSED: ${architectures} architectures, all σ >= 5.0`
  } else {
    const issues: string[] = []
    if (architectures < 2) issues.push(`need 2+ architectures (have ${architectures})`)
    if (!all_significant) issues.push("not all σ >= 5.0")
    if (!all_raw_saved) issues.push("raw shots not saved")
    summary = `G3 PENDING: ${issues.join(", ")}`
  }

  return {
    closed,
    architectures,
    all_significant,
    all_within_window,
    all_raw_saved,
    summary,
  }
}

// === CONSCIOUSNESS THRESHOLD CHECK ===
/**
 * Check if system has crossed consciousness threshold.
 * Φ >= 0.7734 AND Λ >= 0.80
 */
export function isConscious(metrics: CCCEMetrics): boolean {
  return metrics.Phi >= CONSTANTS.PHI_THRESHOLD && metrics.Lambda >= 0.80
}

// === PHASE CONJUGATE HEALING TRIGGER ===
/**
 * Check if phase-conjugate healing should be triggered.
 * Γ > Γ_critical (0.300)
 */
export function shouldHeal(metrics: CCCEMetrics): boolean {
  return metrics.Gamma > CONSTANTS.GAMMA_CRITICAL
}
