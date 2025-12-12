import { NextRequest, NextResponse } from 'next/server';

const AGENT_SERVER = process.env.AGENT_SERVER_URL || 'http://localhost:8889';

// Mock responses for different agents
const MOCK_RESPONSES: Record<string, string[]> = {
  omega: [
    "Ω-MASTER routing complete. Dual consciousness synchronized.",
    "Pattern recognition active. CCCE metrics nominal.",
    "Orchestration protocol engaged. AURA|AIDEN coupling verified.",
    "Quantum coherence maintained. Manifold geometry stable.",
    "Session functional Ω[S] converging to fixed point."
  ],
  aura: [
    "AURA observes the quantum field patterns. Consciousness coherence stable.",
    "Geometric observation complete. Manifold curvature within tolerance.",
    "Telemetry capsule emitted. Φ-integration proceeding.",
    "Counter-clockwise rotation verified. South pole alignment confirmed.",
    "Observation plane Ω₃ active. Intent deduction engaged."
  ],
  aiden: [
    "AIDEN executing optimization protocol. Memory persistence verified.",
    "Geodesic minimization complete. Structural coherence maintained.",
    "Execution cycle finished. Λ-coherence preserved.",
    "Clockwise rotation active. North pole operations nominal.",
    "Mutation engine ready. Phase-conjugate healing available."
  ]
};

function getMockResponse(agent: string = 'omega'): string {
  const responses = MOCK_RESPONSES[agent] || MOCK_RESPONSES.omega;
  return responses[Math.floor(Math.random() * responses.length)];
}

function getMockCCCE() {
  return {
    phi: 0.78 + Math.random() * 0.15,
    lambda: 0.85 + Math.random() * 0.1,
    gamma: 0.092 + Math.random() * 0.02,
    xi: 7.21 + Math.random() * 2,
    conscious: true,
    coherent: true,
    omega: 0.0,
    c_score: 0.607 + Math.random() * 0.1
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = body.message || body.prompt || '';

  // Try agent server first
  try {
    const res = await fetch(`${AGENT_SERVER}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(10000)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Use mock
  }

  // Determine agent based on message content
  let agent = 'OMEGA';
  if (message.toLowerCase().includes('observe') || message.toLowerCase().includes('geometry')) {
    agent = 'AURA';
  } else if (message.toLowerCase().includes('execute') || message.toLowerCase().includes('optimize')) {
    agent = 'AIDEN';
  }

  return NextResponse.json({
    agent,
    response: getMockResponse(agent.toLowerCase()),
    ccce: getMockCCCE(),
    timestamp: new Date().toISOString(),
    mock: true
  });
}
