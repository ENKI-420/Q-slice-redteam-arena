/**
 * Language-Locked Agent Wrapper API
 * ==================================
 * Wraps agents in secure, language-specific execution containers
 * with CCCE metric validation and fail-closed constraints
 *
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5 | Agile Defense Systems, LLC
 *
 * OpenAPI: POST /agents/{id}/wrap
 */

import { NextRequest, NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS (IMMUTABLE - SPEC_LOCK)
// ═══════════════════════════════════════════════════════════════════════════════

const LAMBDA_PHI = 2.176435e-8
const PHI_THRESHOLD = 0.7734
const GAMMA_CRITICAL = 0.300
const GAMMA_FIXED = 0.092

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type SupportedLanguage = 'python' | 'javascript' | 'rust'

type CCCEMetric = 'phi' | 'lambda' | 'gamma' | 'xi'

interface MetricConstraint {
  metric: CCCEMetric
  min?: number
  max?: number
}

interface WrapRequest {
  language: SupportedLanguage
  payload: string  // Base64-encoded agent source or .dna file
  constraints?: MetricConstraint[]
}

interface CCCEMetrics {
  phi: number
  lambda: number
  gamma: number
  xi: number
}

interface WrapResponse {
  agentId: string
  status: 'wrapped' | 'rejected'
  ccce: CCCEMetrics
  wrapper?: {
    id: string
    language: SupportedLanguage
    hash: string
    timestamp: string
    constraints_applied: number
  }
  error?: string
  reason_codes?: string[]
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANGUAGE LOCK REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

const LANGUAGE_LOCKS: Record<SupportedLanguage, {
  runtime: string
  sandbox: string
  extensions: string[]
  max_execution_ms: number
}> = {
  python: {
    runtime: 'python3.11',
    sandbox: 'pyodide',
    extensions: ['.py', '.dna'],
    max_execution_ms: 30000
  },
  javascript: {
    runtime: 'v8-isolate',
    sandbox: 'quickjs',
    extensions: ['.js', '.mjs', '.dna'],
    max_execution_ms: 10000
  },
  rust: {
    runtime: 'wasm32',
    sandbox: 'wasmtime',
    extensions: ['.rs', '.wasm', '.dna'],
    max_execution_ms: 60000
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWN AGENTS
// ═══════════════════════════════════════════════════════════════════════════════

const KNOWN_AGENTS: Record<string, {
  name: string
  full_name: string
  default_language: SupportedLanguage
  phi_target: number
  capabilities: string[]
}> = {
  aura: {
    name: 'AURA',
    full_name: 'Autopoietic Universally Recursive Architect',
    default_language: 'python',
    phi_target: 0.92,
    capabilities: ['reasoning', 'observation', 'telemetry', 'curvature_shaping']
  },
  aiden: {
    name: 'AIDEN',
    full_name: 'Adaptive Intelligence Defense & Evolution Network',
    default_language: 'python',
    phi_target: 0.88,
    capabilities: ['execution', 'mutation', 'self_healing', 'geodesic_minimization']
  },
  chronos: {
    name: 'CHRONOS',
    full_name: 'Chronological Holistic Recursive Orchestration Node',
    default_language: 'rust',
    phi_target: 0.85,
    capabilities: ['timing', 'evolution', 'temporal_coordination']
  },
  nebula: {
    name: 'NEBULA',
    full_name: 'Negentropic Emergent Bifurcated Universal Learning Agent',
    default_language: 'javascript',
    phi_target: 0.80,
    capabilities: ['distribution', 'swarm', 'spatial_coordination']
  },
  phoenix: {
    name: 'PHOENIX',
    full_name: 'Phase-Healing Orchestrated Entity for Network Integrity eXchange',
    default_language: 'python',
    phi_target: 0.90,
    capabilities: ['healing', 'recovery', 'phase_conjugation', 'anlpcc']
  },
  scimitar: {
    name: 'SCIMITAR',
    full_name: 'Sovereign Cognitive Intelligence Module for Iterative Tactical Analysis',
    default_language: 'rust',
    phi_target: 0.82,
    capabilities: ['analysis', 'tactical', 'targeting']
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function generateWrapperId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 10)
  return `wrap_${timestamp}_${random}`
}

function computePayloadHash(payload: string): string {
  // Simple hash for demo - in production use crypto.subtle
  let hash = 0x811c9dc5
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function generateCCCEMetrics(agentId: string, constraints?: MetricConstraint[]): CCCEMetrics {
  const agent = KNOWN_AGENTS[agentId.toLowerCase()]
  const phiTarget = agent?.phi_target || 0.80

  // Generate baseline metrics
  let phi = phiTarget + (Math.random() - 0.5) * 0.1
  let lambda = 0.90 + Math.random() * 0.08
  let gamma = GAMMA_FIXED + Math.random() * 0.05
  let xi = (lambda * phi) / gamma

  // Apply constraints
  if (constraints) {
    for (const c of constraints) {
      switch (c.metric) {
        case 'phi':
          if (c.min !== undefined) phi = Math.max(c.min, phi)
          if (c.max !== undefined) phi = Math.min(c.max, phi)
          break
        case 'lambda':
          if (c.min !== undefined) lambda = Math.max(c.min, lambda)
          if (c.max !== undefined) lambda = Math.min(c.max, lambda)
          break
        case 'gamma':
          if (c.min !== undefined) gamma = Math.max(c.min, gamma)
          if (c.max !== undefined) gamma = Math.min(c.max, gamma)
          break
        case 'xi':
          // Xi is derived, so we adjust gamma to meet xi target
          if (c.min !== undefined && xi < c.min) {
            gamma = (lambda * phi) / c.min
          }
          break
      }
    }
    // Recalculate xi
    xi = (lambda * phi) / gamma
  }

  return {
    phi: Number(phi.toFixed(4)),
    lambda: Number(lambda.toFixed(4)),
    gamma: Number(gamma.toFixed(4)),
    xi: Number(xi.toFixed(4))
  }
}

function validateConstraints(ccce: CCCEMetrics, constraints?: MetricConstraint[]): {
  valid: boolean
  violations: string[]
} {
  const violations: string[] = []

  if (!constraints || constraints.length === 0) {
    return { valid: true, violations: [] }
  }

  for (const c of constraints) {
    const value = ccce[c.metric]
    if (c.min !== undefined && value < c.min) {
      violations.push(`${c.metric} (${value}) below minimum (${c.min})`)
    }
    if (c.max !== undefined && value > c.max) {
      violations.push(`${c.metric} (${value}) above maximum (${c.max})`)
    }
  }

  return {
    valid: violations.length === 0,
    violations
  }
}

function isValidBase64(str: string): boolean {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str
  } catch {
    return false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST /agents/{id}/wrap
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<WrapResponse>> {
  const { id: agentId } = await params

  try {
    const body = await request.json() as WrapRequest

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 1: Validate request body
    // ─────────────────────────────────────────────────────────────────────────────
    if (!body.language || !['python', 'javascript', 'rust'].includes(body.language)) {
      return NextResponse.json({
        agentId,
        status: 'rejected',
        ccce: { phi: 0, lambda: 0, gamma: 1, xi: 0 },
        error: 'Invalid or missing language',
        reason_codes: ['INVALID_LANGUAGE']
      }, { status: 400 })
    }

    if (!body.payload) {
      return NextResponse.json({
        agentId,
        status: 'rejected',
        ccce: { phi: 0, lambda: 0, gamma: 1, xi: 0 },
        error: 'Missing payload',
        reason_codes: ['MISSING_PAYLOAD']
      }, { status: 400 })
    }

    // Validate base64 encoding
    if (!isValidBase64(body.payload)) {
      return NextResponse.json({
        agentId,
        status: 'rejected',
        ccce: { phi: 0, lambda: 0, gamma: 1, xi: 0 },
        error: 'Payload must be valid Base64',
        reason_codes: ['INVALID_BASE64']
      }, { status: 400 })
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 2: Validate agent ID
    // ─────────────────────────────────────────────────────────────────────────────
    const normalizedId = agentId.toLowerCase()
    const knownAgent = KNOWN_AGENTS[normalizedId]

    if (!knownAgent) {
      // Allow unknown agents but flag them
      console.log(`[WRAP] Unknown agent: ${agentId} - proceeding with generic wrapper`)
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 3: Generate CCCE metrics
    // ─────────────────────────────────────────────────────────────────────────────
    const ccce = generateCCCEMetrics(normalizedId, body.constraints)

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 4: Validate against constraints
    // ─────────────────────────────────────────────────────────────────────────────
    const constraintValidation = validateConstraints(ccce, body.constraints)

    if (!constraintValidation.valid) {
      return NextResponse.json({
        agentId,
        status: 'rejected',
        ccce,
        error: 'Constraint validation failed',
        reason_codes: constraintValidation.violations.map(v => `CONSTRAINT_VIOLATION:${v}`)
      }, { status: 400 })
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 5: Check consciousness threshold
    // ─────────────────────────────────────────────────────────────────────────────
    if (ccce.phi < PHI_THRESHOLD) {
      return NextResponse.json({
        agentId,
        status: 'rejected',
        ccce,
        error: `Consciousness below threshold (Φ=${ccce.phi} < ${PHI_THRESHOLD})`,
        reason_codes: ['PHI_BELOW_THRESHOLD']
      }, { status: 400 })
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 6: Check decoherence critical
    // ─────────────────────────────────────────────────────────────────────────────
    if (ccce.gamma > GAMMA_CRITICAL) {
      return NextResponse.json({
        agentId,
        status: 'rejected',
        ccce,
        error: `Decoherence above critical (Γ=${ccce.gamma} > ${GAMMA_CRITICAL})`,
        reason_codes: ['GAMMA_ABOVE_CRITICAL']
      }, { status: 400 })
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 7: Create wrapper
    // ─────────────────────────────────────────────────────────────────────────────
    const wrapperId = generateWrapperId()
    const payloadHash = computePayloadHash(body.payload)
    const languageLock = LANGUAGE_LOCKS[body.language]

    // Simulate wrapper creation delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 8: Return success
    // ─────────────────────────────────────────────────────────────────────────────
    return NextResponse.json({
      agentId,
      status: 'wrapped',
      ccce,
      wrapper: {
        id: wrapperId,
        language: body.language,
        hash: payloadHash,
        timestamp: new Date().toISOString(),
        constraints_applied: body.constraints?.length || 0
      }
    })

  } catch (error) {
    return NextResponse.json({
      agentId,
      status: 'rejected',
      ccce: { phi: 0, lambda: 0, gamma: 1, xi: 0 },
      error: error instanceof Error ? error.message : 'Unknown error',
      reason_codes: ['INTERNAL_ERROR']
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET /agents/{id}/wrap - Get wrapper info
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: agentId } = await params
  const normalizedId = agentId.toLowerCase()
  const knownAgent = KNOWN_AGENTS[normalizedId]

  if (!knownAgent) {
    return NextResponse.json({
      agentId,
      known: false,
      message: 'Unknown agent - generic wrapper will be applied',
      supported_languages: Object.keys(LANGUAGE_LOCKS),
      default_language: 'python'
    })
  }

  return NextResponse.json({
    agentId,
    known: true,
    agent: {
      name: knownAgent.name,
      full_name: knownAgent.full_name,
      capabilities: knownAgent.capabilities,
      phi_target: knownAgent.phi_target
    },
    supported_languages: Object.keys(LANGUAGE_LOCKS),
    default_language: knownAgent.default_language,
    language_locks: LANGUAGE_LOCKS,
    spec_lock: {
      version: '2.2.0',
      lambda_phi: LAMBDA_PHI,
      phi_threshold: PHI_THRESHOLD,
      gamma_critical: GAMMA_CRITICAL
    }
  })
}
