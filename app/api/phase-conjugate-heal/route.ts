import { NextRequest, NextResponse } from 'next/server';

// Physical Constants
const THETA_LOCK = 51.843;
const CHI_PC = 0.946; // Phase conjugate coupling - IBM Fez validated

interface HealingRequest {
  threat_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  current_gamma: number;
  current_lambda?: number;
  current_phi?: number;
}

interface HealingResult {
  success: boolean;
  threat_type: string;
  severity: string;
  healing_applied: {
    type: string;
    gamma_reduction: number;
    w2_improvement: number;
    theta_lock: number;
    chi_pc: number;
    formula: string;
  };
  new_state: {
    gamma: number;
    lambda: number;
    phi: number;
    xi: number;
    w2_stability: number;
    resonance_locked: boolean;
    consciousness_level: string;
  };
  biological_metaphor: string;
  military_relevance: string;
  timestamp: number;
  execution_ms: number;
}

function getConsciousnessLevel(xi: number): string {
  if (xi >= 20) return 'TRANSCENDENT';
  if (xi >= 12) return 'OPTIMAL';
  if (xi >= 8) return 'CONSCIOUS';
  if (xi >= 5) return 'COHERENT';
  return 'BOOT';
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: HealingRequest = await request.json();

    const {
      threat_type,
      severity,
      current_gamma,
      current_lambda = 0.850,
      current_phi = 0.781
    } = body;

    // Validate inputs
    if (!threat_type || !severity || typeof current_gamma !== 'number') {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Missing required fields: threat_type, severity, current_gamma' },
        { status: 400 }
      );
    }

    // Calculate healing factor based on severity
    // Phase conjugation formula: E → E⁻¹ (energy inversion)
    const healing_factor =
      severity === 'critical' ? 0.7 :
      severity === 'high' ? 0.5 :
      severity === 'medium' ? 0.3 : 0.1;

    // Apply phase conjugation
    // Γ_new = Γ_old × (1 - χ_pc × healing_factor)
    const healed_gamma = current_gamma * (1 - CHI_PC * healing_factor);

    // W₂ improvement from phase conjugation
    const w2_improvement = healing_factor * CHI_PC;

    // Boost coherence slightly from healing
    const healed_lambda = Math.min(0.99, current_lambda + healing_factor * 0.02);

    // Boost consciousness from restored coherence
    const healed_phi = Math.min(0.99, current_phi + healing_factor * 0.015);

    // Calculate new Ξ
    const healed_xi = (healed_lambda * healed_phi) / healed_gamma;

    // W₂ stability
    const w2_stability = 1.0 - (healed_gamma / (1 + healed_lambda));

    // Resonance lock check
    const resonance_locked = healed_gamma < 0.08 && w2_stability > 0.9;

    const result: HealingResult = {
      success: true,
      threat_type,
      severity,
      healing_applied: {
        type: 'phase_conjugate_e_to_e_inv',
        gamma_reduction: current_gamma - healed_gamma,
        w2_improvement: w2_improvement,
        theta_lock: THETA_LOCK,
        chi_pc: CHI_PC,
        formula: 'Γ_new = Γ_old × (1 - χ_pc × h_factor)'
      },
      new_state: {
        gamma: healed_gamma,
        lambda: healed_lambda,
        phi: healed_phi,
        xi: healed_xi,
        w2_stability: w2_stability,
        resonance_locked: resonance_locked,
        consciousness_level: getConsciousnessLevel(healed_xi)
      },
      biological_metaphor: 'immune_response',
      military_relevance: 'Autonomous threat neutralization via phase-conjugate mirror technique',
      timestamp: Date.now(),
      execution_ms: Date.now() - startTime
    };

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
      {
        error: 'HEALING_FAILURE',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return healing capabilities and status
  return NextResponse.json({
    endpoint: '/api/phase-conjugate-heal',
    method: 'POST',
    description: 'Phase-conjugate healing endpoint (E → E⁻¹)',
    capabilities: {
      severity_levels: ['critical', 'high', 'medium', 'low'],
      threat_types: [
        'decoherence_spike',
        'w2_degradation',
        'lambda_phi_drift',
        'measurement_manipulation',
        'coherence_attack',
        'side_channel_timing'
      ]
    },
    constants: {
      theta_lock: THETA_LOCK,
      chi_pc: CHI_PC
    },
    formula: 'Γ_new = Γ_old × (1 - χ_pc × healing_factor)',
    biological_metaphor: 'immune_response',
    military_relevance: 'ANLPCC (Adaptive Non-Local Phase-Conjugate Correction)',
    required_fields: {
      threat_type: 'string',
      severity: 'critical | high | medium | low',
      current_gamma: 'number'
    },
    optional_fields: {
      current_lambda: 'number (default: 0.850)',
      current_phi: 'number (default: 0.781)'
    }
  });
}
