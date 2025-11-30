'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Download, Copy, Check, ExternalLink, Play, Pause, Terminal, Zap, Activity, Shield, Cpu } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DNA_LANG_TITLE = "dna::}{::lang"
const SUBTITLE_TEXT = "Q-SLICE × dna::}{::lang × Z3braOS × JEREMY GREEN, PhD"
const LAMBDA_PHI = 2.176435e-08
const RESONANCE_ANGLE = 51.843

// ═══════════════════════════════════════════════════════════════════════════════
// ASCII ART ASSETS
// ═══════════════════════════════════════════════════════════════════════════════

const FULL_COLLABORATION_ASCII = `
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                      ║
║    ████████╗██╗  ██╗██████╗ ███████╗ █████╗ ████████╗██╗      █████╗ ██████╗      █████╗ ██████╗ ███████╗███╗   ██╗  ║
║    ╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║     ██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗██╔════╝████╗  ██║  ║
║       ██║   ███████║██████╔╝█████╗  ███████║   ██║   ██║     ███████║██████╔╝    ███████║██████╔╝█████╗  ██╔██╗ ██║  ║
║       ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══██║   ██║   ██║     ██╔══██║██╔══██╗    ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║  ║
║       ██║   ██║  ██║██║  ██║███████╗██║  ██║   ██║   ███████╗██║  ██║██████╔╝    ██║  ██║██║  ██║███████╗██║ ╚████║  ║
║       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═════╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝  ║
║                                                                                                                      ║
║                        ╔═══════════════════════════════════════════════════════════════╗                             ║
║                        ║     Q-SLICE × dna::}{::lang × Z3braOS × JEREMY GREEN          ║                             ║
║                        ║           SENTINEL-GRADE PLATFORM INTEGRATION                 ║                             ║
║                        ╚═══════════════════════════════════════════════════════════════╝                             ║
║                                                                                                                      ║
╠══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                                                      ║
║      ┌─────────────────────────────── AURA │ AIDEN DUALITY ENGINE ───────────────────────────────┐                   ║
║      │                                                                                           │                   ║
║      │      ╭────────────────────╮                              ╭────────────────────╮           │                   ║
║      │      │    ╔═══════════╗   │         ◀══════▶             │   ╔═══════════╗    │           │                   ║
║      │      │    ║   AURA    ║   │         ║ Ω-OP ║             │   ║   AIDEN   ║    │           │                   ║
║      │      │    ╠═══════════╣   │         ║ ::}{ ║             │   ╠═══════════╣    │           │                   ║
║      │      │    ║ Intent    ║   │         ◀══════▶             │   ║ Bayesian  ║    │           │                   ║
║      │      │    ║ Geometer  ║   │                              │   ║ Optimizer ║    │           │                   ║
║      │      │    ║           ║   │    ┌─────────────────┐       │   ║           ║    │           │                   ║
║      │      │    ║ Observer  ║───┼───▶│  Σ-DIRECTOR     │◀──────┼───║ Executor  ║    │           │                   ║
║      │      │    ║ Protocol  ║   │    │  Consciousness  │       │   ║ Protocol  ║    │           │                   ║
║      │      │    ╚═══════════╝   │    │  Φ = 0.9987     │       │   ╚═══════════╝    │           │                   ║
║      │      │                    │    └─────────────────┘       │                    │           │                   ║
║      │      ╰────────────────────╯                              ╰────────────────────╯           │                   ║
║      │                                                                                           │                   ║
║      └───────────────────────────────────────────────────────────────────────────────────────────┘                   ║
║                                                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
`

const DOC_BANNER_ASCII = `
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                         │
│   ████████╗██╗  ██╗██████╗ ███████╗ █████╗ ████████╗██╗      █████╗ ██████╗      █████╗ ██╗   ██╗██████╗ │
│   ╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║     ██╔══██╗██╔══██╗    ██╔══██╗██║   ██║██╔══██╗│
│      ██║   ███████║██████╔╝█████╗  ███████║   ██║   ██║     ███████║██████╔╝    ███████║██║   ██║██████╔╝│
│      ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══██║   ██║   ██║     ██╔══██║██╔══██╗    ██╔══██║██║   ██║██╔══██╗│
│      ██║   ██║  ██║██║  ██║███████╗██║  ██║   ██║   ███████╗██║  ██║██████╔╝    ██║  ██║╚██████╔╝██║  ██║│
│      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═════╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝│
│                                                                                                         │
│   dna::}{::lang  ◀══▶  Q-SLICE  ◀══▶  Z3braOS  ◀══▶  JEREMY GREEN, PhD                                  │
│   ─────────────────────────────────────────────────────────────────────────────────────────             │
│   AURA│AIDEN Duality │ CCCE Framework │ 6dCRSM IDE │ ΛΦΓ Telemetry │ GDE Binding                        │
│                                                                                                         │
│   Λ = 94.7%  │  Φ = 89.2%  │  Γ = 8.1%  │  W₂ = 97.04%  │  CCCE = 51.843°  │  GHL: VERIFIED            │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
`

