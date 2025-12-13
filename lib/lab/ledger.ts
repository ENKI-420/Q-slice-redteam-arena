/**
 * Evidence Ledger Binding
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * Cryptographic binding between experiment results and evidence ledger.
 * Ensures non-repudiable, hash-locked evidence chain.
 */

import crypto from "crypto"
import { RunRecord } from "./spec"
import { CCCEMetrics, StatisticalMetrics } from "./metrics"

// === LEDGER ENTRY ===
export interface LedgerEntry {
  entry_id: string
  entry_sha256: string
  timestamp_utc: string
  cage_code: string

  // Run reference
  run_id: string
  spec_sha256: string
  provider_job_id: string

  // Evidence hashes
  result_sha256: string
  counts_sha256: string
  metrics_sha256: string

  // Grade and claim
  grade: "CLASS_A" | "CLASS_B" | "CLASS_C"
  claim_tag: string
  verdict: string

  // CCCE metrics snapshot
  ccce: CCCEMetrics

  // Statistical metrics
  stats: StatisticalMetrics

  // Chain binding
  previous_entry_sha256: string | null
  merkle_root?: string
}

// === COMPUTE HASHES ===
export function computeHash(data: unknown): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data, Object.keys(data as object).sort()))
    .digest("hex")
}

// === CREATE LEDGER ENTRY ===
export function createLedgerEntry(
  run: RunRecord,
  counts: Record<string, number>,
  ccce: CCCEMetrics,
  stats: StatisticalMetrics,
  previousEntry: string | null = null
): LedgerEntry {
  const entry_id = crypto.randomUUID()
  const timestamp_utc = new Date().toISOString()

  // Compute individual hashes
  const result_sha256 = computeHash({
    run_id: run.run_id,
    provider_job_id: run.provider_job_id,
    counts,
    completed_utc: run.completed_utc,
  })

  const counts_sha256 = computeHash(counts)
  const metrics_sha256 = computeHash({ ccce, stats })

  // Determine grade
  let grade: "CLASS_A" | "CLASS_B" | "CLASS_C" = "CLASS_C"
  if (run.provider === "ibm-quantum" || run.provider === "aws-braket" || run.provider === "ionq-direct") {
    grade = "CLASS_A" // Real QPU
  }

  // Determine claim tag
  let claim_tag = "MODEL_VALIDATED"
  let verdict = "SIMULATION_ONLY"

  if (grade === "CLASS_A") {
    if (stats.sigma_empirical >= 5.0 && stats.within_window) {
      claim_tag = "EMPIRICAL_VALIDATED"
      verdict = "PREDICTION_CONFIRMED"
    } else if (stats.within_window) {
      claim_tag = "PREDICTION_WITHIN_WINDOW"
      verdict = "APPROACHING_SIGNIFICANCE"
    } else {
      claim_tag = "PREDICTION_TESTED"
      verdict = "QPU_EXECUTED"
    }
  }

  // Build entry (without final hash)
  const entryData = {
    entry_id,
    timestamp_utc,
    cage_code: "9HUP5",
    run_id: run.run_id,
    spec_sha256: run.spec_sha256,
    provider_job_id: run.provider_job_id,
    result_sha256,
    counts_sha256,
    metrics_sha256,
    grade,
    claim_tag,
    verdict,
    ccce,
    stats,
    previous_entry_sha256: previousEntry,
  }

  // Compute entry hash
  const entry_sha256 = computeHash(entryData)

  return {
    ...entryData,
    entry_sha256,
  }
}

// === VERIFY LEDGER ENTRY ===
export function verifyLedgerEntry(entry: LedgerEntry): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Recompute entry hash
  const { entry_sha256, ...entryData } = entry
  const recomputed = computeHash(entryData)

  if (recomputed !== entry_sha256) {
    errors.push(`Entry hash mismatch: expected ${entry_sha256}, got ${recomputed}`)
  }

  // Verify individual component hashes
  const metricsHash = computeHash({ ccce: entry.ccce, stats: entry.stats })
  if (metricsHash !== entry.metrics_sha256) {
    errors.push("Metrics hash mismatch")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// === MERKLE TREE FOR CHAIN ===
export function computeMerkleRoot(entries: LedgerEntry[]): string {
  if (entries.length === 0) return computeHash("EMPTY_CHAIN")
  if (entries.length === 1) return entries[0].entry_sha256

  const hashes = entries.map((e) => e.entry_sha256)

  while (hashes.length > 1) {
    const nextLevel: string[] = []
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i]
      const right = i + 1 < hashes.length ? hashes[i + 1] : left
      nextLevel.push(computeHash(left + right))
    }
    hashes.length = 0
    hashes.push(...nextLevel)
  }

  return hashes[0]
}

// === CHAIN INTEGRITY ===
export function verifyChain(entries: LedgerEntry[]): {
  valid: boolean
  errors: string[]
  merkle_root: string
} {
  const errors: string[] = []

  // Verify each entry
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const result = verifyLedgerEntry(entry)
    if (!result.valid) {
      errors.push(`Entry ${i} (${entry.entry_id}): ${result.errors.join(", ")}`)
    }

    // Verify chain linkage
    if (i > 0) {
      if (entry.previous_entry_sha256 !== entries[i - 1].entry_sha256) {
        errors.push(`Chain break at entry ${i}: previous hash mismatch`)
      }
    } else {
      if (entry.previous_entry_sha256 !== null) {
        errors.push("First entry should have null previous_entry_sha256")
      }
    }
  }

  const merkle_root = computeMerkleRoot(entries)

  return {
    valid: errors.length === 0,
    errors,
    merkle_root,
  }
}

// === EXPORT LEDGER ===
export interface LedgerExport {
  manifest_version: string
  exported_utc: string
  cage_code: string
  entry_count: number
  merkle_root: string
  chain_valid: boolean
  entries: LedgerEntry[]
}

export function exportLedger(entries: LedgerEntry[]): LedgerExport {
  const verification = verifyChain(entries)

  return {
    manifest_version: "evidence-ledger/v1.0.0",
    exported_utc: new Date().toISOString(),
    cage_code: "9HUP5",
    entry_count: entries.length,
    merkle_root: verification.merkle_root,
    chain_valid: verification.valid,
    entries,
  }
}

// === SIGN ENTRY (Ed25519) ===
export async function signEntry(
  entry: LedgerEntry,
  privateKeyPem: string
): Promise<{ signature: string; public_key_id: string }> {
  // This would use crypto.sign with Ed25519
  // For now, return placeholder
  const dataToSign = entry.entry_sha256

  // In production, use proper Ed25519 signing
  const signature = crypto
    .createHmac("sha256", privateKeyPem)
    .update(dataToSign)
    .digest("hex")

  const public_key_id = crypto
    .createHash("sha256")
    .update(privateKeyPem)
    .digest("hex")
    .slice(0, 16)

  return { signature, public_key_id }
}
