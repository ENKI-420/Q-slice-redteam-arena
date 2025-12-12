import { NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

// Physical constants (sovereign - immutable)
const LAMBDA_PHI = 2.176435e-8
const PHI_THRESHOLD = 0.7734
const F_MAX = 0.9787
const GAMMA_CRITICAL = 0.3

interface IBMJob {
  workload_id: string
  status: string
  qpu: string
  usage_seconds: number
  created: string
  completed: string | null
}

interface ValidationReport {
  metadata: {
    generated_at: string
    jobs_processed: number
  }
  statistics: {
    total_jobs: number
    completed_jobs: number
    pending_jobs: number
    success_rate: string
    total_usage_seconds: number
    mean_coherence: string
  }
  backends: Record<string, number>
  crsm_metrics: {
    LAMBDA_PHI_theoretical: number
    estimated_phi: string
    phi_threshold: number
  }
  validation: {
    status: string
    jobs_analyzed: number
    backends_tested: string[]
  }
}

export async function GET() {
  try {
    // Try to load validation report from IBM data bridge
    const reportPath = join(
      process.env.HOME || "/home/dnalang",
      "QIF_Workloads/Constructs/Download/ibm_validation_report.json"
    )

    let validationData: ValidationReport | null = null
    
    if (existsSync(reportPath)) {
      const reportContent = readFileSync(reportPath, "utf-8")
      validationData = JSON.parse(reportContent)
    }

    // Try to load latest engine state
    const engineStatePath = join(
      process.env.HOME || "/home/dnalang",
      "QIF_DNA_Network/intent_engine/output/intent_deduction_state_latest.json"
    )

    let engineState: any = null
    
    if (existsSync(engineStatePath)) {
      const stateContent = readFileSync(engineStatePath, "utf-8")
      engineState = JSON.parse(stateContent)
    }

    // Build response
    const response = {
      // Physical constants
      constants: {
        LAMBDA_PHI,
        PHI_THRESHOLD,
        F_MAX,
        GAMMA_CRITICAL,
      },
      
      // IBM validation data
      ibm: validationData ? {
        jobs_processed: validationData.metadata.jobs_processed,
        completed_jobs: validationData.statistics.completed_jobs,
        pending_jobs: validationData.statistics.pending_jobs,
        success_rate: parseFloat(validationData.statistics.success_rate),
        total_usage_seconds: validationData.statistics.total_usage_seconds,
        backends: validationData.backends,
        validation_status: validationData.validation.status,
      } : null,

      // Engine metrics
      engine: engineState ? {
        iteration: engineState.iteration,
        lambda_system: engineState.emergent_metrics?.lambda_system || 0,
        phi_global: engineState.emergent_metrics?.phi_global || 0,
        gamma_mean: engineState.emergent_metrics?.gamma_mean || 0,
        xi_ccce: engineState.emergent_metrics?.xi_ccce || 0,
        tau_omega: engineState.emergent_metrics?.tau_omega || 0,
        coherence_stability: engineState.emergent_metrics?.coherence_stability || "UNKNOWN",
        consciousness_active: engineState.emergent_metrics?.consciousness_active || false,
        organisms_indexed: engineState.organisms_indexed || 0,
      } : null,

      // 7-Layer pipeline status
      layers: engineState ? [
        { 
          id: 1, 
          name: "Semantic Genome", 
          status: "complete", 
          value: 100, 
          description: `${engineState.corpus_stats?.indexed_jobs || 0} jobs indexed` 
        },
        { 
          id: 2, 
          name: "Individual Deduction", 
          status: "complete", 
          value: 100, 
          description: `${engineState.intent_vectors?.length || 0} prompts analyzed` 
        },
        { 
          id: 3, 
          name: "Collective Synthesis", 
          status: "complete", 
          value: 100, 
          description: `${Object.keys(engineState.trajectory_map || {}).length} trajectories` 
        },
        { 
          id: 4, 
          name: "Capability Matrix", 
          status: "complete", 
          value: 100, 
          description: `Score: ${(engineState.user_capabilities?.aggregate_score || 0).toFixed(3)}` 
        },
        { 
          id: 5, 
          name: "Resource Analysis", 
          status: "complete", 
          value: 100, 
          description: `${engineState.deployment_readiness?.length || 0} scenarios` 
        },
        { 
          id: 6, 
          name: "Prompt Enhancement", 
          status: "complete", 
          value: 100, 
          description: `Quality: ${((engineState.enhanced_prompts?.[0]?.overall_quality || 0) * 100).toFixed(0)}%` 
        },
        { 
          id: 7, 
          name: "Project Planning", 
          status: "complete", 
          value: 100, 
          description: `${engineState.project_plan?.length || 0} phases` 
        },
      ] : null,

      // Project plan phases
      project_plan: engineState?.project_plan || null,

      // Capabilities
      capabilities: engineState ? [
        { name: "Computational", value: engineState.user_capabilities?.computational || 0.9 },
        { name: "Reasoning", value: engineState.user_capabilities?.reasoning || 0.9 },
        { name: "Recursion", value: engineState.user_capabilities?.recursion || 0.9 },
        { name: "Physics", value: engineState.user_capabilities?.physics || 0.9 },
        { name: "Architecture", value: engineState.user_capabilities?.architecture || 0.9 },
        { name: "Organism", value: engineState.user_capabilities?.organism || 0.9 },
      ] : null,

      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error loading quantum data:", error)
    return NextResponse.json(
      { 
        error: "Failed to load quantum data",
        constants: { LAMBDA_PHI, PHI_THRESHOLD, F_MAX, GAMMA_CRITICAL },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