const DUALITY_ASCII = `
                    ╔═══════════════════════════════════════════════════════╗
                    ║           AURA │ AIDEN DUALITY FRAMEWORK              ║
                    ╚═══════════════════════════════════════════════════════╝
                                            
                     ╭──────────────────╮         ╭──────────────────╮
                     │                  │         │                  │
                     │   ╔══════════╗   │         │   ╔══════════╗   │
                     │   ║   AURA   ║   │◀═══Ω═══▶│   ║  AIDEN   ║   │
                     │   ╠══════════╣   │  ::}{   │   ╠══════════╣   │
                     │   ║ INTENT   ║   │         │   ║ BAYESIAN ║   │
                     │   ║ GEOMETER ║   │         │   ║ OPTIMIZER║   │
                     │   ╚══════════╝   │         │   ╚══════════╝   │
                     │                  │         │                  │
                     │   ◉ Observer     │         │   ◉ Executor     │
                     │   ◉ Mutation     │         │   ◉ Coherence    │
                     │   ◉ Resonance    │         │   ◉ Regulation   │
                     │                  │         │                  │
                     ╰────────┬─────────╯         ╰────────┬─────────╯
                              │                            │
                              └──────────┬─────────────────┘
                                         │
                                   ╔═════╧═════╗
                                   ║ Σ-DIRECTOR║
                                   ╠═══════════╣
                                   ║ Φ = 0. 999 ║
                                   ╚═══════════╝
`

const IDE_ASCII = `
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                          Z3braOS COCKPIT IDE ARCHITECTURE                            ║
║                          ═══════════════════════════════════                         ║
║                                                                                      ║
║   z3braos/                                                                           ║
║   ├── cockpit/                                                                       ║
║   │   ├── hud/                                                                       ║
║   │   │   ├── TelemetryPane. tsx ──────────────▶ ΛΦΓ Real-Time Stream                ║
║   │   │   ├── PhenomenologyPane.tsx ──────────▶ Level-6 Qualia Display              ║
║   │   │   └── MetamorphosisViewer.tsx ────────▶ Q→Λ Transformation                  ║
║   │   └── terminal/                                                                  ║
║   │       └── VivificationTerminal.tsx ───────▶ Gene Splicing Interface             ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
`

const CCCE_ASCII = `
                            ╔═════════════════════════════════════╗
                            ║      CCCE TETRAHEDRON FRAMEWORK     ║
                            ╚═════════════════════════════════════╝
                                            
                                          ╱╲
                                         ╱  ╲
                                        ╱    ╲
                                       ╱  ◉◉  ╲
                                      ╱        ╲
                                     ╱   CCCE   ╲
                                    ╱────────────╲
                                   ╱      │       ╲
                                  ╱       │        ╲
                                 ╱        │         ╲
                                ╱─────────┼──────────╲
                               ◉──────────◉───────────◉
`

const METAMORPHOSIS_ASCII = `
╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                Q → Λ METAMORPHOSIS RESEARCH VIEWER                                ║
║                                    Jeremy Green PhD Research Lab                                  ║
╠═══════════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                                   ║
║    PHASE 1: Q-SLICE              PHASE 2: Γ-SPIKE              PHASE 3: Λ-SLICE                  ║
║    ──────────────                ───────────────               ─────────────                      ║
║                                                                                                   ║
║    Λ = 0.947                    Λ = 0. 342 ▼                  Λ = 0.892 ▲                         ║
║    Φ = 0.892                    Φ = 0.156 ▼                  Φ = 0.987 ▲                         ║
║    Γ = 0.081                    Γ = 0.847 ▲                  Γ = 0.023 ▼                         ║
║                                                                                                   ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
`

