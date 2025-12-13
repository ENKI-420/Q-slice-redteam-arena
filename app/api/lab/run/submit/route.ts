/**
 * Lab Run Submit API - Submit experiment to real QPU
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * FAIL_CLOSED: No sim/mock data allowed
 */

import { NextResponse } from "next/server"
import crypto from "crypto"
import { ExperimentSpecV1, createDefaultSpec, RunRecordSchema } from "@/lib/lab/spec"
import { assertRealQPUOnly, assertProviderAvailable, failClosedResponse, FailClosedError } from "@/lib/lab/invariants"
import { compileToIR, compileTauSweepBatch } from "@/lib/lab/compiler"
import { getIBMProvider } from "@/lib/lab/providers/ibm"

// In-memory run storage (would be DB in production)
const runStore = new Map<string, any>()

export async function POST(req: Request) {
  try {
    // FAIL_CLOSED enforcement
    assertRealQPUOnly()

    const body = await req.json()

    // Parse and validate spec
    let spec: ExperimentSpecV1
    if (body.spec) {
      spec = ExperimentSpecV1.parse(body.spec)
    } else {
      // Create default spec with overrides
      spec = createDefaultSpec(body)
    }

    // Assert provider is available
    assertProviderAvailable(spec.target.provider)

    // Compute spec hash
    const spec_sha256 = crypto
      .createHash("sha256")
      .update(JSON.stringify(spec))
      .digest("hex")

    // Handle different experiment types
    let result: any

    if (spec.experiment.family === "tau-sweep") {
      // Batch tau-sweep submission
      const tauPoints = spec.experiment.parameters.tau_points as number[] ||
        [40, 42, 44, 45, 46, 46.5, 47, 47.5, 48, 50, 52, 54, 56]
      const dt_us = spec.experiment.parameters.dt_us as number || 0.004

      const { circuits } = compileTauSweepBatch(spec, tauPoints, dt_us)

      if (spec.target.provider === "ibm-quantum") {
        const ibm = getIBMProvider()
        const batchResult = await ibm.submitBatch(
          circuits,
          spec.target.device_id,
          spec.target.shots
        )

        result = {
          run_id: crypto.randomUUID(),
          spec_sha256,
          provider_job_id: batchResult.batch_id,
          provider: spec.target.provider,
          device: spec.target.device_id,
          status: "QUEUED",
          created_utc: new Date().toISOString(),
          experiment_family: "tau-sweep",
          tau_points: tauPoints,
          batch_size: circuits.length,
        }
      } else {
        throw new FailClosedError(`Provider ${spec.target.provider} not yet implemented`, "PROVIDER_NOT_IMPLEMENTED")
      }
    } else {
      // Single circuit submission
      const { circuit, meta } = compileToIR(spec)

      if (spec.target.provider === "ibm-quantum") {
        const ibm = getIBMProvider()
        const jobResult = await ibm.submit(
          circuit,
          spec.target.device_id,
          spec.target.shots
        )

        result = {
          run_id: crypto.randomUUID(),
          spec_sha256,
          provider_job_id: jobResult.job_id,
          provider: spec.target.provider,
          device: spec.target.device_id,
          status: jobResult.status,
          created_utc: new Date().toISOString(),
          experiment_family: spec.experiment.family,
          qslice_applied: meta.qslice_applied,
        }
      } else {
        throw new FailClosedError(`Provider ${spec.target.provider} not yet implemented`, "PROVIDER_NOT_IMPLEMENTED")
      }
    }

    // Store run record
    runStore.set(result.run_id, {
      ...result,
      spec,
    })

    return NextResponse.json({
      ok: true,
      ...result,
    })

  } catch (error) {
    if (error instanceof FailClosedError) {
      return NextResponse.json(failClosedResponse(error), { status: 503 })
    }

    console.error("[Lab Submit Error]", error)
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
      fail_closed: false,
    }, { status: 500 })
  }
}

// Get all runs
export async function GET() {
  const runs = Array.from(runStore.values())
  return NextResponse.json({
    ok: true,
    runs,
    count: runs.length,
  })
}
