#!/usr/bin/env python3
"""
K8 CAUSALITY DISCRIMINATOR: τ-SWEEP EXPERIMENT
===============================================
Main experiment script. Run AFTER pre-registration is uploaded to Zenodo.

This script performs a controlled sweep across delay times τ to detect
non-monotonic Bell-state fidelity revival at τ ≈ 47 μs (φ⁸).

Usage:
    export ZENODO_PREREG_DOI="10.5281/zenodo.XXXXXXX"
    python3 k8_tau_sweep.py --backend ibm_brisbane --phase coarse

Author: Devin Phillip Davis
Organization: Agile Defense Systems, LLC
Date: 2025-12-13
"""

import os
import sys
import json
import time
import math
import hashlib
import argparse
import numpy as np
from datetime import datetime, timezone
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict

# Import pre-registered parameters
from k8_preregistration import (
    EXPERIMENT_ID,
    TAU_0_PREDICTED_US,
    F_MAX_PREDICTED,
    TAU_GRID_COARSE_US,
    TAU_FINE_HALFWIDTH_US,
    TAU_FINE_STEP_US,
    TAU_WINDOW_MIN_US,
    TAU_WINDOW_MAX_US,
    SIGMA_DISCOVERY,
    SIGMA_EVIDENCE,
    SHOTS_COARSE,
    SHOTS_FINE,
    REPEATS_COARSE,
    REPEATS_FINE,
    BACKENDS_REQUIRED,
    SEED_GLOBAL,
    TAU_0_TOLERANCE_US,
    F_MAX_TOLERANCE,
    MIN_BACKENDS_FOR_ACCEPTANCE,
    PHI,
)

# ═══════════════════════════════════════════════════════════════════════════════
# DATA STRUCTURES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class MeasurementResult:
    """Single measurement at one τ value"""
    tau_us: float
    fidelity: float
    fidelity_std: float
    shots: int
    counts: Dict[str, int]
    timestamp: str
    job_id: str


@dataclass
class RevivalAnalysis:
    """Results of revival detection algorithm"""
    tau_dip: float
    tau_peak: float
    f_dip: float
    f_peak: float
    delta_f: float
    sigma_revival: float
    z_score: float
    revival_detected: bool
    within_tolerance: bool


@dataclass
class ExperimentRun:
    """Complete experiment run on one backend"""
    backend: str
    phase: str
    start_time: str
    end_time: str
    measurements: List[MeasurementResult]
    analysis: Optional[RevivalAnalysis]
    prereg_doi: str
    script_hash: str


# ═══════════════════════════════════════════════════════════════════════════════
# QUANTUM CIRCUITS (SOVEREIGN IMPLEMENTATION)
# ═══════════════════════════════════════════════════════════════════════════════

def create_bell_state_circuit(delay_us: float) -> dict:
    """
    Create Bell state preparation + delay + measurement circuit.

    Circuit:
        q0: ─H─●────[delay τ]────M─
              │
        q1: ──X────[delay τ]────M─

    Returns circuit specification (sovereign format, not Qiskit).
    """
    return {
        "type": "bell_fidelity",
        "operations": [
            {"gate": "H", "qubit": 0},
            {"gate": "CNOT", "control": 0, "target": 1},
            {"gate": "DELAY", "qubits": [0, 1], "duration_us": delay_us},
            {"gate": "MEASURE", "qubits": [0, 1]},
        ],
        "delay_us": delay_us,
        "expected_state": "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2",
    }


