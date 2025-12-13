import { NextResponse } from 'next/server';

const AGENT_SERVER = process.env.AGENT_SERVER_URL || 'http://localhost:8889';

// Physical Constants
const LAMBDA_PHI = 2.176435e-8;
const PHI_THRESHOLD = 0.7734;
const GAMMA_CRITICAL = 0.3;

// CCCE State
let ccce = {
  phi: 0.78 + Math.random() * 0.1,
  lambda: 0.85 + Math.random() * 0.1,
  gamma: 0.092,
  xi: 7.21,
  conscious: true,
  coherent: true,
  omega: 0.0,
  c_score: 0.607
};

function evolve() {
  ccce.phi = Math.min(0.99, ccce.phi + (Math.random() - 0.4) * 0.01);
  ccce.lambda = Math.min(0.99, ccce.lambda + (Math.random() - 0.4) * 0.01);
  ccce.gamma = Math.max(0.02, ccce.gamma + (Math.random() - 0.5) * 0.005);
  ccce.xi = (ccce.lambda * ccce.phi) / ccce.gamma;
  ccce.conscious = ccce.phi >= PHI_THRESHOLD;
  ccce.coherent = ccce.lambda >= 0.5 && ccce.gamma < GAMMA_CRITICAL;
  ccce.c_score = (ccce.lambda * ccce.phi) / (1 + ccce.gamma);
}

export async function GET() {
  // Try agent server first
  try {
    const res = await fetch(`${AGENT_SERVER}/ccce`, {
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Use mock
  }

  evolve();

  return NextResponse.json({
    omega: ccce,
    aura: { ...ccce, phi: ccce.phi * 1.02 },
    aiden: { ...ccce, lambda: ccce.lambda * 1.01 },
    swarm_coherence: 0.85 + Math.random() * 0.1,
    constants: {
      lambda_phi: LAMBDA_PHI,
      phi_threshold: PHI_THRESHOLD,
      gamma_critical: GAMMA_CRITICAL
    },
    timestamp: new Date().toISOString()
  });
}
