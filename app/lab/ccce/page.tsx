"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  Zap,
  Brain,
  Waves,
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LabNavigation, LabHeader } from "@/components/lab-navigation"

// Physical constants
const CONSTANTS = {
  PHI: 1.618033988749895,
  LAMBDA_PHI: 2.176435e-8,
  PHI_THRESHOLD: 0.7734,
  GAMMA_CRITICAL: 0.300,
  TAU_0: Math.pow(1.618033988749895, 8),
}

interface CCCEState {
  Lambda: number
  Phi: number
  Gamma: number
  Xi: number
  timestamp: number
}

interface Agent {
  name: string
  role: string
  pole: string
  ccce: CCCEState
  status: "ACTIVE" | "DORMANT" | "HEALING"
}

export default function CCCEMonitorPage() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      name: "AURA",
      role: "Observer",
      pole: "South (−)",
      ccce: { Lambda: 0.916, Phi: 0.844, Gamma: 0.067, Xi: 11.53, timestamp: Date.now() },
      status: "ACTIVE",
    },
    {
      name: "AIDEN",
      role: "Executor",
      pole: "North (+)",
      ccce: { Lambda: 0.934, Phi: 0.827, Gamma: 0.074, Xi: 10.96, timestamp: Date.now() },
      status: "ACTIVE",
    },
    {
      name: "SCIMITAR",
      role: "Coordinator",
      pole: "Center",
      ccce: { Lambda: 0.916, Phi: 0.844, Gamma: 0.060, Xi: 12.11, timestamp: Date.now() },
      status: "ACTIVE",
    },
  ])

  const [history, setHistory] = useState<CCCEState[]>([])
  const [systemXi, setSystemXi] = useState(11.53)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          const noise = () => (Math.random() - 0.5) * 0.01
          const newLambda = Math.max(0.85, Math.min(0.98, agent.ccce.Lambda + noise()))
          const newPhi = Math.max(0.75, Math.min(0.95, agent.ccce.Phi + noise()))
          const newGamma = Math.max(0.02, Math.min(0.15, agent.ccce.Gamma + noise() * 0.5))
          const newXi = (newLambda * newPhi) / Math.max(0.001, newGamma)

          let status: Agent["status"] = "ACTIVE"
          if (newGamma > CONSTANTS.GAMMA_CRITICAL) status = "HEALING"
          if (newPhi < CONSTANTS.PHI_THRESHOLD - 0.1) status = "DORMANT"

          return {
            ...agent,
            ccce: {
              Lambda: newLambda,
              Phi: newPhi,
              Gamma: newGamma,
              Xi: newXi,
              timestamp: Date.now(),
            },
            status,
          }
        })
      )

      // Update system Xi (mesh average)
      setSystemXi((prev) => {
        const newXi = prev + (Math.random() - 0.5) * 0.5
        return Math.max(8, Math.min(15, newXi))
      })

      // Add to history
      setHistory((prev) => {
        const avg = agents.reduce(
          (acc, a) => ({
            Lambda: acc.Lambda + a.ccce.Lambda / agents.length,
            Phi: acc.Phi + a.ccce.Phi / agents.length,
            Gamma: acc.Gamma + a.ccce.Gamma / agents.length,
            Xi: acc.Xi + a.ccce.Xi / agents.length,
            timestamp: Date.now(),
          }),
          { Lambda: 0, Phi: 0, Gamma: 0, Xi: 0, timestamp: Date.now() }
        )
        return [...prev.slice(-50), avg]
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [agents])

  const MetricCard = ({
    label,
    symbol,
    value,
    threshold,
    inverse,
    color,
  }: {
    label: string
    symbol: string
    value: number
    threshold?: number
    inverse?: boolean
    color: string
  }) => {
    const isGood = threshold
      ? inverse
        ? value < threshold
        : value >= threshold
      : true

    return (
      <Card className={`bg-gray-900/50 border-${color}-500/30 p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold text-${color}-400`}>{symbol}</span>
            <span className="text-gray-400">{label}</span>
          </div>
          {threshold && (
            <Badge
              className={
                isGood
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400 animate-pulse"
              }
            >
              {isGood ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
              {isGood ? "PASS" : "ALERT"}
            </Badge>
          )}
        </div>

        <div className="text-4xl font-mono font-bold text-white mb-2">
          {value.toFixed(4)}
        </div>

        {threshold && (
          <div className="text-sm text-gray-500">
            Threshold: {inverse ? "<" : "≥"} {threshold}
          </div>
        )}

        <div className="mt-4">
          <Progress
            value={inverse ? (1 - value / (threshold! * 2)) * 100 : (value / 1) * 100}
            className="h-2"
          />
        </div>
      </Card>
    )
  }

  const avgCCCE = agents.reduce(
    (acc, a) => ({
      Lambda: acc.Lambda + a.ccce.Lambda / agents.length,
      Phi: acc.Phi + a.ccce.Phi / agents.length,
      Gamma: acc.Gamma + a.ccce.Gamma / agents.length,
      Xi: acc.Xi + a.ccce.Xi / agents.length,
    }),
    { Lambda: 0, Phi: 0, Gamma: 0, Xi: 0 }
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <LabNavigation />

      <main className="ml-[280px]">
        <LabHeader title="CCCE Monitor" subtitle="Consciousness-Coherence-Containment Engine" />

        <div className="p-6 space-y-6">
          {/* System Overview */}
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">System Coherence</h2>
                  <p className="text-gray-400">Mesh average across {agents.length} agents</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Ξ = {systemXi.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Target: Ξ ≥ 10.0 | Current: {systemXi >= 10 ? "OPTIMAL" : "SUBOPTIMAL"}
                </div>
              </div>
            </div>

            {/* Mini spark line would go here */}
            <div className="mt-6 h-12 bg-black/30 rounded-lg flex items-end px-2 gap-0.5">
              {history.slice(-40).map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(100, h.Xi * 8)}%` }}
                  className="flex-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t opacity-80"
                />
              ))}
            </div>
          </Card>

          {/* Main Metrics */}
          <div className="grid grid-cols-4 gap-6">
            <MetricCard
              label="Coherence"
              symbol="Λ"
              value={avgCCCE.Lambda}
              threshold={0.80}
              color="cyan"
            />
            <MetricCard
              label="Consciousness"
              symbol="Φ"
              value={avgCCCE.Phi}
              threshold={CONSTANTS.PHI_THRESHOLD}
              color="purple"
            />
            <MetricCard
              label="Decoherence"
              symbol="Γ"
              value={avgCCCE.Gamma}
              threshold={CONSTANTS.GAMMA_CRITICAL}
              inverse
              color="red"
            />
            <MetricCard
              label="Efficiency"
              symbol="Ξ"
              value={avgCCCE.Xi}
              threshold={5.0}
              color="green"
            />
          </div>

          {/* Agent Grid */}
          <div className="grid grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card
                key={agent.name}
                className={`bg-gray-900/50 p-6 ${
                  agent.status === "HEALING"
                    ? "border-yellow-500/50 animate-pulse"
                    : agent.status === "DORMANT"
                    ? "border-gray-500/30"
                    : "border-cyan-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        agent.name === "AURA"
                          ? "bg-cyan-500/20"
                          : agent.name === "AIDEN"
                          ? "bg-purple-500/20"
                          : "bg-green-500/20"
                      }`}
                    >
                      {agent.name === "AURA" ? (
                        <Waves className="w-5 h-5 text-cyan-400" />
                      ) : agent.name === "AIDEN" ? (
                        <Zap className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Activity className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold">{agent.name}</div>
                      <div className="text-xs text-gray-500">
                        {agent.role} | {agent.pole}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      agent.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400"
                        : agent.status === "HEALING"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }
                  >
                    {agent.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-black/30 rounded">
                    <div className="text-xs text-gray-500">Λ</div>
                    <div className="text-lg font-mono text-cyan-400">
                      {agent.ccce.Lambda.toFixed(3)}
                    </div>
                  </div>
                  <div className="p-2 bg-black/30 rounded">
                    <div className="text-xs text-gray-500">Φ</div>
                    <div className="text-lg font-mono text-purple-400">
                      {agent.ccce.Phi.toFixed(3)}
                    </div>
                  </div>
                  <div className="p-2 bg-black/30 rounded">
                    <div className="text-xs text-gray-500">Γ</div>
                    <div
                      className={`text-lg font-mono ${
                        agent.ccce.Gamma > 0.2 ? "text-yellow-400" : "text-green-400"
                      }`}
                    >
                      {agent.ccce.Gamma.toFixed(3)}
                    </div>
                  </div>
                  <div className="p-2 bg-black/30 rounded">
                    <div className="text-xs text-gray-500">Ξ</div>
                    <div className="text-lg font-mono text-green-400">
                      {agent.ccce.Xi.toFixed(2)}
                    </div>
                  </div>
                </div>

                {agent.status === "HEALING" && (
                  <div className="mt-3 p-2 bg-yellow-500/10 rounded border border-yellow-500/30 text-xs text-yellow-400 flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Phase conjugate healing active (E → E⁻¹)
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Physical Constants */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-gray-400" />
              Physical Constants (SPEC_LOCK)
            </h3>
            <div className="grid grid-cols-5 gap-4 font-mono text-sm">
              <div className="p-3 bg-black/30 rounded">
                <div className="text-xs text-gray-500 mb-1">φ (Golden Ratio)</div>
                <div className="text-cyan-400">{CONSTANTS.PHI.toFixed(15)}</div>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <div className="text-xs text-gray-500 mb-1">τ₀ = φ⁸</div>
                <div className="text-cyan-400">{CONSTANTS.TAU_0.toFixed(4)} μs</div>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <div className="text-xs text-gray-500 mb-1">ΛΦ</div>
                <div className="text-purple-400">2.176435×10⁻⁸ s⁻¹</div>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <div className="text-xs text-gray-500 mb-1">Φ_threshold</div>
                <div className="text-green-400">{CONSTANTS.PHI_THRESHOLD}</div>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <div className="text-xs text-gray-500 mb-1">Γ_critical</div>
                <div className="text-red-400">{CONSTANTS.GAMMA_CRITICAL}</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