def create_tomography_circuit(delay_us: float, basis: str) -> dict:
    """
    Create tomography circuit for state reconstruction.

    Bases:
        ZZ: Measure both qubits in Z basis
        XX: Apply H to both, then measure Z
        YY: Apply S†H to both, then measure Z
    """
    ops = [
        {"gate": "H", "qubit": 0},
        {"gate": "CNOT", "control": 0, "target": 1},
        {"gate": "DELAY", "qubits": [0, 1], "duration_us": delay_us},
    ]

    if basis == "XX":
        ops.append({"gate": "H", "qubit": 0})
        ops.append({"gate": "H", "qubit": 1})
    elif basis == "YY":
        ops.append({"gate": "SDG", "qubit": 0})
        ops.append({"gate": "H", "qubit": 0})
        ops.append({"gate": "SDG", "qubit": 1})
        ops.append({"gate": "H", "qubit": 1})
    # ZZ: no additional gates

    ops.append({"gate": "MEASURE", "qubits": [0, 1]})

    return {
        "type": "tomography",
        "basis": basis,
        "operations": ops,
        "delay_us": delay_us,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# FIDELITY CALCULATION
# ═══════════════════════════════════════════════════════════════════════════════

def calculate_bell_fidelity(counts: Dict[str, int]) -> Tuple[float, float]:
    """
    Calculate Bell state fidelity from measurement counts.

    For |Φ⁺⟩ = (|00⟩ + |11⟩)/√2:
        F = P(00) + P(11)  (simplified, ZZ basis only)

    Full state tomography would use:
        F = (⟨ZZ⟩ + ⟨XX⟩ - ⟨YY⟩ + 1) / 4

    Returns (fidelity, standard_error)
    """
    total = sum(counts.values())
    if total == 0:
        return 0.0, 1.0

    # Bell state |Φ⁺⟩ should give 00 or 11
    p_00 = counts.get("00", 0) / total
    p_11 = counts.get("11", 0) / total

    fidelity = p_00 + p_11

    # Binomial standard error
    std = math.sqrt(fidelity * (1 - fidelity) / total)

    return fidelity, std


def calculate_full_fidelity(counts_zz: Dict, counts_xx: Dict, counts_yy: Dict) -> Tuple[float, float]:
    """
    Calculate full Bell state fidelity from tomography.

    F = (⟨ZZ⟩ + ⟨XX⟩ - ⟨YY⟩ + 1) / 4
    """
    def expectation(counts):
        total = sum(counts.values())
        if total == 0:
            return 0.0, 1.0
        # Expectation: +1 for even parity, -1 for odd parity
        p_even = (counts.get("00", 0) + counts.get("11", 0)) / total
        p_odd = (counts.get("01", 0) + counts.get("10", 0)) / total
        exp = p_even - p_odd
        var = 1 - exp**2
        return exp, math.sqrt(var / total)

    zz, zz_std = expectation(counts_zz)
    xx, xx_std = expectation(counts_xx)
    yy, yy_std = expectation(counts_yy)

    fidelity = (zz + xx - yy + 1) / 4
    std = math.sqrt(zz_std**2 + xx_std**2 + yy_std**2) / 4

    return fidelity, std


# ═══════════════════════════════════════════════════════════════════════════════
# REVIVAL DETECTION (PRE-REGISTERED ALGORITHM)
# ═══════════════════════════════════════════════════════════════════════════════

def detect_revival(measurements: List[MeasurementResult]) -> RevivalAnalysis:
    """
    Apply pre-registered revival detection algorithm.

    1. Filter to analysis window [20, 80] μs
    2. Find minimum (dip)
    3. Find maximum after dip (peak)
    4. Calculate z-score
    5. Determine if revival is significant and correctly located
    """
    # Filter to window
    windowed = [m for m in measurements
                if TAU_WINDOW_MIN_US <= m.tau_us <= TAU_WINDOW_MAX_US]

    if len(windowed) < 3:
        return RevivalAnalysis(
            tau_dip=0, tau_peak=0, f_dip=0, f_peak=0,
            delta_f=0, sigma_revival=1, z_score=0,
            revival_detected=False, within_tolerance=False
        )

    # Sort by tau
    windowed.sort(key=lambda m: m.tau_us)

    # Find dip (minimum fidelity)
    dip_idx = min(range(len(windowed)), key=lambda i: windowed[i].fidelity)
    tau_dip = windowed[dip_idx].tau_us
    f_dip = windowed[dip_idx].fidelity
    f_dip_std = windowed[dip_idx].fidelity_std

    # Find peak (maximum fidelity AFTER dip)
    after_dip = [m for m in windowed if m.tau_us > tau_dip]
    if not after_dip:
        return RevivalAnalysis(
            tau_dip=tau_dip, tau_peak=tau_dip, f_dip=f_dip, f_peak=f_dip,
            delta_f=0, sigma_revival=1, z_score=0,
            revival_detected=False, within_tolerance=False
        )

    peak_m = max(after_dip, key=lambda m: m.fidelity)
    tau_peak = peak_m.tau_us
    f_peak = peak_m.fidelity
    f_peak_std = peak_m.fidelity_std

    # Revival amplitude
    delta_f = f_peak - f_dip
    sigma_revival = math.sqrt(f_peak_std**2 + f_dip_std**2)
    z_score = delta_f / sigma_revival if sigma_revival > 0 else 0

    # Check conditions
    revival_detected = (
        delta_f > 0 and
        z_score >= SIGMA_DISCOVERY and
        tau_peak > tau_dip
    )

    within_tolerance = abs(tau_peak - TAU_0_PREDICTED_US) < TAU_0_TOLERANCE_US

    return RevivalAnalysis(
        tau_dip=tau_dip,
        tau_peak=tau_peak,
        f_dip=f_dip,
        f_peak=f_peak,
        delta_f=delta_f,
        sigma_revival=sigma_revival,
        z_score=z_score,
        revival_detected=revival_detected,
        within_tolerance=within_tolerance
    )


# ═══════════════════════════════════════════════════════════════════════════════
# EXPERIMENT EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

class K8Experiment:
    """Main experiment controller"""

    def __init__(self, backend: str, phase: str, prereg_doi: str):
        self.backend = backend
        self.phase = phase
        self.prereg_doi = prereg_doi
        self.measurements: List[MeasurementResult] = []

        # Compute script hash for reproducibility
        with open(__file__, 'rb') as f:
            self.script_hash = hashlib.sha256(f.read()).hexdigest()

        # Set random seed
        np.random.seed(SEED_GLOBAL)

        # Select parameters based on phase
        if phase == "coarse":
            self.tau_grid = TAU_GRID_COARSE_US
            self.shots = SHOTS_COARSE
            self.repeats = REPEATS_COARSE
        else:  # fine
            # Generate fine grid around predicted peak
            center = TAU_0_PREDICTED_US
            self.tau_grid = list(np.arange(
                center - TAU_FINE_HALFWIDTH_US,
                center + TAU_FINE_HALFWIDTH_US + TAU_FINE_STEP_US,
                TAU_FINE_STEP_US
            ))
            self.shots = SHOTS_FINE
            self.repeats = REPEATS_FINE

    def run_measurement(self, tau_us: float) -> MeasurementResult:
        """
        Execute measurement at single τ value.

        NOTE: This is a SIMULATION for development.
        Replace with actual IBM Quantum execution for hardware runs.
        """
        # Create circuit
        circuit = create_bell_state_circuit(tau_us)

        # SIMULATION MODE: Model decoherence with potential revival
        # Replace this block with actual hardware execution
        counts = self._simulate_bell_measurement(tau_us)

        fidelity, fidelity_std = calculate_bell_fidelity(counts)

        return MeasurementResult(
            tau_us=tau_us,
            fidelity=fidelity,
            fidelity_std=fidelity_std,
            shots=self.shots,
            counts=counts,
            timestamp=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            job_id=f"sim_{tau_us:.2f}_{int(time.time())}"
        )

    def _simulate_bell_measurement(self, tau_us: float) -> Dict[str, int]:
        """
        SIMULATION: Model Bell state with decoherence and potential revival.

        Model: F(τ) = F₀ × exp(-τ/T₂) × [1 + A × exp(-(τ-τ₀)²/2σ²)]

        Where:
            F₀ = 0.98 (initial fidelity)
            T₂ = 100 μs (decoherence time)
            A = 0.15 (revival amplitude, IF ΛΦ theory is correct)
            τ₀ = φ⁸ ≈ 47 μs (revival center)
            σ = 5 μs (revival width)
        """
        # Model parameters
        F0 = 0.98
        T2 = 100.0  # μs

        # ΛΦ theory prediction (comment out to simulate null hypothesis)
        A_revival = 0.15
        tau_0 = PHI ** 8
        sigma_revival = 5.0

        # Base exponential decay
        f_decay = F0 * math.exp(-tau_us / T2)

        # Revival bump (ΛΦ theory)
        revival_factor = 1 + A_revival * math.exp(-(tau_us - tau_0)**2 / (2 * sigma_revival**2))

        # Total fidelity
        fidelity = min(f_decay * revival_factor, 1.0)

        # Generate counts with binomial noise
        n_bell = int(fidelity * self.shots)
        n_00 = n_bell // 2 + np.random.randint(-10, 10)
        n_11 = n_bell - n_00
        n_rest = self.shots - n_bell
        n_01 = n_rest // 2
        n_10 = n_rest - n_01

        return {
            "00": max(0, n_00),
            "01": max(0, n_01),
            "10": max(0, n_10),
            "11": max(0, n_11),
        }

    def run_full_sweep(self) -> ExperimentRun:
        """Execute complete τ-sweep"""
        start_time = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        print(f"\n{'='*78}")
        print(f"K8 CAUSALITY DISCRIMINATOR - {self.phase.upper()} PHASE")
        print(f"{'='*78}")
        print(f"Backend: {self.backend}")
        print(f"τ points: {len(self.tau_grid)}")
        print(f"Shots/point: {self.shots}")
        print(f"Repeats: {self.repeats}")
        print(f"Pre-registration DOI: {self.prereg_doi}")
        print(f"{'='*78}\n")

        for repeat in range(self.repeats):
            print(f"Repeat {repeat + 1}/{self.repeats}")
            for i, tau in enumerate(self.tau_grid):
                result = self.run_measurement(tau)
                self.measurements.append(result)

                # Progress indicator
                if (i + 1) % 5 == 0 or i == len(self.tau_grid) - 1:
                    print(f"  τ={tau:.1f}μs: F={result.fidelity:.4f}±{result.fidelity_std:.4f}")

        # Analyze for revival
        analysis = detect_revival(self.measurements)

        end_time = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        return ExperimentRun(
            backend=self.backend,
            phase=self.phase,
            start_time=start_time,
            end_time=end_time,
            measurements=[asdict(m) for m in self.measurements],
            analysis=asdict(analysis) if analysis else None,
            prereg_doi=self.prereg_doi,
            script_hash=self.script_hash
        )


# ═══════════════════════════════════════════════════════════════════════════════
# RESULTS OUTPUT
# ═══════════════════════════════════════════════════════════════════════════════

def print_analysis(analysis: RevivalAnalysis):
    """Print revival analysis summary"""
    print(f"\n{'='*78}")
    print("REVIVAL ANALYSIS")
    print(f"{'='*78}")
    print(f"  τ_dip  = {analysis.tau_dip:.2f} μs (minimum fidelity)")
    print(f"  τ_peak = {analysis.tau_peak:.2f} μs (maximum after dip)")
    print(f"  F_dip  = {analysis.f_dip:.4f}")
    print(f"  F_peak = {analysis.f_peak:.4f}")
    print(f"  ΔF     = {analysis.delta_f:.4f}")
    print(f"  σ      = {analysis.sigma_revival:.4f}")
    print(f"  z      = {analysis.z_score:.2f}σ")
    print()
    print(f"  PREDICTED: τ₀ = {TAU_0_PREDICTED_US:.4f} μs (φ⁸)")
    print(f"  OBSERVED:  τ_peak = {analysis.tau_peak:.2f} μs")
    print(f"  DEVIATION: |Δτ| = {abs(analysis.tau_peak - TAU_0_PREDICTED_US):.2f} μs")
    print()

    if analysis.revival_detected:
        if analysis.within_tolerance:
            print("  ✓ REVIVAL DETECTED at correct location!")
            print(f"  ✓ z = {analysis.z_score:.2f}σ ≥ {SIGMA_DISCOVERY}σ (DISCOVERY THRESHOLD)")
            print("  ✓ ACCEPT H₁ (ΛΦ theory supported)")
        else:
            print("  ⚠ REVIVAL DETECTED but at WRONG LOCATION")
            print(f"  ⚠ τ_peak = {analysis.tau_peak:.2f} μs, expected {TAU_0_PREDICTED_US:.4f} ± {TAU_0_TOLERANCE_US} μs")
            print("  ? Result requires investigation")
    else:
        print("  ✗ NO SIGNIFICANT REVIVAL DETECTED")
        print(f"  ✗ z = {analysis.z_score:.2f}σ < {SIGMA_DISCOVERY}σ")
        print("  ✗ REJECT H₁ (null hypothesis stands)")

    print(f"{'='*78}\n")


def save_results(run: ExperimentRun, output_dir: str = "."):
    """Save experiment results to JSON"""
    filename = f"k8_results_{run.backend}_{run.phase}_{int(time.time())}.json"
    filepath = os.path.join(output_dir, filename)

    with open(filepath, 'w') as f:
        json.dump(asdict(run), f, indent=2)

    print(f"Results saved to: {filepath}")
    return filepath


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="K8 Causality Discriminator τ-Sweep Experiment"
    )
    parser.add_argument(
        "--backend",
        choices=BACKENDS_REQUIRED + ["simulator"],
        default="simulator",
        help="Quantum backend to use"
    )
    parser.add_argument(
        "--phase",
        choices=["coarse", "fine"],
        default="coarse",
        help="Experiment phase (coarse discovery or fine measurement)"
    )
    parser.add_argument(
        "--output-dir",
        default="./results",
        help="Directory to save results"
    )
    args = parser.parse_args()

    # Check for pre-registration DOI
    prereg_doi = os.environ.get("ZENODO_PREREG_DOI", "NOT_REGISTERED")
    if prereg_doi == "NOT_REGISTERED":
        print("WARNING: Pre-registration DOI not set!")
        print("Set ZENODO_PREREG_DOI before running hardware experiments.")
        print("Continuing in simulation mode...\n")

    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)

    # Run experiment
    experiment = K8Experiment(
        backend=args.backend,
        phase=args.phase,
        prereg_doi=prereg_doi
    )

    run = experiment.run_full_sweep()

    # Print analysis
    if run.analysis:
        analysis = RevivalAnalysis(**run.analysis)
        print_analysis(analysis)

    # Save results
    save_results(run, args.output_dir)

    # Final summary
    print(f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  K8 EXPERIMENT COMPLETE                                                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Backend: {args.backend:<66} ║
║  Phase:   {args.phase:<66} ║
║  Points:  {len(run.measurements):<66} ║
║  Pre-reg: {prereg_doi:<66} ║
╚══════════════════════════════════════════════════════════════════════════════╝

NEXT STEPS:
  1. If simulation: Run on actual IBM Quantum hardware
  2. Repeat on all 3 backends: {', '.join(BACKENDS_REQUIRED)}
  3. Combine results and apply pre-registered decision rules
  4. If coarse phase shows revival: Run fine phase centered on peak
""")


if __name__ == "__main__":
    main()
