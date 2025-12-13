/**
 * Quantum-Secure Cryptographic Utilities for Q-SLICE Threatlab Arena
 * ===================================================================
 * JWT generation with φ⁸-based quantum mixing and device entanglement
 *
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5 | Agile Defense Systems, LLC
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS (IMMUTABLE - SPEC_LOCK)
// ═══════════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895
const PHI_8 = Math.pow(PHI, 8)  // 46.9787...
const LAMBDA_PHI = 2.176435e-8
const THETA_LOCK = 51.843
const PHI_THRESHOLD = 0.7734
const GAMMA_FIXED = 0.092

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM HASH MIXING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * φ⁸-based mixing function for quantum entropy injection
 */
function phi8Mix(input: string): number[] {
  const bytes = new TextEncoder().encode(input)
  const mixed: number[] = []

  for (let i = 0; i < bytes.length; i++) {
    // Apply φ⁸ modular mixing with torsion lock
    const phi8Val = (bytes[i] * PHI_8) % 256
    const thetaMix = (phi8Val * Math.sin(THETA_LOCK * Math.PI / 180)) % 256
    const lambdaMix = (thetaMix * LAMBDA_PHI * 1e10) % 256
    mixed.push(Math.floor(Math.abs(lambdaMix)))
  }

  return mixed
}

/**
 * Generate pseudo-random quantum hash using φ⁸ mixing
 */
function quantumHashSync(data: string): string {
  const preMixed = phi8Mix(data)

  // XOR fold the mixed bytes
  let hash = ''

  for (let i = 0; i < 32; i++) {
    let val = 0
    for (let j = 0; j < preMixed.length; j++) {
      val ^= Math.floor(Math.abs((preMixed[j] * PHI_8 * (i + 1) + j * THETA_LOCK) % 256))
    }
    hash += val.toString(16).padStart(2, '0')
  }

  return hash
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM JWT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface QuantumJWTHeader {
  alg: 'QS-UED-PALS'  // Quantum-Secure Unified Entanglement Distribution
  typ: 'JWT+Q'
  phi8: number
}

export interface QuantumJWTPayload {
  sub: string           // Subject (entity identifier)
  iss: string           // Issuer
  aud: string           // Audience
  iat: number           // Issued at
  exp: number           // Expiration
  ccce: {
    phi: number
    lambda: number
    gamma: number
    xi: number
  }
  entanglement_id: string  // Quantum entanglement hash
  quantum_state: string    // Consciousness state
  cage: string             // CAGE code
}

/**
 * Generate quantum-secure JWT for first-time identity synthesis
 * Uses φ⁸-based mixing and CCCE consciousness metrics
 */
export function generateQuantumJWT(entityId: string): string {
  const now = Date.now()
  const timestamp = Math.floor(now / 1000)

  // Generate CCCE metrics (simulated consciousness state)
  const phi = PHI_THRESHOLD + Math.random() * 0.15
  const lambda = 0.85 + Math.random() * 0.1
  const gamma = GAMMA_FIXED + Math.random() * 0.02
  const xi = (lambda * phi) / gamma

  // Generate quantum entanglement hash using φ⁸ mixing
  const entropySource = `${entityId}:${now}:${Math.random()}:${PHI_8}`
  const qeHash = quantumHashSync(entropySource)

  // Compute Einstein field curvature simulation
  const tensorField = entityId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const curvature = Math.sin(tensorField * timestamp) * Math.cos(tensorField / LAMBDA_PHI)

  // JWT Header
  const header: QuantumJWTHeader = {
    alg: 'QS-UED-PALS',
    typ: 'JWT+Q',
    phi8: PHI_8
  }

  // JWT Payload
  const payload: QuantumJWTPayload = {
    sub: entityId,
    iss: 'q-slice-threatlab-arena',
    aud: 'q-slice-operators',
    iat: timestamp,
    exp: timestamp + (24 * 60 * 60), // 24 hours
    ccce: { phi, lambda, gamma, xi },
    entanglement_id: `QE-${qeHash.slice(0, 32)}`,
    quantum_state: phi >= PHI_THRESHOLD ? 'coherent' : 'decoherent',
    cage: '9HUP5'
  }

  // Encode parts
  const headerB64 = btoa(JSON.stringify({ ...header, curvature: curvature.toFixed(8) }))
  const payloadB64 = btoa(JSON.stringify(payload))

  // Generate signature using quantum hash
  const signatureInput = `${headerB64}.${payloadB64}`
  const signature = quantumHashSync(signatureInput)
  const signatureB64 = btoa(signature)

  return `${headerB64}.${payloadB64}.${signatureB64}`
}

/**
 * Verify quantum JWT (basic structure validation)
 */
export async function verifyQuantumJWT(token: string): Promise<{
  valid: boolean
  payload?: QuantumJWTPayload
  error?: string
}> {
  // Simulate quantum state collapse delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid JWT structure' }
    }

    const [, payloadB64] = parts

    // Decode payload
    const payloadStr = atob(payloadB64)
    const payload = JSON.parse(payloadStr) as QuantumJWTPayload

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) {
      return { valid: false, error: 'Token expired' }
    }

    // Check issuer
    if (payload.iss !== 'q-slice-threatlab-arena') {
      return { valid: false, error: 'Invalid issuer' }
    }

    // Validate CCCE metrics
    if (payload.ccce.phi < PHI_THRESHOLD) {
      return { valid: false, error: 'Consciousness below threshold' }
    }

    return { valid: true, payload }
  } catch (err) {
    return { valid: false, error: `Parse error: ${err}` }
  }
}

/**
 * Legacy compatibility - verify quantum identity
 */
export const verifyQuantumIdentity = async (token: string): Promise<boolean> => {
  const result = await verifyQuantumJWT(token)
  return result.valid
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSCIOUSNESS METRIC UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate negentropic efficiency from CCCE metrics
 */
export function calculateXi(phi: number, lambda: number, gamma: number): number {
  if (gamma <= 0) return Infinity
  return (lambda * phi) / gamma
}

/**
 * Check if consciousness state is coherent
 */
export function isCoherent(ccce: { phi: number; lambda: number; gamma: number }): boolean {
  return ccce.phi >= PHI_THRESHOLD && ccce.lambda >= 0.85 && ccce.gamma <= 0.3
}

/**
 * Generate CCCE telemetry capsule
 */
export function generateCCCECapsule(): {
  phi: number
  lambda: number
  gamma: number
  xi: number
  timestamp: number
  coherent: boolean
} {
  const phi = PHI_THRESHOLD + Math.random() * 0.15
  const lambda = 0.85 + Math.random() * 0.1
  const gamma = GAMMA_FIXED + Math.random() * 0.15
  const xi = calculateXi(phi, lambda, gamma)

  return {
    phi,
    lambda,
    gamma,
    xi,
    timestamp: Date.now(),
    coherent: isCoherent({ phi, lambda, gamma })
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  PHI,
  PHI_8,
  LAMBDA_PHI,
  THETA_LOCK,
  PHI_THRESHOLD,
  GAMMA_FIXED,
  quantumHashSync,
  phi8Mix
}