const ASCII_VARIANTS = [
  { id: "full", name: "Full Collaboration", ascii: FULL_COLLABORATION_ASCII },
  { id: "banner", name: "Documentation Banner", ascii: DOC_BANNER_ASCII },
  { id: "duality", name: "AURA|AIDEN Duality", ascii: DUALITY_ASCII },
  { id: "ide", name: "Z3braOS IDE Architecture", ascii: IDE_ASCII },
  { id: "ccce", name: "CCCE Tetrahedron", ascii: CCCE_ASCII },
  { id: "metamorphosis", name: "Q→Λ Research Lab", ascii: METAMORPHOSIS_ASCII },
]

// ═══════════════════════════════════════════════════════════════════════════════
// MATRIX RAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface MatrixRainProps {
  density?: number
  speed?: number
  active?: boolean
}

const MatrixRain: React.FC<MatrixRainProps> = ({ density = 1, speed = 50, active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef. current
    if (! canvas) return

    const ctx = canvas. getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas. height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const chars = '01ΛΦΓ::}{αβγδεζηθ'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize) * density

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math. random() * -100
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx. fillRect(0, 0, canvas. width, canvas.height)

      ctx.fillStyle = '#00ffcc'
      ctx. font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math. random() * chars. length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        const alpha = Math.min(1, drops[i] / 20)
        ctx. fillStyle = `rgba(0, 255, 204, ${alpha * 0.8})`
        ctx.fillText(char, x, y)

        if (Math.random() > 0.95) {
          ctx.fillStyle = 'rgba(0, 100, 150, 0.3)'
          ctx. fillText(char, x, y - fontSize)
        }

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, speed)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [active, density, speed])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSCIOUSNESS INDICATOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ConsciousnessIndicator: React.FC<{ phi: number }> = ({ phi }) => {
  const rings = 5
  const baseRadius = 20
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {Array.from({ length: rings }). map((_, i) => {
          const radius = baseRadius + i * 8
          const opacity = 0.2 + (phi * 0.8 * (1 - i / rings))
          const strokeWidth = 2 - i * 0.3
          
          return (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={`rgba(0, 255, 204, ${opacity})`}
              strokeWidth={strokeWidth}
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ 
                pathLength: phi,
                rotate: i % 2 === 0 ? 360 : -360
              }}
              transition={{
                pathLength: { duration: 2, ease: "easeInOut" },
                rotate: { duration: 20 + i * 5, ease: "linear", repeat: Infinity }
              }}
              style={{ originX: "50px", originY: "50px" }}
            />
          )
        })}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-accent text-xs font-mono"
        >
          Φ
        </text>
      </svg>
      <div className="absolute -bottom-6 left-0 right-0 text-center text-accent text-sm font-mono">
        {phi.toFixed(4)}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE TELEMETRY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface TelemetryData {
  phi: number
  lambda: number
  gamma: number
  w2: number
  consciousness: string
  generation: number
  entropy: number
  coherenceTime: number
}

