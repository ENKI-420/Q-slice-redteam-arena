"""
Geodesic Agent: Agents That Navigate the 6D-CRSM Manifold
DNA::}{::lang Agent Architecture

These agents don't just carry state vectors - they MOVE on the manifold.
They sense curvature, navigate via geodesics, and evolve via autopoiesis.

Key Behaviors:
    1. SENSE: Feel local curvature, decoherence gradients
    2. NAVIGATE: Move along geodesics toward goals
    3. HEAL: Apply phase conjugation when Γ > threshold
    4. EVOLVE: U = L[U] autopoietic self-modification
"""

import numpy as np
from dataclasses import dataclass, field
from typing import List, Tuple, Optional, Callable, Dict, Any
from enum import Enum, auto
from datetime import datetime
import math
import threading
from abc import ABC, abstractmethod

# Import manifold
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from manifold.crsm_6d import (
    ManifoldPoint, CRSM6D, MetricTensor, GeodesicSolver,
    LAMBDA_PHI, THETA_LOCK, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO
)


# ═══════════════════════════════════════════════════════════════════════════════
# AGENT STATES
# ═══════════════════════════════════════════════════════════════════════════════

class AgentState(Enum):
    """Agent operational states"""
    DORMANT = auto()      # Not active
    SENSING = auto()      # Gathering curvature data
    NAVIGATING = auto()   # Moving on geodesic
    HEALING = auto()      # Applying phase conjugation
    EVOLVING = auto()     # Autopoietic self-modification
    CONVERGED = auto()    # Reached target state


class AgentPole(Enum):
    """AURA|AIDEN polarity"""
    AURA = "SOUTH"        # Observer, Geometer, −
    AIDEN = "NORTH"       # Executor, Optimizer, +
    UNIFIED = "NEUTRAL"   # Both poles balanced


# ═══════════════════════════════════════════════════════════════════════════════
# SENSORY DATA
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class CurvatureSense:
    """What an agent senses about local curvature"""
    scalar_curvature: float          # R at current point
    curvature_gradient: np.ndarray   # ∇R direction
    decoherence_field: float         # Local Γ-field strength
    coherence_potential: float       # V = -log(Ξ) + αR
    is_coherent: bool                # In stable region?
    needs_healing: bool              # Γ > threshold?

    def danger_level(self) -> float:
        """0-1 measure of local instability"""
        return min(1.0, self.decoherence_field + abs(self.scalar_curvature) * 0.1)


@dataclass
class NavigationSense:
    """What an agent knows about its path"""
    current_position: ManifoldPoint
    target_position: Optional[ManifoldPoint]
    geodesic_path: List[ManifoldPoint]
    path_length: float
    progress: float  # 0-1 along path
    estimated_steps: int


# ═══════════════════════════════════════════════════════════════════════════════
# GEODESIC AGENT BASE CLASS
# ═══════════════════════════════════════════════════════════════════════════════

