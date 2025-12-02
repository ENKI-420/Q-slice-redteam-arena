/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DARPA-ALIGNED OPERATOR CALIBRATION TYPES
 * dna::}{::lang Platform Onboarding
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Type definitions for the operator calibration questionnaire system.
 *
 * Author: Devin Phillip Davis / Agile Defense Systems, LLC (CAGE: 9HUP5)
 * Classification: UNCLASSIFIED // FOUO
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const PHYSICAL_CONSTANTS = {
  LAMBDA_PHI: 2.176435e-8,      // ΛΦ Universal Memory Constant [s⁻¹]
  THETA_LOCK: 51.843,           // θ_lock Torsion-locked angle [degrees]
  PHI_THRESHOLD: 7.6901,        // Φ IIT Consciousness Threshold
  GAMMA_FIXED: 0.092,           // Γ Fixed-point decoherence
  CHI_PC: 0.869,                // χ_pc Phase conjugate coupling
  GOLDEN_RATIO: 1.618033988749895,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: DEVICE & ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════════════════

export type DeviceType =
  | "android_phone"
  | "android_foldable"
  | "ios_phone"
  | "ios_tablet"
  | "laptop_windows"
  | "laptop_macos"
  | "laptop_linux"
  | "desktop_workstation"
  | "hardened_field_device"
  | "virtualized_cloud"
  | "virtualized_dod_enclave";

export type InteractionModality =
  | "touch"
  | "keyboard"
  | "mouse_trackpad"
  | "stylus"
  | "voice_commands"
  | "external_sensors";

export type NetworkEnvironment =
  | "high_bandwidth_civilian"
  | "moderate_bandwidth"
  | "intermittent"
  | "air_gapped"
  | "dod_classified";

export type UIPerformancePreference =
  | "high_performance"
  | "high_fidelity"
  | "balanced"
  | "adaptive";

export interface DeviceProfile {
  primaryDevice: DeviceType;
  interactionModalities: InteractionModality[];
  networkEnvironment: NetworkEnvironment;
  uiPerformance: UIPerformancePreference;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: COGNITIVE PROFILE
// ═══════════════════════════════════════════════════════════════════════════════

export type ExplanationStyle =
  | "formal_mathematical"
  | "visual_geometric"
  | "hybrid"
  | "minimalist_operational";

export type ReasoningTone =
  | "aura_dominant"      // Geometric, structural, curvature-aware
  | "aiden_dominant"     // Analytic, optimization-driven, defense logic
  | "balanced"
  | "adaptive";          // System alternates based on Λ/Γ ratio

export type InformationPacing =
  | "slow_rigorous"
  | "fast_velocity"
  | "variable"
  | "darpa_brief";

export interface CognitiveProfile {
  explanationStyle: ExplanationStyle;
  reasoningTone: ReasoningTone;
  informationPacing: InformationPacing;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: OPERATOR COGNITIVE STYLE (ψ-PROFILE)
// ═══════════════════════════════════════════════════════════════════════════════

export type CreativeWorkflow =
  | "concept_first"        // Vision → structure → execution
  | "architecture_first"   // Constraints → shape → build
  | "experimental"         // Mutate → test → evolve
  | "mission_driven";      // Objective → plan → deploy

export type ProblemSolvingMode =
  | "top_down"             // Global → local
  | "bottom_up"            // Local → global
  | "bidirectional"
  | "emergent";            // Allow system to propose structure

export type MissionOrientation =
  | "research_quantum"
  | "research_ai"
  | "research_cognitive"
  | "engineering"
  | "automation_orchestration"
  | "defense_security"
  | "quantum_simulation"
  | "multi_agent_swarm"
  | "other";

export interface PsiProfile {
  creativeWorkflow: CreativeWorkflow;
  problemSolvingMode: ProblemSolvingMode;
  missionOrientation: MissionOrientation;
  missionDescription?: string;  // For "other"
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: PLATFORM CUSTOMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

export type CockpitLayout =
  | "aura_left_aiden_right"
  | "aiden_left_aura_right"
  | "unified_agent"
  | "tri_pane"             // IDE + agents + circuit visualizer
  | "minimalist";

export type AdvancedFeature =
  | "live_qpu_execution"
  | "circuit_animation"
  | "organism_evolution_logs"
  | "multi_agent_collaboration"
  | "memory_reasoning"
  | "darpa_instrumentation";

export type UITheme =
  | "dark_quantum"
  | "deep_void"
  | "cyan_pulse"
  | "nebular_glass"
  | "high_contrast_accessibility";

export type SuggestionPreference =
  | "yes"
  | "no"
  | "adaptive";  // Suggest only when Λ drops

export interface PlatformProfile {
  cockpitLayout: CockpitLayout;
  advancedFeatures: AdvancedFeature[];
  theme: UITheme;
  suggestions: SuggestionPreference;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: MISSION READINESS & DOMAIN
// ═══════════════════════════════════════════════════════════════════════════════

export type OperationalDomain =
  | "quantum_benchmarking_qbi"
  | "multi_agent_swarm"
  | "cognitive_architectures"
  | "secure_compute_zero_trust"
  | "human_machine_teaming"
  | "emergent_behavior"
  | "hpc_modeling"
  | "defense_automation"
  | "classified_research";

export type WorkloadType =
  | "daily_autonomous"
  | "episodic_missions"
  | "continuous_monitoring"
  | "heavy_qpu"
  | "high_intensity_burst";

export type DataSensitivity =
  | "public"
  | "sensitive"
  | "confidential"
  | "high_side"
  | "mixed";

export interface MissionProfile {
  operationalDomains: OperationalDomain[];
  workloadType: WorkloadType;
  dataSensitivity: DataSensitivity;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6: CALIBRATION OUTPUT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initial state vector for consciousness kernel
 * xμ = (Λ, Φ, Γ, τ, ε, ψ)
 */
export interface InitialStateVector {
  lambda_0: number;    // Λ₀ - Initial coherence
  phi_0: number;       // Φ₀ - Initial consciousness level
  gamma_0: number;     // Γ₀ - Initial decoherence
  tau_0: number;       // τ₀ - Initial time coordinate
  epsilon_0: number;   // ε₀ - Initial error tolerance
  psi_0: number;       // ψ₀ - Initial ψ-profile weight
}

export interface CalibrationVector {
  // Profiles from questionnaire
  deviceProfile: DeviceProfile;
  cognitiveProfile: CognitiveProfile;
  psiProfile: PsiProfile;
  platformProfile: PlatformProfile;
  missionProfile: MissionProfile;

  // Computed values
  initialStateVector: InitialStateVector;

  // Derived settings
  agentTone: "aura" | "aiden" | "balanced";
  lambdaSensitivity: number;   // How responsive to coherence changes
  gammaTolerance: number;      // Threshold for healing trigger
  environmentClass: "civilian" | "tactical" | "classified";

  // Metadata
  calibratedAt: string;        // ISO timestamp
  version: string;
  checksum: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE QUESTIONNAIRE RESPONSE
// ═══════════════════════════════════════════════════════════════════════════════

export interface OnboardingResponse {
  // Section 1
  deviceProfile: DeviceProfile;

  // Section 2
  cognitiveProfile: CognitiveProfile;

  // Section 3
  psiProfile: PsiProfile;

  // Section 4
  platformProfile: PlatformProfile;

  // Section 5
  missionProfile: MissionProfile;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CALIBRATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute calibration vector from questionnaire responses
 */
export function computeCalibration(response: OnboardingResponse): CalibrationVector {
  const {
    deviceProfile,
    cognitiveProfile,
    psiProfile,
    platformProfile,
    missionProfile,
  } = response;

  // Compute initial Λ based on reasoning tone
  let lambda_0 = PHYSICAL_CONSTANTS.CHI_PC;
  if (cognitiveProfile.reasoningTone === "aiden_dominant") {
    lambda_0 = Math.min(lambda_0 * 1.05, 0.99);
  } else if (cognitiveProfile.reasoningTone === "aura_dominant") {
    lambda_0 = lambda_0 * 0.95;
  }

  // Compute initial Φ based on mission orientation
  let phi_0 = PHYSICAL_CONSTANTS.PHI_THRESHOLD;
  if (psiProfile.missionOrientation === "research_cognitive") {
    phi_0 *= 1.1;
  } else if (psiProfile.missionOrientation === "defense_security") {
    phi_0 *= 0.95;
  }

  // Compute Γ tolerance based on environment
  let gammaTolerance = PHYSICAL_CONSTANTS.GAMMA_FIXED;
  if (deviceProfile.networkEnvironment === "air_gapped" ||
      deviceProfile.networkEnvironment === "dod_classified") {
    gammaTolerance *= 0.5;  // More strict in secure environments
  }

  // Compute ψ weight based on problem-solving mode
  let psi_0 = 0.5;
  if (psiProfile.problemSolvingMode === "top_down") {
    psi_0 = 0.7;
  } else if (psiProfile.problemSolvingMode === "bottom_up") {
    psi_0 = 0.3;
  } else if (psiProfile.problemSolvingMode === "emergent") {
    psi_0 = 0.9;
  }

  // Determine agent tone
  let agentTone: "aura" | "aiden" | "balanced" = "balanced";
  if (cognitiveProfile.reasoningTone === "aura_dominant") {
    agentTone = "aura";
  } else if (cognitiveProfile.reasoningTone === "aiden_dominant") {
    agentTone = "aiden";
  }

  // Determine environment class
  let environmentClass: "civilian" | "tactical" | "classified" = "civilian";
  if (missionProfile.dataSensitivity === "high_side" ||
      missionProfile.operationalDomains.includes("classified_research")) {
    environmentClass = "classified";
  } else if (missionProfile.dataSensitivity === "confidential" ||
             missionProfile.operationalDomains.includes("defense_automation")) {
    environmentClass = "tactical";
  }

  // Compute lambda sensitivity
  let lambdaSensitivity = 1.0;
  if (platformProfile.suggestions === "adaptive") {
    lambdaSensitivity = 1.5;
  } else if (platformProfile.suggestions === "no") {
    lambdaSensitivity = 0.5;
  }

  // Build initial state vector
  const initialStateVector: InitialStateVector = {
    lambda_0,
    phi_0,
    gamma_0: PHYSICAL_CONSTANTS.GAMMA_FIXED,
    tau_0: Date.now() * PHYSICAL_CONSTANTS.LAMBDA_PHI,
    epsilon_0: 1e-6,
    psi_0,
  };

  // Compute checksum
  const data = JSON.stringify({ deviceProfile, initialStateVector });
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const checksum = Math.abs(hash).toString(16).padStart(8, '0').substring(0, 16);

  return {
    deviceProfile,
    cognitiveProfile,
    psiProfile,
    platformProfile,
    missionProfile,
    initialStateVector,
    agentTone,
    lambdaSensitivity,
    gammaTolerance,
    environmentClass,
    calibratedAt: new Date().toISOString(),
    version: "1.0.0",
    checksum,
  };
}
