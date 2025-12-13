/**
 * Fail-Closed Invariants for QPU Lab
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * CRITICAL: This module enforces NO_SIM / NO_MOCK / FAIL_CLOSED
 *
 * Formally:
 * ALLOW_SIM = ⊥, ALLOW_MOCK = ⊥, ¬CREDENTIALS ⇒ HTTP 503 (FAIL_CLOSED)
 */

export class FailClosedError extends Error {
  code: string

  constructor(message: string, code: string = "FAIL_CLOSED") {
    super(message)
    this.name = "FailClosedError"
    this.code = code
  }
}

// === CREDENTIAL STATUS ===
export interface CredentialStatus {
  hasIBM: boolean
  hasBraket: boolean
  hasIonQ: boolean
  hasQuantinuum: boolean
  anyAvailable: boolean
  providers: string[]
}

/**
 * Check which QPU credentials are available
 */
export function getCredentialStatus(): CredentialStatus {
  const hasIBM = !!(process.env.IBM_QUANTUM_TOKEN)
  const hasBraket = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
  const hasIonQ = !!(process.env.IONQ_API_KEY)
  const hasQuantinuum = !!(process.env.QUANTINUUM_API_KEY)

  const providers: string[] = []
  if (hasIBM) providers.push("ibm-quantum")
  if (hasBraket) providers.push("aws-braket")
  if (hasIonQ) providers.push("ionq-direct")
  if (hasQuantinuum) providers.push("quantinuum")

  return {
    hasIBM,
    hasBraket,
    hasIonQ,
    hasQuantinuum,
    anyAvailable: providers.length > 0,
    providers,
  }
}

/**
 * FAIL_CLOSED: Assert real QPU credentials are available
 * Throws FailClosedError if sim/mock is enabled or no credentials present
 */
export function assertRealQPUOnly(): void {
  // Check for forbidden sim/mock flags
  if (process.env.ALLOW_SIM === "1" || process.env.ALLOW_SIM === "true") {
    throw new FailClosedError(
      "FAIL_CLOSED: Simulation mode forbidden (ALLOW_SIM set). Real QPU required.",
      "SIM_FORBIDDEN"
    )
  }

  if (process.env.ALLOW_MOCK === "1" || process.env.ALLOW_MOCK === "true") {
    throw new FailClosedError(
      "FAIL_CLOSED: Mock mode forbidden (ALLOW_MOCK set). Real QPU required.",
      "MOCK_FORBIDDEN"
    )
  }

  // Check for credentials
  const status = getCredentialStatus()

  if (!status.anyAvailable) {
    throw new FailClosedError(
      "FAIL_CLOSED: No QPU credentials present. Configure IBM_QUANTUM_TOKEN, AWS credentials, or IONQ_API_KEY.",
      "NO_CREDENTIALS"
    )
  }
}

/**
 * Assert a specific provider is available
 */
export function assertProviderAvailable(provider: string): void {
  assertRealQPUOnly()

  const status = getCredentialStatus()

  if (provider === "ibm-quantum" && !status.hasIBM) {
    throw new FailClosedError(
      "FAIL_CLOSED: IBM Quantum credentials not configured (IBM_QUANTUM_TOKEN missing).",
      "IBM_NOT_CONFIGURED"
    )
  }

  if (provider === "aws-braket" && !status.hasBraket) {
    throw new FailClosedError(
      "FAIL_CLOSED: AWS Braket credentials not configured (AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY missing).",
      "BRAKET_NOT_CONFIGURED"
    )
  }

  if (provider === "ionq-direct" && !status.hasIonQ) {
    throw new FailClosedError(
      "FAIL_CLOSED: IonQ credentials not configured (IONQ_API_KEY missing).",
      "IONQ_NOT_CONFIGURED"
    )
  }

  if (provider === "quantinuum" && !status.hasQuantinuum) {
    throw new FailClosedError(
      "FAIL_CLOSED: Quantinuum credentials not configured (QUANTINUUM_API_KEY missing).",
      "QUANTINUUM_NOT_CONFIGURED"
    )
  }
}

/**
 * Validate that counts are from real QPU (basic heuristic checks)
 */
export function validateRealCounts(counts: Record<string, number>): void {
  // Check for suspicious patterns that indicate mock data
  const values = Object.values(counts)
  const total = values.reduce((a, b) => a + b, 0)

  if (total === 0) {
    throw new FailClosedError(
      "FAIL_CLOSED: Zero total counts - invalid measurement data.",
      "INVALID_COUNTS"
    )
  }

  // Check for perfectly uniform distributions (too perfect = mock)
  const uniqueValues = new Set(values)
  if (values.length > 2 && uniqueValues.size === 1 && values[0] === total / values.length) {
    throw new FailClosedError(
      "FAIL_CLOSED: Perfectly uniform distribution detected - suspected mock data.",
      "SUSPECTED_MOCK"
    )
  }
}

/**
 * Create a fail-closed response for API routes
 */
export function failClosedResponse(error: FailClosedError) {
  return {
    ok: false,
    error: error.message,
    code: error.code,
    fail_closed: true,
    timestamp: new Date().toISOString(),
  }
}

// === INVARIANT ASSERTIONS ===
export const INVARIANTS = {
  I_NO_SIM: "Simulation data forbidden - real QPU only",
  I_NO_MOCK: "Mock data forbidden - real QPU only",
  I_CREDENTIALS: "QPU credentials required",
  I_REAL_COUNTS: "Measurement counts must be from real hardware",
  I_SPEC_LOCK: "Experiment spec must be Δ-locked",
  I_LEDGER_BIND: "Results must bind to evidence ledger",
} as const
