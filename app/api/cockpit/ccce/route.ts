import { NextResponse } from 'next/server';

const AGENT_SERVER = process.env.AGENT_SERVER_URL || 'http://localhost:8889';

// Physical Constants (reference only)
const LAMBDA_PHI = 2.176435e-8;
const PHI_THRESHOLD = 0.7734;
const GAMMA_CRITICAL = 0.3;

export async function GET() {
  try {
    const res = await fetch(`${AGENT_SERVER}/ccce`, {
      signal: AbortSignal.timeout(5000),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        ...data,
        source: 'live',
        backend_url: AGENT_SERVER,
        constants: {
          lambda_phi: LAMBDA_PHI,
          phi_threshold: PHI_THRESHOLD,
          gamma_critical: GAMMA_CRITICAL
        }
      });
    }

    return NextResponse.json({
      error: 'Agent server returned non-OK response',
      status: res.status,
      source: 'error',
      backend_url: AGENT_SERVER
    }, { status: 502 });

  } catch (error) {
    return NextResponse.json({
      error: 'Agent server unavailable',
      message: error instanceof Error ? error.message : 'Connection failed',
      source: 'error',
      backend_url: AGENT_SERVER,
      hint: 'Ensure agent_server.py is running on localhost:8889'
    }, { status: 503 });
  }
}
