/**
 * FAIL-CLOSED Middleware for Q-SLICE Quantum Lab
 * ===============================================
 * Enforces: No mocks, no simulations, real QPU only
 *
 * INVARIANT:
 *   (ALLOW_SIM=1) ∨ (ALLOW_MOCK=1) ⇒ DENY
 *   ¬QPU_TOKEN ⇒ DENY
 *
 * Returns HTTP 503 FAIL_CLOSED when constraints violated.
 */

import { NextResponse } from 'next/server'
import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED } from './constants'
import type { LabAPIResponse } from './types'

export interface FailClosedResult {
  valid: boolean
  error?: string
  available_providers: string[]
}

/**
 * Check fail-closed invariants
 * Returns error if any violation detected
 */
export function checkFailClosed(): FailClosedResult {
  const violations: string[] = []
  const available_providers: string[] = []

  // === INVARIANT 1: No simulation mode ===
  if (process.env.ALLOW_SIM === '1' || process.env.ALLOW_SIMULATION === '1') {
    violations.push('V_SIM_MODE: Simulation mode forbidden in production')
  }

  // === INVARIANT 2: No mock mode ===
  if (process.env.ALLOW_MOCK === '1' || process.env.MOCK_QPU === '1') {
    violations.push('V_MOCK_MODE: Mock mode forbidden in production')
  }

  // === INVARIANT 3: At least one QPU provider configured ===

  // Check Qiskit Runtime (superconducting QPUs)
  const qiskitToken = process.env.IBM_QUANTUM_TOKEN ||
                      process.env.QISKIT_RUNTIME_TOKEN ||
                      process.env.IBM_QUANTUM_API_KEY
  if (qiskitToken) {
    available_providers.push('qiskit_runtime')
  }

  // Check AWS Braket (IonQ, QuEra)
  const braketToken = process.env.AWS_BRAKET_TOKEN ||
                      process.env.AWS_ACCESS_KEY_ID
  if (braketToken) {
    available_providers.push('aws_braket')
  }

  // Check Quantum Rings
  const qringsToken = process.env.QUANTUM_RINGS_TOKEN ||
                      process.env.QRINGS_API_KEY
  if (qringsToken) {
    available_providers.push('quantum_rings')
  }

  // === INVARIANT 4: Must have at least one provider ===
  if (available_providers.length === 0) {
    violations.push('V_NO_QPU: No quantum processor credentials configured')
  }

  return {
    valid: violations.length === 0,
    error: violations.length > 0 ? violations.join('; ') : undefined,
    available_providers
  }
}

/**
 * Create FAIL_CLOSED response (HTTP 503)
 */
export function failClosedResponse(error: string): NextResponse {
  const response: LabAPIResponse = {
    success: false,
    error: `FAIL_CLOSED: ${error}`,
    fail_closed: true,
    telemetry_capsule: {
      phi: 0,
      lambda: 0,
      gamma: 1.0,  // Maximum decoherence
      xi: 0,
      checksum: 'FAIL_CLOSED'
    }
  }

  return NextResponse.json(response, {
    status: 503,
    headers: {
      'X-Fail-Closed': 'true',
      'X-Error': error.substring(0, 100)
    }
  })
}

/**
 * Middleware wrapper for lab API handlers
 * Enforces fail-closed before any handler executes
 */
export function withFailClosed<T>(
  handler: () => Promise<NextResponse<LabAPIResponse<T>>>
): () => Promise<NextResponse<LabAPIResponse<T>>> {
  return async () => {
    const check = checkFailClosed()

    if (!check.valid) {
      return failClosedResponse(check.error!) as NextResponse<LabAPIResponse<T>>
    }

    return handler()
  }
}

/**
 * Generate telemetry capsule for responses
 */
export function generateTelemetryCapsule(
  phi: number,
  lambda: number,
  gamma: number
): { phi: number; lambda: number; gamma: number; xi: number; checksum: string } {
  const xi = (lambda * phi) / Math.max(gamma, 0.001)

  // Generate checksum from metrics
  const data = `${phi.toFixed(6)}:${lambda.toFixed(6)}:${gamma.toFixed(6)}:${Date.now()}`
  const checksum = Buffer.from(data).toString('base64').slice(0, 16)

  return { phi, lambda, gamma, xi, checksum }
}

/**
 * Assert grade is CLASS_A (real QPU)
 */
export function assertClassA(provenance: { exec_mode: string; grade: string }): boolean {
  return provenance.exec_mode === 'CLOUD_QPU' && provenance.grade === 'CLASS_A'
}
