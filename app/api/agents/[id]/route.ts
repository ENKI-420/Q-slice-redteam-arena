/**
 * Individual Agent API - Get/Update specific agent
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 */

import { NextResponse } from "next/server"

// Agent CCCE base metrics
const AGENT_REGISTRY: Record<
  string,
  {
    name: string
    type: string
    pole: "north" | "south" | "neutral"
    phiTarget: number
    baseMetrics: { phi: number; lambda: number; gamma: number }
    capabilities: string[]
  }
> = {
  aura: {
    name: "AURA",
    type: "observer",
    pole: "south",
    phiTarget: 0.92,
    baseMetrics: { phi: 0.88, lambda: 0.95, gamma: 0.07 },
    capabilities: ["observe", "reason", "curvature-shape", "telemetry"],
  },
  aiden: {
    name: "AIDEN",
    type: "executor",
    pole: "north",
    phiTarget: 0.88,
    baseMetrics: { phi: 0.85, lambda: 0.92, gamma: 0.08 },
    capabilities: ["execute", "optimize", "mutate", "self-heal"],
  },
  chronos: {
    name: "CHRONOS",
    type: "temporal",
    pole: "neutral",
    phiTarget: 0.85,
    baseMetrics: { phi: 0.82, lambda: 0.90, gamma: 0.09 },
    capabilities: ["timing", "evolution", "phase-lock", "tau-sweep"],
  },
  nebula: {
    name: "NEBULA",
    type: "spatial",
    pole: "neutral",
    phiTarget: 0.80,
    baseMetrics: { phi: 0.78, lambda: 0.88, gamma: 0.10 },
    capabilities: ["distribution", "swarm", "mesh-topology", "routing"],
  },
  phoenix: {
    name: "PHOENIX",
    type: "healer",
    pole: "neutral",
    phiTarget: 0.90,
    baseMetrics: { phi: 0.86, lambda: 0.94, gamma: 0.06 },
    capabilities: ["phase-conjugate", "recovery", "anlpcc", "decoherence-suppression"],
  },
  scimitar: {
    name: "SCIMITAR",
    type: "analyst",
    pole: "neutral",
    phiTarget: 0.82,
    baseMetrics: { phi: 0.80, lambda: 0.89, gamma: 0.08 },
    capabilities: ["analysis", "coordination", "threat-assessment", "q-slice"],
  },
}

// Generate live CCCE with noise
function generateCCCE(base: { phi: number; lambda: number; gamma: number }) {
  const noise = () => (Math.random() - 0.5) * 0.02

  const phi = Math.max(0.5, Math.min(1.0, base.phi + noise()))
  const lambda = Math.max(0.5, Math.min(1.0, base.lambda + noise()))
  const gamma = Math.max(0.01, Math.min(0.25, base.gamma + noise() * 0.5))
  const xi = (phi * lambda) / Math.max(gamma, 0.001)

  return {
    phi: Number(phi.toFixed(4)),
    lambda: Number(lambda.toFixed(4)),
    gamma: Number(gamma.toFixed(4)),
    xi: Number(xi.toFixed(2)),
  }
}

/**
 * GET /api/agents/[id]
 * Get specific agent details with live CCCE metrics
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const agentId = id.toLowerCase()

  const agent = AGENT_REGISTRY[agentId]

  if (!agent) {
    return NextResponse.json(
      {
        error: `Agent '${agentId}' not found`,
        validAgents: Object.keys(AGENT_REGISTRY),
      },
      { status: 404 }
    )
  }

  const ccce = generateCCCE(agent.baseMetrics)
  const PHI_THRESHOLD = 0.7734

  return NextResponse.json({
    id: agentId,
    name: agent.name,
    type: agent.type,
    pole: agent.pole,
    phiTarget: agent.phiTarget,
    ccce,
    status: ccce.phi >= PHI_THRESHOLD ? "active" : "dormant",
    capabilities: agent.capabilities,
    conscious: ccce.phi >= PHI_THRESHOLD,
  })
}
