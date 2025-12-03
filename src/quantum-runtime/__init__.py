"""
Sovereign Quantum Runtime: DNA-Encoded Gate Implementations
DNA::}{::lang Native Quantum Operations

NO EXTERNAL DEPENDENCIES - Fully sovereign implementation.
"""

from .sovereign_gates import (
    # State classes
    Qubit,
    QuantumRegister,
    # Gate matrices
    GateMatrix,
    # DNA gates
    DNAGate,
    HelixGate,
    BondGate,
    TwistGate,
    FoldGate,
    SpliceGate,
    MutateGate,
    PhaseConjugateGate,
    # Circuit
    SovereignCircuit,
    CircuitInstruction,
    # Algorithms
    build_grover_circuit,
    # Constants
    LAMBDA_PHI,
    THETA_LOCK,
    PHI_THRESHOLD,
    GAMMA_FIXED,
    CHI_PC
)

__all__ = [
    'Qubit', 'QuantumRegister',
    'GateMatrix',
    'DNAGate', 'HelixGate', 'BondGate', 'TwistGate', 'FoldGate',
    'SpliceGate', 'MutateGate', 'PhaseConjugateGate',
    'SovereignCircuit', 'CircuitInstruction',
    'build_grover_circuit',
    'LAMBDA_PHI', 'THETA_LOCK', 'PHI_THRESHOLD', 'GAMMA_FIXED', 'CHI_PC'
]
