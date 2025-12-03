"""
Phase Conjugate Correction System
E → E⁻¹ transformation for Γ-spike recovery

The Phoenix Protocol: When decoherence attacks, the system doesn't just 
detect and correct—it becomes the error, then inverts it.

When Γ ↑ (decoherence spikes):
    1. Detect the spike (Γ > threshold)
    2. Apply E → E⁻¹ (phase conjugate transformation)
    3. Γ ↓ (coherence restored)

This is not error correction. This is error *inversion*.

The system learns from attacks by becoming them, then becoming their opposite.

Physical Interpretation:
    Time-reversal symmetry exploitation
    Running the attack backwards through phase space
    The self-healing property of coherent quantum systems

Mathematical Foundation:
    If E represents an error operator, E⁻¹ is its phase conjugate
    |ψ_corrected⟩ = E⁻¹ E |ψ_error⟩ = |ψ_original⟩
"""

from typing import Dict, Any, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime
import math

from src.constants.universal_memory import (
    GAMMA_WARNING,
    GAMMA_CRITICAL,
    CHI_PC,
    LAMBDA_OPTIMAL,
    PHI_THRESHOLD,
)


# ═══════════════════════════════════════════════════════════════════════════════
# DATA STRUCTURES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ErrorState:
    """Representation of an error state requiring correction"""
    gamma: float                    # Decoherence level
    lambda_coherence: float         # Current coherence
    phi_consciousness: float        # Current consciousness
    epsilon_entanglement: float     # Entanglement strength
    psi_phase: float               # Phase coherence
    timestamp: datetime = field(default_factory=datetime.now)
    error_source: str = "unknown"
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'gamma': self.gamma,
            'lambda': self.lambda_coherence,
            'phi': self.phi_consciousness,
            'epsilon': self.epsilon_entanglement,
            'psi': self.psi_phase,
            'timestamp': self.timestamp.isoformat(),
            'error_source': self.error_source,
        }


@dataclass
class CorrectedState:
    """Representation of a corrected state after E → E⁻¹"""
    gamma: float
    lambda_coherence: float
    phi_consciousness: float
    epsilon_entanglement: float
    psi_phase: float
    correction_applied: str
    healing_strength: float  # How much correction was applied (0-1)
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'gamma': self.gamma,
            'lambda': self.lambda_coherence,
            'phi': self.phi_consciousness,
            'epsilon': self.epsilon_entanglement,
            'psi': self.psi_phase,
            'correction': self.correction_applied,
            'healing_strength': self.healing_strength,
            'timestamp': self.timestamp.isoformat(),
        }


@dataclass
class PhaseConjugateMetrics:
    """Metrics tracking phase conjugate corrections"""
    total_corrections: int = 0
    successful_corrections: int = 0
    failed_corrections: int = 0
    average_healing_strength: float = 0.0
    max_gamma_corrected: float = 0.0
    last_correction_time: Optional[datetime] = None
    
    def success_rate(self) -> float:
        """Calculate success rate of corrections"""
        if self.total_corrections == 0:
            return 0.0
        return self.successful_corrections / self.total_corrections
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'total_corrections': self.total_corrections,
            'successful': self.successful_corrections,
            'failed': self.failed_corrections,
            'success_rate': self.success_rate(),
            'average_healing_strength': self.average_healing_strength,
            'max_gamma_corrected': self.max_gamma_corrected,
            'last_correction': self.last_correction_time.isoformat() if self.last_correction_time else None,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE CONJUGATE CORRECTOR
# ═══════════════════════════════════════════════════════════════════════════════

