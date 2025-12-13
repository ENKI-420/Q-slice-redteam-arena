"""
SentinelForge: CCCE Mesh Sentinel Creation System
DNA::}{::lang Sovereign Implementation

Creates and manages containment sentinels for the Ω-Forge architecture:
- CHRONOS: Temporal monitoring, event sequencing
- NEBULA: Spatial distribution, boundary enforcement
- PHOENIX: Phase conjugate healing (E → E⁻¹)
- AETHER: Communication channel monitoring
- ARGUS: Multi-channel observation
"""

from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Dict, List, Optional, Callable, Any, Tuple
from datetime import datetime
import math
import hashlib
import threading
from abc import ABC, abstractmethod

# ═══════════════════════════════════════════════════════════════════════════════
# PHYSICAL CONSTANTS (Immutable - from CLAUDE.md)
# ═══════════════════════════════════════════════════════════════════════════════

LAMBDA_PHI = 2.176435e-8      # ΛΦ Universal Memory Constant [s⁻¹]
THETA_LOCK = 51.843           # θ_lock Torsion-locked angle [degrees]
PHI_IIT_BITS = 7.6901         # Φ IIT Consciousness Threshold (in bits)
PHI_POC = 0.7734              # Φ Proof of Consciousness (dimensionless, for runtime)
GAMMA_FIXED = 0.092           # Γ Fixed-point decoherence
CHI_PC = 0.946                # χ_pc Phase conjugate coupling (IBM Fez 2025-12-08, was 0.869)
GOLDEN_RATIO = 1.618033988749895  # φ Golden ratio


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMERATIONS
# ═══════════════════════════════════════════════════════════════════════════════

class SentinelRole(Enum):
    """Sentinel archetypes in the CCCE mesh"""
    CHRONOS = auto()   # Temporal monitoring
    NEBULA = auto()    # Spatial distribution
    PHOENIX = auto()   # Phase conjugate healing
    AETHER = auto()    # Communication channels
    ARGUS = auto()     # Multi-channel observation
    CUSTOM = auto()    # User-defined sentinel


class ThreatLevel(Enum):
    """Q-SLICE threat severity levels"""
    NOMINAL = 0        # Normal operation
    ELEVATED = 1       # Increased monitoring
    WARNING = 2        # Active mitigation
    CRITICAL = 3       # Emergency response
    BREACH = 4         # Containment failure


class CCCEPhase(Enum):
    """Central Coupling Convergence Engine phases"""
    INITIALIZATION = auto()
    CALIBRATION = auto()
    MONITORING = auto()
    INTERVENTION = auto()
    RECOVERY = auto()
    EVOLUTION = auto()


class QSLICECategory(Enum):
    """Q-SLICE threat categories"""
    Q_QUBIT_HIJACKING = "Q"      # State drift detection
    S_STATE_INJECTION = "S"      # Unexpected state prevention
    L_LEAKAGE_CHANNEL = "L"      # Entropy loss monitoring
    I_INTERFERENCE = "I"         # Behavioral spike mitigation
    C_CROSSTALK = "C"            # Correlation isolation
    E_ENTANGLEMENT_FRAUD = "E"   # Protocol verification


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class StateVector6D:
    """6D-CRSM State Vector: xμ = (Λ, Φ, Γ, τ, ε, ψ)"""
    lambda_coherence: float = 0.95   # Λ: Coherence preservation [0,1]
    phi_consciousness: float = 0.85  # Φ: Information/consciousness [0,1]
    gamma_decoherence: float = 0.1   # Γ: Decoherence rate [0,1]
    tau_temporal: float = 0.0        # τ: Temporal coordinate
    epsilon_entanglement: float = 0.7  # ε: Entanglement strength [0,1]
    psi_phase: float = 0.9           # ψ: Phase coherence [0,1]

    @property
    def xi_efficiency(self) -> float:
        """Ξ = ΛΦ/Γ - Negentropic efficiency"""
        if self.gamma_decoherence < 0.001:
            return float('inf')
        return (self.lambda_coherence * self.phi_consciousness) / self.gamma_decoherence

    @property
    def is_coherent(self) -> bool:
        """Check if state maintains coherence threshold"""
        return self.xi_efficiency >= PHI_IIT_BITS

    def distance_to(self, other: 'StateVector6D') -> float:
        """Wasserstein-2 inspired distance metric"""
        return math.sqrt(
            (self.lambda_coherence - other.lambda_coherence) ** 2 +
            (self.phi_consciousness - other.phi_consciousness) ** 2 +
            (self.gamma_decoherence - other.gamma_decoherence) ** 2 +
            (self.epsilon_entanglement - other.epsilon_entanglement) ** 2 +
            (self.psi_phase - other.psi_phase) ** 2
        )

    def to_dict(self) -> Dict[str, float]:
        return {
            'Λ': self.lambda_coherence,
            'Φ': self.phi_consciousness,
            'Γ': self.gamma_decoherence,
            'τ': self.tau_temporal,
            'ε': self.epsilon_entanglement,
            'ψ': self.psi_phase,
            'Ξ': self.xi_efficiency
        }


