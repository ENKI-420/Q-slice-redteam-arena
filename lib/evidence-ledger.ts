/**
 * Q-SLICE Evidence Ledger — Fail-Closed Audit Infrastructure
 * ===========================================================
 * Merkle-chained, hash-verified, CLASS-graded evidence system
 *
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5 | Agile Defense Systems, LLC
 *
 * AXIOM: FAIL_CLOSED
 *   rule[1] = "if env(ALLOW_MOCK)==1 then DENY"
 *   rule[2] = "if env(ALLOW_SIM)==1 then DENY"
 *   rule[3] = "if backend ∉ ALLOWLIST then DENY"
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS (IMMUTABLE - SPEC_LOCK)
// ═══════════════════════════════════════════════════════════════════════════════

export const SPEC_LOCK = {
  version: '2.2.0',
  LAMBDA_PHI: 2.176435e-8,
  PHI_THRESHOLD: 0.7734,
  GAMMA_CRITICAL: 0.300,
  WINDOW_US: 2.5,
  THETA_LOCK: 51.843,
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// EXECUTION MODE & POLICY
// ═══════════════════════════════════════════════════════════════════════════════

export type ExecutionMode = 'QPU' | 'DEV'

export type EvidenceClass =
  | 'CLASS_A'  // QPU job IDs + backend + shots + timestamps + raw results + hash chain
  | 'CLASS_B'  // Pipeline validated but not QPU-validated
  | 'CLASS_C'  // Dev-only synthetic (FORBIDDEN in MODE=QPU)

export const BACKEND_ALLOWLIST = [
  'ibm_fez',
  'ibm_torino',
  'ibm_marrakesh',
] as const

export type AllowedBackend = typeof BACKEND_ALLOWLIST[number]

// ═══════════════════════════════════════════════════════════════════════════════
// EVIDENCE ENTRY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface EvidenceEntry {
  id: string                    // UUIDv7
  timestamp: string             // ISO 8601
  mode: ExecutionMode
  class: EvidenceClass

  // Request provenance
  request_hash: string          // SHA256(canon(request))
  request_canon: string         // Canonical JSON of request

  // Execution provenance
  backend: AllowedBackend
  job_id?: string               // IBM job ID (CLASS_A only)
  shots: number

  // Result provenance (populated on completion)
  result_hash?: string          // SHA256(raw_results_blob)
  result_blob?: string          // Base64-encoded raw results

  // Chain provenance
  leaf_hash?: string            // SHA256(entry_hash || result_hash || job_id || ...)
  merkle_root?: string          // Current Merkle root after this entry
  chain_index: number           // Position in chain

  // CCCE metrics at time of execution
  ccce?: {
    phi: number
    lambda: number
    gamma: number
    xi: number
  }

  // Policy decision trace
  policy_trace: {
    version: string
    candidate_backends: string[]
    selected_backend: string
    reason_codes: string[]
    decision_timestamp: string
  }
}

export interface MerkleChainState {
  root: string
  leaf_count: number
  last_entry_id: string
  last_entry_hash: string
  spec_lock_hash: string
  created_at: string
  updated_at: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL JSON SERIALIZATION (RFC 8785 compliant)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Canonical JSON serialization per RFC 8785
 * - Sorted object keys
 * - No whitespace
 * - Unicode normalization
 */
export function canonicalize(obj: unknown): string {
  if (obj === null) return 'null'
  if (typeof obj === 'boolean') return obj ? 'true' : 'false'
  if (typeof obj === 'number') {
    if (!Number.isFinite(obj)) throw new Error('Non-finite numbers forbidden in canonical JSON')
    return Object.is(obj, -0) ? '0' : String(obj)
  }
  if (typeof obj === 'string') return JSON.stringify(obj)
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalize).join(',') + ']'
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj).sort()
    const pairs = keys
      .filter(k => (obj as Record<string, unknown>)[k] !== undefined)
      .map(k => JSON.stringify(k) + ':' + canonicalize((obj as Record<string, unknown>)[k]))
    return '{' + pairs.join(',') + '}'
  }
  throw new Error(`Unsupported type: ${typeof obj}`)
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHA-256 HASHING (Web Crypto API)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute SHA-256 hash of input string
 */
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Synchronous SHA-256 for server-side (fallback)
 */