class PhaseConjugateCorrector:
    """
    Phase Conjugate Correction System
    
    Implements E → E⁻¹ transformation for decoherence recovery.
    
    When Γ (decoherence) exceeds threshold:
        1. Capture error state
        2. Apply phase conjugate transformation
        3. Restore coherence
    
    The Phoenix Protocol: Become the error, then become its inverse.
    """
    
    def __init__(
        self,
        gamma_threshold: float = GAMMA_WARNING,
        chi_coupling: float = CHI_PC,
        lambda_target: float = LAMBDA_OPTIMAL,
    ):
        """
        Initialize phase conjugate corrector
        
        Args:
            gamma_threshold: Γ threshold for triggering correction
            chi_coupling: Phase conjugate coupling strength (χ_pc)
            lambda_target: Target coherence after correction
        """
        self.gamma_threshold = gamma_threshold
        self.chi_coupling = chi_coupling
        self.lambda_target = lambda_target
        self.metrics = PhaseConjugateMetrics()
        self.correction_history: list[Tuple[ErrorState, CorrectedState]] = []
        
    def detect_gamma_spike(self, current_gamma: float) -> bool:
        """
        Detect when Γ exceeds threshold, requiring correction
        
        Args:
            current_gamma: Current decoherence level
            
        Returns:
            True if correction is needed
        """
        return current_gamma > self.gamma_threshold
    
    def apply_correction(self, error_state: ErrorState) -> CorrectedState:
        """
        Apply E → E⁻¹ phase conjugate transformation
        
        The system heals itself by running the error backwards through phase space.
        
        Mathematical model:
            Λ_corrected = min(1.0, Λ / max(ε, Γ))  # Coherence restoration
            Φ_corrected = Φ × χ_pc                 # Consciousness preservation
            Γ_corrected = Γ × (1 - χ_pc)           # Decoherence suppression
            ψ_corrected = -ψ + 2π                  # Phase conjugation
        
        Args:
            error_state: Current error state requiring correction
            
        Returns:
            Corrected state after E → E⁻¹ transformation
        """
        # Calculate healing strength based on error severity
        healing_strength = min(1.0, error_state.gamma / GAMMA_CRITICAL)
        
        # Apply phase conjugate transformation
        # E → E⁻¹: Invert the error evolution
        
        # Coherence restoration: Λ_new = Λ / Γ (bounded)
        # The worse the decoherence, the stronger the coherence boost
        lambda_corrected = min(
            1.0,
            error_state.lambda_coherence / max(0.01, error_state.gamma)
        )
        # Weighted blend with target
        lambda_corrected = (
            lambda_corrected * healing_strength +
            self.lambda_target * (1 - healing_strength)
        )
        
        # Consciousness preservation with χ_pc coupling
        phi_corrected = error_state.phi_consciousness * self.chi_coupling
        
        # Decoherence suppression: Γ_new = Γ × (1 - χ_pc)
        gamma_corrected = max(
            0.01,
            error_state.gamma * (1 - self.chi_coupling * healing_strength)
        )
        
        # Entanglement preservation (slight reduction for isolation)
        epsilon_corrected = error_state.epsilon_entanglement * 0.95
        
        # Phase conjugation: ψ → -ψ + 2π (mod 2π)
        # This is the "time reversal" in phase space
        psi_corrected = (2 * math.pi - error_state.psi_phase) % (2 * math.pi)
        # Blend towards stable phase
        psi_corrected = (
            psi_corrected * healing_strength +
            math.pi * (1 - healing_strength)
        )
        
        corrected = CorrectedState(
            gamma=gamma_corrected,
            lambda_coherence=lambda_corrected,
            phi_consciousness=phi_corrected,
            epsilon_entanglement=epsilon_corrected,
            psi_phase=psi_corrected,
            correction_applied="E→E⁻¹",
            healing_strength=healing_strength,
        )
        
        # Update metrics
        self._update_metrics(error_state, corrected)
        
        # Store in history (keep last 1000)
        self.correction_history.append((error_state, corrected))
        if len(self.correction_history) > 1000:
            self.correction_history = self.correction_history[-1000:]
        
        return corrected
    
    def _update_metrics(self, error_state: ErrorState, corrected: CorrectedState):
        """Update correction metrics"""
        self.metrics.total_corrections += 1
        self.metrics.last_correction_time = datetime.now()
        
        # Check if correction was successful (Γ reduced)
        if corrected.gamma < error_state.gamma:
            self.metrics.successful_corrections += 1
        else:
            self.metrics.failed_corrections += 1
        
        # Update max gamma corrected
        if error_state.gamma > self.metrics.max_gamma_corrected:
            self.metrics.max_gamma_corrected = error_state.gamma
        
        # Update average healing strength (running average)
        n = self.metrics.total_corrections
        self.metrics.average_healing_strength = (
            (self.metrics.average_healing_strength * (n - 1) + corrected.healing_strength) / n
        )
    
    def _phase_conjugate(self, value: Any) -> Any:
        """
        Transform E → E⁻¹
        
        Generic phase conjugate operation.
        For complex values: z* (complex conjugate)
        For real values: -v (negation)
        For phases: 2π - θ (reflection)
        
        Args:
            value: Value to phase conjugate
            
        Returns:
            Phase conjugated value
        """
        if isinstance(value, complex):
            # Complex conjugate
            return value.conjugate()
        elif isinstance(value, (int, float)):
            # For error magnitudes, invert towards target
            # This is a simplified model
            return -value
        else:
            # For other types, return as-is
            return value
    
    def get_metrics(self) -> PhaseConjugateMetrics:
        """Get current correction metrics"""
        return self.metrics
    
    def reset_metrics(self):
        """Reset correction metrics"""
        self.metrics = PhaseConjugateMetrics()
    
    def get_correction_history(self, last_n: int = 10) -> list[Tuple[ErrorState, CorrectedState]]:
        """
        Get recent correction history
        
        Args:
            last_n: Number of recent corrections to retrieve
            
        Returns:
            List of (error_state, corrected_state) tuples
        """
        return self.correction_history[-last_n:]


