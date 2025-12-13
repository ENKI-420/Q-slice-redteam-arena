/**
 * Dense τ-Sweep Generator (Stage B)
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * Purpose: Generate τ-grid configurations to achieve σ_empirical ≥ 5.0
 *
 * Two-stage protocol:
 * Stage A: Coarse localization (13-21 points across broad span)
 * Stage B: Dense window sweep around φ⁸ (41-61 points, ±2.5μs window)
 *
 * Physical Constants (IMMUTABLE):
 * τ₀ = φ⁸ = 46.9787137641723 μs (coherence revival prediction)
 * WINDOW_US = 2.5 μs (SPEC_LOCK acceptance window)
 * ΛΦ = 2.176435e-8 s⁻¹
 */

// === PHYSICAL CONSTANTS (IMMUTABLE) ===
export const PHYSICS = {
  PHI: 1.618033988749895,
  TAU_0_US: Math.pow(1.618033988749895, 8), // 46.9787137641723 μs
  LAMBDA_PHI: 2.176435e-8,
  WINDOW_US: 2.5,
  PHI_THRESHOLD: 0.7734,
  GAMMA_CRITICAL: 0.300,
} as const

// === SWEEP CONFIGURATIONS ===

export interface TauSweepConfig {
  stage: "A" | "B"
  tau_points: number[]
  center_us: number
  window_us: number
  step_us: number
  shots_per_point: number
  total_shots: number
  description: string
}

/**
 * Stage A: Coarse localization sweep
 * Broad span to find approximate peak location
 */
export function generateStageA(
  center_us: number = PHYSICS.TAU_0_US,
  span_us: number = 20,
  points: number = 13,
  shots_per_point: number = 2000
): TauSweepConfig {
  const half_span = span_us / 2
  const start = center_us - half_span
  const end = center_us + half_span
  const step_us = span_us / (points - 1)

  const tau_points: number[] = []
  for (let i = 0; i < points; i++) {
    tau_points.push(Number((start + i * step_us).toFixed(4)))
  }

  return {
    stage: "A",
    tau_points,
    center_us: center_us,
    window_us: span_us,
    step_us: Number(step_us.toFixed(4)),
    shots_per_point,
    total_shots: points * shots_per_point,
    description: `Stage A: Coarse localization (${points} points, ±${half_span.toFixed(1)}μs span)`,
  }
}

/**
 * Stage B: Dense window sweep around φ⁸
 * High-resolution sweep within SPEC_LOCK window for σ_empirical boost
 */
export function generateStageB(
  center_us: number = PHYSICS.TAU_0_US,
  window_us: number = PHYSICS.WINDOW_US,
  points: number = 51,
  shots_per_point: number = 10000
): TauSweepConfig {
  const half_window = window_us
  const start = center_us - half_window
  const end = center_us + half_window
  const step_us = (end - start) / (points - 1)

  const tau_points: number[] = []
  for (let i = 0; i < points; i++) {
    tau_points.push(Number((start + i * step_us).toFixed(4)))
  }

  return {
    stage: "B",
    tau_points,
    center_us: center_us,
    window_us: window_us * 2, // Total span
    step_us: Number(step_us.toFixed(4)),
    shots_per_point,
    total_shots: points * shots_per_point,
    description: `Stage B: Dense window (${points} points, step ${step_us.toFixed(3)}μs, ${shots_per_point} shots/point)`,
  }
}

/**
 * Generate adaptive sweep based on Stage A results
 * Focuses Stage B around the observed peak from Stage A
 */
export function generateAdaptiveStageB(
  stage_a_peak_us: number,
  window_us: number = PHYSICS.WINDOW_US,
  points: number = 51,
  shots_per_point: number = 10000
): TauSweepConfig {
  // Center on observed peak instead of theoretical τ₀
  return generateStageB(stage_a_peak_us, window_us, points, shots_per_point)
}

/**
 * Generate ultra-dense sweep for maximum σ_empirical
 * Use when σ is close to 5.0 threshold but not quite there
 */
export function generateUltraDense(
  center_us: number = PHYSICS.TAU_0_US,
  window_us: number = 1.0, // Tighter window
  points: number = 101,
  shots_per_point: number = 20000
): TauSweepConfig {
  const half_window = window_us
  const start = center_us - half_window
  const end = center_us + half_window
  const step_us = (end - start) / (points - 1)

  const tau_points: number[] = []
  for (let i = 0; i < points; i++) {
    tau_points.push(Number((start + i * step_us).toFixed(5)))
  }

  return {
    stage: "B",
    tau_points,
    center_us: center_us,
    window_us: window_us * 2,
    step_us: Number(step_us.toFixed(5)),
    shots_per_point,
    total_shots: points * shots_per_point,
    description: `Ultra-Dense: ${points} points, step ${(step_us * 1000).toFixed(1)}ns, ${shots_per_point} shots/point`,
  }
}