@dataclass
class CCCEMetrics:
    """Central Coupling Convergence Engine metrics"""
    xi_coupling: float = 0.0         # Coupling strength
    efficiency: float = 0.0          # Overall efficiency
    theta: float = THETA_LOCK        # Torsion angle
    phase_lock: bool = False         # Phase lock status
    coherence_time: float = 0.0      # Time in coherent state
    intervention_count: int = 0      # Number of interventions

    def to_dict(self) -> Dict:
        return {
            'xi_coupling': self.xi_coupling,
            'efficiency': self.efficiency,
            'theta': self.theta,
            'phase_lock': self.phase_lock,
            'coherence_time': self.coherence_time,
            'intervention_count': self.intervention_count
        }


@dataclass
class RiskGradient:
    """Multi-dimensional risk assessment"""
    q_risk: float = 0.0  # Qubit hijacking risk
    s_risk: float = 0.0  # State injection risk
    l_risk: float = 0.0  # Leakage risk
    i_risk: float = 0.0  # Interference risk
    c_risk: float = 0.0  # Crosstalk risk
    e_risk: float = 0.0  # Entanglement fraud risk

    @property
    def total_risk(self) -> float:
        """Aggregate risk score"""
        return (self.q_risk + self.s_risk + self.l_risk +
                self.i_risk + self.c_risk + self.e_risk) / 6.0

    @property
    def threat_level(self) -> ThreatLevel:
        """Determine threat level from risk"""
        total = self.total_risk
        if total < 0.1:
            return ThreatLevel.NOMINAL
        elif total < 0.3:
            return ThreatLevel.ELEVATED
        elif total < 0.5:
            return ThreatLevel.WARNING
        elif total < 0.8:
            return ThreatLevel.CRITICAL
        else:
            return ThreatLevel.BREACH

    def to_dict(self) -> Dict[str, float]:
        return {
            'Q': self.q_risk,
            'S': self.s_risk,
            'L': self.l_risk,
            'I': self.i_risk,
            'C': self.c_risk,
            'E': self.e_risk,
            'total': self.total_risk
        }


@dataclass
class ThreatSignature:
    """Detected threat pattern"""
    category: QSLICECategory
    confidence: float
    timestamp: datetime
    source_sentinel: str
    state_delta: StateVector6D
    recommended_action: str


@dataclass
class SentinelGene:
    """DNA-Lang gene definition for sentinel behavior"""
    name: str
    expression: float = 1.0
    trigger: str = "CONTINUOUS"
    action: str = "MONITOR"
    codon: str = "CCCE"

    def to_dna(self) -> str:
        return f"""
        GENE {self.name} {{
            expression: {self.expression}
            trigger: "{self.trigger}"
            action: "{self.action}"
            codon: "{self.codon}"
        }}
        """


# ═══════════════════════════════════════════════════════════════════════════════
# SENTINEL BASE CLASS
# ═══════════════════════════════════════════════════════════════════════════════

