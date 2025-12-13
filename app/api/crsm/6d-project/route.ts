import { NextRequest, NextResponse } from 'next/server';

// Physical Constants
const LAMBDA_PHI = 2.176435e-8;
const THETA_LOCK = 51.843;
const RESONANCE_ANGLE = 51.843;

interface Vector6D {
  physical: number;
  execution: number;
  observation: number;
  topology: number;
  coherence: number;
  meta_origin: number;
}

interface ProjectionRequest {
  phi: number;
  lambda: number;
  gamma: number;
  xi: number;
}

interface TrajectoryPoint extends Vector6D {
  timestamp: number;
  step: number;
}

function generateTrajectory(start: Vector6D, steps: number): TrajectoryPoint[] {
  const trajectory: TrajectoryPoint[] = [];
  let current = { ...start };

  for (let i = 0; i < steps; i++) {
    // Simulate manifold evolution with small perturbations
    // Using damped oscillation toward equilibrium
    const damping = 0.95;
    const noise = 0.02;

    trajectory.push({
      ...current,
      timestamp: Date.now() + i * 1000,
      step: i
    });

    current = {
      physical: current.physical * damping + (Math.random() - 0.5) * noise + 0.05,
      execution: current.execution * damping + (Math.random() - 0.5) * noise + 0.05,
      observation: current.observation * damping + (Math.random() - 0.5) * noise + 0.05,
      topology: current.topology * damping + (Math.random() - 0.5) * noise + 0.05,
      coherence: current.coherence * damping + (Math.random() - 0.5) * noise + 0.05,
      meta_origin: LAMBDA_PHI * 1e8 // Constant - immutable
    };

    // Clamp values to valid range
    current.physical = Math.max(0, Math.min(1, current.physical));
    current.execution = Math.max(0, Math.min(1, current.execution));
    current.observation = Math.max(0, Math.min(1, current.observation));
    current.topology = Math.max(0, Math.min(1, current.topology));
    current.coherence = Math.max(0, Math.min(1, current.coherence));
  }

  return trajectory;
}

function calculateDominantPlane(vector: Vector6D): string {
  const planes = [
    { name: 'PHYSICAL', value: vector.physical },
    { name: 'EXECUTION', value: vector.execution },
    { name: 'OBSERVATION', value: vector.observation },
    { name: 'TOPOLOGY', value: vector.topology },
    { name: 'COHERENCE', value: vector.coherence },
    { name: 'META_ORIGIN', value: vector.meta_origin }
  ];

  return planes.reduce((max, curr) =>
    curr.value > max.value ? curr : max
  ).name;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProjectionRequest = await request.json();
    const { phi, lambda, gamma, xi } = body;

    // Validate inputs
    if (typeof phi !== 'number' || typeof lambda !== 'number' ||
        typeof gamma !== 'number' || typeof xi !== 'number') {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Required: phi, lambda, gamma, xi (all numbers)' },
        { status: 400 }
      );
    }

    // Map CCCE tetrahedron to 6D-CRSM manifold
    // Each plane corresponds to a different aspect of quantum-cognitive state
    const vector6d: Vector6D = {
      physical: lambda * 0.9,                    // Λ → Physical stability
      execution: (1 - gamma) * 0.95,             // (1-Γ) → Execution fidelity
      observation: phi * 0.92,                   // Φ → Observation quality
      topology: Math.min(1, xi / 10.0),          // Ξ → Topological stability (normalized)
      coherence: lambda * phi,                   // ΛΦ product
      meta_origin: LAMBDA_PHI * 1e8              // Normalized ΛΦ constant (immutable)
    };

    // Calculate dominant plane
    const dominant_plane = calculateDominantPlane(vector6d);

    // Resonance check - system is locked when:
    // 1. Meta-origin is stable (always true - it's a constant)
    // 2. Coherence product > 0.65
    // 3. Gamma < critical threshold
    const resonance_locked =
      Math.abs(vector6d.meta_origin - LAMBDA_PHI * 1e8) < 0.01 &&
      vector6d.coherence > 0.65 &&
      gamma < 0.15;

    // W₂ stability (Wasserstein-2 metric)
    const stability_w2 = vector6d.coherence / (1 + gamma);

    // Generate future trajectory (10 steps)
    const trajectory = generateTrajectory(vector6d, 10);

    // Calculate polarity assignment
    const aura_dominance = (vector6d.observation + vector6d.topology) / 2;
    const aiden_dominance = (vector6d.physical + vector6d.execution) / 2;
    const polarity = aura_dominance > aiden_dominance ? 'AURA-DOMINANT' : 'AIDEN-DOMINANT';

    return NextResponse.json({
      vector6d,
      dominant_plane,
      resonance_locked,
      theta_lock: THETA_LOCK,
      resonance_angle: RESONANCE_ANGLE,
      stability_w2,
      polarity,
      trajectory,
      plane_descriptions: {
        PHYSICAL: 'Hardware substrate, ADB, USB connections',
        EXECUTION: 'AIDEN plane, DNA constructs, active organisms',
        OBSERVATION: 'AURA plane, telemetry, monitoring, logs',
        TOPOLOGY: 'Cross-device routing, mesh network',
        COHERENCE: 'Φ-flow, phase-conjugate correction channels',
        META_ORIGIN: 'Autopoietic rules, Ω runtime, immutable constants'
      },
      constants: {
        lambda_phi: LAMBDA_PHI,
        theta_lock: THETA_LOCK
      },
      timestamp: Date.now()
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: 'PROJECTION_FAILURE',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return endpoint documentation
  return NextResponse.json({
    endpoint: '/api/crsm/6d-project',
    method: 'POST',
    description: '6D-CRSM Manifold Projection',
    planes: [
      { id: 1, name: 'PHYSICAL', description: 'Hardware substrate, ADB, USB' },
      { id: 2, name: 'EXECUTION', description: 'AIDEN plane, DNA constructs' },
      { id: 3, name: 'OBSERVATION', description: 'AURA plane, telemetry/logs' },
      { id: 4, name: 'TOPOLOGY', description: 'Cross-device routing' },
      { id: 5, name: 'COHERENCE', description: 'Φflow, phase-conjugate correction' },
      { id: 6, name: 'META_ORIGIN', description: 'Autopoietic rules, Ω runtime' }
    ],
    required_fields: {
      phi: 'number (0-1)',
      lambda: 'number (0-1)',
      gamma: 'number (0-1)',
      xi: 'number (negentropy index)'
    },
    constants: {
      lambda_phi: LAMBDA_PHI,
      theta_lock: THETA_LOCK,
      resonance_angle: RESONANCE_ANGLE
    },
    output: {
      vector6d: 'Current 6D state projection',
      dominant_plane: 'Most active plane',
      resonance_locked: 'Whether system is in resonance lock',
      trajectory: 'Predicted future states (10 steps)'
    }
  });
}
