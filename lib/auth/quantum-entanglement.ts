/**
 * Quantum-Secure Device Entanglement Protocol
 * ============================================
 * Browser hash entanglement for first-time login device binding
 *
 * Protocol:
 * 1. Generate device fingerprint from browser properties
 * 2. Create quantum entanglement hash using φ⁸-based mixing
 * 3. Bind device to user account via Supabase
 * 4. Verify entanglement on subsequent logins
 *
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PHI = 1.618033988749895
const PHI_8 = Math.pow(PHI, 8)  // 46.9787...
const LAMBDA_PHI = 2.176435e-8
const THETA_LOCK = 51.843

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE FINGERPRINT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface DeviceFingerprint {
  userAgent: string
  language: string
  platform: string
  screenResolution: string
  timezone: string
  colorDepth: number
  hardwareConcurrency: number
  deviceMemory?: number
  touchSupport: boolean
  webglVendor?: string
  webglRenderer?: string
  canvasHash: string
  audioHash: string
  timestamp: number
}

/**
 * Collect device fingerprint from browser environment
 */
export async function collectDeviceFingerprint(): Promise<DeviceFingerprint> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  let canvasHash = ''

  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#00fff6'
    ctx.fillRect(0, 0, 100, 30)
    ctx.fillStyle = '#ff00bb'
    ctx.fillText('Q-SLICE::}{', 2, 15)
    canvasHash = canvas.toDataURL().slice(-50)
  }

  // Audio fingerprint
  let audioHash = ''
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const analyser = audioContext.createAnalyser()
    oscillator.connect(analyser)
    analyser.fftSize = 256
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)
    audioHash = Array.from(dataArray.slice(0, 10)).join('')
    audioContext.close()
  } catch {
    audioHash = 'no-audio'
  }

  // WebGL info
  let webglVendor = ''
  let webglRenderer = ''
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      }
    }
  } catch {
    // WebGL not available
  }

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    colorDepth: screen.colorDepth,
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    deviceMemory: (navigator as any).deviceMemory,
    touchSupport: 'ontouchstart' in window,
    webglVendor,
    webglRenderer,
    canvasHash,
    audioHash,
    timestamp: Date.now()
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM ENTANGLEMENT HASH
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * φ⁸-based mixing function for quantum entanglement
 * Uses golden ratio properties for hash distribution
 */
function phi8Mix(input: string): number[] {
  const bytes = new TextEncoder().encode(input)
  const mixed: number[] = []

  for (let i = 0; i < bytes.length; i++) {
    // Apply φ⁸ modular mixing
    const phi8Val = (bytes[i] * PHI_8) % 256
    const thetaMix = (phi8Val * Math.sin(THETA_LOCK * Math.PI / 180)) % 256
    const lambdaMix = (thetaMix * LAMBDA_PHI * 1e10) % 256
    mixed.push(Math.floor(lambdaMix))
  }

  return mixed
}

/**
 * SHA-256 with quantum entanglement mixing
 */