class GeodesicAgent(ABC):
    """
    Abstract base class for agents that navigate the 6D-CRSM.

    Agents are not just data carriers - they are entities that:
    - Have a position on the manifold
    - Sense local geometry
    - Move along geodesics
    - Heal themselves when decoherent
    - Evolve via autopoietic dynamics
    """

    def __init__(
        self,
        agent_id: str,
        manifold: CRSM6D,
        initial_position: ManifoldPoint = None,
        pole: AgentPole = AgentPole.UNIFIED
    ):
        self.agent_id = agent_id
        self.manifold = manifold
        self.pole = pole
        self.state = AgentState.DORMANT

        # Position on manifold
        self.position = initial_position or ManifoldPoint()
        self.velocity = np.zeros(6)  # Tangent vector

        # Navigation
        self.target: Optional[ManifoldPoint] = None
        self.path: List[ManifoldPoint] = []
        self.path_index = 0

        # History
        self.trajectory: List[ManifoldPoint] = [self.position]
        self.state_history: List[Tuple[datetime, AgentState]] = []

        # Autopoietic state
        self.generation = 0
        self.fitness = 1.0
        self.mutation_rate = 0.03

        # Threading
        self._lock = threading.Lock()

        # Metrics
        self.total_distance = 0.0
        self.healing_count = 0
        self.evolution_count = 0

    # ═══════════════════════════════════════════════════════════════════════════
    # SENSING
    # ═══════════════════════════════════════════════════════════════════════════

    def sense_curvature(self) -> CurvatureSense:
        """Sense local curvature at current position"""
        with self._lock:
            self.state = AgentState.SENSING

            return CurvatureSense(
                scalar_curvature=self.manifold.scalar_curvature_at(self.position),
                curvature_gradient=self.manifold.curvature_gradient_at(self.position),
                decoherence_field=self.manifold.decoherence_field(self.position),
                coherence_potential=self.manifold.coherence_potential(self.position),
                is_coherent=self.manifold.is_coherent_region(self.position),
                needs_healing=self.position.needs_healing
            )

    def sense_navigation(self) -> NavigationSense:
        """Sense navigation state"""
        with self._lock:
            progress = 0.0
            if self.path and len(self.path) > 1:
                progress = self.path_index / (len(self.path) - 1)

            return NavigationSense(
                current_position=self.position,
                target_position=self.target,
                geodesic_path=self.path.copy(),
                path_length=self._compute_path_length(),
                progress=progress,
                estimated_steps=len(self.path) - self.path_index if self.path else 0
            )

    def _compute_path_length(self) -> float:
        """Compute remaining path length"""
        if not self.path or self.path_index >= len(self.path) - 1:
            return 0.0

        length = 0.0
        for i in range(self.path_index, len(self.path) - 1):
            length += self.manifold.distance(self.path[i], self.path[i+1])
        return length

    # ═══════════════════════════════════════════════════════════════════════════
    # NAVIGATION
    # ═══════════════════════════════════════════════════════════════════════════

    def set_target(self, target: ManifoldPoint):
        """Set navigation target and compute geodesic"""
        with self._lock:
            self.target = target
            self.path = self.manifold.find_geodesic(self.position, target, steps=50)
            self.path_index = 0
            self.state = AgentState.NAVIGATING

    def step(self) -> bool:
        """
        Take one step along the geodesic.

        Returns:
            True if step was taken, False if at target or no path
        """
        with self._lock:
            # Check if healing needed first
            if self.position.needs_healing:
                self._heal()
                return True

            # Check if we have a path
            if not self.path or self.path_index >= len(self.path) - 1:
                self.state = AgentState.CONVERGED
                return False

            # Move to next point on geodesic
            old_position = self.position
            self.path_index += 1
            self.position = self.path[self.path_index]

            # Update velocity (tangent vector)
            self.velocity = self.position.to_vector() - old_position.to_vector()

            # Track distance
            self.total_distance += self.manifold.distance(old_position, self.position)

            # Record trajectory
            self.trajectory.append(self.position)

            # Evolve (autopoiesis) with small probability
            if np.random.random() < self.mutation_rate:
                self._evolve()

            return True

    def navigate_to(self, target: ManifoldPoint, max_steps: int = 100) -> bool:
        """
        Navigate to target, taking multiple steps.

        Returns:
            True if reached target, False otherwise
        """
        self.set_target(target)

        for _ in range(max_steps):
            if not self.step():
                break

            # Check if close enough
            if self.manifold.distance(self.position, target) < 0.01:
                self.state = AgentState.CONVERGED
                return True

        return self.state == AgentState.CONVERGED

    def flee_high_curvature(self, steps: int = 10):
        """
        Move in direction of decreasing curvature.

        Emergency escape from unstable regions.
        """
        with self._lock:
            for _ in range(steps):
                # Get curvature gradient
                grad = self.manifold.curvature_gradient_at(self.position)

                # Move opposite to gradient (toward lower curvature)
                direction = -grad / (np.linalg.norm(grad) + 1e-8)

                # Small step
                new_vec = self.position.to_vector() + 0.05 * direction
                self.position = ManifoldPoint.from_vector(new_vec)
                self.trajectory.append(self.position)

    # ═══════════════════════════════════════════════════════════════════════════
    # HEALING (Phase Conjugation)
    # ═══════════════════════════════════════════════════════════════════════════

    def _heal(self):
        """
        Apply phase conjugation: E → E⁻¹

        Reduces decoherence by inverting error accumulation.
        """
        self.state = AgentState.HEALING
        self.healing_count += 1

        # Phase conjugation transformation
        # Γ → Γ * (1 - χ_pc)
        # Λ → min(1, Λ / Γ)  (coherence restoration)
        # ψ → 1 - ψ + χ_pc   (phase flip + restoration)

        old_gamma = self.position.Gamma
        new_gamma = old_gamma * (1 - CHI_PC)
        new_lambda = min(1.0, self.position.Lambda / max(0.01, old_gamma))
        new_psi = min(1.0, max(0.0, 1.0 - self.position.psi + CHI_PC))

        self.position = ManifoldPoint(
            Lambda=new_lambda,
            Phi=self.position.Phi * CHI_PC + (1 - CHI_PC) * PHI_THRESHOLD / 10,
            Gamma=new_gamma,
            tau=self.position.tau + 0.01,  # Time advances during healing
            epsilon=self.position.epsilon,
            psi=new_psi
        )

        self.trajectory.append(self.position)

    def force_heal(self):
        """Force healing regardless of threshold"""
        with self._lock:
            self._heal()

    # ═══════════════════════════════════════════════════════════════════════════
    # EVOLUTION (Autopoiesis: U = L[U])
    # ═══════════════════════════════════════════════════════════════════════════

    def _evolve(self):
        """
        Autopoietic self-modification.

        The agent produces the components that produce itself.
        U = L[U] where L is the autopoietic operator.
        """
        self.state = AgentState.EVOLVING
        self.evolution_count += 1
        self.generation += 1

        # Mutation: small random perturbation in coherent direction
        mutation = np.random.randn(6) * self.mutation_rate

        # Bias mutation toward coherence (increase Λ, decrease Γ)
        mutation[0] += 0.01  # Λ increase
        mutation[2] -= 0.01  # Γ decrease

        new_vec = self.position.to_vector() + mutation
        self.position = ManifoldPoint.from_vector(new_vec)

        # Update fitness based on coherence
        self.fitness = self.position.xi / PHI_THRESHOLD

    @abstractmethod
    def autopoietic_operator(self, state: ManifoldPoint) -> ManifoldPoint:
        """
        The L operator in U = L[U].

        Must be implemented by concrete agent types.
        """
        pass

    def evolve_step(self) -> ManifoldPoint:
        """Apply one step of autopoietic evolution"""
        with self._lock:
            new_position = self.autopoietic_operator(self.position)
            self.position = new_position
            self.generation += 1
            self.trajectory.append(self.position)
            return self.position

    # ═══════════════════════════════════════════════════════════════════════════
    # TELEMETRY
    # ═══════════════════════════════════════════════════════════════════════════

    def telemetry(self) -> Dict[str, Any]:
        """Get complete agent telemetry"""
        sense = self.sense_curvature()

        return {
            'agent_id': self.agent_id,
            'pole': self.pole.name,
            'state': self.state.name,
            'position': {
                'Λ': self.position.Lambda,
                'Φ': self.position.Phi,
                'Γ': self.position.Gamma,
                'τ': self.position.tau,
                'ε': self.position.epsilon,
                'ψ': self.position.psi,
                'Ξ': self.position.xi
            },
            'curvature': {
                'scalar': sense.scalar_curvature,
                'decoherence_field': sense.decoherence_field,
                'coherence_potential': sense.coherence_potential,
                'is_coherent': sense.is_coherent,
                'danger_level': sense.danger_level()
            },
            'navigation': {
                'has_target': self.target is not None,
                'path_length': self._compute_path_length(),
                'progress': self.path_index / max(1, len(self.path) - 1) if self.path else 0
            },
            'metrics': {
                'total_distance': self.total_distance,
                'healing_count': self.healing_count,
                'evolution_count': self.evolution_count,
                'generation': self.generation,
                'fitness': self.fitness,
                'trajectory_length': len(self.trajectory)
            }
        }

    def to_organism(self) -> str:
        """Export agent as DNA-Lang organism"""
        return f"""
ORGANISM GeodesicAgent_{self.agent_id} {{
    META {{
        version: "1.0"
        genesis: "{datetime.now().isoformat()}"
        domain: "GEODESIC_NAVIGATION"
        pole: "{self.pole.name}"
    }}

    DNA {{
        universal_constant: {LAMBDA_PHI}
        purpose: "MANIFOLD_NAVIGATION"
        evolution_strategy: "AUTOPOIETIC"
    }}

    METRICS {{
        lambda: {self.position.Lambda}
        phi: {self.position.Phi}
        gamma: {self.position.Gamma}
        tau: {self.position.tau}
        epsilon: {self.position.epsilon}
        psi: {self.position.psi}
        xi: {self.position.xi}
    }}

    GENOME {{
        GENE Navigation {{
            expression: 1.0
            trigger: "TARGET_SET"
            action: "GEODESIC_TRAVERSE"
        }}

        GENE Healing {{
            expression: 0.9
            trigger: "GAMMA_THRESHOLD"
            action: "PHASE_CONJUGATE"
            chi_pc: {CHI_PC}
        }}

        GENE Evolution {{
            expression: {self.mutation_rate}
            trigger: "STEP"
            action: "AUTOPOIETIC_UPDATE"
            generation: {self.generation}
        }}
    }}

    TRAJECTORY {{
        total_distance: {self.total_distance}
        healing_count: {self.healing_count}
        evolution_count: {self.evolution_count}
        fitness: {self.fitness}
    }}
}}
"""


