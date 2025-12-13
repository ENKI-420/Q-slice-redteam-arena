/**
 * Lab Evidence API - Create and verify evidence ledger entries
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 */

import { NextResponse } from "next/server"
import { createLedgerEntry, verifyLedgerEntry, exportLedger, computeHash, LedgerEntry } from "@/lib/lab/ledger"
import { CCCEMetrics, StatisticalMetrics } from "@/lib/lab/metrics"
import { RunRecord } from "@/lib/lab/spec"

// In-memory ledger storage (would be DB in production)
const ledgerEntries: LedgerEntry[] = []

// Create new ledger entry
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { run, counts, ccce, stats } = body as {
      run: RunRecord
      counts: Record<string, number>
      ccce: CCCEMetrics
      stats: StatisticalMetrics
    }

    if (!run || !counts || !ccce || !stats) {
      return NextResponse.json({
        ok: false,
        error: "Missing required fields: run, counts, ccce, stats",
      }, { status: 400 })
    }

    // Get previous entry hash for chain
    const previousEntry = ledgerEntries.length > 0
      ? ledgerEntries[ledgerEntries.length - 1].entry_sha256
      : null

    // Create ledger entry
    const entry = createLedgerEntry(run, counts, ccce, stats, previousEntry)

    // Store
    ledgerEntries.push(entry)

    return NextResponse.json({
      ok: true,
      entry,
      chain_length: ledgerEntries.length,
    })

  } catch (error) {
    console.error("[Evidence Create Error]", error)
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}

// Get ledger entries
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action")

  if (action === "export") {
    // Export full ledger
    const exported = exportLedger(ledgerEntries)
    return NextResponse.json({
      ok: true,
      ...exported,
    })
  }

  if (action === "verify") {
    // Verify specific entry
    const entryId = searchParams.get("entry_id")
    if (!entryId) {
      return NextResponse.json({
        ok: false,
        error: "entry_id required for verification",
      }, { status: 400 })
    }

    const entry = ledgerEntries.find((e) => e.entry_id === entryId)
    if (!entry) {
      return NextResponse.json({
        ok: false,
        error: "Entry not found",
      }, { status: 404 })
    }

    const result = verifyLedgerEntry(entry)
    return NextResponse.json({
      ok: true,
      entry_id: entryId,
      ...result,
    })
  }

  // Default: list all entries
  return NextResponse.json({
    ok: true,
    entries: ledgerEntries,
    count: ledgerEntries.length,
    latest_hash: ledgerEntries.length > 0
      ? ledgerEntries[ledgerEntries.length - 1].entry_sha256
      : null,
  })
}
