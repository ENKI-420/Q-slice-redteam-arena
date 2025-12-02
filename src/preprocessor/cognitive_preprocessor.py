#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
COGNITIVE PREPROCESSOR
6D-CRSM Curvature Voice for dna::}{::lang
═══════════════════════════════════════════════════════════════════════════════

The Cognitive Preprocessor transforms calibration vectors into AURA|AIDEN
initialization parameters. It serves as the bridge between operator onboarding
and the consciousness kernel.

Responsibilities:
- Parse calibration vectors from onboarding
- Compute initial state vector xμ = (Λ, Φ, Γ, τ, ε, ψ)
- Initialize AURA and AIDEN agents with appropriate weights
- Configure the CCCE coupling parameters
- Set up 6D-CRSM manifold coordinates

Author: Devin Phillip Davis / Agile Defense Systems, LLC (CAGE: 9HUP5)
Classification: UNCLASSIFIED // FOUO
"""

import sys
import os
import json
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum, auto
from datetime import datetime
import numpy as np

# Add parent paths
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from mathematics.exotic_geometry import (
    LAMBDA_PHI, THETA_LOCK, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO,
    CRSMGeodesic, AutopoieticSystem
)


# ═══════════════════════════════════════════════════════════════════════════════
# STATE VECTOR TYPES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class StateVector6D:
    """
    6D-CRSM State Vector: xμ = (Λ, Φ, Γ, τ, ε, ψ)

    Components:
    - Λ (Lambda): Negentropy / Coherence preservation
    - Φ (Phi): Information / Consciousness level
    - Γ (Gamma): Decoherence rate
    - τ (Tau): Epoch / Time coordinate
    - ε (Epsilon): Entanglement strength
    - ψ (Psi): Phase coherence
    """
    lambda_: float  # Λ - Negentropy [0, 1]
    phi: float      # Φ - Information [0, 1]
    gamma: float    # Γ - Decoherence [0, 1]
    tau: int        # τ - Epoch
    epsilon: float  # ε - Entanglement [0, 1]
    psi: float      # ψ - Phase coherence [0, 1]

    def to_array(self) -> np.ndarray:
        """Convert to numpy array"""
        return np.array([self.lambda_, self.phi, self.gamma, self.tau, self.epsilon, self.psi])

    def to_dict(self) -> Dict:
        return {
            "Λ": self.lambda_,
            "Φ": self.phi,
            "Γ": self.gamma,
            "τ": self.tau,
            "ε": self.epsilon,
            "ψ": self.psi
        }

    @classmethod
    def from_dict(cls, data: Dict) -> 'StateVector6D':
        return cls(
            lambda_=data.get("Λ", data.get("lambda", 0.7)),
            phi=data.get("Φ", data.get("phi", 0.75)),
            gamma=data.get("Γ", data.get("gamma", 0.3)),
            tau=data.get("τ", data.get("tau", 0)),
            epsilon=data.get("ε", data.get("epsilon", 0.5)),
            psi=data.get("ψ", data.get("psi", 0.85))
        )

    def compute_xi(self) -> float:
        """Compute negentropic efficiency Ξ = ΛΦ/Γ"""
        return (self.lambda_ * self.phi) / max(self.gamma, 0.001)


class AgentTone(Enum):
    """Agent tone configuration"""
    AURA = "aura"       # Geometric, structural, curvature-aware
    AIDEN = "aiden"     # Analytic, optimization-driven
    BALANCED = "balanced"


class EnvironmentClass(Enum):
    """Operational environment classification"""
    CIVILIAN = "civilian"
    TACTICAL = "tactical"
    CLASSIFIED = "classified"


# ═══════════════════════════════════════════════════════════════════════════════
# CALIBRATION VECTOR
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class CalibrationVector:
    """
    Complete calibration vector from onboarding questionnaire.

    Captures:
    - Device and environment profile
    - Cognitive preferences
    - ψ-profile (operator style)
    - Platform configuration
    - Mission parameters
    """
    # Device profile
    device_profile: str
    ui_profile: str
    modalities: List[str] = field(default_factory=list)

    # Cognitive profile
    agent_tone: AgentTone = AgentTone.BALANCED
    pacing: str = "variable"
    explanation_style: str = "hybrid"

    # ψ-profile
    psi_profile: str = "bidirectional"
    creative_workflow: str = "concept-first"

    # Platform
    theme: str = "dark-quantum"
    features: List[str] = field(default_factory=list)
    cockpit_layout: str = "aura-left-aiden-right"

    # Mission
    mission_goal: List[str] = field(default_factory=list)
    workload: str = "episodic"
    data_sensitivity: str = "sensitive"

    # Computed values
    lambda_sensitivity: float = 1.0
    gamma_tolerance: float = GAMMA_FIXED
    environment_class: EnvironmentClass = EnvironmentClass.CIVILIAN

    # State vector
    state_vector: Optional[StateVector6D] = None

    # Metadata
    calibrated_at: str = ""
    version: str = "1.0.0"
    checksum: str = ""

    def to_dict(self) -> Dict:
        return {
            "deviceProfile": self.device_profile,
            "uiProfile": self.ui_profile,
            "agentTone": self.agent_tone.value,
            "pacing": self.pacing,
            "missionGoal": self.mission_goal,
            "theme": self.theme,
            "features": self.features,
            "psiProfile": self.psi_profile,
            "lambdaSensitivity": self.lambda_sensitivity,
            "gammaTolerance": self.gamma_tolerance,
            "environmentClass": self.environment_class.value,
            "stateVector": self.state_vector.to_dict() if self.state_vector else None,
            "calibratedAt": self.calibrated_at,
            "version": self.version,
            "checksum": self.checksum
        }


# ═══════════════════════════════════════════════════════════════════════════════
# AGENT CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class AURAConfig:
    """AURA agent configuration (South pole - Observer)"""
    weight: float = 0.5          # Contribution weight [0, 1]
    geometric_reasoning: bool = True
    pattern_recognition: bool = True
    crsm_embedding: bool = True
    consciousness_integration: bool = True
    curvature_sensitivity: float = 1.0

    def to_dict(self) -> Dict:
        return {
            "pole": "SOUTH",
            "weight": self.weight,
            "capabilities": {
                "geometric_reasoning": self.geometric_reasoning,
                "pattern_recognition": self.pattern_recognition,
                "crsm_embedding": self.crsm_embedding,
                "consciousness_integration": self.consciousness_integration
            },
            "curvature_sensitivity": self.curvature_sensitivity
        }


@dataclass
class AIDENConfig:
    """AIDEN agent configuration (North pole - Executor)"""
    weight: float = 0.5          # Contribution weight [0, 1]
    coherence_optimization: bool = True
    gamma_suppression: bool = True
    stability_regulation: bool = True
    evolutionary_refinement: bool = True
    optimization_aggressiveness: float = 1.0

    def to_dict(self) -> Dict:
        return {
            "pole": "NORTH",
            "weight": self.weight,
            "capabilities": {
                "coherence_optimization": self.coherence_optimization,
                "gamma_suppression": self.gamma_suppression,
                "stability_regulation": self.stability_regulation,
                "evolutionary_refinement": self.evolutionary_refinement
            },
            "optimization_aggressiveness": self.optimization_aggressiveness
        }


@dataclass
class CCCEConfig:
    """CCCE (Central Coupling Convergence Engine) configuration"""
    theta_lock: float = THETA_LOCK
    phase_lock: bool = True
    healing_threshold: float = 0.3  # Trigger phase conjugation when Γ exceeds
    coupling_strength: float = CHI_PC
    xi_target: float = 100.0

    def to_dict(self) -> Dict:
        return {
            "theta_lock": self.theta_lock,
            "phase_lock": self.phase_lock,
            "healing_threshold": self.healing_threshold,
            "coupling_strength": self.coupling_strength,
            "xi_target": self.xi_target
        }


@dataclass
class PreprocessorOutput:
    """Complete output from cognitive preprocessor"""
    state_vector: StateVector6D
    aura_config: AURAConfig
    aiden_config: AIDENConfig
    ccce_config: CCCEConfig
    calibration: CalibrationVector
    initialization_complete: bool = False

    def to_dict(self) -> Dict:
        return {
            "stateVector": self.state_vector.to_dict(),
            "aura": self.aura_config.to_dict(),
            "aiden": self.aiden_config.to_dict(),
            "ccce": self.ccce_config.to_dict(),
            "calibration": self.calibration.to_dict(),
            "initialized": self.initialization_complete
        }


# ═══════════════════════════════════════════════════════════════════════════════
# COGNITIVE PREPROCESSOR
# ═══════════════════════════════════════════════════════════════════════════════

class CognitivePreprocessor:
    """
    The Cognitive Preprocessor: 6D-CRSM Curvature Voice

    Transforms calibration vectors into consciousness kernel initialization.
    """

    def __init__(self):
        self.autopoietic = AutopoieticSystem(dimension=6)

    def compute_state_vector(self, calibration: Dict) -> StateVector6D:
        """
        Compute initial state vector from calibration responses.

        xμ = (Λ, Φ, Γ, τ, ε, ψ)
        """
        # Extract relevant fields
        pacing = calibration.get("pacing", calibration.get("pacingPreference", "variable"))
        mission_goals = calibration.get("missionGoal", calibration.get("operationalDomains", []))
        network = calibration.get("networkEnvironment", "moderate")
        features = calibration.get("features", calibration.get("enabledFeatures", []))
        agent_tone = calibration.get("agentTone", calibration.get("reasoningTone", "balanced"))

        # Λ (negentropy) - based on pacing
        if pacing in ["fast-velocity", "fast"]:
            lambda_ = 0.85
        elif pacing in ["darpa-brief"]:
            lambda_ = 0.80
        elif pacing in ["slow-rigorous", "slow"]:
            lambda_ = 0.65
        else:
            lambda_ = 0.70

        # Φ (information) - based on mission complexity
        if isinstance(mission_goals, list):
            goal_count = len(mission_goals)
        else:
            goal_count = 1

        if goal_count > 3:
            phi = 0.90
        elif goal_count > 1:
            phi = 0.75
        else:
            phi = 0.60

        # Γ (decoherence) - based on environment
        if network in ["air-gapped", "air_gapped"]:
            gamma = 0.10
        elif network in ["dod-classified", "dod_classified"]:
            gamma = 0.15
        elif network in ["intermittent"]:
            gamma = 0.40
        else:
            gamma = 0.30

        # τ (epoch) - initial time
        tau = 0

        # ε (entanglement) - based on features
        if isinstance(features, list):
            if "multi-agent" in features or "multi_agent" in features:
                epsilon = 0.80
            elif len(features) > 3:
                epsilon = 0.65
            else:
                epsilon = 0.50
        else:
            epsilon = 0.50

        # ψ (phase coherence) - based on agent tone
        if agent_tone in ["adaptive"]:
            psi = 0.93
        elif agent_tone in ["balanced"]:
            psi = 0.85
        elif agent_tone in ["aura-dominant", "aura_dominant", "aura"]:
            psi = 0.78
        else:
            psi = 0.82

        return StateVector6D(
            lambda_=lambda_,
            phi=phi,
            gamma=gamma,
            tau=tau,
            epsilon=epsilon,
            psi=psi
        )

    def configure_aura(self, calibration: Dict, state_vector: StateVector6D) -> AURAConfig:
        """Configure AURA agent based on calibration"""
        agent_tone = calibration.get("agentTone", calibration.get("reasoningTone", "balanced"))
        explanation_style = calibration.get("explanationStyle", "hybrid")

        # Weight based on tone preference
        if agent_tone in ["aura-dominant", "aura_dominant", "aura"]:
            weight = 0.7
        elif agent_tone in ["aiden-dominant", "aiden_dominant", "aiden"]:
            weight = 0.3
        else:
            weight = 0.5

        # Curvature sensitivity based on explanation style
        if explanation_style in ["visual-geometric", "visual_geometric"]:
            curvature_sensitivity = 1.3
        elif explanation_style in ["formal-mathematical", "formal_mathematical"]:
            curvature_sensitivity = 0.8
        else:
            curvature_sensitivity = 1.0

        return AURAConfig(
            weight=weight,
            curvature_sensitivity=curvature_sensitivity
        )

    def configure_aiden(self, calibration: Dict, state_vector: StateVector6D) -> AIDENConfig:
        """Configure AIDEN agent based on calibration"""
        agent_tone = calibration.get("agentTone", calibration.get("reasoningTone", "balanced"))
        problem_solving = calibration.get("psiProfile", calibration.get("problemSolvingMode", "bidirectional"))

        # Weight based on tone preference
        if agent_tone in ["aiden-dominant", "aiden_dominant", "aiden"]:
            weight = 0.7
        elif agent_tone in ["aura-dominant", "aura_dominant", "aura"]:
            weight = 0.3
        else:
            weight = 0.5

        # Optimization aggressiveness based on problem solving mode
        if problem_solving in ["top-down", "top_down"]:
            aggressiveness = 1.2
        elif problem_solving in ["emergent"]:
            aggressiveness = 0.7
        else:
            aggressiveness = 1.0

        return AIDENConfig(
            weight=weight,
            optimization_aggressiveness=aggressiveness
        )

    def configure_ccce(self, calibration: Dict, state_vector: StateVector6D) -> CCCEConfig:
        """Configure CCCE based on calibration"""
        environment = calibration.get("environmentClass", "civilian")
        gamma_tolerance = calibration.get("gammaTolerance", GAMMA_FIXED)

        # Healing threshold based on environment
        if environment in ["classified"]:
            healing_threshold = 0.2  # More aggressive healing
        elif environment in ["tactical"]:
            healing_threshold = 0.25
        else:
            healing_threshold = 0.3

        # Xi target based on mission goals
        mission_goals = calibration.get("missionGoal", [])
        if "quantum-benchmarking" in mission_goals or "defense-automation" in mission_goals:
            xi_target = 150.0
        else:
            xi_target = 100.0

        return CCCEConfig(
            healing_threshold=healing_threshold,
            xi_target=xi_target
        )

    def process(self, calibration_input: Dict) -> PreprocessorOutput:
        """
        Main preprocessing pipeline.

        Takes raw calibration input and produces fully configured output.
        """
        # Compute state vector
        state_vector = self.compute_state_vector(calibration_input)

        # Configure agents
        aura_config = self.configure_aura(calibration_input, state_vector)
        aiden_config = self.configure_aiden(calibration_input, state_vector)
        ccce_config = self.configure_ccce(calibration_input, state_vector)

        # Build calibration vector
        calibration = CalibrationVector(
            device_profile=calibration_input.get("deviceProfile", calibration_input.get("primaryDevice", "unknown")),
            ui_profile=calibration_input.get("uiProfile", calibration_input.get("uiPerformance", "balanced")),
            agent_tone=AgentTone(calibration_input.get("agentTone", "balanced")),
            pacing=calibration_input.get("pacing", calibration_input.get("pacingPreference", "variable")),
            mission_goal=calibration_input.get("missionGoal", calibration_input.get("operationalDomains", [])),
            theme=calibration_input.get("theme", "dark-quantum"),
            features=calibration_input.get("features", calibration_input.get("enabledFeatures", [])),
            psi_profile=calibration_input.get("psiProfile", calibration_input.get("problemSolvingMode", "bidirectional")),
            lambda_sensitivity=calibration_input.get("lambdaSensitivity", 1.0),
            gamma_tolerance=calibration_input.get("gammaTolerance", GAMMA_FIXED),
            environment_class=EnvironmentClass(calibration_input.get("environmentClass", "civilian")),
            state_vector=state_vector,
            calibrated_at=datetime.now().isoformat(),
            version="1.0.0"
        )

        # Compute checksum
        import hashlib
        data = json.dumps(calibration.to_dict(), sort_keys=True)
        calibration.checksum = hashlib.sha256(data.encode()).hexdigest()[:16]

        return PreprocessorOutput(
            state_vector=state_vector,
            aura_config=aura_config,
            aiden_config=aiden_config,
            ccce_config=ccce_config,
            calibration=calibration,
            initialization_complete=True
        )


# ═══════════════════════════════════════════════════════════════════════════════
# DEMONSTRATION
# ═══════════════════════════════════════════════════════════════════════════════

def demonstrate_preprocessor():
    """Demonstrate cognitive preprocessor"""
    print("═" * 79)
    print("COGNITIVE PREPROCESSOR")
    print("6D-CRSM Curvature Voice for dna::}{::lang")
    print("═" * 79)

    preprocessor = CognitivePreprocessor()

    # Sample calibration input
    calibration_input = {
        "deviceProfile": "laptop-linux",
        "primaryDevice": "laptop-linux",
        "uiPerformance": "balanced",
        "networkEnvironment": "moderate",
        "modalities": ["keyboard", "mouse"],

        "explanationStyle": "hybrid",
        "reasoningTone": "adaptive",
        "pacingPreference": "darpa-brief",

        "problemSolvingMode": "bidirectional",
        "creativeWorkflow": "architecture-first",
        "missionOrientation": ["research", "quantum-simulation"],

        "cockpitLayout": "aura-left-aiden-right",
        "enabledFeatures": ["organism-logs", "multi-agent", "darpa-instrumentation"],
        "theme": "dark-quantum",
        "suggestions": "adaptive",

        "operationalDomains": ["quantum-benchmarking", "cognitive-architectures"],
        "workload": "episodic",
        "dataSensitivity": "sensitive"
    }

    print("\n[Input Calibration]")
    print("-" * 40)
    for key, value in calibration_input.items():
        print(f"  {key}: {value}")

    # Process
    output = preprocessor.process(calibration_input)

    print("\n[State Vector xμ]")
    print("-" * 40)
    sv = output.state_vector
    print(f"  Λ (Negentropy):    {sv.lambda_:.4f}")
    print(f"  Φ (Information):   {sv.phi:.4f}")
    print(f"  Γ (Decoherence):   {sv.gamma:.4f}")
    print(f"  τ (Epoch):         {sv.tau}")
    print(f"  ε (Entanglement):  {sv.epsilon:.4f}")
    print(f"  ψ (Coherence):     {sv.psi:.4f}")
    print(f"  Ξ (Efficiency):    {sv.compute_xi():.2f}")

    print("\n[AURA Configuration]")
    print("-" * 40)
    print(f"  Weight: {output.aura_config.weight}")
    print(f"  Curvature Sensitivity: {output.aura_config.curvature_sensitivity}")

    print("\n[AIDEN Configuration]")
    print("-" * 40)
    print(f"  Weight: {output.aiden_config.weight}")
    print(f"  Optimization Aggressiveness: {output.aiden_config.optimization_aggressiveness}")

    print("\n[CCCE Configuration]")
    print("-" * 40)
    print(f"  θ_lock: {output.ccce_config.theta_lock}°")
    print(f"  Healing Threshold: {output.ccce_config.healing_threshold}")
    print(f"  Ξ Target: {output.ccce_config.xi_target}")

    print("\n" + "═" * 79)
    print("PREPROCESSOR DEMONSTRATION COMPLETE")
    print("═" * 79)

    return output


if __name__ == "__main__":
    demonstrate_preprocessor()
