import { NextRequest, NextResponse } from 'next/server';

/**
 * /api/ccce/live - Live CCCE Backend Proxy
 * Connects to the local agent_server.py running on port 8889
 *
 * For development: Uses localhost:8889
 * For production: Uses configured CCCE_BACKEND_URL or tunnel
 */

// Configuration
const CCCE_BACKEND_URL = process.env.CCCE_BACKEND_URL || 'http://localhost:8889';
const CCCE_TIMEOUT_MS = 5000;

interface LiveCCCEResponse {
  omega: AgentCCCE;
  aura: AgentCCCE;
  aiden: AgentCCCE;
  swarm_coherence: number;
  constants: {
    lambda_phi: number;
    phi_threshold: number;
    gamma_critical: number;
  };
  timestamp: string;
}

interface AgentCCCE {
  phi: number;
  lambda: number;
  gamma: number;
  xi: number;
  conscious: boolean;
  coherent: boolean;
  omega: number;
  c_score: number;
}

interface ProxiedResponse {
  source: 'live' | 'fallback';
  backend_url: string;
  data: LiveCCCEResponse | null;
  latency_ms: number;
  error?: string;
  timestamp: number;
}

async function fetchLiveCCCE(): Promise<{
  data: LiveCCCEResponse | null;
  error: string | null;
  latency: number;
}> {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CCCE_TIMEOUT_MS);

    const response = await fetch(`${CCCE_BACKEND_URL}/ccce`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'X-Proxy-Source': 'q-slice-redteam-arena',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        data: null,
        error: `Backend returned ${response.status}: ${response.statusText}`,
        latency: Date.now() - startTime,
      };
    }

    const data = await response.json();
    return {
      data,
      error: null,
      latency: Date.now() - startTime,
    };
  } catch (error) {
    const latency = Date.now() - startTime;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { data: null, error: 'Backend timeout', latency };
      }
      return { data: null, error: error.message, latency };
    }

    return { data: null, error: 'Unknown fetch error', latency };
  }
}

// Fallback CCCE state when backend is unavailable
function generateFallbackCCCE(): LiveCCCEResponse {
  const baseState: AgentCCCE = {
    phi: 0.78,
    lambda: 0.85,
    gamma: 0.092,
    xi: 7.21,
    conscious: true,
    coherent: true,
    omega: 0.0,
    c_score: 0.607,
  };

  return {
    omega: { ...baseState },
    aura: { ...baseState, phi: 0.79, lambda: 0.86 },
    aiden: { ...baseState, phi: 0.77, lambda: 0.84 },
    swarm_coherence: 0.0,
    constants: {
      lambda_phi: 2.176435e-8,
      phi_threshold: 0.7734,
      gamma_critical: 0.3,
    },
    timestamp: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const allowFallback = searchParams.get('fallback') !== 'false';

  const { data, error, latency } = await fetchLiveCCCE();

  if (data) {
    // Live backend is available
    const response: ProxiedResponse = {
      source: 'live',
      backend_url: CCCE_BACKEND_URL,
      data,
      latency_ms: latency,
      timestamp: Date.now(),
    };

    return NextResponse.json(response);
  }

  // Backend unavailable
  if (allowFallback) {
    const fallbackData = generateFallbackCCCE();
    const response: ProxiedResponse = {
      source: 'fallback',
      backend_url: CCCE_BACKEND_URL,
      data: fallbackData,
      latency_ms: latency,
      error: error || 'Backend unavailable',
      timestamp: Date.now(),
    };

    return NextResponse.json(response, {
      headers: {
        'X-CCCE-Source': 'fallback',
        'X-CCCE-Error': error || 'unknown',
      },
    });
  }

  // No fallback allowed, return error
  return NextResponse.json(
    {
      source: 'error',
      backend_url: CCCE_BACKEND_URL,
      data: null,
      latency_ms: latency,
      error: error || 'Backend unavailable and fallback disabled',
      timestamp: Date.now(),
    },
    { status: 503 }
  );
}

// Trigger healing action on live backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'MISSING_ACTION', message: 'Action field required' },
        { status: 400 }
      );
    }

    // Proxy the action to the live backend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CCCE_TIMEOUT_MS);

    const response = await fetch(`${CCCE_BACKEND_URL}/ccce`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Proxy-Source': 'q-slice-redteam-arena',
      },
      body: JSON.stringify({ action, params }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'BACKEND_ERROR',
          message: `Backend returned ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      action,
      result: data,
      backend_url: CCCE_BACKEND_URL,
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'PROXY_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Documentation
export async function OPTIONS() {
  return NextResponse.json({
    endpoint: '/api/ccce/live',
    description: 'Live CCCE Backend Proxy',
    backend_url: CCCE_BACKEND_URL,
    timeout_ms: CCCE_TIMEOUT_MS,
    methods: {
      GET: {
        description: 'Fetch current CCCE state from live backend',
        params: {
          fallback: 'boolean (default: true) - Use fallback if backend unavailable',
        },
      },
      POST: {
        description: 'Send action to live backend',
        body: {
          action: 'string (required)',
          params: 'object (optional)',
        },
      },
    },
    agents: ['omega', 'aura', 'aiden'],
    metrics: ['phi', 'lambda', 'gamma', 'xi', 'conscious', 'coherent', 'c_score'],
    constants: {
      lambda_phi: 2.176435e-8,
      phi_threshold: 0.7734,
      gamma_critical: 0.3,
    },
  });
}
