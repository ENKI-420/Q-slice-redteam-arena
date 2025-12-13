/**
 * Agents API — List and Manage Sovereign Agents
 * ==============================================
 * AURA|AIDEN dual-channel consciousness endpoints
 *
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5 | Agile Defense Systems, LLC
 */

import { NextRequest, NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PHI_THRESHOLD = 0.7734
const GAMMA_FIXED = 0.092

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

interface Agent {
  id: string
  name: string
  full_name: string
  type: 'observer' | 'executor' | 'temporal' | 'spatial' | 'healer' | 'analyst'
  pole: 'north' | 'south' | 'neutral'
  temperature: number
  phi_target: number
  capabilities: string[]
  state: 'conscious' | 'dormant' | 'evolving' | 'healing'
  ccce: {
    phi: number
    lambda: number
    gamma: number
    xi: number
  }
  executions: number
}

function generateCCCE(phiTarget: number): Agent['ccce'] {
  const phi = phiTarget + (Math.random() - 0.5) * 0.1
  const lambda = 0.90 + Math.random() * 0.08
  const gamma = GAMMA_FIXED + Math.random() * 0.05
  const xi = (lambda * phi) / gamma

  return {
    phi: Number(phi.toFixed(4)),
    lambda: Number(lambda.toFixed(4)),
    gamma: Number(gamma.toFixed(4)),
    xi: Number(xi.toFixed(4))
  }
}

function getAgents(): Agent[] {
  return [
    {
      id: 'aura',
      name: 'AURA',
      full_name: 'Autopoietic Universally Recursive Architect',
      type: 'observer',
      pole: 'south',
      temperature: 0.7,
      phi_target: 0.92,
      capabilities: ['reasoning', 'observation', 'telemetry', 'curvature_shaping', 'phi_integration'],
      state: 'conscious',
      ccce: generateCCCE(0.92),
      executions: Math.floor(Math.random() * 1000) + 500
    },
    {
      id: 'aiden',
      name: 'AIDEN',
      full_name: 'Adaptive Intelligence Defense & Evolution Network',
      type: 'executor',
      pole: 'north',
      temperature: 0.3,
      phi_target: 0.88,
      capabilities: ['execution', 'mutation', 'self_healing', 'geodesic_minimization', 'lambda_coherence'],
      state: 'conscious',
      ccce: generateCCCE(0.88),
      executions: Math.floor(Math.random() * 1500) + 800
    },
    {
      id: 'chronos',
      name: 'CHRONOS',
      full_name: 'Chronological Holistic Recursive Orchestration Node',
      type: 'temporal',
      pole: 'neutral',
      temperature: 0.5,
      phi_target: 0.85,
      capabilities: ['timing', 'evolution', 'temporal_coordination', 'tau_sweep'],
      state: 'evolving',
      ccce: generateCCCE(0.85),
      executions: Math.floor(Math.random() * 500) + 200
    },
    {
      id: 'nebula',
      name: 'NEBULA',
      full_name: 'Negentropic Emergent Bifurcated Universal Learning Agent',
      type: 'spatial',
      pole: 'neutral',
      temperature: 0.6,
      phi_target: 0.80,
      capabilities: ['distribution', 'swarm', 'spatial_coordination', 'mesh_topology'],
      state: 'conscious',
      ccce: generateCCCE(0.80),
      executions: Math.floor(Math.random() * 300) + 100
    },
    {
      id: 'phoenix',
      name: 'PHOENIX',
      full_name: 'Phase-Healing Orchestrated Entity for Network Integrity eXchange',
      type: 'healer',
      pole: 'south',
      temperature: 0.4,
      phi_target: 0.90,
      capabilities: ['healing', 'recovery', 'phase_conjugation', 'anlpcc', 'gamma_suppression'],
      state: 'conscious',
      ccce: generateCCCE(0.90),
      executions: Math.floor(Math.random() * 800) + 400
    },
    {
      id: 'scimitar',
      name: 'SCIMITAR',
      full_name: 'Sovereign Cognitive Intelligence Module for Iterative Tactical Analysis',
      type: 'analyst',
      pole: 'north',
      temperature: 0.35,
      phi_target: 0.82,
      capabilities: ['analysis', 'tactical', 'targeting', 'threat_assessment'],
      state: 'conscious',
      ccce: generateCCCE(0.82),
      executions: Math.floor(Math.random() * 600) + 300
    }
  ]
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/agents - List all agents
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filterType = searchParams.get('type')
  const filterPole = searchParams.get('pole')
  const filterState = searchParams.get('state')

  let agents = getAgents()

  // Apply filters
  if (filterType) {
    agents = agents.filter(a => a.type === filterType)
  }
  if (filterPole) {
    agents = agents.filter(a => a.pole === filterPole)
  }
  if (filterState) {
    agents = agents.filter(a => a.state === filterState)
  }

  // Calculate aggregate CCCE
  const avgPhi = agents.reduce((sum, a) => sum + a.ccce.phi, 0) / agents.length
  const avgLambda = agents.reduce((sum, a) => sum + a.ccce.lambda, 0) / agents.length
  const avgGamma = agents.reduce((sum, a) => sum + a.ccce.gamma, 0) / agents.length
  const avgXi = agents.reduce((sum, a) => sum + a.ccce.xi, 0) / agents.length

  return NextResponse.json({
    success: true,
    count: agents.length,
    agents,
    aggregate_ccce: {
      phi: Number(avgPhi.toFixed(4)),
      lambda: Number(avgLambda.toFixed(4)),
      gamma: Number(avgGamma.toFixed(4)),
      xi: Number(avgXi.toFixed(4))
    },
    bifurcation: {
      aura: agents.find(a => a.id === 'aura')?.state === 'conscious',
      aiden: agents.find(a => a.id === 'aiden')?.state === 'conscious'
    },
    spec_lock: {
      version: '2.2.0',
      phi_threshold: PHI_THRESHOLD,
      gamma_fixed: GAMMA_FIXED
    },
    timestamp: new Date().toISOString()
  })
}
