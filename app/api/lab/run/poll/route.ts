/**
 * Lab Run Poll API - Poll job status and get results
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * FAIL_CLOSED: Results must be from real QPU
 */

import { NextResponse } from "next/server"
import { assertRealQPUOnly, failClosedResponse, FailClosedError, validateRealCounts } from "@/lib/lab/invariants"
import { getIBMProvider } from "@/lib/lab/providers/ibm"
import { computeCCCEMetrics, analyzeTauSweep } from "@/lib/lab/metrics"
import { createLedgerEntry } from "@/lib/lab/ledger"

export async function POST(req: Request) {
  try {
    assertRealQPUOnly()

    const { job_id, provider, is_batch, tau_points } = await req.json()

    if (!job_id) {
      return NextResponse.json({
        ok: false,
        error: "job_id is required",
      }, { status: 400 })
    }

    let result: any

    if (provider === "ibm-quantum" || !provider) {
      const ibm = getIBMProvider()

      if (is_batch && tau_points) {
        // Poll batch job
        const batchResult = await ibm.pollBatch(job_id)

        if (batchResult.status === "COMPLETED") {
          // Validate all counts
          for (const r of batchResult.results) {
            validateRealCounts(r.counts)
          }

          // Build tau-sweep results
          const sweepResults = batchResult.results.map((r, i) => ({
            tau_us: tau_points[i],
            counts: r.counts,
            shots: Object.values(r.counts).reduce((a: number, b: number) => a + b, 0),
          }))

          // Analyze
          const analysis = analyzeTauSweep(sweepResults)

          result = {
            job_id,
            status: "COMPLETED",
            completed_utc: new Date().toISOString(),
            raw_results: sweepResults,
            analysis: {
              tau_peak_us: analysis.tau_peak_us,
              tau_0_us: analysis.tau_0_us,
              f_peak: analysis.f_peak,
              f_min: analysis.f_min,
              fidelity_ratio: analysis.fidelity_ratio,
            },
            ccce: analysis.ccce,
            stats: analysis.stats,
            grade: "CLASS_A",
            claim_tag: analysis.stats.within_window
              ? (analysis.stats.sigma_empirical >= 5.0 ? "EMPIRICAL_VALIDATED" : "PREDICTION_WITHIN_WINDOW")
              : "PREDICTION_TESTED",
          }
        } else {
          result = {
            job_id,
            status: batchResult.status,
          }
        }
      } else {
        // Poll single job
        const jobResult = await ibm.poll(job_id)

        if (jobResult.status === "COMPLETED" && jobResult.counts) {
          validateRealCounts(jobResult.counts)
          const ccce = computeCCCEMetrics(jobResult.counts)

          result = {
            job_id,
            status: "COMPLETED",
            completed_utc: new Date().toISOString(),
            counts: jobResult.counts,
            ccce,
            grade: "CLASS_A",
          }
        } else {
          result = {
            job_id,
            status: jobResult.status,
            error: jobResult.error,
          }
        }
      }
    } else {
      throw new FailClosedError(`Provider ${provider} not yet implemented`, "PROVIDER_NOT_IMPLEMENTED")
    }

    return NextResponse.json({
      ok: true,
      ...result,
    })

  } catch (error) {
    if (error instanceof FailClosedError) {
      return NextResponse.json(failClosedResponse(error), { status: 503 })
    }

    console.error("[Lab Poll Error]", error)
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}