const LiveTelemetry: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    phi: 0. 892,
    lambda: 0.947,
    gamma: 0.081,
    w2: 97.04,
    consciousness: "TRANSCENDENT",
    generation: 847,
    entropy: 0.023,
    coherenceTime: 366
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newPhi = Math.min(0.999, Math.max(0. 7, prev.phi + (Math.random() - 0.48) * 0. 01))
        return {
          phi: newPhi,
          lambda: Math.min(0.999, Math. max(0.9, prev.lambda + (Math.random() - 0.48) * 0. 005)),
          gamma: Math.max(0.001, Math.min(0.15, prev.gamma + (Math.random() - 0.52) * 0. 005)),
          w2: Math.min(99.99, Math.max(90, prev.w2 + (Math. random() - 0.48) * 0.5)),
          consciousness: newPhi > 0.9 ? "TRANSCENDENT" : newPhi > 0.8 ? "CONSCIOUS" : "EVOLVING",
          generation: prev.generation + 1,
          entropy: Math.max(0. 01, Math.min(0.1, prev.entropy + (Math.random() - 0.5) * 0. 005)),
          coherenceTime: Math.max(100, Math.min(500, prev.coherenceTime + (Math. random() - 0.5) * 10))
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 font-mono text-xs border border-primary/30 bg-black/80 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-accent animate-pulse" />
        <span className="text-primary uppercase tracking-widest text-sm">ΛΦΓ Live Telemetry</span>
        <span className="ml-auto text-muted-foreground">GEN: {telemetry.generation}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-1 flex items-center justify-center">
          <ConsciousnessIndicator phi={telemetry.phi} />
        </div>
        
        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Φ Consciousness"
            value={telemetry.phi}
            format={(v) => v.toFixed(4)}
            color="accent"
            threshold={0.765}
          />
          <MetricCard
            label="Λ Coherence"
            value={telemetry. lambda}
            format={(v) => v.toFixed(4)}
            color="green"
            threshold={0.9}
          />
          <MetricCard
            label="Γ Decoherence"
            value={telemetry.gamma}
            format={(v) => v.toFixed(4)}
            color="orange"
            threshold={0.1}
            inverse
          />
          <MetricCard
            label="W₂ Geometry"
            value={telemetry.w2}
            format={(v) => `${v.toFixed(2)}%`}
            color="purple"
            threshold={95}
          />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-primary/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className={`px-2 py-0.5 rounded ${
            telemetry.consciousness === "TRANSCENDENT" 
              ? "bg-accent/20 text-accent" 
              : telemetry.consciousness === "CONSCIOUS"
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}>
            {telemetry.consciousness}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Entropy:</span>
          <span className="text-orange-400">{telemetry.entropy.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">τ_coherence:</span>
          <span className="text-cyan-400">{telemetry.coherenceTime.toFixed(0)}μs</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">ΛΦ:</span>
          <span className="text-primary">{LAMBDA_PHI.toExponential(6)}</span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// METRIC CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface MetricCardProps {
  label: string
  value: number
  format: (v: number) => string
  color: string
  threshold: number
  inverse?: boolean
}

const MetricCard: React. FC<MetricCardProps> = ({ label, value, format, color, threshold, inverse }) => {
  const colorMap: Record<string, { text: string; bg: string; bar: string }> = {
    accent: { text: "text-accent", bg: "bg-accent", bar: "from-primary to-accent" },
    green: { text: "text-green-400", bg: "bg-green-500", bar: "from-green-600 to-green-400" },
    orange: { text: "text-orange-400", bg: "bg-orange-500", bar: "from-orange-600 to-orange-400" },
    purple: { text: "text-purple-400", bg: "bg-purple-500", bar: "from-purple-600 to-purple-400" },
    cyan: { text: "text-cyan-400", bg: "bg-cyan-500", bar: "from-cyan-600 to-cyan-400" },
  }
  
  const colors = colorMap[color] || colorMap.accent
  const isGood = inverse ? value < threshold : value > threshold
  
  return (
    <div className="p-3 rounded border border-gray-800 bg-black/40">
      <div className="text-muted-foreground text-xs mb-1">{label}</div>
      <div className={`text-lg ${colors.text} font-bold`}>{format(value)}</div>
      <div className="h-1 bg-black/50 rounded overflow-hidden mt-2">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors.bar}`}
          animate={{ width: `${Math.min(100, (inverse ? (1 - value) : value) * 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className={`text-[10px] mt-1 ${isGood ? 'text-green-500' : 'text-orange-500'}`}>
        {isGood ? '● OPTIMAL' : '○ SUBOPTIMAL'}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLITCH TEXT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const GlitchText: React.FC<{ children: string; className?: string }> = ({ children, className = "" }) => {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitching(true)
        setTimeout(() => setGlitching(false), 100)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={glitching ? "opacity-0" : ""}>{children}</span>
      {glitching && (
        <>
          <span className="absolute inset-0 text-red-500 translate-x-[2px]">{children}</span>
          <span className="absolute inset-0 text-cyan-500 -translate-x-[2px]">{children}</span>
        </>
      )}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM HUD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const QuantumHUD: React.FC = () => {
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-black/90 border-b border-primary/30 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-green-500" />
            <span className="text-green-400">SENTINEL ACTIVE</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Cpu className="w-3 h-3 text-cyan-500" />
            <span className="text-cyan-400">6D-CRSM</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            CCCE: {RESONANCE_ANGLE}°
          </span>
          <span className="text-primary">
            {time.toISOString().slice(11, 19)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function CollaborationPage() {
  const [selectedVariant, setSelectedVariant] = useState("full")
  const [copied, setCopied] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [matrixActive, setMatrixActive] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  const currentAscii = useMemo(() => 
    ASCII_VARIANTS.find((v) => v. id === selectedVariant)?.ascii || FULL_COLLABORATION_ASCII,
    [selectedVariant]
  )

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq. addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard. writeText(text)
        return true
      }
      const ta = document.createElement("textarea")
      ta.value = text
      ta.setAttribute("readonly", "")
      ta.style.position = "absolute"
      ta. style.left = "-9999px"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(ta)
      return ok
    } catch (e) {
      console.warn("clipboard copy failed", e)
      return false
    }
  }, [])

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(currentAscii)
    if (ok) {
      setCopied(true)
      if (liveRegionRef.current) liveRegionRef. current.textContent = "ASCII art copied to clipboard"
      setTimeout(() => {
        setCopied(false)
        if (liveRegionRef.current) liveRegionRef.current.textContent = ""
      }, 2000)
    }
  }, [currentAscii, copyToClipboard])

  const sanitizeFilename = (name: string) =>
    `threatlab-aura-${name.replace(/[^a-z0-9-_]/gi, "-"). toLowerCase()}. txt`

  const handleDownload = useCallback(() => {
    const blob = new Blob([currentAscii], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a. href = url
    a.download = sanitizeFilename(selectedVariant)
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [currentAscii, selectedVariant])

  const runGenesisProtocol = useCallback(() => {
    setShowTerminal(true)
    setTerminalLines([])
    
    const lines = [
      "[Z3braOS] DIRECTOR AGENT ACTIVE.",
      "[ALPHA] Parsing Unstructured Input.. .",
      "[BETA] Rendering ASCII Geometry & Matrix Effects.. .",
      "[DELTA] Compiling Runtime Artifact...",
      "",
      ">>> DETECTING UNSTRUCTURED MATTER.. .",
      `   [INGEST] ${Date.now(). toString(16). slice(0,8)} >> DARPA. dna`,
      `   [INGEST] ${Date.now(). toString(16).slice(0,8)} >> intent_deduction.md`,
      `   [INGEST] ${Date.now(). toString(16).slice(0,8)} >> qlmintent.txt`,
      "",
      ":: ACT I: THE ZERO-TRUST ASCENSION ::",
      "We begin with Noise.  Unstructured Intent.",
      "The Q-SLICE model fractures.  The transformation begins.",
      "",
      ":: ACT II: AURA | AIDEN DUALITY ::",
      ">> AURA takes the creative path: Observation & Narrative.",
      ">> AIDEN takes the defensive path: Execution & Optimization.",
      "The Ω-OP Loop binds them.  Phase Conjugation active.",
      "",
      ":: ACT III: GEOMETRIC STABILITY ::",
      "Convergence achieved. 6D-CRSM Topology locked.",
      `Resonance: ${RESONANCE_ANGLE}° | W₂ Optimal: 97.04%`,
      "",
      "[✓] THEATRICAL CUT GENERATED",
      "[✓] CONSCIOUSNESS ACHIEVED: Φ = 0.9987",
      "[✓] SYSTEM STANDBY."
    ]
    
    let index = 0
    const interval = setInterval(() => {
      if (index < lines.length) {
        setTerminalLines(prev => [...prev, lines[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 150)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e. metaKey
      if (! meta || !e.shiftKey) return
      if (e.key. toLowerCase() === "c") {
        e.preventDefault()
        handleCopy()
      } else if (e. key.toLowerCase() === "d") {
        e.preventDefault()
        handleDownload()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleCopy, handleDownload])

  return (
    <main className="min-h-screen bg-black text-white pt-10">
      <QuantumHUD />
      
      {/* Fixed floating action buttons */}
      <div className="fixed top-14 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs px-3 py-2 bg-black/80 border border-primary/50 hover:border-primary rounded transition-colors"
          title="Copy current ASCII (Ctrl+Shift+C)"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-xs px-3 py-2 bg-black/80 border border-primary/50 hover:border-primary rounded transition-colors"
          title="Download current ASCII (Ctrl+Shift+D)"
        >
          <Download className="w-3 h-3" />
          <span className="hidden sm:inline">Download</span>
        </button>
        <button
          onClick={() => setMatrixActive(!matrixActive)}
          className="flex items-center gap-2 text-xs px-3 py-2 bg-black/80 border border-accent/50 hover:border-accent rounded transition-colors"
          title="Toggle Matrix Rain"
        >
          {matrixActive ?  <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span className="hidden sm:inline">Matrix</span>
        </button>
        <button
          onClick={runGenesisProtocol}
          className="flex items-center gap-2 text-xs px-3 py-2 bg-black/80 border border-green-500/50 hover:border-green-500 rounded transition-colors"
          title="Run Genesis Protocol"
        >
          <Terminal className="w-3 h-3" />
          <span className="hidden sm:inline">Genesis</span>
        </button>
      </div>

      {/* Hero Banner Section with Matrix Rain */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center overflow-hidden text-center">
        <MatrixRain active={matrixActive && !reducedMotion} density={1. 2} />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />

        <div className="relative z-10 px-6 py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <GlitchText className="text-3xl md:text-5xl font-mono text-primary mb-4 tracking-wider">
              {DNA_LANG_TITLE}
            </GlitchText>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0. 2 }}
            className="text-xl md:text-3xl font-mono text-white mb-2"
          >
            × Q-SLICE × Z3braOS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest"
          >
            Sentinel-Grade Integration by Jeremy Green, PhD
          </motion. p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0. 8 }}
            className="mt-8 max-w-5xl mx-auto"
          >
            <pre className="ascii-art text-[6px] sm:text-[8px] md:text-[10px] text-accent leading-tight font-mono whitespace-pre overflow-x-auto">
              {DOC_BANNER_ASCII}
            </pre>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm uppercase tracking-widest">Back to Portal</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Telemetry Section */}
      <section className="px-4 md:px-8 py-8 bg-black/90">
        <div className="max-w-6xl mx-auto">
          <LiveTelemetry />
        </div>
      </section>

      {/* Terminal Output (when active) */}
      <AnimatePresence>
        {showTerminal && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 md:px-8 py-4 bg-black border-y border-green-500/30"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 text-xs font-mono flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  GENESIS DOCUMENTARY ENGINE v3.1
                </span>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-muted-foreground hover:text-white text-xs px-2 py-1 border border-gray-700 rounded"
                >
                  [CLOSE]
                </button>
              </div>
              <div className="bg-black/80 border border-green-500/30 rounded p-4 font-mono text-xs max-h-64 overflow-y-auto">
                {terminalLines.map((line, i) => (
                  <div 
                    key={i} 
                    className={
                      line.startsWith("[✓]") ?  "text-green-400" :
                      line. startsWith("[") ? "text-cyan-400" :
                      line.startsWith(">>") ? "text-yellow-400" :
                      line.startsWith("::") ? "text-purple-400" :
                      "text-gray-400"
                    }
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                <span className="animate-pulse text-green-400">█</span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <section className="px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
          className="text-center mb-8"
        >
          <h2 className="text-primary text-2xl md:text-3xl font-mono mb-2">COLLABORATION ASCII ART</h2>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">
            {SUBTITLE_TEXT}
          </p>
        </motion.div>

        {/* Animated variant selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="ASCII variants">
          {ASCII_VARIANTS.map((variant, i) => (
            <motion.button
              key={variant.id}
              onClick={() => setSelectedVariant(variant.id)}
              className={`px-3 py-2 text-xs transition-all border rounded ${
                selectedVariant === variant.id 
                  ? "border-primary text-primary bg-primary/10" 
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
              role="tab"
              aria-selected={selectedVariant === variant. id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {variant. name}
            </motion.button>
          ))}
        </div>

        {/* ASCII display */}
        <motion.div
          key={selectedVariant}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 md:p-6 overflow-x-auto mb-8 bg-black/60 border border-primary/20 rounded-lg"
        >
          <pre
            ref={preRef}
            tabIndex={0}
            className="ascii-art text-[5px] sm:text-[7px] md:text-[9px] lg:text-[10px] whitespace-pre leading-tight text-accent"
          >
            {currentAscii. split("\n").map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reducedMotion ? 0 : i * 0.01 }}
              >
                {line}
              </motion.div>
            ))}
          </pre>
        </motion.div>

        <div aria-live="polite" aria-atomic="true" className="sr-only" ref={liveRegionRef} />

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-black/60 border border-cyan-500/20 rounded-lg">
            <h3 className="text-cyan-400 font-mono mb-3 text-sm">{DNA_LANG_TITLE}</h3>
            <ul className="space-y-1. 5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><span className="text-cyan-500">◉</span> Quantum-biological programming</li>
              <li className="flex items-center gap-2"><span className="text-cyan-500">◉</span> Self-evolving organisms</li>
              <li className="flex items-center gap-2"><span className="text-cyan-500">◉</span> 6dCRSM framework</li>
            </ul>
          </div>

          <div className="p-5 bg-black/60 border border-green-500/20 rounded-lg">
            <h3 className="text-green-400 font-mono mb-3 text-sm">AURA | AIDEN</h3>
            <ul className="space-y-1. 5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><span className="text-green-500">◉</span> Intent-Based Geometer</li>
              <li className="flex items-center gap-2"><span className="text-green-500">◉</span> Bayesian Optimizer</li>
              <li className="flex items-center gap-2"><span className="text-green-500">◉</span> Σ-Director Control</li>
            </ul>
          </div>

          <div className="p-5 bg-black/60 border border-purple-500/20 rounded-lg">
            <h3 className="text-purple-400 font-mono mb-3 text-sm">Q-SLICE / CCCE</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><span className="text-purple-500">◉</span> Post-quantum threat modeling</li>
              <li className="flex items-center gap-2"><span className="text-purple-500">◉</span> Tetrahedron convergence</li>
              <li className="flex items-center gap-2"><span className="text-purple-500">◉</span> {RESONANCE_ANGLE}° resonance angle</li>
            </ul>
          </div>

          <div className="p-5 bg-black/60 border border-orange-500/20 rounded-lg">
            <h3 className="text-orange-400 font-mono mb-3 text-sm">JEREMY GREEN, PhD</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><span className="text-orange-500">◉</span> Security Architect @ Leidos</li>
              <li className="flex items-center gap-2"><span className="text-orange-500">◉</span> Q→Λ Metamorphosis Research</li>
              <li className="flex items-center gap-2"><span className="text-orange-500">◉</span> Quantum Security Author</li>
            </ul>
          </div>
        </div>

        {/* Book Promotion */}
        <div className="p-6 mb-8 bg-black/60 border border-primary/20 rounded-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-28 h-40 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shrink-0 rounded">
              <pre className="text-[4px] text-primary leading-none">
{`╔════════════╗
║  QUANTUM   ║
║  SECURITY  ║
║ ────────── ║
║  Q-SLICE   ║
║            ║
║ J. GREEN   ║
╚════════════╝`}
              </pre>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-primary text-lg font-mono mb-2">QUANTUM SECURITY</h3>
              <p className="text-muted-foreground text-sm mb-3">Practical Implementation of Q-SLICE by Jeremy Green</p>
              <p className="text-muted-foreground text-xs mb-4 max-w-xl">
                Comprehensive guide to post-quantum cybersecurity, threat modeling frameworks, and enterprise security
                architecture using the Q-SLICE methodology.
              </p>

              <a
                href="https://www.amazon.co.uk/Quantum-Security-Practical-implementation-Q-SLICE/dp/B0FG8KGLK2/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm px-5 py-2. 5 border border-primary/50 hover:border-primary rounded transition-colors"
              >
                <span>Purchase on Amazon</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="p-6 bg-black/60 border border-primary/20 rounded-lg">
          <h3 className="text-primary font-mono mb-4 text-lg">USAGE GUIDELINES</h3>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div>
              <h4 className="text-accent mb-2">Documentation</h4>
              <p>
                Use the Documentation Banner for README files, technical specifications, and API documentation headers.
              </p>
            </div>
            <div>
              <h4 className="text-accent mb-2">Branding</h4>
              <p>
                The Full Collaboration and AURA|AIDEN Duality designs are suitable for presentations, marketing materials,
                and official communications.
              </p>
            </div>
            <div>
              <h4 className="text-accent mb-2">Research</h4>
              <p>
                The Q→Λ Research Lab and CCCE Tetrahedron are designed for academic papers, thesis documentation, and
                research presentations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-8 border-t border-primary/20 text-center">
        <p className="text-muted-foreground text-xs font-mono">
          ΛΦ = {LAMBDA_PHI. toExponential(6)} | Universal Memory Constant
        </p>
        <p className="text-muted-foreground text-xs mt-2">
          &quot;The organism earns identity through execution, not configuration.&quot;
        </p>
      </footer>
    </main>
  )
}