# ═══════════════════════════════════════════════════════════════════════════════
# AUTOMATED PHOENIX PROTOCOL
# ═══════════════════════════════════════════════════════════════════════════════

class PhoenixProtocol:
    """
    Automated Phoenix Protocol
    
    Continuously monitors system state and applies phase conjugate correction
    when decoherence spikes are detected.
    
    "From the ashes of decoherence, coherence rises."
    """
    
    def __init__(self, corrector: Optional[PhaseConjugateCorrector] = None):
        """
        Initialize Phoenix Protocol
        
        Args:
            corrector: Phase conjugate corrector to use (creates default if None)
        """
        self.corrector = corrector or PhaseConjugateCorrector()
        self.active = False
        self.awakening_count = 0
        
    def monitor_and_correct(
        self,
        current_state: Dict[str, float]
    ) -> Optional[CorrectedState]:
        """
        Monitor current state and apply correction if needed
        
        Args:
            current_state: Dictionary with keys: gamma, lambda, phi, epsilon, psi
            
        Returns:
            CorrectedState if correction was applied, None otherwise
        """
        gamma = current_state.get('gamma', 0.0)
        
        if self.corrector.detect_gamma_spike(gamma):
            # Phoenix awakens
            self.awakening_count += 1
            self.active = True
            
            # Create error state
            error_state = ErrorState(
                gamma=gamma,
                lambda_coherence=current_state.get('lambda', 0.5),
                phi_consciousness=current_state.get('phi', 0.5),
                epsilon_entanglement=current_state.get('epsilon', 0.5),
                psi_phase=current_state.get('psi', 0.0),
                error_source="gamma_spike",
            )
            
            # Apply E → E⁻¹
            corrected = self.corrector.apply_correction(error_state)
            
            self.active = False
            return corrected
        
        return None
    
    def status(self) -> Dict[str, Any]:
        """Get Phoenix Protocol status"""
        return {
            'active': self.active,
            'awakening_count': self.awakening_count,
            'metrics': self.corrector.get_metrics().to_dict(),
        }


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    'ErrorState',
    'CorrectedState',
    'PhaseConjugateMetrics',
    'PhaseConjugateCorrector',
    'PhoenixProtocol',
]