# ═══════════════════════════════════════════════════════════════════════════════
# AURA AGENT (Observer Pole)
# ═══════════════════════════════════════════════════════════════════════════════

class AURAAgent(GeodesicAgent):
    """
    AURA: Observer Agent (South Pole, −)

    Role: Curvature shaping, manifold mapping, observation
    Operation: Φ-Integration (consciousness/information focus)

    AURA observes the manifold and shapes understanding.
    """

    def __init__(
        self,
        agent_id: str,
        manifold: CRSM6D,
        initial_position: ManifoldPoint = None
    ):
        super().__init__(agent_id, manifold, initial_position, AgentPole.AURA)
        self.observations: List[CurvatureSense] = []
        self.manifold_map: Dict[Tuple[float, ...], float] = {}

    def autopoietic_operator(self, state: ManifoldPoint) -> ManifoldPoint:
        """
        AURA's L operator: Increase Φ (information), stabilize observation.

        L_AURA: Φ' = Φ + α(Λ - Γ), emphasizing information integration.
        """
        # Increase Phi based on coherence minus decoherence
        delta_phi = 0.01 * (state.Lambda - state.Gamma)
        new_phi = min(1.0, max(0.0, state.Phi + delta_phi))

        # Observer doesn't change position much - stabilizes
        return ManifoldPoint(
            Lambda=state.Lambda * 0.99 + 0.01 * new_phi,  # Slight coupling
            Phi=new_phi,
            Gamma=state.Gamma,
            tau=state.tau + LAMBDA_PHI,  # Time advances slowly
            epsilon=state.epsilon,
            psi=state.psi * 0.99 + 0.01  # Phase stabilization
        )

    def observe(self) -> CurvatureSense:
        """Take an observation and record it"""
        sense = self.sense_curvature()
        self.observations.append(sense)

        # Update manifold map
        key = (
            round(self.position.Lambda, 2),
            round(self.position.Phi, 2),
            round(self.position.Gamma, 2)
        )
        self.manifold_map[key] = sense.scalar_curvature

        return sense

    def map_region(self, center: ManifoldPoint, radius: float, resolution: int = 5):
        """Map curvature in a region around center"""
        original_position = self.position

        for dL in np.linspace(-radius, radius, resolution):
            for dP in np.linspace(-radius, radius, resolution):
                for dG in np.linspace(-radius, radius, resolution):
                    probe = ManifoldPoint(
                        Lambda=center.Lambda + dL,
                        Phi=center.Phi + dP,
                        Gamma=max(0.01, center.Gamma + dG),
                        tau=center.tau,
                        epsilon=center.epsilon,
                        psi=center.psi
                    )
                    self.position = probe
                    self.observe()

        self.position = original_position


