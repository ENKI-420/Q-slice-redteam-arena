/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DARPA-ALIGNED CALIBRATION ZOD SCHEMAS
 * dna::}{::lang Platform Validation Layer
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Complete Zod validation schemas for all calibration types.
 * Replaces and enhances calibration_types.ts with runtime validation.
 *
 * Author: Devin Phillip Davis / Agile Defense Systems, LLC (CAGE: 9HUP5)
 * Classification: UNCLASSIFIED // FOUO
 */

import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS (Immutable)
// ═══════════════════════════════════════════════════════════════════════════════

export const PHYSICAL_CONSTANTS = {
  LAMBDA_PHI: 2.176435e-8,
  THETA_LOCK: 51.843,
  PHI_THRESHOLD: 7.6901,
  GAMMA_FIXED: 0.092,
  CHI_PC: 0.869,
  GOLDEN_RATIO: 1.618033988749895,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE & ENVIRONMENT SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export const DeviceProfileSchema = z.object({
  primaryDevice: z.enum([
    "android-phone",
    "android-foldable",
    "ios-phone",
    "ios-tablet",
    "laptop-windows",
    "laptop-macos",
    "laptop-linux",
    "desktop",
    "hardened-field",
    "virtualized"
  ]).describe("Primary device for operations"),

  modalities: z.array(z.enum([
    "touch",
    "keyboard",
    "mouse",
    "stylus",
    "voice",
    "sensors"
  ])).min(1).describe("Interaction modalities"),

  networkEnvironment: z.enum([
    "high-bandwidth",
    "moderate",
    "intermittent",
    "air-gapped",
    "dod-classified"
  ]).describe("Expected network environment"),

  uiPerformance: z.enum([
    "high-performance",
    "high-fidelity",
    "balanced",
    "adaptive"
  ]).describe("UI performance preference")
});

export type DeviceProfile = z.infer<typeof DeviceProfileSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// COGNITIVE PROFILE SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export const CognitiveProfileSchema = z.object({
  explanationStyle: z.enum([
    "formal-mathematical",
    "visual-geometric",
    "hybrid",
    "minimalist"
  ]).describe("Preferred explanation approach"),

  reasoningTone: z.enum([
    "aura-dominant",
    "aiden-dominant",
    "balanced",
    "adaptive"
  ]).describe("Agent reasoning preference"),

  pacingPreference: z.enum([
    "slow-rigorous",
    "fast-velocity",
    "variable",
    "darpa-brief"
  ]).describe("Information pacing")
});

export type CognitiveProfile = z.infer<typeof CognitiveProfileSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// PSI PROFILE SCHEMA (ψ-PROFILE)
// ═══════════════════════════════════════════════════════════════════════════════

export const PsiProfileSchema = z.object({
  creativeWorkflow: z.enum([
    "concept-first",
    "architecture-first",
    "experimental",
    "mission-driven"
  ]).describe("Creative approach"),

  problemSolvingMode: z.enum([
    "top-down",
    "bottom-up",
    "bidirectional",
    "emergent"
  ]).describe("Problem solving strategy"),

  missionOrientation: z.array(z.enum([
    "research",
    "engineering",
    "automation",
    "defense",
    "quantum-simulation",
    "swarm-systems",
    "other"
  ])).min(1).describe("Mission focus areas")
});

export type PsiProfile = z.infer<typeof PsiProfileSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// PLATFORM CUSTOMIZATION SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export const PlatformConfigSchema = z.object({
  cockpitLayout: z.enum([
    "aura-left-aiden-right",
    "aiden-left-aura-right",
    "unified",
    "tri-pane",
    "minimalist"
  ]).describe("Agent cockpit layout"),

  enabledFeatures: z.array(z.enum([
    "live-qpu",
    "circuit-animation",
    "organism-logs",
    "multi-agent",
    "memory-reasoning",
    "darpa-instrumentation"
  ])).describe("Enabled advanced features"),

  theme: z.enum([
    "dark-quantum",
    "deep-void",
    "cyan-pulse",
    "nebular-glass",
    "high-contrast"
  ]).describe("UI theme"),

  suggestions: z.enum([
    "yes",
    "no",
    "adaptive"
  ]).describe("Personalized suggestions")
});