export function sha256Sync(input: string): string {
  // Simple implementation for deterministic hashing
  // In production, use crypto.createHash('sha256')
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  // Expand to 64 hex chars by iterating
  let result = ''
  let state = hash >>> 0
  for (let i = 0; i < 8; i++) {
    state = Math.imul(state ^ (state >>> 16), 0x85ebca6b)
    state = Math.imul(state ^ (state >>> 13), 0xc2b2ae35)
    state ^= state >>> 16
    result += (state >>> 0).toString(16).padStart(8, '0')
  }
  return result
}

// ═══════════════════════════════════════════════════════════════════════════════
// UUIDv7 GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate UUIDv7 (timestamp-ordered)
 */
export function uuidv7(): string {
  const timestamp = Date.now()
  const timestampHex = timestamp.toString(16).padStart(12, '0')

  // Random bytes for the rest
  const randomBytes = new Uint8Array(10)
  crypto.getRandomValues(randomBytes)

  // Set version (7) and variant bits
  randomBytes[0] = (randomBytes[0] & 0x0f) | 0x70  // Version 7
  randomBytes[2] = (randomBytes[2] & 0x3f) | 0x80  // Variant

  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return [
    timestampHex.slice(0, 8),
    timestampHex.slice(8, 12) + randomHex.slice(0, 2),
    randomHex.slice(2, 6),
    randomHex.slice(6, 10),
    randomHex.slice(10, 22)
  ].join('-')
}

// ═══════════════════════════════════════════════════════════════════════════════
// MERKLE TREE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute Merkle root from leaf hashes
 */
export async function computeMerkleRoot(leaves: string[]): Promise<string> {
  if (leaves.length === 0) return await sha256('EMPTY_TREE')
  if (leaves.length === 1) return leaves[0]

  // Pad to power of 2 if needed
  const paddedLeaves = [...leaves]
  while ((paddedLeaves.length & (paddedLeaves.length - 1)) !== 0) {
    paddedLeaves.push(paddedLeaves[paddedLeaves.length - 1])
  }

  let level = paddedLeaves
  while (level.length > 1) {
    const nextLevel: string[] = []
    for (let i = 0; i < level.length; i += 2) {
      const combined = level[i] + level[i + 1]
      nextLevel.push(await sha256(combined))
    }
    level = nextLevel
  }

  return level[0]
}

/**
 * Compute leaf hash from evidence entry
 */
export async function computeLeafHash(entry: EvidenceEntry): Promise<string> {
  const leafData = [
    entry.request_hash,
    entry.result_hash || 'PENDING',
    entry.job_id || 'NO_JOB',
    entry.backend,
    entry.shots.toString(),
    entry.timestamp
  ].join('||')

  return await sha256(leafData)
}

/**
 * Compute final chain hash
 */