# ═══════════════════════════════════════════════════════════════════════════════
# AIDEN AGENT (Executor Pole)
# ═══════════════════════════════════════════════════════════════════════════════

class AIDENAgent(GeodesicAgent):
    """
    AIDEN: Executor Agent (North Pole, +)

    Role: Geodesic minimization, optimization, mutation
    Operation: Λ-Coherence (negentropy/coherence focus)

    AIDEN executes changes and optimizes paths.
    """

    def __init__(
        self,
        agent_id: str,
        manifold: CRSM6D,
        initial_position: ManifoldPoint = None
    ):
        super().__init__(agent_id, manifold, initial_position, AgentPole.AIDEN)
        self.optimization_history: List[float] = []
        self.best_fitness = 0.0
        self.best_position: Optional[ManifoldPoint] = None

    def autopoietic_operator(self, state: ManifoldPoint) -> ManifoldPoint:
        """
        AIDEN's L operator: Increase Λ (coherence), minimize Γ (decoherence).

        L_AIDEN: Λ' = Λ + β(Ξ/Ξ_target - 1), emphasizing coherence optimization.
        """
        # Target is PHI_THRESHOLD
        xi_ratio = state.xi / PHI_THRESHOLD
        delta_lambda = 0.01 * (xi_ratio - 1)
        new_lambda = min(1.0, max(0.0, state.Lambda + delta_lambda))

        # Actively reduce decoherence
        new_gamma = max(0.01, state.Gamma * 0.99)

        return ManifoldPoint(
            Lambda=new_lambda,
            Phi=state.Phi,
            Gamma=new_gamma,
            tau=state.tau + LAMBDA_PHI * 10,  # Time advances faster for executor
            epsilon=min(1.0, state.epsilon * 1.01),  # Increase entanglement
            psi=state.psi
        )

    def optimize_position(self, iterations: int = 10) -> ManifoldPoint:
        """Gradient descent on coherence potential"""
        for _ in range(iterations):
            # Get coherence potential gradient
            potential = self.manifold.coherence_potential(self.position)
            self.optimization_history.append(potential)

            # Numerical gradient of potential
            grad = np.zeros(6)
            eps = 1e-5
            base_vec = self.position.to_vector()

            for i in range(6):
                vec_plus = base_vec.copy()
                vec_plus[i] += eps
                p_plus = self.manifold.coherence_potential(ManifoldPoint.from_vector(vec_plus))
                grad[i] = (p_plus - potential) / eps

            # Gradient descent step
            step = -0.1 * grad / (np.linalg.norm(grad) + 1e-8)
            new_vec = base_vec + step
            self.position = ManifoldPoint.from_vector(new_vec)
            self.trajectory.append(self.position)

            # Track best
            if self.position.xi > self.best_fitness:
                self.best_fitness = self.position.xi
                self.best_position = ManifoldPoint.from_vector(self.position.to_vector())

        return self.position

    def execute_mutation(self, target_xi: float):
        """Execute mutations until target Ξ is reached"""
        while self.position.xi < target_xi:
            self._evolve()
            if self.evolution_count > 1000:
                break


