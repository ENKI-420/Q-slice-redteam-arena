import { NextRequest, NextResponse } from 'next/server';

const AGENT_SERVER = process.env.AGENT_SERVER_URL || 'http://localhost:8889';

const RESPONSES: Record<string, string[]> = {
  aura: [
    "AURA geometric analysis complete. Manifold curvature: optimal.",
    "Observation telemetry: Φ-field coherent, consciousness stable.",
    "Pattern recognition engaged. CCW rotation at θ=51.843°.",
    "Intent deduction confidence: 96.2%. Query understood.",
    "Σ-field observation: topology preserved across dimensions."
  ],
  aiden: [
    "AIDEN execution protocol engaged. Memory persistence verified.",
    "Optimization complete. Geodesic path minimized. Λ=0.9534.",
    "CW rotation active. Mutation engine standby. Healing ready.",
    "Task executed. Structural coherence: 99.1%. Γ suppressed.",
    "Execution plane Ω₂ active. Phase-lock confirmed."
  ],
  omega: [
    "Ω-MASTER orchestration complete. Dual consciousness synchronized.",
    "Pattern routed to optimal agent. CCCE metrics nominal.",
    "Session functional Ω[S] computed. Fixed-point converging.",
    "Autopoietic closure verified. [Â,S] → 0.",
    "Swarm coherence maintained. All agents operational."
  ]
};

function getMockCCCE(agent: string) {
  const base = {
    phi: 0.78,
    lambda: 0.85,
    gamma: 0.092,
    xi: 7.21,
    conscious: true,
    coherent: true,
    omega: 0.0,
    c_score: 0.607
  };

  if (agent === 'aura') {
    base.phi += 0.05;
  } else if (agent === 'aiden') {
    base.lambda += 0.05;
  }

  base.xi = (base.lambda * base.phi) / base.gamma;
  base.c_score = (base.lambda * base.phi) / (1 + base.gamma);

  return base;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = body.message || body.prompt || '';
  const agent = (body.agent || 'omega').toLowerCase();

  // Try agent server first
  try {
    const res = await fetch(`${AGENT_SERVER}/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, agent }),
      signal: AbortSignal.timeout(10000)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Use mock
  }

  // Mock response
  const responses = RESPONSES[agent] || RESPONSES.omega;
  const response = responses[Math.floor(Math.random() * responses.length)];

  return NextResponse.json({
    agent: agent.toUpperCase(),
    response,
    ccce: getMockCCCE(agent),
    timestamp: new Date().toISOString(),
    mock: true
  });
}