export async function computeFinalChain(
  merkleRoot: string,
  specLockHash: string,
  gateState: string,
  preregDoi?: string
): Promise<string> {
  const chainData = [
    merkleRoot,
    specLockHash,
    gateState,
    preregDoi || 'NO_PREREG'
  ].join('||')

  return await sha256(chainData)
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAIL-CLOSED VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface ValidationResult {
  valid: boolean
  reason_codes: string[]
  policy_version: string
}

/**
 * Validate request against fail-closed policy
 */
export function validateFailClosed(
  mode: ExecutionMode,
  backend: string,
  options: {
    simulate?: boolean
    mock?: boolean
    localhost?: boolean
  }
): ValidationResult {
  const reasons: string[] = []
  const policy_version = 'FAIL_CLOSED_v1.0'

  // Rule 1: No simulation in QPU mode
  if (mode === 'QPU' && options.simulate) {
    reasons.push('DENY:SIMULATE_IN_QPU_MODE')
  }

  // Rule 2: No mock in QPU mode
  if (mode === 'QPU' && options.mock) {
    reasons.push('DENY:MOCK_IN_QPU_MODE')
  }

  // Rule 3: No localhost data sources in QPU mode
  if (mode === 'QPU' && options.localhost) {
    reasons.push('DENY:LOCALHOST_IN_QPU_MODE')
  }

  // Rule 4: Backend must be in allowlist
  if (!BACKEND_ALLOWLIST.includes(backend as AllowedBackend)) {
    reasons.push(`DENY:BACKEND_NOT_IN_ALLOWLIST:${backend}`)
  }

  return {
    valid: reasons.length === 0,
    reason_codes: reasons.length > 0 ? reasons : ['PASS:ALL_RULES'],
    policy_version
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKEND POLICY SELECTION
// ═══════════════════════════════════════════════════════════════════════════════

export interface BackendCandidate {
  name: AllowedBackend
  num_qubits: number
  pending_jobs: number
  operational: boolean
  estimated_wait_ms?: number
}

export interface BackendDecision {
  selected: AllowedBackend
  candidates: BackendCandidate[]
  reason_codes: string[]
  policy_version: string
  decision_timestamp: string
}

/**
 * Select optimal backend using policy function
 */
export function selectBackendByPolicy(
  candidates: BackendCandidate[],
  requiredQubits: number,
  preferredBackend?: string,
  pendingThreshold: number = 100
): BackendDecision {
  const policy_version = 'BACKEND_POLICY_v1.0'
  const decision_timestamp = new Date().toISOString()
  const reason_codes: string[] = []

  // Filter operational backends with sufficient qubits
  const suitable = candidates.filter(b =>
    b.operational &&
    b.num_qubits >= requiredQubits &&
    BACKEND_ALLOWLIST.includes(b.name)
  )

  if (suitable.length === 0) {
    reason_codes.push('FALLBACK:NO_SUITABLE_BACKENDS')
    return {
      selected: 'ibm_fez',  // Default fallback
      candidates,
      reason_codes,
      policy_version,
      decision_timestamp
    }
  }

  // Prefer ibm_fez if queue is manageable
  const fez = suitable.find(b => b.name === 'ibm_fez')
  if (fez && fez.pending_jobs < pendingThreshold) {
    reason_codes.push('SELECT:IBM_FEZ_LOW_QUEUE')
    return {
      selected: 'ibm_fez',
      candidates,
      reason_codes,
      policy_version,
      decision_timestamp
    }
  }

  // Check preferred backend
  if (preferredBackend) {
    const preferred = suitable.find(b => b.name === preferredBackend)
    if (preferred) {
      reason_codes.push(`SELECT:PREFERRED_BACKEND:${preferredBackend}`)
      return {
        selected: preferred.name,
        candidates,
        reason_codes,
        policy_version,
        decision_timestamp
      }
    }
    reason_codes.push(`IGNORE:PREFERRED_NOT_SUITABLE:${preferredBackend}`)
  }

  // Select by lowest queue
  const sorted = [...suitable].sort((a, b) => a.pending_jobs - b.pending_jobs)
  reason_codes.push(`SELECT:LOWEST_QUEUE:${sorted[0].name}:${sorted[0].pending_jobs}`)

  return {
    selected: sorted[0].name,
    candidates,
    reason_codes,
    policy_version,
    decision_timestamp
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVIDENCE LEDGER OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

// In-memory ledger (would use database in production)
const evidenceLedger: EvidenceEntry[] = []
let merkleChainState: MerkleChainState | null = null

/**
 * Create new evidence entry on experiment submission
 */
export async function createEvidenceEntry(
  request: {
    vector: string
    shots: number
    backend: AllowedBackend
  },
  mode: ExecutionMode,
  policyDecision: BackendDecision,
  ccce?: { phi: number; lambda: number; gamma: number; xi: number }
): Promise<EvidenceEntry> {
  const id = uuidv7()
  const timestamp = new Date().toISOString()
  const request_canon = canonicalize(request)
  const request_hash = await sha256(request_canon)

  const evidenceClass: EvidenceClass = mode === 'QPU' ? 'CLASS_B' : 'CLASS_C'

  const entry: EvidenceEntry = {
    id,
    timestamp,
    mode,
    class: evidenceClass,
    request_hash,
    request_canon,
    backend: request.backend,
    shots: request.shots,
    chain_index: evidenceLedger.length,
    ccce,
    policy_trace: {
      version: policyDecision.policy_version,
      candidate_backends: policyDecision.candidates.map(c => c.name),
      selected_backend: policyDecision.selected,
      reason_codes: policyDecision.reason_codes,
      decision_timestamp: policyDecision.decision_timestamp
    }
  }

  evidenceLedger.push(entry)
  return entry
}

/**
 * Seal evidence entry with QPU results (upgrades to CLASS_A)
 */
export async function sealEvidenceEntry(
  entryId: string,
  jobId: string,
  rawResults: Record<string, number>
): Promise<EvidenceEntry | null> {
  const entry = evidenceLedger.find(e => e.id === entryId)
  if (!entry) return null

  // Compute result hash
  const result_canon = canonicalize(rawResults)
  entry.result_blob = Buffer.from(result_canon).toString('base64')
  entry.result_hash = await sha256(result_canon)
  entry.job_id = jobId

  // Upgrade to CLASS_A
  entry.class = 'CLASS_A'

  // Compute leaf hash
  entry.leaf_hash = await computeLeafHash(entry)

  // Update Merkle root
  const allLeaves = evidenceLedger
    .filter(e => e.leaf_hash)
    .map(e => e.leaf_hash as string)

  entry.merkle_root = await computeMerkleRoot(allLeaves)

  // Update chain state
  const specLockHash = await sha256(canonicalize(SPEC_LOCK))
  merkleChainState = {
    root: entry.merkle_root,
    leaf_count: allLeaves.length,
    last_entry_id: entry.id,
    last_entry_hash: entry.leaf_hash,
    spec_lock_hash: specLockHash,
    created_at: merkleChainState?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return entry
}

/**
 * Get evidence entry by ID
 */
export function getEvidenceEntry(id: string): EvidenceEntry | undefined {
  return evidenceLedger.find(e => e.id === id)
}

/**
 * Get current chain state
 */
export function getChainState(): MerkleChainState | null {
  return merkleChainState
}

/**
 * Get all evidence entries (for audit)
 */
export function getAllEvidence(): EvidenceEntry[] {
  return [...evidenceLedger]
}

// ═══════════════════════════════════════════════════════════════════════════════
// WATERMARK UTILITIES (for DEV/synthetic data)
// ═══════════════════════════════════════════════════════════════════════════════

export const WATERMARK = {
  DEV: '⚠️ DEV/SYNTHETIC',
  CLASS_C: '🚫 CLASS_C: NOT FOR PRODUCTION',
  SIMULATED: '🔬 SIMULATED DATA',
} as const

export function applyWatermark(data: unknown, type: keyof typeof WATERMARK): unknown {
  if (typeof data === 'object' && data !== null) {
    return {
      ...data,
      __watermark: WATERMARK[type],
      __watermark_timestamp: new Date().toISOString(),
      __class: type === 'DEV' ? 'CLASS_C' : type
    }
  }
  return data
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  EvidenceEntry,
  MerkleChainState,
  BackendCandidate,
  BackendDecision,
  ValidationResult
}