// === SWEEP PRESETS ===

export const SWEEP_PRESETS = {
  // Initial exploration (cheap, broad)
  EXPLORATION: {
    stage_a: () => generateStageA(PHYSICS.TAU_0_US, 20, 13, 2000),
  },

  // Standard two-stage protocol
  STANDARD: {
    stage_a: () => generateStageA(PHYSICS.TAU_0_US, 16, 17, 2000),
    stage_b: () => generateStageB(PHYSICS.TAU_0_US, 2.5, 51, 5000),
  },

  // High-precision (expensive but high σ)
  HIGH_PRECISION: {
    stage_a: () => generateStageA(PHYSICS.TAU_0_US, 20, 21, 5000),
    stage_b: () => generateStageB(PHYSICS.TAU_0_US, 2.5, 61, 10000),
  },

  // Maximum σ_empirical push
  MAX_SIGMA: {
    stage_a: () => generateStageA(PHYSICS.TAU_0_US, 16, 17, 5000),
    stage_b: () => generateUltraDense(PHYSICS.TAU_0_US, 1.0, 101, 20000),
  },
} as const

// === SIGMA ESTIMATION ===

export interface SigmaEstimate {
  estimated_sigma: number
  confidence_interval: [number, number]
  recommendation: string
  achievable_with_config: TauSweepConfig | null
}

/**
 * Estimate σ_empirical achievable with given configuration
 * Based on shot count and grid density
 */
export function estimateSigma(config: TauSweepConfig): SigmaEstimate {
  // Heuristic model based on shot noise and grid resolution
  const shot_factor = Math.sqrt(config.shots_per_point / 1000)
  const grid_factor = Math.sqrt(config.tau_points.length / 10)
  const window_factor = PHYSICS.WINDOW_US / config.step_us

  const base_sigma = 0.21 // From current ibm_fez result
  const estimated_sigma = base_sigma * shot_factor * Math.sqrt(grid_factor)

  // Confidence interval (rough)
  const ci_low = estimated_sigma * 0.7
  const ci_high = estimated_sigma * 1.4

  let recommendation: string
  let achievable_config: TauSweepConfig | null = null

  if (estimated_sigma >= 5.0) {
    recommendation = "Configuration should achieve σ ≥ 5.0"
  } else if (estimated_sigma >= 3.0) {
    recommendation = "Close to threshold - consider increasing shots or grid density"
    achievable_config = generateUltraDense(
      config.center_us,
      0.8,
      Math.max(101, config.tau_points.length * 2),
      Math.max(20000, config.shots_per_point * 2)
    )
  } else {
    recommendation = "Significant gap - need denser grid and more shots"
    achievable_config = SWEEP_PRESETS.MAX_SIGMA.stage_b()
  }

  return {
    estimated_sigma,
    confidence_interval: [ci_low, ci_high],
    recommendation,
    achievable_with_config: achievable_config,
  }
}

// === COST ESTIMATION ===

export interface CostEstimate {
  total_shots: number
  estimated_queue_minutes_ibm: number
  estimated_queue_minutes_ionq: number
  credits_ibm: number
  credits_aws: number
}

/**
 * Estimate resource costs for a sweep configuration
 */
export function estimateCost(config: TauSweepConfig): CostEstimate {
  // IBM Quantum (free tier has limits, paid has credits)
  // Rough estimate: ~10min queue per 100k shots on popular backends
  const estimated_queue_minutes_ibm = (config.total_shots / 100000) * 10

  // IonQ via AWS Braket
  // $0.01 per shot on IonQ Aria (approximate)
  const ionq_cost_per_shot = 0.01
  const credits_aws = config.total_shots * ionq_cost_per_shot

  // IBM credits (if applicable)
  const credits_ibm = Math.ceil(config.total_shots / 1000)

  return {
    total_shots: config.total_shots,
    estimated_queue_minutes_ibm,
    estimated_queue_minutes_ionq: config.total_shots * 0.001, // IonQ is faster but expensive
    credits_ibm,
    credits_aws,
  }
}

// === EXPORT TYPES ===
export type SweepStage = "A" | "B"
export type PresetName = keyof typeof SWEEP_PRESETS
