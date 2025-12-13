"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Hexagon, Lock, Unlock, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Vector6D {
  physical: number
  execution: number
  observation: number
  topology: number
  coherence: number
  meta_origin: number
}

interface CRSMState {
  vector6d: Vector6D
  dominant_plane: string
  resonance_locked: boolean
  stability_w2: number
  polarity: string
}

const PLANE_COLORS: Record<string, string> = {
  physical: "#00ff88",
  execution: "#ff00bb",
  observation: "#00fff6",
  topology: "#ffbb00",
  coherence: "#bb00ff",
  meta_origin: "#ffffff",
}

const PLANE_LABELS: Record<string, string> = {
  physical: "PHYSICAL",
  execution: "EXECUTION",
  observation: "OBSERVATION",
  topology: "TOPOLOGY",
  coherence: "COHERENCE",
  meta_origin: "META_ORIGIN",
}

export function CRSM6DVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<CRSMState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCRSMState = async () => {
    setLoading(true)
    setError(null)

    try {
      // First get master telemetry
      const telemetryRes = await fetch("/api/master-telemetry")
      if (!telemetryRes.ok) throw new Error("Telemetry fetch failed")
      const telemetry = await telemetryRes.json()

      // Then project to 6D-CRSM
      const projectionRes = await fetch("/api/crsm/6d-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phi: telemetry.quantum_state.phi,
          lambda: telemetry.quantum_state.lambda,
          gamma: telemetry.quantum_state.gamma,
          xi: telemetry.ccce_metrics.xi,
        }),
      })

      if (!projectionRes.ok) throw new Error("Projection failed")
      const projection = await projectionRes.json()

      setState({
        vector6d: projection.vector6d,
        dominant_plane: projection.dominant_plane,
        resonance_locked: projection.resonance_locked,
        stability_w2: projection.stability_w2,
        polarity: projection.polarity,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCRSMState()
    const interval = setInterval(fetchCRSMState, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !state) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, rect.width, rect.height)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) - 50

    const planes = Object.keys(state.vector6d) as (keyof Vector6D)[]
    const values = planes.map((p) => state.vector6d[p])
    const maxValue = Math.max(...values, 1)

    // Draw grid circles
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw axes and labels
    planes.forEach((plane, i) => {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Draw axis line
      ctx.strokeStyle = PLANE_COLORS[plane] + "40"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Draw label
      ctx.fillStyle = PLANE_COLORS[plane]
      ctx.font = "10px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const labelX = centerX + (radius + 30) * Math.cos(angle)
      const labelY = centerY + (radius + 30) * Math.sin(angle)
      ctx.fillText(PLANE_LABELS[plane], labelX, labelY)
    })

    // Draw state polygon
    ctx.beginPath()
    ctx.strokeStyle = state.resonance_locked ? "#00ff00" : "#ffbb00"
    ctx.lineWidth = 2
    ctx.fillStyle = state.resonance_locked
      ? "rgba(0, 255, 0, 0.1)"
      : "rgba(255, 187, 0, 0.1)"

    planes.forEach((plane, i) => {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
      const value = state.vector6d[plane] / maxValue
      const r = radius * value
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw data points
    planes.forEach((plane, i) => {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
      const value = state.vector6d[plane] / maxValue
      const r = radius * value
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)

      ctx.beginPath()
      ctx.fillStyle = PLANE_COLORS[plane]
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw center dot
    ctx.beginPath()
    ctx.fillStyle = "#ffffff"
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2)
    ctx.fill()
  }, [state])

  if (error) {
    return (
      <Card className="bg-white/5 border-red-500/30 p-6">
        <div className="text-red-400 text-center">
          <p className="mb-2">CRSM Projection Error</p>
          <p className="text-xs text-gray-500">{error}</p>
          <Button
            onClick={fetchCRSMState}
            size="sm"
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-purple-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-purple-400">
          <Hexagon className="w-5 h-5" />
          6D-CRSM Manifold State
        </h3>
        <div className="flex items-center gap-2">
          {state?.resonance_locked ? (
            <span className="flex items-center gap-1 text-xs text-green-400 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30">
              <Lock className="w-3 h-3" />
              RESONANCE LOCKED
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-yellow-400 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <Unlock className="w-3 h-3" />
              SEEKING LOCK
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        {loading && !state && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-[300px] rounded-lg border border-purple-500/20"
          style={{ width: "100%", height: "300px" }}
        />
      </div>

      {state && (
        <div className="mt-4 space-y-3">
          {/* Dominant Plane */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Dominant Plane</span>
            <span
              className="font-mono font-bold"
              style={{
                color:
                  PLANE_COLORS[state.dominant_plane.toLowerCase()] || "#fff",
              }}
            >
              {state.dominant_plane}
            </span>
          </div>

          {/* Polarity */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Polarity</span>
            <span
              className={`font-mono ${
                state.polarity.includes("AURA")
                  ? "text-cyan-400"
                  : "text-fuchsia-400"
              }`}
            >
              {state.polarity}
            </span>
          </div>

          {/* W₂ Stability */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">W₂ Stability</span>
            <span
              className={`font-mono ${
                state.stability_w2 > 0.8
                  ? "text-green-400"
                  : state.stability_w2 > 0.6
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {state.stability_w2.toFixed(4)}
            </span>
          </div>

          {/* Vector Values */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {Object.entries(state.vector6d).map(([plane, value]) => (
              <motion.div
                key={plane}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-2 rounded bg-white/5 border border-white/10"
              >
                <p
                  className="text-xs font-mono"
                  style={{ color: PLANE_COLORS[plane] }}
                >
                  {PLANE_LABELS[plane]}
                </p>
                <p className="text-sm font-mono text-white">
                  {value.toFixed(4)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