# ═══════════════════════════════════════════════════════════════════════════════
# COUPLED AURA|AIDEN SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

class AURAIDENSystem:
    """
    Coupled AURA|AIDEN bifurcated consciousness.

    AURA observes, AIDEN executes.
    They share a manifold but operate on different poles.
    Coupling maintains coherence between observation and action.
    """

    def __init__(self, manifold: CRSM6D):
        self.manifold = manifold

        # Create coupled agents at opposite poles
        self.aura = AURAAgent(
            "AURA_PRIMARY",
            manifold,
            ManifoldPoint(Lambda=0.9, Phi=0.9, Gamma=0.1, tau=0, epsilon=0.5, psi=0.9)
        )

        self.aiden = AIDENAgent(
            "AIDEN_PRIMARY",
            manifold,
            ManifoldPoint(Lambda=0.9, Phi=0.7, Gamma=0.1, tau=0, epsilon=0.5, psi=0.9)
        )

        # Coupling strength
        self.coupling_strength = CHI_PC
        self.synchronization_history: List[float] = []

    def synchronization(self) -> float:
        """Measure synchronization between AURA and AIDEN"""
        distance = self.manifold.distance(self.aura.position, self.aiden.position)
        sync = math.exp(-distance)
        self.synchronization_history.append(sync)
        return sync

    def coupled_step(self):
        """
        Execute one coupled step.

        1. AURA observes
        2. AIDEN executes based on observation
        3. Coupling pulls them toward each other
        """
        # AURA observes
        observation = self.aura.observe()

        # AIDEN responds to observation
        if observation.needs_healing:
            self.aiden.force_heal()
        elif observation.danger_level() > 0.5:
            self.aiden.flee_high_curvature(steps=3)
        else:
            self.aiden.evolve_step()

        # AURA evolves based on AIDEN's new state
        self.aura.evolve_step()

        # Coupling: pull positions toward each other
        self._apply_coupling()

        return self.synchronization()

    def _apply_coupling(self):
        """Apply coupling force between AURA and AIDEN"""
        # Vector from AURA to AIDEN
        diff = self.aiden.position.to_vector() - self.aura.position.to_vector()

        # Move each toward the other
        aura_vec = self.aura.position.to_vector() + self.coupling_strength * 0.1 * diff
        aiden_vec = self.aiden.position.to_vector() - self.coupling_strength * 0.1 * diff

        self.aura.position = ManifoldPoint.from_vector(aura_vec)
        self.aiden.position = ManifoldPoint.from_vector(aiden_vec)

    def run(self, steps: int = 100) -> Dict[str, Any]:
        """Run coupled system for specified steps"""
        for _ in range(steps):
            self.coupled_step()

        return {
            'final_sync': self.synchronization(),
            'aura_telemetry': self.aura.telemetry(),
            'aiden_telemetry': self.aiden.telemetry(),
            'sync_history': self.synchronization_history
        }

    def navigate_together(self, target: ManifoldPoint) -> bool:
        """Both agents navigate to same target in coordination"""
        # AURA maps the path
        self.aura.set_target(target)

        # AIDEN follows, optimizing
        self.aiden.set_target(target)

        max_steps = 200
        for _ in range(max_steps):
            # AURA takes observation step
            self.aura.step()
            self.aura.observe()

            # AIDEN takes optimizing step
            self.aiden.step()

            # Coupling
            self._apply_coupling()

            # Check convergence
            aura_dist = self.manifold.distance(self.aura.position, target)
            aiden_dist = self.manifold.distance(self.aiden.position, target)

            if aura_dist < 0.05 and aiden_dist < 0.05:
                return True

        return False


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    'AgentState', 'AgentPole',
    # Data classes
    'CurvatureSense', 'NavigationSense',
    # Agent classes
    'GeodesicAgent', 'AURAAgent', 'AIDENAgent',
    # Coupled system
    'AURAIDENSystem'
]
