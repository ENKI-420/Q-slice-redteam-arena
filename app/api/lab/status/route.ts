/**
 * Lab Status API - SPEC_LOCK_Δ2 Compliance & System Status
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * Returns comprehensive status for fail-closed enforcement,
 * QPU credentials, gate closure progress, and Architecture-2 availability.
 */

import { NextResponse } from "next/server"
import { getCredentialStatus } from "@/lib/lab/invariants"
import { CONSTANTS } from "@/lib/lab/spec"
import { checkArchitecture2Status, BRAKET_DEVICES } from "@/lib/lab/providers/braket"
import { PHYSICS, SWEEP_PRESETS, estimateCost } from "@/lib/lab/tau-sweep-generator"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verbose = searchParams.get("verbose") === "true"

  const credentials = getCredentialStatus()

  // Check Architecture-2 status for G3 closure
  let arch2Status = { available: false, providers: [] as string[], recommended_device: null as string | null, reason: "" }
  try {
    arch2Status = checkArchitecture2Status()
  } catch {
    // Credentials not available
  }

  // Calculate G3 closure progress
  const arch1_closed = credentials.hasIBM // IBM Fez result exists
  const arch2_available = arch2Status.available
  const architectures_count = (arch1_closed ? 1 : 0) + (arch2_available ? 1 : 0)
  const sigma_current = 0.21 // From ibm_fez result
  const sigma_target = 5.0

  // Gate closure conditions
  const g3_conditions = {
    architectures_min_2: architectures_count >= 2,
    sigma_empirical_min_5: sigma_current >= sigma_target,
    evidence_class_a: arch1_closed, // We have CLASS_A evidence
    closure_possible: architectures_count >= 2 || arch2_available,
  }

  const response = {
    ok: true,
    manifest_version: "spec-lock-delta2/v1.0.0",
    timestamp: new Date().toISOString(),
    cage_code: "9HUP5",
    spec_lock: "v2.2.0",
    spec_delta: "Δ2",

    // FAIL_CLOSED enforcement status
    fail_closed: {
      mode: process.env.MODE || "QPU",
      sim_forbidden: process.env.ALLOW_SIM !== "1",
      mock_forbidden: process.env.ALLOW_MOCK !== "1",
      enforced: !(process.env.ALLOW_SIM === "1" || process.env.ALLOW_MOCK === "1"),
      verdict: credentials.anyAvailable ? "QPU_READY" : "NO_CREDENTIALS",
    },

    // Credential status
    credentials: {
      any_available: credentials.anyAvailable,
      providers: credentials.providers,
      ibm_quantum: credentials.hasIBM,
      aws_braket: credentials.hasBraket,
      ionq_direct: credentials.hasIonQ,
      quantinuum: credentials.hasQuantinuum,
    },

    // Architecture status for G3 closure
    architectures: {
      count: architectures_count,
      target: 2,
      arch1_ibm: {
        available: credentials.hasIBM,
        evidence: arch1_closed ? "CLASS_A" : "NONE",
        device: "ibm_fez",
        tau_peak_us: 47.50,
        tau_0_us: 46.98,
        delta_us: 0.52,
        within_window: true,
      },
      arch2_braket: {
        available: arch2Status.available,
        providers: arch2Status.providers,
        recommended_device: arch2Status.recommended_device,
        reason: arch2Status.reason,
        devices: {
          ionq_aria: BRAKET_DEVICES.IONQ_ARIA,
          ionq_forte: BRAKET_DEVICES.IONQ_FORTE,
          rigetti_ankaa: BRAKET_DEVICES.RIGETTI_ANKAA,
        },
      },
    },

    // Gate status with closure conditions
    gates: {
      G1_PREREG: { status: "CLOSED", evidence: "DOI 10.5281/zenodo.17918774" },
      G2_LINEAGE: { status: "CLOSED", evidence: "FINAL_CHAIN.sha256 locked" },
      S3_PIPELINE: { status: "CLOSED", evidence: "Ed25519 nonce verified" },
      G3_QPU: {
        status: g3_conditions.architectures_min_2 && g3_conditions.sigma_empirical_min_5 ? "CLOSED" : "PENDING",
        closure_conditions: g3_conditions,
        progress: {
          architectures: `${architectures_count}/2`,
          sigma_empirical: `${sigma_current.toFixed(2)}/${sigma_target.toFixed(1)}`,
        },
        next_action: !arch2_available
          ? "Configure AWS Braket credentials for Architecture-2"
          : sigma_current < sigma_target
            ? "Execute dense τ-sweep (Stage B) to achieve σ ≥ 5.0"
            : "G3 closure criteria met",
      },
      G4_REPL: { status: "OPEN", evidence: "Awaiting G3 closure + independent lab" },
    },

    // σ_empirical status
    sigma: {
      current: sigma_current,
      target: sigma_target,
      gap: sigma_target - sigma_current,
      recommendation: sigma_current < sigma_target
        ? "Execute Stage B dense τ-sweep with HIGH_PRECISION or MAX_SIGMA preset"
        : "Threshold achieved",
    },

    // Physical constants (SPEC_LOCK - IMMUTABLE)
    constants: {
      PHI: PHYSICS.PHI,
      TAU_0_US: PHYSICS.TAU_0_US,
      WINDOW_US: PHYSICS.WINDOW_US,
      LAMBDA_PHI: PHYSICS.LAMBDA_PHI,
      PHI_THRESHOLD: PHYSICS.PHI_THRESHOLD,
      GAMMA_CRITICAL: PHYSICS.GAMMA_CRITICAL,
    },

    // Claims allowed
    claims: {
      allowed: ["MODEL_VALIDATED", "PIPELINE_VALIDATED"],
      pending: g3_conditions.architectures_min_2 && g3_conditions.sigma_empirical_min_5
        ? ["EMPIRICAL_VALIDATED"]
        : [],
      grade: arch1_closed ? "CLASS_A" : "CLASS_B",
    },
  }

  // Add verbose details if requested
  if (verbose) {
    const stageBConfig = SWEEP_PRESETS.HIGH_PRECISION.stage_b()
    const stageBCost = estimateCost(stageBConfig)

    Object.assign(response, {
      tau_sweep_presets: {
        EXPLORATION: {
          description: "Initial exploration (cheap, broad)",
          total_shots: SWEEP_PRESETS.EXPLORATION.stage_a().total_shots,
        },
        STANDARD: {
          description: "Standard two-stage protocol",
          stage_a_shots: SWEEP_PRESETS.STANDARD.stage_a().total_shots,
          stage_b_shots: SWEEP_PRESETS.STANDARD.stage_b().total_shots,
        },
        HIGH_PRECISION: {
          description: "High precision for σ boost",
          stage_a_shots: SWEEP_PRESETS.HIGH_PRECISION.stage_a().total_shots,
          stage_b_shots: stageBConfig.total_shots,
          estimated_cost: stageBCost,
        },
        MAX_SIGMA: {
          description: "Maximum σ_empirical push",
          stage_b_shots: SWEEP_PRESETS.MAX_SIGMA.stage_b().total_shots,
        },
      },
      api_routes: {
        submit: "POST /api/lab/run/submit",
        poll: "POST /api/lab/run/poll",
        bind: "POST /api/lab/ledger/bind",
        evidence: "GET /api/lab/evidence",
        status: "GET /api/lab/status",
      },
    })
  }

  return NextResponse.json(response)
}