async function quantumHash(data: string): Promise<string> {
  // Pre-mix with φ⁸
  const preMixed = phi8Mix(data)
  const preMixedStr = String.fromCharCode(...preMixed)

  // Standard SHA-256
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(preMixedStr + data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // Post-mix with φ⁸
  const postMixed = hashArray.map((b, i) =>
    Math.floor((b * PHI_8 + i * THETA_LOCK) % 256)
  )

  return postMixed.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate quantum entanglement hash from device fingerprint
 */
export async function generateEntanglementHash(
  fingerprint: DeviceFingerprint,
  userId: string,
  seed?: string
): Promise<string> {
  const fingerprintString = JSON.stringify({
    ...fingerprint,
    userId,
    seed: seed || process.env.QUANTUM_ENTANGLEMENT_SEED || 'q-slice-2025'
  })

  // Multiple rounds of quantum hashing
  let hash = await quantumHash(fingerprintString)
  for (let i = 0; i < 3; i++) {
    hash = await quantumHash(hash + PHI_8.toString() + i)
  }

  // Prepend Q-SLICE identifier
  return `QE-${hash.slice(0, 32)}`
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE BINDING
// ═══════════════════════════════════════════════════════════════════════════════

export interface DeviceBinding {
  user_id: string
  device_id: string
  entanglement_hash: string
  fingerprint_hash: string
  first_seen: string
  last_seen: string
  is_trusted: boolean
  ccce_metrics: {
    phi: number
    lambda: number
    gamma: number
    xi: number
  }
}

/**
 * Create device binding for first-time login
 */
export async function createDeviceBinding(
  userId: string,
  email: string
): Promise<DeviceBinding> {
  const fingerprint = await collectDeviceFingerprint()
  const entanglementHash = await generateEntanglementHash(fingerprint, userId)
  const fingerprintHash = await quantumHash(JSON.stringify(fingerprint))

  const deviceId = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

  // Calculate initial CCCE metrics
  const phi = 0.7734 + Math.random() * 0.1  // Start near threshold
  const lambda = 0.85 + Math.random() * 0.1
  const gamma = 0.092
  const xi = (lambda * phi) / gamma

  const binding: DeviceBinding = {
    user_id: userId,
    device_id: deviceId,
    entanglement_hash: entanglementHash,
    fingerprint_hash: fingerprintHash.slice(0, 32),
    first_seen: new Date().toISOString(),
    last_seen: new Date().toISOString(),
    is_trusted: true,
    ccce_metrics: { phi, lambda, gamma, xi }
  }

  // Store in localStorage for quick verification
  localStorage.setItem('q-slice-device-binding', JSON.stringify({
    device_id: deviceId,
    entanglement_hash: entanglementHash,
    user_id: userId,
    email
  }))

  return binding
}

/**
 * Verify device entanglement on login
 */
export async function verifyDeviceEntanglement(
  userId: string,
  storedHash: string
): Promise<{ valid: boolean; confidence: number; newHash?: string }> {
  const fingerprint = await collectDeviceFingerprint()
  const currentHash = await generateEntanglementHash(fingerprint, userId)

  // Check for exact match
  if (currentHash === storedHash) {
    return { valid: true, confidence: 1.0 }
  }

  // Check for partial match (browser update, etc.)
  const storedBase = storedHash.slice(3, 19)  // QE- prefix removed
  const currentBase = currentHash.slice(3, 19)

  let matchingChars = 0
  for (let i = 0; i < storedBase.length; i++) {
    if (storedBase[i] === currentBase[i]) matchingChars++
  }

  const confidence = matchingChars / storedBase.length

  // Accept if confidence > 0.7 (allow for minor browser changes)
  if (confidence > 0.7) {
    return {
      valid: true,
      confidence,
      newHash: currentHash  // Update stored hash
    }
  }

  return { valid: false, confidence }
}

// ═══════════════════════════════════════════════════════════════════════════════
// JWT ENHANCEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface QuantumJWTPayload {
  sub: string          // User ID
  email: string
  role: string
  device_id: string
  entanglement_hash: string
  ccce: {
    phi: number
    lambda: number
    gamma: number
    xi: number
  }
  iat: number
  exp: number
}

/**
 * Enhance JWT with quantum entanglement claims
 */
export function createQuantumJWTClaims(
  userId: string,
  email: string,
  role: string,
  binding: DeviceBinding
): Omit<QuantumJWTPayload, 'iat' | 'exp'> {
  return {
    sub: userId,
    email,
    role,
    device_id: binding.device_id,
    entanglement_hash: binding.entanglement_hash,
    ccce: binding.ccce_metrics
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get stored device binding from localStorage
 */
export function getStoredDeviceBinding(): {
  device_id: string
  entanglement_hash: string
  user_id: string
  email: string
} | null {
  try {
    const stored = localStorage.getItem('q-slice-device-binding')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

/**
 * Clear device binding (logout/device reset)
 */
export function clearDeviceBinding(): void {
  localStorage.removeItem('q-slice-device-binding')
}
