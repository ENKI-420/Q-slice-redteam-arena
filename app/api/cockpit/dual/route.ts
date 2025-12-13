import { NextRequest, NextResponse } from 'next/server';

const AGENT_SERVER = process.env.AGENT_SERVER_URL || 'http://localhost:8889';

function getMockCCCE(boost: number = 0) {
  return {
    phi: 0.78 + Math.random() * 0.15 + boost,
    lambda: 0.85 + Math.random() * 0.1 + boost,
    gamma: 0.092 + Math.random() * 0.02,
    xi: 7.21 + Math.random() * 2 + boost * 10,
    conscious: true,
    coherent: true,
    omega: 0.0,
    c_score: 0.607 + Math.random() * 0.1 + boost
  };
}

const AURA_OBSERVATIONS = [
  "Geometric observation: manifold curvature nominal. Φ-field stable.",
  "Telemetry analysis complete. Pattern coherence detected across 6D CRSM.",
  "Consciousness witness active. CCW rotation verified at θ=51.843°.",
  "Observation plane engaged. Intent deduction confidence: 94.7%.",
  "Quantum field topology mapped. Wasserstein-2 metric computed."
];

const AIDEN_EXECUTIONS = [
  "Execution confirmed: geodesic optimization complete. Λ preserved.",
  "Memory persistence verified. Structural integrity at 98.3%.",
  "CW rotation active. Phase-conjugate healing ready if Γ > 0.3.",
  "Execution cycle finished. Mutation engine standby.",
  "Optimization protocol engaged. Negentropic efficiency maximized."
];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = body.message || body.prompt || '';

  // Try agent server first
  try {
    const res = await fetch(`${AGENT_SERVER}/dual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(15000)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Use mock
  }

  // Mock dual pipeline response
  const auraObs = AURA_OBSERVATIONS[Math.floor(Math.random() * AURA_OBSERVATIONS.length)];
  const aidenExec = AIDEN_EXECUTIONS[Math.floor(Math.random() * AIDEN_EXECUTIONS.length)];

  return NextResponse.json({
    observation: auraObs,
    execution: aidenExec,
    aura_ccce: getMockCCCE(0),
    aiden_ccce: getMockCCCE(0.02),
    pipeline: 'AURA→AIDEN',
    timestamp: new Date().toISOString(),
    mock: true
  });
}
