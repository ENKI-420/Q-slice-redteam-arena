import { NextRequest, NextResponse } from 'next/server';

const AGENT_SERVER = process.env.AGENT_SERVER_URL || 'http://localhost:8889';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message || body.prompt || '';

    if (!message.trim()) {
      return NextResponse.json({
        error: 'No message provided',
        source: 'error'
      }, { status: 400 });
    }

    const res = await fetch(`${AGENT_SERVER}/dual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(60000)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        ...data,
        source: 'live',
        backend_url: AGENT_SERVER
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