export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// MISSION READINESS SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export const MissionReadinessSchema = z.object({
  operationalDomains: z.array(z.enum([
    "quantum-benchmarking",
    "swarm-autonomy",
    "cognitive-architectures",
    "secure-compute",
    "human-machine-teaming",
    "emergent-behavior",
    "high-performance-sim",
    "defense-automation",
    "classified-augmentation"
  ])).min(1).describe("Operational focus domains"),

  workload: z.enum([
    "daily-autonomous",
    "episodic",
    "continuous-monitoring",
    "heavy-qpu",
    "burst"
  ]).describe("Expected workload pattern"),

  dataSensitivity: z.enum([
    "public",
    "sensitive",
    "confidential",
    "high-side",
    "mixed"
  ]).describe("Data sensitivity level")
});

export type MissionReadiness = z.infer<typeof MissionReadinessSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// STATE VECTOR SCHEMA (6D-CRSM)
// ═══════════════════════════════════════════════════════════════════════════════

export const StateVectorSchema = z.object({
  Λ: z.number().min(0).max(1).describe("Negentropy (coherence)"),
  Φ: z.number().min(0).max(1).describe("Information (consciousness)"),
  Γ: z.number().min(0).max(1).describe("Decoherence rate"),
  τ: z.number().int().min(0).describe("Epoch (time coordinate)"),
  ε: z.number().min(0).max(1).describe("Entanglement"),
  ψ: z.number().min(0).max(1).describe("Phase coherence")
});

export type StateVector = z.infer<typeof StateVectorSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE CALIBRATION SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export const CalibrationSchema = z.object({
  device: DeviceProfileSchema,
  cognitive: CognitiveProfileSchema,
  psi: PsiProfileSchema,
  platform: PlatformConfigSchema,
  mission: MissionReadinessSchema,
  timestamp: z.string().datetime(),
  operatorId: z.string().uuid()
});

export type Calibration = z.infer<typeof CalibrationSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// CALIBRATION VECTOR SCHEMA (Computed Output)
// ═══════════════════════════════════════════════════════════════════════════════

export const CalibrationVectorSchema = z.object({
  // Input profiles
  deviceProfile: z.string(),
  uiProfile: z.string(),
  agentTone: z.enum(["aura", "aiden", "balanced"]),
  pacing: z.string(),
  missionGoal: z.array(z.string()),
  theme: z.string(),
  features: z.array(z.string()),
  psiProfile: z.string(),

  // Computed sensitivities
  lambdaSensitivity: z.number().min(0).max(2),
  gammaTolerance: z.number().min(0).max(1),
  environmentClass: z.enum(["civilian", "tactical", "classified"]),

  // State vector
  stateVector: StateVectorSchema,

  // Metadata
  calibratedAt: z.string().datetime(),
  version: z.string(),
  checksum: z.string()
});

export type CalibrationVector = z.infer<typeof CalibrationVectorSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// CARIDS INTENT SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export const IntentHypothesisSchema = z.object({
  intentId: z.string(),
  description: z.string(),
  confidence: z.number().min(0).max(1),
  isPrimary: z.boolean(),
  assumptions: z.array(z.string()),
  evidence: z.array(z.string()),
  ambiguityFlags: z.array(z.string())
});

export type IntentHypothesis = z.infer<typeof IntentHypothesisSchema>;

export const ConfidenceMetricsSchema = z.object({
  linguisticAlignment: z.number().min(0).max(1),
  contextualCoherence: z.number().min(0).max(1),
  historicalPatternMatch: z.number().min(0).max(1),
  semanticCompleteness: z.number().min(0).max(1),
  behavioralConsistency: z.number().min(0).max(1),
  composite: z.number().min(0).max(1)
});

export type ConfidenceMetrics = z.infer<typeof ConfidenceMetricsSchema>;