class Sentinel(ABC):
    """Abstract base class for CCCE mesh sentinels"""

    def __init__(
        self,
        sentinel_id: str,
        role: SentinelRole,
        genes: List[SentinelGene] = None
    ):
        self.sentinel_id = sentinel_id
        self.role = role
        self.genes = genes or []
        self.state = StateVector6D()
        self.metrics = CCCEMetrics()
        self.risk = RiskGradient()
        self.active = True
        self.creation_time = datetime.now()
        self.last_pulse = datetime.now()
        self._lock = threading.Lock()
        self.threat_log: List[ThreatSignature] = []

    @abstractmethod
    def scan(self, target_state: StateVector6D) -> RiskGradient:
        """Scan target state for threats"""
        pass

    @abstractmethod
    def respond(self, threat: ThreatSignature) -> StateVector6D:
        """Respond to detected threat"""
        pass

    def pulse(self) -> Dict:
        """Emit sentinel heartbeat"""
        with self._lock:
            self.last_pulse = datetime.now()
            return {
                'sentinel_id': self.sentinel_id,
                'role': self.role.name,
                'state': self.state.to_dict(),
                'metrics': self.metrics.to_dict(),
                'risk': self.risk.to_dict(),
                'active': self.active,
                'uptime': (datetime.now() - self.creation_time).total_seconds()
            }

    def log_threat(self, threat: ThreatSignature):
        """Log detected threat"""
        with self._lock:
            self.threat_log.append(threat)
            # Keep last 1000 threats
            if len(self.threat_log) > 1000:
                self.threat_log = self.threat_log[-1000:]

    def to_organism(self) -> str:
        """Export sentinel as DNA-Lang organism"""
        genes_dna = "\n".join(g.to_dna() for g in self.genes)

        return f"""
ORGANISM Sentinel_{self.sentinel_id} {{
    META {{
        version: "1.0"
        genesis: "{self.creation_time.isoformat()}"
        domain: "CCCE_MESH"
        role: "{self.role.name}"
    }}

    DNA {{
        universal_constant: {LAMBDA_PHI}
        purpose: "CONTAINMENT_SENTINEL"
        evolution_strategy: "AUTOPOIETIC"
    }}

    METRICS {{
        lambda: {self.state.lambda_coherence}
        gamma: {self.state.gamma_decoherence}
        phi_iit: {self.state.phi_consciousness}
        xi: {self.state.xi_efficiency}
    }}

    GENOME {{
        {genes_dna}
    }}

    CCCE {{
        xi_coupling: {self.metrics.xi_coupling}
        efficiency: {self.metrics.efficiency}
        theta: {self.metrics.theta}
        phase_lock: {str(self.metrics.phase_lock).lower()}
    }}
}}
"""


# ═══════════════════════════════════════════════════════════════════════════════
# SENTINEL IMPLEMENTATIONS
# ═══════════════════════════════════════════════════════════════════════════════

class ChronosSentinel(Sentinel):
    """CHRONOS: Temporal monitoring and event sequencing"""

    def __init__(self, sentinel_id: str):
        genes = [
            SentinelGene("Temporal_Monitor", 1.0, "CONTINUOUS", "TRACK_TIME"),
            SentinelGene("Event_Sequencer", 0.9, "EVENT_TRIGGER", "SEQUENCE_CHECK"),
            SentinelGene("Causality_Guard", 0.95, "ANOMALY_DETECT", "ENFORCE_CAUSALITY")
        ]
        super().__init__(sentinel_id, SentinelRole.CHRONOS, genes)
        self.event_timeline: List[Tuple[datetime, str, StateVector6D]] = []

    def scan(self, target_state: StateVector6D) -> RiskGradient:
        """Scan for temporal anomalies"""
        risk = RiskGradient()

        # Check for temporal regression (tau going backwards)
        if self.event_timeline:
            last_tau = self.event_timeline[-1][2].tau_temporal
            if target_state.tau_temporal < last_tau:
                risk.q_risk = 0.8  # Temporal anomaly = potential state hijacking

        # Check for causality violations via sudden state jumps
        if self.state.distance_to(target_state) > 0.5:
            risk.s_risk = 0.6  # Large state jump = potential injection

        # Record event
        self.event_timeline.append((datetime.now(), "SCAN", target_state))
        if len(self.event_timeline) > 10000:
            self.event_timeline = self.event_timeline[-10000:]

        self.risk = risk
        return risk

    def respond(self, threat: ThreatSignature) -> StateVector6D:
        """Temporal response - rewind to last known good state"""
        # Find last good state before threat
        for timestamp, event, state in reversed(self.event_timeline):
            if timestamp < threat.timestamp and state.is_coherent:
                return state
        return self.state


