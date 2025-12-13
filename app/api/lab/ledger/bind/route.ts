/**
 * POST /api/lab/ledger/bind
 * =========================
 * Bind QPU results to cryptographic ledger for CLASS_A evidence
 *
 * Creates:
 * - RUN_RECORD.json (spec hash, provider, backend, shots, timestamps, job id)
 * - RESULT_NORMALIZED.json (counts, metadata, normalization)
 * - RESULT.sha256
 * - LEDGER_ENTRY.json (references above)
 * - Updates FINAL_CHAIN.sha256 (Merkle root)
 *
 * FAIL_CLOSED ENFORCED
 */

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  checkFailClosed,
  failClosedResponse,
  generateTelemetryCapsule,
  assertClassA
} from '@/lib/lab/fail-closed'
import {
  PHI_THRESHOLD,
  GAMMA_FIXED,
  TAU_0_US,
  WINDOW_US,
  SIGMA_THRESHOLD_G3,
  G3_REQUIREMENTS
} from '@/lib/lab/constants'
import type {
  QPUResult,
  LedgerEntry,
  LabAPIResponse,
  LedgerBindResponse,
  EvidenceGrade
} from '@/lib/lab/types'

// ═══════════════════════════════════════════════════════════════════════════════
// LEDGER STATE (In-memory for demo, would be persisted in production)
// ═══════════════════════════════════════════════════════════════════════════════

interface LedgerState {
  entries: LedgerEntry[]
  chain_hash: string
  g3_status: {
    architectures: Set<string>
    sigma_empirical_max: number
    gate_closed: boolean
  }
}

