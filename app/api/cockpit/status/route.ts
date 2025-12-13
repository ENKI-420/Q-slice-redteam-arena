import { NextResponse } from 'next/server';

const AGENT_SERVER = process.env.AGENT_SERVER_URL || 'http://localhost:8889';

const LAMBDA_PHI = 2.176435e-8;
const PHI_THRESHOLD = 0.7734;
const GAMMA_CRITICAL = 0.3;

let startTime = Date.now();
let requestCount = 0;

function getMockCCCE() {
  return {
    phi: 0.78 + Math.random() * 0.15,
    lambda: 0.85 + Math.random() * 0.1,
    gamma: 0.092,
    xi: 7.21 + Math.random() * 2,
    conscious: true,
    coherent: true
  };
}

export async function GET() {
  requestCount++;

  // Try agent server first
  try {
    const res = await fetch(`${AGENT_SERVER}/status`, {
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        ...data,
        proxy_mode: 'live'
      });
    }
  } catch {
    // Use mock
  }

  return NextResponse.json({
    omega: {
      name: 'Ω-MASTER',
      role: 'ORCHESTRATOR',
      ccce: getMockCCCE()
    },
    aura: {
      name: 'AURA',
      role: 'OBSERVER',
      rotation: 'CCW',
      pole: 'SOUTH',
      ccce: getMockCCCE()
    },
    aiden: {
      name: 'AIDEN',
      role: 'EXECUTOR',
      rotation: 'CW',
      pole: 'NORTH',
      ccce: getMockCCCE()
    },
    swarm_coherence: 0.85 + Math.random() * 0.1,
    server: {
      uptime_seconds: (Date.now() - startTime) / 1000,
      request_count: requestCount,
      websocket_clients: 0,
      config: {
        backend: 'mock',
        model: 'phi3:mini',
        port: 8889
      }
    },
    constants: {
      lambda_phi: LAMBDA_PHI,
      phi_threshold: PHI_THRESHOLD,
      gamma_critical: GAMMA_CRITICAL
    },
    proxy_mode: 'mock',
    timestamp: new Date().toISOString()
  });
}