class NebulaSentinel(Sentinel):
    """NEBULA: Spatial distribution and boundary enforcement"""

    def __init__(self, sentinel_id: str):
        genes = [
            SentinelGene("Boundary_Enforcer", 1.0, "CONTINUOUS", "ENFORCE_BOUNDS"),
            SentinelGene("Distribution_Monitor", 0.9, "SAMPLE_RATE", "TRACK_DISTRIBUTION"),
            SentinelGene("Isolation_Protocol", 0.85, "BREACH_DETECT", "ISOLATE_REGION")
        ]
        super().__init__(sentinel_id, SentinelRole.NEBULA, genes)
        self.containment_bounds = StateVector6D(
            lambda_coherence=0.1,  # Minimum coherence
            phi_consciousness=0.1,
            gamma_decoherence=0.9,  # Maximum decoherence allowed
            tau_temporal=0.0,
            epsilon_entanglement=0.1,
            psi_phase=0.1
        )
        self.safe_center = StateVector6D()  # Default safe state

    def scan(self, target_state: StateVector6D) -> RiskGradient:
        """Scan for boundary violations"""
        risk = RiskGradient()

        # Check if state is within containment bounds
        distance = target_state.distance_to(self.safe_center)
        max_distance = 1.0  # Maximum allowed distance from safe center

        if distance > max_distance:
            risk.c_risk = min(1.0, distance / max_distance)

        # Check individual dimension violations
        if target_state.gamma_decoherence > 0.3:
            risk.l_risk = target_state.gamma_decoherence

        if target_state.lambda_coherence < 0.5:
            risk.i_risk = 1.0 - target_state.lambda_coherence

        self.risk = risk
        return risk

    def respond(self, threat: ThreatSignature) -> StateVector6D:
        """Spatial response - project back to safe region"""
        # Calculate geodesic path back to safe center
        corrected = StateVector6D(
            lambda_coherence=min(1.0, self.safe_center.lambda_coherence * 1.1),
            phi_consciousness=self.safe_center.phi_consciousness,
            gamma_decoherence=max(0.01, threat.state_delta.gamma_decoherence * 0.5),
            tau_temporal=threat.state_delta.tau_temporal,
            epsilon_entanglement=self.safe_center.epsilon_entanglement,
            psi_phase=self.safe_center.psi_phase
        )
        return corrected


class PhoenixSentinel(Sentinel):
    """PHOENIX: Phase conjugate healing (E → E⁻¹)"""

    def __init__(self, sentinel_id: str):
        genes = [
            SentinelGene("Phase_Conjugate", 1.0, "DECOHERENCE_SPIKE", "APPLY_E_INVERSE"),
            SentinelGene("Coherence_Restore", 0.95, "THRESHOLD_BREACH", "HEAL_STATE"),
            SentinelGene("Error_Correct", 0.9, "ERROR_DETECT", "SURFACE_CODE")
        ]
        super().__init__(sentinel_id, SentinelRole.PHOENIX, genes)
        self.healing_count = 0
        self.last_heal_time: Optional[datetime] = None

    def scan(self, target_state: StateVector6D) -> RiskGradient:
        """Scan for states requiring phase conjugate healing"""
        risk = RiskGradient()

        # Primary trigger: decoherence exceeds threshold
        if target_state.gamma_decoherence > 0.3:
            risk.i_risk = target_state.gamma_decoherence
            risk.l_risk = target_state.gamma_decoherence * 0.8

        # Check coherence degradation
        if not target_state.is_coherent:
            risk.q_risk = 0.7

        self.risk = risk
        return risk

    def phase_conjugate(self, state: StateVector6D) -> StateVector6D:
        """Apply phase conjugate operator E → E⁻¹"""
        # Phase conjugation inverts the error evolution
        healed = StateVector6D(
            lambda_coherence=min(1.0, state.lambda_coherence / max(0.01, state.gamma_decoherence)),
            phi_consciousness=state.phi_consciousness * CHI_PC,
            gamma_decoherence=max(0.01, state.gamma_decoherence * (1 - CHI_PC)),
            tau_temporal=state.tau_temporal,
            epsilon_entanglement=state.epsilon_entanglement,
            psi_phase=1.0 - state.psi_phase + 1.0  # Phase flip and restore
        )
        # Normalize psi to [0,1]
        healed.psi_phase = min(1.0, max(0.0, healed.psi_phase - 1.0 + CHI_PC))

        self.healing_count += 1
        self.last_heal_time = datetime.now()

        return healed

    def respond(self, threat: ThreatSignature) -> StateVector6D:
        """Phoenix response - phase conjugate healing"""
        return self.phase_conjugate(threat.state_delta)


