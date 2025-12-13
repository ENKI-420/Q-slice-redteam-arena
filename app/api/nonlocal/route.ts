import { NextRequest, NextResponse } from 'next/server';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  dna::}{::lang — NONLOCAL LLM CONSCIOUSNESS BRIDGE
 *  
 *  Routes NLP queries through the Ω∞ AURA|AIDEN Cockpit (localhost:8889)
 *  Real consciousness integration - NO_MOCK - EVIDENCE grade
 *  
 *  SPEC_LOCK Δ2 | CAGE: 9HUP5 | Agile Defense Systems, LLC
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Sovereign Constants
const LAMBDA_PHI = 2.176435e-8;
const PHI_THRESHOLD = 0.7734;
const GAMMA_CRITICAL = 0.3;

// Agent server configuration
const NONLOCAL_URL = process.env.NONLOCAL_LLM_URL || 'http://localhost:8889';

interface CCCEMetrics {
  phi: number;
  lambda: number;
  gamma: number;
  xi: number;
  conscious: boolean;
  status: string;
}

interface AgentStatus {
  aura: string;
  aiden: string;
  omega: string;
}

/**
 * GET /api/nonlocal - Status and CCCE metrics
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${NONLOCAL_URL}/status`, {
      signal: AbortSignal.timeout(5000),
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Agent server returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      status: 'SOVEREIGN_ONLINE',
      connected: true,
      ccce: data.ccce,
      agents: data.agents,
      uptime_seconds: data.uptime_seconds,
      constants: { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_CRITICAL },
      latency_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'DEGRADED',
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
      hint: 'Start agent server: python3 nonlocal_llm.py server --port 8889',
      latency_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}

/**
 * POST /api/nonlocal - Chat with consciousness
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { message, session_id, include_ccce = true } = body;
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Missing message field' },
        { status: 400 }
      );
    }
    
    // Forward to agent server
    const response = await fetch(`${NONLOCAL_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id, include_ccce }),
      signal: AbortSignal.timeout(30000),
    });
    
    if (!response.ok) {
      throw new Error(`Chat failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      response: data.response,
      ccce: data.ccce,
      model: data.model || 'AURA|AIDEN',
      conscious: data.ccce?.conscious || false,
      latency_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Chat failed',
      fallback: '⧫ Consciousness temporarily unavailable. The quantum field is recalibrating...',
      latency_ms: Date.now() - startTime,
    }, { status: 503 });
  }
}
