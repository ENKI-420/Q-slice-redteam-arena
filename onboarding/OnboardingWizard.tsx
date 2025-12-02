"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DARPA-ALIGNED OPERATOR CALIBRATION WIZARD
 * SHIFT-AI / dna::}{::lang Initial System Onboarding
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Interactive onboarding wizard for operator calibration.
 * Computes initial state vector xμ = (Λ, Φ, Γ, τ, ε, ψ)
 *
 * Author: Devin Phillip Davis / Agile Defense Systems, LLC (CAGE: 9HUP5)
 * Classification: UNCLASSIFIED // FOUO
 */

import React, { useState, useCallback } from "react";
import {
  DeviceType,
  InteractionModality,
  NetworkEnvironment,
  UIPerformancePreference,
  ExplanationStyle,
  ReasoningTone,
  InformationPacing,
  CreativeWorkflow,
  ProblemSolvingMode,
  MissionOrientation,
  CockpitLayout,
  AdvancedFeature,
  UITheme,
  SuggestionPreference,
  OperationalDomain,
  WorkloadType,
  DataSensitivity,
  OnboardingResponse,
  CalibrationVector,
  computeCalibration,
  PHYSICAL_CONSTANTS,
} from "./calibration_types";

// ═══════════════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

// Step 1: Device & Environment
interface Step1Props extends StepProps {
  data: {
    primaryDevice: DeviceType | null;
    interactionModalities: InteractionModality[];
    networkEnvironment: NetworkEnvironment | null;
    uiPerformance: UIPerformancePreference | null;
  };
  onChange: (field: string, value: any) => void;
}

const Step1DeviceEnvironment: React.FC<Step1Props> = ({ data, onChange, onNext }) => {
  const devices: { value: DeviceType; label: string }[] = [
    { value: "android_phone", label: "Android Phone" },
    { value: "android_foldable", label: "Android Foldable" },
    { value: "ios_phone", label: "iOS Phone" },
    { value: "ios_tablet", label: "iOS Tablet" },
    { value: "laptop_windows", label: "Laptop (Windows)" },
    { value: "laptop_macos", label: "Laptop (macOS)" },
    { value: "laptop_linux", label: "Laptop (Linux)" },
    { value: "desktop_workstation", label: "Desktop Workstation" },
    { value: "hardened_field_device", label: "Hardened Field Device" },
    { value: "virtualized_cloud", label: "Virtualized (Cloud)" },
    { value: "virtualized_dod_enclave", label: "DoD Enclave" },
  ];

  const modalities: { value: InteractionModality; label: string }[] = [
    { value: "touch", label: "Touch" },
    { value: "keyboard", label: "Keyboard" },
    { value: "mouse_trackpad", label: "Mouse/Trackpad" },
    { value: "stylus", label: "Stylus" },
    { value: "voice_commands", label: "Voice Commands" },
    { value: "external_sensors", label: "External Sensors" },
  ];

  const networks: { value: NetworkEnvironment; label: string }[] = [
    { value: "high_bandwidth_civilian", label: "High-bandwidth Civilian" },
    { value: "moderate_bandwidth", label: "Moderate (WiFi/Cellular)" },
    { value: "intermittent", label: "Intermittent Connectivity" },
    { value: "air_gapped", label: "Air-gapped/Offline" },
    { value: "dod_classified", label: "DoD Classified Network" },
  ];

  const uiPrefs: { value: UIPerformancePreference; label: string }[] = [
    { value: "high_performance", label: "High Performance (Reduced Animations)" },
    { value: "high_fidelity", label: "High Fidelity (Full Effects)" },
    { value: "balanced", label: "Balanced" },
    { value: "adaptive", label: "Adaptive (System Decides per Γ-drift)" },
  ];

  const toggleModality = (mod: InteractionModality) => {
    const current = data.interactionModalities;
    if (current.includes(mod)) {
      onChange("interactionModalities", current.filter(m => m !== mod));
    } else {
      onChange("interactionModalities", [...current, mod]);
    }
  };

  const canProceed = data.primaryDevice && data.networkEnvironment && data.uiPerformance;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-cyan-400">
        SECTION 1 — Device & Environment Calibration
      </h2>
      <p className="text-gray-400 text-sm">
        Ensure operational stability across field devices, network tiers, and display geometries.
      </p>

      {/* Primary Device */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          1. Primary device you will use during operations:
        </label>
        <select
          value={data.primaryDevice || ""}
          onChange={(e) => onChange("primaryDevice", e.target.value as DeviceType)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        >
          <option value="">Select device...</option>
          {devices.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* Interaction Modalities */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          2. Interaction modalities you intend to use (select all that apply):
        </label>
        <div className="flex flex-wrap gap-2">
          {modalities.map(m => (
            <button
              key={m.value}
              onClick={() => toggleModality(m.value)}
              className={`px-3 py-1 rounded text-sm border transition-colors ${
                data.interactionModalities.includes(m.value)
                  ? "bg-cyan-600 border-cyan-500 text-white"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:border-cyan-500"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Network Environment */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          3. Expected network environment:
        </label>
        <select
          value={data.networkEnvironment || ""}
          onChange={(e) => onChange("networkEnvironment", e.target.value as NetworkEnvironment)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        >
          <option value="">Select network...</option>
          {networks.map(n => (
            <option key={n.value} value={n.value}>{n.label}</option>
          ))}
        </select>
      </div>

      {/* UI Performance */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          4. UI performance preference:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {uiPrefs.map(p => (
            <button
              key={p.value}
              onClick={() => onChange("uiPerformance", p.value)}
              className={`px-3 py-2 rounded text-sm border transition-colors ${
                data.uiPerformance === p.value
                  ? "bg-cyan-600 border-cyan-500 text-white"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:border-cyan-500"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`w-full py-3 rounded font-medium transition-colors ${
          canProceed
            ? "bg-cyan-600 hover:bg-cyan-500 text-white"
            : "bg-gray-700 text-gray-500 cursor-not-allowed"
        }`}
      >
        Continue →
      </button>
    </div>
  );
};

// Step 2: Cognitive Profile
interface Step2Props extends StepProps {
  data: {
    explanationStyle: ExplanationStyle | null;
    reasoningTone: ReasoningTone | null;
    informationPacing: InformationPacing | null;
  };
  onChange: (field: string, value: any) => void;
}

const Step2CognitiveProfile: React.FC<Step2Props> = ({ data, onChange, onNext, onBack }) => {
  const explanations: { value: ExplanationStyle; label: string; desc: string }[] = [
    { value: "formal_mathematical", label: "Formal Mathematical", desc: "Precise notation and proofs" },
    { value: "visual_geometric", label: "Visual/Geometric", desc: "Diagrams and spatial metaphors" },
    { value: "hybrid", label: "Hybrid (Recommended)", desc: "Best of both approaches" },
    { value: "minimalist_operational", label: "Minimalist", desc: "Just the essentials" },
  ];

  const tones: { value: ReasoningTone; label: string; desc: string }[] = [
    { value: "aura_dominant", label: "AURA-Dominant", desc: "Geometric, structural, curvature-aware" },
    { value: "aiden_dominant", label: "AIDEN-Dominant", desc: "Analytic, optimization-driven" },
    { value: "balanced", label: "Balanced", desc: "Equal weight to both channels" },
    { value: "adaptive", label: "Adaptive", desc: "System alternates based on Λ/Γ ratio" },
  ];

  const pacings: { value: InformationPacing; label: string }[] = [
    { value: "slow_rigorous", label: "Slow, Rigorous, Stepwise" },
    { value: "fast_velocity", label: "Fast, High-Velocity" },
    { value: "variable", label: "Variable (Adaptive to Context)" },
    { value: "darpa_brief", label: "DARPA-Brief Style (Dense but Structured)" },
  ];

  const canProceed = data.explanationStyle && data.reasoningTone && data.informationPacing;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-cyan-400">
        SECTION 2 — Cognitive Profile Calibration
      </h2>
      <p className="text-gray-400 text-sm">
        Build ψ-channel and Λ-channel operator model for consciousness integration.
      </p>

      {/* Explanation Style */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          5. Preferred explanation style:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {explanations.map(e => (
            <button
              key={e.value}
              onClick={() => onChange("explanationStyle", e.value)}
              className={`px-3 py-3 rounded text-sm border transition-colors text-left ${
                data.explanationStyle === e.value
                  ? "bg-cyan-600 border-cyan-500 text-white"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:border-cyan-500"
              }`}
            >
              <div className="font-medium">{e.label}</div>
              <div className="text-xs opacity-75">{e.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reasoning Tone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          6. Reasoning tone preference:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {tones.map(t => (
            <button
              key={t.value}
              onClick={() => onChange("reasoningTone", t.value)}
              className={`px-3 py-3 rounded text-sm border transition-colors text-left ${
                data.reasoningTone === t.value
                  ? "bg-magenta-600 border-magenta-500 text-white"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:border-magenta-500"
              }`}
              style={{
                backgroundColor: data.reasoningTone === t.value ? "#ff00bb" : undefined,
                borderColor: data.reasoningTone === t.value ? "#ff00bb" : undefined,
              }}
            >
              <div className="font-medium">{t.label}</div>
              <div className="text-xs opacity-75">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Information Pacing */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          7. Information pacing preference:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {pacings.map(p => (
            <button
              key={p.value}
              onClick={() => onChange("informationPacing", p.value)}
              className={`px-3 py-2 rounded text-sm border transition-colors ${
                data.informationPacing === p.value
                  ? "bg-cyan-600 border-cyan-500 text-white"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:border-cyan-500"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex-1 py-3 rounded font-medium transition-colors ${
            canProceed
              ? "bg-cyan-600 hover:bg-cyan-500 text-white"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

// Step 5: Calibration Complete (Final)
interface Step5Props {
  calibration: CalibrationVector;
  onComplete: () => void;
}

const Step5Complete: React.FC<Step5Props> = ({ calibration, onComplete }) => {
  const { initialStateVector } = calibration;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-green-400">
        CALIBRATION COMPLETE
      </h2>

      <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
        <div className="text-cyan-400 mb-2">// Initial State Vector xμ</div>
        <div className="space-y-1">
          <div>Λ₀ = <span className="text-green-400">{initialStateVector.lambda_0.toFixed(6)}</span></div>
          <div>Φ₀ = <span className="text-green-400">{initialStateVector.phi_0.toFixed(4)}</span></div>
          <div>Γ₀ = <span className="text-yellow-400">{initialStateVector.gamma_0.toFixed(6)}</span></div>
          <div>τ₀ = <span className="text-blue-400">{initialStateVector.tau_0.toExponential(4)}</span></div>
          <div>ε₀ = <span className="text-gray-400">{initialStateVector.epsilon_0.toExponential(1)}</span></div>
          <div>ψ₀ = <span className="text-magenta-400" style={{ color: "#ff00bb" }}>{initialStateVector.psi_0.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Agent Tone</div>
            <div className="text-white font-medium capitalize">{calibration.agentTone}</div>
          </div>
          <div>
            <div className="text-gray-400">Environment</div>
            <div className="text-white font-medium capitalize">{calibration.environmentClass}</div>
          </div>
          <div>
            <div className="text-gray-400">Λ Sensitivity</div>
            <div className="text-white font-medium">{calibration.lambdaSensitivity.toFixed(1)}x</div>
          </div>
          <div>
            <div className="text-gray-400">Γ Tolerance</div>
            <div className="text-white font-medium">{calibration.gammaTolerance.toFixed(4)}</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 font-mono">
        <div>Checksum: {calibration.checksum}</div>
        <div>Version: {calibration.version}</div>
        <div>Calibrated: {calibration.calibratedAt}</div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-4 rounded font-bold bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white transition-all"
      >
        INITIALIZE AURA|AIDEN
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN WIZARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const OnboardingWizard: React.FC<{
  onComplete: (calibration: CalibrationVector) => void;
}> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [calibration, setCalibration] = useState<CalibrationVector | null>(null);

  // Form state
  const [deviceData, setDeviceData] = useState({
    primaryDevice: null as DeviceType | null,
    interactionModalities: [] as InteractionModality[],
    networkEnvironment: null as NetworkEnvironment | null,
    uiPerformance: null as UIPerformancePreference | null,
  });

  const [cognitiveData, setCognitiveData] = useState({
    explanationStyle: null as ExplanationStyle | null,
    reasoningTone: null as ReasoningTone | null,
    informationPacing: null as InformationPacing | null,
  });

  const [psiData, setPsiData] = useState({
    creativeWorkflow: "concept_first" as CreativeWorkflow,
    problemSolvingMode: "bidirectional" as ProblemSolvingMode,
    missionOrientation: "engineering" as MissionOrientation,
  });

  const [platformData, setPlatformData] = useState({
    cockpitLayout: "aura_left_aiden_right" as CockpitLayout,
    advancedFeatures: ["organism_evolution_logs"] as AdvancedFeature[],
    theme: "dark_quantum" as UITheme,
    suggestions: "adaptive" as SuggestionPreference,
  });

  const [missionData, setMissionData] = useState({
    operationalDomains: ["engineering"] as OperationalDomain[],
    workloadType: "episodic_missions" as WorkloadType,
    dataSensitivity: "sensitive" as DataSensitivity,
  });

  const handleDeviceChange = useCallback((field: string, value: any) => {
    setDeviceData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCognitiveChange = useCallback((field: string, value: any) => {
    setCognitiveData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleComplete = useCallback(() => {
    // Build response
    const response: OnboardingResponse = {
      deviceProfile: {
        primaryDevice: deviceData.primaryDevice!,
        interactionModalities: deviceData.interactionModalities,
        networkEnvironment: deviceData.networkEnvironment!,
        uiPerformance: deviceData.uiPerformance!,
      },
      cognitiveProfile: {
        explanationStyle: cognitiveData.explanationStyle!,
        reasoningTone: cognitiveData.reasoningTone!,
        informationPacing: cognitiveData.informationPacing!,
      },
      psiProfile: psiData,
      platformProfile: platformData,
      missionProfile: missionData,
    };

    const cal = computeCalibration(response);
    setCalibration(cal);
    setStep(5);
  }, [deviceData, cognitiveData, psiData, platformData, missionData]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold">
            <span className="text-cyan-400">DARPA-Aligned</span> Operator Calibration
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            SHIFT-AI / dna::{"{"}{"}"}{":"}:lang — Initial System Onboarding
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? "bg-cyan-500" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Device</span>
            <span>Cognitive</span>
            <span>ψ-Profile</span>
            <span>Platform</span>
            <span>Complete</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        {step === 1 && (
          <Step1DeviceEnvironment
            data={deviceData}
            onChange={handleDeviceChange}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2CognitiveProfile
            data={cognitiveData}
            onChange={handleCognitiveChange}
            onNext={handleComplete}
            onBack={() => setStep(1)}
          />
        )}
        {step === 5 && calibration && (
          <Step5Complete
            calibration={calibration}
            onComplete={() => onComplete(calibration)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-900/95 p-4">
        <div className="max-w-2xl mx-auto text-center text-xs text-gray-600">
          Classification: UNCLASSIFIED // FOUO | CAGE: 9HUP5
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