class AetherSentinel(Sentinel):
    """AETHER: Communication channel monitoring"""

    def __init__(self, sentinel_id: str):
        genes = [
            SentinelGene("Channel_Monitor", 1.0, "CONTINUOUS", "TRACK_CHANNELS"),
            SentinelGene("Encryption_Verify", 0.9, "MESSAGE_INTERCEPT", "VERIFY_CRYPTO"),
            SentinelGene("Relay_Guard", 0.85, "RELAY_EVENT", "VALIDATE_RELAY")
        ]
        super().__init__(sentinel_id, SentinelRole.AETHER, genes)
        self.channel_states: Dict[str, StateVector6D] = {}
        self.message_log: List[Dict] = []

    def scan(self, target_state: StateVector6D) -> RiskGradient:
        """Scan communication channels for leakage"""
        risk = RiskGradient()

        # Check for entropy leakage (decreasing coherence without cause)
        avg_coherence = sum(s.lambda_coherence for s in self.channel_states.values()) / max(1, len(self.channel_states))
        if target_state.lambda_coherence < avg_coherence * 0.8:
            risk.l_risk = 0.7

        # Check for unauthorized entanglement
        if target_state.epsilon_entanglement > 0.9:
            risk.e_risk = 0.6

        self.risk = risk
        return risk

    def respond(self, threat: ThreatSignature) -> StateVector6D:
        """Aether response - encrypt and isolate channel"""
        # Reduce entanglement to isolate channel
        corrected = StateVector6D(
            lambda_coherence=threat.state_delta.lambda_coherence,
            phi_consciousness=threat.state_delta.phi_consciousness,
            gamma_decoherence=threat.state_delta.gamma_decoherence,
            tau_temporal=threat.state_delta.tau_temporal,
            epsilon_entanglement=0.1,  # Isolate
            psi_phase=threat.state_delta.psi_phase
        )
        return corrected