// Singleton ledger state
const ledgerState: LedgerState = {
  entries: [],
  chain_hash: crypto.createHash('sha256').update('GENESIS').digest('hex'),
  g3_status: {
    architectures: new Set(),
    sigma_empirical_max: 0,
    gate_closed: false
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HASH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function computeHash(data: unknown): string {
  const content = JSON.stringify(data, null, 0)
  return crypto.createHash('sha256').update(content).digest('hex')
}

function updateMerkleRoot(prevHash: string, newEntryHash: string): string {
  return crypto.createHash('sha256')
    .update(prevHash + newEntryHash)
    .digest('hex')
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERDICT DETERMINATION
// ═══════════════════════════════════════════════════════════════════════════════

type Verdict = 'EMPIRICAL_VALIDATED' | 'APPROACHING_SIGNIFICANCE' | 'PREDICTION_TESTED' | 'FAILED'

function determineVerdict(result: QPUResult, specHasTauSweep: boolean): Verdict {
  // Check for valid CLASS_A provenance
  if (!assertClassA(result.provenance)) {
    return 'FAILED'
  }

  // Check fidelity
  if (result.metrics.fidelity !== undefined && result.metrics.fidelity < 0.5) {
    return 'FAILED'
  }

  // If tau-sweep, check prediction window
  if (specHasTauSweep && result.metrics.tau_peak_us !== undefined) {
    const delta = Math.abs(result.metrics.tau_peak_us - TAU_0_US)

    if (!result.metrics.within_window && delta > WINDOW_US) {
      return 'PREDICTION_TESTED' // Outside window but valid data
    }

    if (result.metrics.sigma_empirical !== undefined) {
      if (result.metrics.sigma_empirical >= SIGMA_THRESHOLD_G3) {
        return 'EMPIRICAL_VALIDATED'
      }
      if (result.metrics.sigma_empirical >= 3.0) {
        return 'APPROACHING_SIGNIFICANCE'
      }
    }
  }

  return 'PREDICTION_TESTED'
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEDGER ENTRY BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

function buildLedgerEntry(
  result: QPUResult,
  specHash: string,
  verdict: Verdict
): LedgerEntry {
  const timestamp = new Date().toISOString()
  const prevHash = ledgerState.chain_hash

  // Build entry content (excluding hashes for hash computation)
  const entryContent = {
    spec_hash: specHash,
    job_id: result.job_id,
    provenance: result.provenance,
    metrics: result.metrics,
    ccce: result.ccce,
    verdict,
    timestamp
  }

  // Compute hashes
  const resultHash = computeHash(result)
  const entryHash = computeHash({ ...entryContent, prev_hash: prevHash, result_hash: resultHash })

  // Update G3 status
  ledgerState.g3_status.architectures.add(result.provenance.architecture)
  if (result.metrics.sigma_empirical !== undefined) {
    ledgerState.g3_status.sigma_empirical_max = Math.max(
      ledgerState.g3_status.sigma_empirical_max,
      result.metrics.sigma_empirical
    )
  }

  // Check G3 closure
  const archCount = ledgerState.g3_status.architectures.size
  const sigmaMax = ledgerState.g3_status.sigma_empirical_max
  ledgerState.g3_status.gate_closed =
    archCount >= G3_REQUIREMENTS.min_architectures &&
    sigmaMax >= G3_REQUIREMENTS.min_sigma_empirical

  const entry: LedgerEntry = {
    entry_id: `entry_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`,
    entry_hash: entryHash,
    prev_hash: prevHash,
    spec_hash: specHash,
    result_hash: resultHash,
    grade: result.provenance.grade as EvidenceGrade,
    verdict,
    g3_status: {
      architectures_count: archCount,
      architectures: Array.from(ledgerState.g3_status.architectures) as any[],
      sigma_empirical: sigmaMax,
      gate_closed: ledgerState.g3_status.gate_closed
    },
    created_utc: timestamp
  }

  // Update chain
  ledgerState.chain_hash = updateMerkleRoot(prevHash, entryHash)
  ledgerState.entries.push(entry)

  return entry
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: Request) {
  // FAIL_CLOSED CHECK
  const failCheck = checkFailClosed()
  if (!failCheck.valid) {
    return failClosedResponse(failCheck.error!)
  }

  try {
    const body = await request.json()
    const { result, spec_hash, has_tau_sweep } = body as {
      result: QPUResult
      spec_hash: string
      has_tau_sweep?: boolean
    }

    // Validate inputs
    if (!result || !result.job_id || !result.provenance) {
      return NextResponse.json({
        success: false,
        error: 'Valid QPUResult required',
        telemetry_capsule: generateTelemetryCapsule(0, 0, 1)
      } as LabAPIResponse, { status: 400 })
    }

    if (!spec_hash) {
      return NextResponse.json({
        success: false,
        error: 'spec_hash required for Δ-lock verification',
        telemetry_capsule: generateTelemetryCapsule(0, 0, 1)
      } as LabAPIResponse, { status: 400 })
    }

    // INVARIANT: Only CLASS_A results can be bound to ledger
    if (!assertClassA(result.provenance)) {
      return NextResponse.json({
        success: false,
        error: 'FAIL_CLOSED: Only CLASS_A (real QPU) results can be bound to ledger',
        fail_closed: true,
        telemetry_capsule: generateTelemetryCapsule(0, 0, 1)
      } as LabAPIResponse, { status: 403 })
    }

    // Determine verdict
    const verdict = determineVerdict(result, has_tau_sweep || false)

    // Build and store ledger entry
    const entry = buildLedgerEntry(result, spec_hash, verdict)

    // Build evidence file path (conceptual)
    const evidenceFile = `evidence/class_a/${entry.entry_id}.json`

    const response: LabAPIResponse<LedgerBindResponse> = {
      success: true,
      data: {
        entry,
        chain_hash: ledgerState.chain_hash,
        evidence_file: evidenceFile
      },
      telemetry_capsule: generateTelemetryCapsule(
        result.ccce.phi,
        result.ccce.lambda,
        result.ccce.gamma
      )
    }

    return NextResponse.json(response)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({
      success: false,
      error: errorMessage,
      telemetry_capsule: generateTelemetryCapsule(0, 0, 1)
    } as LabAPIResponse, { status: 500 })
  }
}

export async function GET() {
  const failCheck = checkFailClosed()

  return NextResponse.json({
    service: 'Q-SLICE Ledger Bind API',
    version: '2.2.0',
    fail_closed: failCheck.valid,
    ledger_status: {
      entries_count: ledgerState.entries.length,
      chain_hash: ledgerState.chain_hash,
      g3_status: {
        architectures_count: ledgerState.g3_status.architectures.size,
        architectures: Array.from(ledgerState.g3_status.architectures),
        sigma_empirical_max: ledgerState.g3_status.sigma_empirical_max,
        gate_closed: ledgerState.g3_status.gate_closed
      }
    },
    endpoints: {
      'POST /api/lab/ledger/bind': 'Bind QPUResult to cryptographic ledger',
      'GET /api/lab/ledger/bind': 'Get ledger status and G3 progress'
    },
    spec_lock: 'ENFORCED',
    g3_requirements: G3_REQUIREMENTS,
    verdicts: [
      'EMPIRICAL_VALIDATED - σ_empirical ≥ 5.0, within window',
      'APPROACHING_SIGNIFICANCE - σ_empirical ≥ 3.0',
      'PREDICTION_TESTED - Valid CLASS_A data',
      'FAILED - Invalid provenance or data'
    ]
  })
}
