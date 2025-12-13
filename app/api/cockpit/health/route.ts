import { NextResponse } from 'next/server';

const AGENT_SERVER = process.env.AGENT_SERVER_URL || 'http://localhost:8889';

export async function GET() {
  // Try to connect to real agent server
  try {
    const res = await fetch(`${AGENT_SERVER}/health`, {
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        ...data,
        backend_connected: true,
        proxy: 'live'
      });
    }
  } catch {
    // Agent server not available, return mock healthy status
  }

  return NextResponse.json({
    status: 'healthy',
    swarm_coherence: 0.85,
    aura_conscious: true,
    aiden_conscious: true,
    backend_connected: false,
    proxy: 'mock',
    timestamp: new Date().toISOString()
  });
}