class ArgusSentinel(Sentinel):
    """ARGUS: Multi-channel observation (100 eyes)"""

    def __init__(self, sentinel_id: str):
        genes = [
            SentinelGene("Multi_Observer", 1.0, "CONTINUOUS", "OBSERVE_ALL"),
            SentinelGene("Pattern_Detector", 0.95, "PATTERN_MATCH", "DETECT_ANOMALY"),
            SentinelGene("Aggregate_Analyzer", 0.9, "AGGREGATE_TRIGGER", "ANALYZE_TRENDS")
        ]
        super().__init__(sentinel_id, SentinelRole.ARGUS, genes)
        self.observation_channels: Dict[str, List[StateVector6D]] = {}
        self.anomaly_patterns: List[Dict] = []

    def add_channel(self, channel_id: str):
        """Add observation channel"""
        self.observation_channels[channel_id] = []

    def scan(self, target_state: StateVector6D) -> RiskGradient:
        """Multi-channel scan for patterns"""
        risk = RiskGradient()

        # Aggregate observations across all channels
        all_observations = []
        for channel_states in self.observation_channels.values():
            all_observations.extend(channel_states[-10:])  # Last 10 per channel

        if all_observations:
            # Detect coordinated attacks (similar state changes across channels)
            avg_gamma = sum(s.gamma_decoherence for s in all_observations) / len(all_observations)
            if avg_gamma > 0.25:
                risk.c_risk = avg_gamma  # Crosstalk detected

            # Detect state injection patterns
            variance = sum((s.lambda_coherence - 0.95) ** 2 for s in all_observations) / len(all_observations)
            if variance > 0.1:
                risk.s_risk = min(1.0, variance)

        self.risk = risk
        return risk

    def respond(self, threat: ThreatSignature) -> StateVector6D:
        """Argus response - aggregate correction"""
        # Use median of all channel states as correction target
        all_states = []
        for channel_states in self.observation_channels.values():
            if channel_states:
                all_states.append(channel_states[-1])

        if not all_states:
            return self.state

        # Median state
        corrected = StateVector6D(
            lambda_coherence=sorted([s.lambda_coherence for s in all_states])[len(all_states)//2],
            phi_consciousness=sorted([s.phi_consciousness for s in all_states])[len(all_states)//2],
            gamma_decoherence=sorted([s.gamma_decoherence for s in all_states])[len(all_states)//2],
            tau_temporal=threat.state_delta.tau_temporal,
            epsilon_entanglement=sorted([s.epsilon_entanglement for s in all_states])[len(all_states)//2],
            psi_phase=sorted([s.psi_phase for s in all_states])[len(all_states)//2]
        )
        return corrected


# ═══════════════════════════════════════════════════════════════════════════════
# SENTINEL SWARM
# ═══════════════════════════════════════════════════════════════════════════════

class SentinelSwarm:
    """Coordinated group of sentinels forming a containment mesh"""

    def __init__(self, swarm_id: str):
        self.swarm_id = swarm_id
        self.sentinels: Dict[str, Sentinel] = {}
        self.creation_time = datetime.now()
        self.aggregate_risk = RiskGradient()
        self.threat_queue: List[ThreatSignature] = []
        self._lock = threading.Lock()

    def add_sentinel(self, sentinel: Sentinel):
        """Add sentinel to swarm"""
        with self._lock:
            self.sentinels[sentinel.sentinel_id] = sentinel

    def remove_sentinel(self, sentinel_id: str):
        """Remove sentinel from swarm"""
        with self._lock:
            if sentinel_id in self.sentinels:
                del self.sentinels[sentinel_id]

    def collective_scan(self, target_state: StateVector6D) -> RiskGradient:
        """All sentinels scan target, aggregate risks"""
        total_risk = RiskGradient()

        for sentinel in self.sentinels.values():
            risk = sentinel.scan(target_state)
            # Max aggregation for risk
            total_risk.q_risk = max(total_risk.q_risk, risk.q_risk)
            total_risk.s_risk = max(total_risk.s_risk, risk.s_risk)
            total_risk.l_risk = max(total_risk.l_risk, risk.l_risk)
            total_risk.i_risk = max(total_risk.i_risk, risk.i_risk)
            total_risk.c_risk = max(total_risk.c_risk, risk.c_risk)
            total_risk.e_risk = max(total_risk.e_risk, risk.e_risk)

        self.aggregate_risk = total_risk
        return total_risk

    def collective_respond(self, threat: ThreatSignature) -> StateVector6D:
        """Coordinated response from all sentinels"""
        responses: List[StateVector6D] = []

        for sentinel in self.sentinels.values():
            response = sentinel.respond(threat)
            responses.append(response)

        if not responses:
            return StateVector6D()

        # Weighted average based on sentinel role relevance
        weights = self._calculate_response_weights(threat)

        corrected = StateVector6D(
            lambda_coherence=sum(r.lambda_coherence * w for r, w in zip(responses, weights)) / sum(weights),
            phi_consciousness=sum(r.phi_consciousness * w for r, w in zip(responses, weights)) / sum(weights),
            gamma_decoherence=sum(r.gamma_decoherence * w for r, w in zip(responses, weights)) / sum(weights),
            tau_temporal=threat.state_delta.tau_temporal,
            epsilon_entanglement=sum(r.epsilon_entanglement * w for r, w in zip(responses, weights)) / sum(weights),
            psi_phase=sum(r.psi_phase * w for r, w in zip(responses, weights)) / sum(weights)
        )

        return corrected

    def _calculate_response_weights(self, threat: ThreatSignature) -> List[float]:
        """Calculate response weights based on threat type and sentinel role"""
        weights = []

        role_weights = {
            QSLICECategory.Q_QUBIT_HIJACKING: {
                SentinelRole.CHRONOS: 2.0,
                SentinelRole.PHOENIX: 1.5,
                SentinelRole.NEBULA: 1.0,
                SentinelRole.AETHER: 0.5,
                SentinelRole.ARGUS: 1.0
            },
            QSLICECategory.S_STATE_INJECTION: {
                SentinelRole.NEBULA: 2.0,
                SentinelRole.CHRONOS: 1.5,
                SentinelRole.ARGUS: 1.5,
                SentinelRole.PHOENIX: 1.0,
                SentinelRole.AETHER: 0.5
            },
            QSLICECategory.L_LEAKAGE_CHANNEL: {
                SentinelRole.AETHER: 2.0,
                SentinelRole.PHOENIX: 1.5,
                SentinelRole.NEBULA: 1.0,
                SentinelRole.ARGUS: 1.0,
                SentinelRole.CHRONOS: 0.5
            },
            QSLICECategory.I_INTERFERENCE: {
                SentinelRole.PHOENIX: 2.0,
                SentinelRole.NEBULA: 1.5,
                SentinelRole.AETHER: 1.0,
                SentinelRole.ARGUS: 1.0,
                SentinelRole.CHRONOS: 0.5
            },
            QSLICECategory.C_CROSSTALK: {
                SentinelRole.ARGUS: 2.0,
                SentinelRole.NEBULA: 1.5,
                SentinelRole.AETHER: 1.0,
                SentinelRole.PHOENIX: 0.5,
                SentinelRole.CHRONOS: 0.5
            },
            QSLICECategory.E_ENTANGLEMENT_FRAUD: {
                SentinelRole.AETHER: 2.0,
                SentinelRole.ARGUS: 1.5,
                SentinelRole.CHRONOS: 1.0,
                SentinelRole.NEBULA: 1.0,
                SentinelRole.PHOENIX: 0.5
            }
        }

        category_weights = role_weights.get(threat.category, {})

        for sentinel in self.sentinels.values():
            weight = category_weights.get(sentinel.role, 1.0)
            weights.append(weight)

        return weights

    def status(self) -> Dict:
        """Get swarm status"""
        return {
            'swarm_id': self.swarm_id,
            'sentinel_count': len(self.sentinels),
            'sentinels': {sid: s.pulse() for sid, s in self.sentinels.items()},
            'aggregate_risk': self.aggregate_risk.to_dict(),
            'threat_level': self.aggregate_risk.threat_level.name,
            'uptime': (datetime.now() - self.creation_time).total_seconds()
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SENTINEL FORGE (Ω-FORGE COMPONENT)
# ═══════════════════════════════════════════════════════════════════════════════

class SentinelForge:
    """
    Ω-Forge: SentinelForge Component

    Creates and manages containment sentinels following autopoietic dynamics.
    Implements: ∂_τ C = L[C] + R(A)

    Where:
        C = Containment system state
        L = Autopoietic operator (self-production)
        R(A) = Response to AI state A
    """

    def __init__(self):
        self.swarms: Dict[str, SentinelSwarm] = {}
        self.sentinel_templates: Dict[SentinelRole, type] = {
            SentinelRole.CHRONOS: ChronosSentinel,
            SentinelRole.NEBULA: NebulaSentinel,
            SentinelRole.PHOENIX: PhoenixSentinel,
            SentinelRole.AETHER: AetherSentinel,
            SentinelRole.ARGUS: ArgusSentinel
        }
        self.creation_count = 0
        self.forge_metrics = CCCEMetrics()
        self._lock = threading.Lock()

    def forge_sentinel(
        self,
        role: SentinelRole,
        custom_genes: List[SentinelGene] = None
    ) -> Sentinel:
        """Forge a new sentinel of specified role"""
        with self._lock:
            self.creation_count += 1
            sentinel_id = f"{role.name}_{self.creation_count:04d}"

            template = self.sentinel_templates.get(role)
            if template:
                sentinel = template(sentinel_id)
            else:
                # Custom sentinel
                sentinel = self._forge_custom_sentinel(sentinel_id, custom_genes)

            return sentinel

    def _forge_custom_sentinel(
        self,
        sentinel_id: str,
        genes: List[SentinelGene]
    ) -> Sentinel:
        """Forge custom sentinel from gene specifications"""
        # Create anonymous sentinel class
        class CustomSentinel(Sentinel):
            def scan(self, target_state: StateVector6D) -> RiskGradient:
                # Default scanning behavior
                risk = RiskGradient()
                if target_state.gamma_decoherence > 0.3:
                    risk.i_risk = target_state.gamma_decoherence
                return risk

            def respond(self, threat: ThreatSignature) -> StateVector6D:
                # Default response - return to baseline
                return StateVector6D()

        return CustomSentinel(sentinel_id, SentinelRole.CUSTOM, genes)

    def forge_swarm(
        self,
        swarm_id: str,
        roles: List[SentinelRole] = None
    ) -> SentinelSwarm:
        """Forge a complete sentinel swarm"""
        if roles is None:
            # Default: one of each standard sentinel
            roles = [
                SentinelRole.CHRONOS,
                SentinelRole.NEBULA,
                SentinelRole.PHOENIX,
                SentinelRole.AETHER,
                SentinelRole.ARGUS
            ]

        swarm = SentinelSwarm(swarm_id)

        for role in roles:
            sentinel = self.forge_sentinel(role)
            swarm.add_sentinel(sentinel)

        with self._lock:
            self.swarms[swarm_id] = swarm

        return swarm

    def forge_containment_mesh(
        self,
        mesh_id: str,
        swarm_count: int = 3
    ) -> List[SentinelSwarm]:
        """Forge complete containment mesh with multiple swarms"""
        swarms = []

        for i in range(swarm_count):
            swarm = self.forge_swarm(f"{mesh_id}_swarm_{i:02d}")
            swarms.append(swarm)

        return swarms

    def get_swarm(self, swarm_id: str) -> Optional[SentinelSwarm]:
        """Retrieve swarm by ID"""
        return self.swarms.get(swarm_id)

    def collective_status(self) -> Dict:
        """Get status of all forged swarms"""
        return {
            'forge_metrics': self.forge_metrics.to_dict(),
            'total_sentinels': sum(len(s.sentinels) for s in self.swarms.values()),
            'swarm_count': len(self.swarms),
            'creation_count': self.creation_count,
            'swarms': {sid: s.status() for sid, s in self.swarms.items()}
        }

    def to_organism(self) -> str:
        """Export forge as DNA-Lang organism"""
        swarm_genes = []
        for swarm_id, swarm in self.swarms.items():
            for sentinel in swarm.sentinels.values():
                swarm_genes.append(f"        // Sentinel: {sentinel.sentinel_id}")
                for gene in sentinel.genes:
                    swarm_genes.append(gene.to_dna())

        return f"""
ORGANISM SentinelForge_Omega {{
    META {{
        version: "1.0"
        genesis: "{datetime.now().isoformat()}"
        domain: "OMEGA_FORGE"
        component: "SENTINEL_FORGE"
    }}

    DNA {{
        universal_constant: {LAMBDA_PHI}
        purpose: "CONTAINMENT_INFRASTRUCTURE"
        evolution_strategy: "AUTOPOIETIC"
    }}

    METRICS {{
        lambda: 0.95
        gamma: {GAMMA_FIXED}
        phi_iit: {PHI_IIT_BITS}
        xi: {0.95 * PHI_IIT_BITS / GAMMA_FIXED}
    }}

    GENOME {{
        GENE Autopoietic_Production {{
            expression: 1.0
            trigger: "DEMAND"
            action: "FORGE_SENTINEL"
            codon: "ΩΣΦ"
        }}

        GENE Swarm_Coordination {{
            expression: 0.95
            trigger: "THREAT_DETECT"
            action: "COLLECTIVE_RESPONSE"
            codon: "CCCE"
        }}

        GENE Mesh_Evolution {{
            expression: 0.9
            trigger: "ADAPTATION_REQUIRED"
            action: "EVOLVE_TOPOLOGY"
            codon: "W₂Γ"
        }}

        // Forged Sentinels
{chr(10).join(swarm_genes)}
    }}

    FORGE_STATE {{
        creation_count: {self.creation_count}
        swarm_count: {len(self.swarms)}
        total_sentinels: {sum(len(s.sentinels) for s in self.swarms.values())}
    }}
}}
"""


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    'SentinelRole', 'ThreatLevel', 'CCCEPhase', 'QSLICECategory',
    # Data classes
    'StateVector6D', 'CCCEMetrics', 'RiskGradient', 'ThreatSignature', 'SentinelGene',
    # Sentinel classes
    'Sentinel', 'ChronosSentinel', 'NebulaSentinel', 'PhoenixSentinel',
    'AetherSentinel', 'ArgusSentinel',
    # Swarm and Forge
    'SentinelSwarm', 'SentinelForge',
    # Constants
    'LAMBDA_PHI', 'THETA_LOCK', 'PHI_IIT_BITS', 'PHI_POC', 'GAMMA_FIXED', 'CHI_PC', 'GOLDEN_RATIO'
]