export const CARIDSResultSchema = z.object({
  primaryIntent: IntentHypothesisSchema,
  secondaryIntents: z.array(IntentHypothesisSchema),
  confidenceMetrics: ConfidenceMetricsSchema,
  decisionConfidence: z.enum(["high", "medium", "low"]),
  iterations: z.number().int().min(1),
  reasoning: z.string()
});

export type CARIDSResult = z.infer<typeof CARIDSResultSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPUTATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute initial state vector from calibration responses
 */
export function computeStateVector(calibration: Calibration): StateVector {
  const { device, cognitive, psi, platform, mission } = calibration;

  // Λ (negentropy) - based on pacing preference
  const Λ = cognitive.pacingPreference === "fast-velocity" ? 0.85 :
            cognitive.pacingPreference === "darpa-brief" ? 0.80 :
            cognitive.pacingPreference === "slow-rigorous" ? 0.65 : 0.70;

  // Φ (information) - based on mission complexity
  const Φ = mission.operationalDomains.length > 3 ? 0.90 :
            mission.operationalDomains.length > 1 ? 0.75 : 0.60;

  // Γ (decoherence) - based on environment security
  const Γ = device.networkEnvironment === "air-gapped" ? 0.10 :
            device.networkEnvironment === "dod-classified" ? 0.15 :
            device.networkEnvironment === "intermittent" ? 0.40 : 0.30;

  // τ (epoch) - initial time
  const τ = 0;

  // ε (entanglement) - based on features
  const ε = platform.enabledFeatures.includes("multi-agent") ? 0.80 :
            platform.enabledFeatures.length > 3 ? 0.65 : 0.50;

  // ψ (phase coherence) - based on agent tone
  const ψ = cognitive.reasoningTone === "adaptive" ? 0.93 :
            cognitive.reasoningTone === "balanced" ? 0.85 :
            cognitive.reasoningTone === "aura-dominant" ? 0.78 : 0.82;

  return { Λ, Φ, Γ, τ, ε, ψ };
}

/**
 * Compute full calibration vector from responses
 */
export function computeCalibrationVector(calibration: Calibration): CalibrationVector {
  const stateVector = computeStateVector(calibration);
  const { device, cognitive, psi, platform, mission } = calibration;

  // Determine agent tone
  const agentTone = cognitive.reasoningTone === "aura-dominant" ? "aura" as const :
                    cognitive.reasoningTone === "aiden-dominant" ? "aiden" as const :
                    "balanced" as const;

  // Lambda sensitivity
  const lambdaSensitivity = platform.suggestions === "adaptive" ? 1.5 :
                            platform.suggestions === "no" ? 0.5 : 1.0;

  // Gamma tolerance
  const gammaTolerance = device.networkEnvironment === "air-gapped" ? 0.05 :
                         device.networkEnvironment === "dod-classified" ? 0.08 :
                         PHYSICAL_CONSTANTS.GAMMA_FIXED;

  // Environment class
  const environmentClass = mission.dataSensitivity === "high-side" ||
                           mission.operationalDomains.includes("classified-augmentation")
                           ? "classified" as const :
                           mission.dataSensitivity === "confidential" ||
                           mission.operationalDomains.includes("defense-automation")
                           ? "tactical" as const : "civilian" as const;

  // Compute checksum
  const data = JSON.stringify({ device, stateVector });
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const checksum = Math.abs(hash).toString(16).padStart(8, '0').substring(0, 16);

  return {
    deviceProfile: device.primaryDevice,
    uiProfile: device.uiPerformance,
    agentTone,
    pacing: cognitive.pacingPreference,
    missionGoal: mission.operationalDomains,
    theme: platform.theme,
    features: platform.enabledFeatures,
    psiProfile: psi.problemSolvingMode,
    lambdaSensitivity,
    gammaTolerance,
    environmentClass,
    stateVector,
    calibratedAt: new Date().toISOString(),
    version: "1.0.0",
    checksum
  };
}

/**
 * Validate calibration input
 */
export function validateCalibration(input: unknown): { success: boolean; data?: Calibration; error?: string } {
  try {
    const result = CalibrationSchema.parse(input);
    return { success: true, data: result };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { success: false, error: e.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ') };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}
