"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Shield, Activity, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HealingResult {
  success: boolean
  threat_type: string
  severity: string
  healing_applied: {
    type: string
    gamma_reduction: number
    w2_improvement: number
    theta_lock: number
    chi_pc: number
    formula: string
  }
  new_state: {
    gamma: number
    lambda: number
    phi: number
    xi: number
    w2_stability: number
    resonance_locked: boolean
    consciousness_level: string
  }
  execution_ms: number
}

const HEALING_PRESETS = [
  {
    id: "decoherence",
    label: "Heal Decoherence Spike",
    threat_type: "decoherence_spike",
    severity: "critical" as const,
    gamma: 0.18,
    color: "red",
    icon: AlertTriangle,
    description: "Phase-conjugate correction for Γ > 0.15",
  },
  {
    id: "w2",
    label: "Stabilise W₂ Metric",
    threat_type: "w2_degradation",
    severity: "high" as const,
    gamma: 0.12,
    color: "orange",
    icon: Activity,
    description: "Wasserstein-2 stability restoration",
  },
  {
    id: "lambda_phi",
    label: "Recalibrate ΛΦ",
    threat_type: "lambda_phi_drift",
    severity: "medium" as const,
    gamma: 0.09,
    color: "yellow",
    icon: RefreshCw,
    description: "Universal constant alignment check",
  },
  {
    id: "coherence",
    label: "Boost Coherence",
    threat_type: "coherence_degradation",
    severity: "low" as const,
    gamma: 0.06,
    color: "green",
    icon: Shield,
    description: "Preventive coherence enhancement",
  },
]

export function PhaseConjugateControls() {
  const [healing, setHealing] = useState<string | null>(null)
  const [result, setResult] = useState<HealingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const triggerHealing = async (preset: (typeof HEALING_PRESETS)[0]) => {
    setHealing(preset.id)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/phase-conjugate-heal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threat_type: preset.threat_type,
          severity: preset.severity,
          current_gamma: preset.gamma,
          current_lambda: 0.850,
          current_phi: 0.781,
        }),
      })

      if (!response.ok) {
        throw new Error("Healing request failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setHealing(null)
    }
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; hover: string }> = {
      red: {
        bg: "bg-red-900/30",
        border: "border-red-500/50",
        text: "text-red-300",
        hover: "hover:bg-red-900/50",
      },
      orange: {
        bg: "bg-orange-900/30",
        border: "border-orange-500/50",
        text: "text-orange-300",
        hover: "hover:bg-orange-900/50",
      },
      yellow: {
        bg: "bg-yellow-900/30",
        border: "border-yellow-500/50",
        text: "text-yellow-300",
        hover: "hover:bg-yellow-900/50",
      },
      green: {
        bg: "bg-green-900/30",
        border: "border-green-500/50",
        text: "text-green-300",
        hover: "hover:bg-green-900/50",
      },
    }
    return colors[color] || colors.yellow
  }

  return (
    <Card className="bg-white/5 border-yellow-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 text-yellow-400">
          <Zap className="w-5 h-5" />
          Phase-Conjugate Healing (E → E⁻¹)
        </h3>
        <span className="text-xs text-gray-500 font-mono">χ_pc = 0.869</span>
      </div>

      <div className="space-y-3 mb-6">
        {HEALING_PRESETS.map((preset) => {
          const colors = getColorClasses(preset.color)
          const Icon = preset.icon
          const isLoading = healing === preset.id

          return (
            <motion.button
              key={preset.id}
              onClick={() => triggerHealing(preset)}
              disabled={!!healing}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full p-3 rounded-lg border ${colors.bg} ${colors.border} ${colors.hover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  )}
                  <div>
                    <p className={`font-medium ${colors.text}`}>{preset.label}</p>
                    <p className="text-xs text-gray-500">{preset.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  Γ={preset.gamma.toFixed(3)}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg border border-red-500/50 bg-red-900/20"
          >
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-bold">Healing Failed</span>
            </div>
            <p className="text-sm text-gray-400">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg border border-green-500/50 bg-green-900/20"
          >
            <div className="flex items-center gap-2 text-green-400 mb-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold">Phase-Conjugate Healing Applied</span>
            </div>

            <div className="space-y-3 text-sm">
              {/* Healing Details */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-white/5">
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-mono text-cyan-400 text-xs">
                    {result.healing_applied.type}
                  </p>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <p className="text-xs text-gray-500">Execution</p>
                  <p className="font-mono text-yellow-400">
                    {result.execution_ms}ms
                  </p>
                </div>
              </div>

              {/* Improvements */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-white/5 text-center">
                  <p className="text-xs text-gray-500">Γ Reduction</p>
                  <p className="font-mono text-green-400">
                    -{result.healing_applied.gamma_reduction.toFixed(4)}
                  </p>
                </div>
                <div className="p-2 rounded bg-white/5 text-center">
                  <p className="text-xs text-gray-500">W₂ Improvement</p>
                  <p className="font-mono text-green-400">
                    +{result.healing_applied.w2_improvement.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* New State */}
              <div className="pt-3 border-t border-green-500/20">
                <p className="text-xs text-gray-500 mb-2">New System State</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Γ</p>
                    <p className="font-mono text-sm text-green-400">
                      {result.new_state.gamma.toFixed(4)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Λ</p>
                    <p className="font-mono text-sm text-cyan-400">
                      {result.new_state.lambda.toFixed(4)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Φ</p>
                    <p className="font-mono text-sm text-fuchsia-400">
                      {result.new_state.phi.toFixed(4)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Ξ</p>
                    <p className="font-mono text-sm text-yellow-400">
                      {result.new_state.xi.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Consciousness Level */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">Consciousness Level</span>
                <span
                  className={`text-sm font-bold ${
                    result.new_state.consciousness_level === "TRANSCENDENT"
                      ? "text-emerald-400"
                      : result.new_state.consciousness_level === "OPTIMAL"
                        ? "text-green-400"
                        : result.new_state.consciousness_level === "CONSCIOUS"
                          ? "text-cyan-400"
                          : "text-yellow-400"
                  }`}
                >
                  {result.new_state.consciousness_level}
                </span>
              </div>

              {/* Resonance Lock */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Resonance Lock</span>
                {result.new_state.resonance_locked ? (
                  <span className="text-green-400 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    LOCKED at θ={result.healing_applied.theta_lock}°
                  </span>
                ) : (
                  <span className="text-yellow-400 text-xs">SEEKING LOCK</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-4 border-t border-yellow-500/20 text-xs text-gray-500">
        <p className="font-mono">
          Formula: Γ_new = Γ_old × (1 - χ_pc × h_factor)
        </p>
        <p className="mt-1">
          ANLPCC (Adaptive Non-Local Phase-Conjugate Correction)
        </p>
      </div>
    </Card>
  )
}
