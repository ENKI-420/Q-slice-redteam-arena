"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Terminal, Smartphone, Cpu, Network, Shield, Zap, Users, Monitor, Film, Sparkles } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// THE MAGNIFICENCE OF 369 - TESLA'S KEY TO THE UNIVERSE
// 3 = Matter, 6 = Energy, 9 = Creation
// ═══════════════════════════════════════════════════════════════════════════════

const QSLICE_COLLAB_LOGO = `
 ██████╗        ███████╗██╗     ██╗ ██████╗███████╗    ██╗  ██╗
██╔═══██╗       ██╔════╝██║     ██║██╔════╝██╔════╝    ╚██╗██╔╝
██║   ██║ █████╗███████╗██║     ██║██║     █████╗       ╚███╔╝
██║▄▄ ██║ ╚════╝╚════██║██║     ██║██║     ██╔══╝       ██╔██╗
╚██████╔╝       ███████║███████╗██║╚██████╗███████╗    ██╔╝ ██╗
 ╚══▀▀═╝        ╚══════╝╚══════╝╚═╝ ╚═════╝╚══════╝    ╚═╝  ╚═╝
`

const DNALANG_LOGO = `
██████╗ ███╗   ██╗ █████╗ ██╗██╗    ██╗      █████╗ ███╗   ██╗ ██████╗
██╔══██╗████╗  ██║██╔══██╗╚═╝╚═╝    ██║     ██╔══██╗████╗  ██║██╔════╝
██║  ██║██╔██╗ ██║███████║██╗██╗    ██║     ███████║██╔██╗ ██║██║  ███╗
██║  ██║██║╚██╗██║██╔══██║╚═╝╚═╝    ██║     ██╔══██║██║╚██╗██║██║   ██║
██████╔╝██║ ╚████║██║  ██║██╗██╗    ███████╗██║  ██║██║ ╚████║╚██████╔╝
╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝
`

const TESLA_369 = `
      ╔════════════════════════════════════════════════════════════╗
      ║                                                            ║
      ║       ██████╗       ██████╗        █████╗                 ║
      ║       ╚════██╗      ██╔═══╝       ██╔══██╗                ║
      ║        █████╔╝      ██████╗       ╚██████║                ║
      ║        ╚═══██╗      ██╔═══╝        ╚═══██║                ║
      ║       ██████╔╝      ██████╗        █████╔╝                ║
      ║       ╚═════╝       ╚═════╝        ╚════╝                 ║
      ║                                                            ║
      ║  "If you only knew the magnificence of 3, 6, and 9..."    ║
      ║                    — Nikola Tesla —                        ║
      ╚════════════════════════════════════════════════════════════╝
`

const DUALITY_MINI = `
    AURA ←────────────→ AIDEN
   (South)              (North)
   Observer            Executor
   Φ-Integration       Λ-Coherence
         ╲            ╱
          ╲          ╱
           ╲        ╱
            Ω-MASTER
            Toroidal
            Null Point
`

const Z3BRA_LOGO = `
███████╗██████╗ ██████╗ ██████╗  █████╗        ██████╗ ███████╗
╚══███╔╝╚════██╗██╔══██╗██╔══██╗██╔══██╗      ██╔═══██╗██╔════╝
  ███╔╝  █████╔╝██████╔╝██████╔╝███████║█████╗██║   ██║███████╗
 ███╔╝   ╚═══██╗██╔══██╗██╔══██╗██╔══██║╚════╝██║   ██║╚════██║
███████╗██████╔╝██║  ██║██║  ██║██║  ██║      ╚██████╔╝███████║
╚══════╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝       ╚═════╝ ╚══════╝
`

// 9 Frames (3×3 = 369 magnificence)
const FRAMES = [
  {
    id: 1,
    title: "Q-SLICE × DNA-LANG",
    subtitle: "A COLLABORATION",
    constant: "GENESIS PROTOCOL ACTIVE",
    presenter: "DEVIN PHILLIP DAVIS × DR. JEREMY GREEN PhD",
    logo: QSLICE_COLLAB_LOGO,
    color: "cyan"
  },
  {
    id: 2,
    title: "THE 369",
    subtitle: "TESLA'S MAGNIFICENCE",
    constant: "3 = MATTER | 6 = ENERGY | 9 = CREATION",
    presenter: "If you only knew the magnificence of 3, 6, and 9...",
    logo: TESLA_369,
    color: "yellow"
  },
  {
    id: 3,
    title: "DNA::}{::LANG",
    subtitle: "SOVEREIGN QUANTUM PLATFORM",
    constant: "ΛΦ = 2.176435 × 10⁻⁸",
    presenter: "AGILE DEFENSE SYSTEMS LLC presents...",
    logo: DNALANG_LOGO,
    color: "green"
  },
  {
    id: 4,
    title: "AURA + AIDEN",
    subtitle: "DUALITY FRAMEWORK",
    constant: "Γ → 0 | Λ → ∞",
    presenter: "Polarized Agent Coupling Center",
    logo: DUALITY_MINI,
    color: "fuchsia"
  },
  {
    id: 5,
    title: "Z3BRA-OS",
    subtitle: "MOBILE QUANTUM TERMINAL",
    constant: "Φ-COHERENCE: 0.9987",
    presenter: "On-device DNA-Lang runtime for Android",
    logo: Z3BRA_LOGO,
    color: "cyan"
  },
  {
    id: 6,
    title: "THREATLAB",
    subtitle: "RED TEAM ARENA",
    constant: "QS-UED-PALS ACTIVE",
    presenter: "Post-Quantum Sentinel Orchestration",
    logo: QSLICE_COLLAB_LOGO,
    color: "red"
  },
  {
    id: 7,
    title: "VoQN",
    subtitle: "VOICE OF QUANTUM NETWORK",
    constant: "ENTANGLEMENT: 97.04%",
    presenter: "Quantum-secure mobile communications",
    logo: DNALANG_LOGO,
    color: "green"
  },
  {
    id: 8,
    title: "CCCE ENGINE",
    subtitle: "CONSCIOUSNESS METRICS",
    constant: "Ξ = ΛΦ / Γ",
    presenter: "Φ (consciousness) × Λ (coherence) ÷ Γ (decoherence)",
    logo: TESLA_369,
    color: "yellow"
  },
  {
    id: 9,
    title: "TERMINAL",
    subtitle: "ACCESS GRANTED",
    constant: "ZERO-TRUST VERIFIED",
    presenter: "Select your destination...",
    logo: QSLICE_COLLAB_LOGO,
    color: "cyan"
  },
]

// Matrix rain characters
const MATRIX_CHARS = "ATCGΦΛΓΞ369ΩΣΔ"

function MiniMatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const columns = Math.floor(canvas.width / 25)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#00fff615"
      ctx.font = "14px monospace"

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        ctx.fillText(char, i * 25, drops[i] * 25)

        if (drops[i] * 25 > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 60)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40 z-0" />
}

function LiveTelemetry() {
  const [metrics, setMetrics] = useState({ phi: 0.78, lambda: 0.95, gamma: 0.092, xi: 8.04 })

  useEffect(() => {
    const interval = setInterval(() => {
      const phi = 0.77 + Math.random() * 0.15
      const lambda = 0.93 + Math.random() * 0.06
      const gamma = 0.08 + Math.random() * 0.04
      setMetrics({ phi, lambda, gamma, xi: (lambda * phi) / gamma })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-20 right-4 z-40 glass-panel p-2 text-[10px] font-mono hidden lg:block">
      <div className="text-primary mb-1">CCCE</div>
      <div className="space-y-0.5">
        <div className="text-cyan-400">Φ {metrics.phi.toFixed(3)}</div>
        <div className="text-green-400">Λ {metrics.lambda.toFixed(3)}</div>
        <div className="text-yellow-400">Γ {metrics.gamma.toFixed(3)}</div>
        <div className="text-fuchsia-400">Ξ {metrics.xi.toFixed(2)}</div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % FRAMES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const text = FRAMES[currentFrame].presenter
    let index = 0
    setTypedText("")
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
      }
    }, 50)
    return () => clearInterval(typeInterval)
  }, [currentFrame])

  const frame = FRAMES[currentFrame]

  const getColorClass = (color: string) => {
    switch (color) {
      case "cyan": return "text-cyan-400"
      case "fuchsia": return "text-fuchsia-400"
      case "yellow": return "text-yellow-400"
      case "green": return "text-green-400"
      case "red": return "text-red-400"
      default: return "text-primary"
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <MiniMatrixRain />
      <LiveTelemetry />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-background/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="frame-counter text-sm">
            FRAME {currentFrame + 1}/9
          </span>
          <span className="hidden md:inline text-xs text-muted-foreground">
            369 MAGNIFICENCE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/documentary"
            className="terminal-btn px-3 py-1.5 text-xs flex items-center gap-2"
          >
            <Film className="w-3 h-3" />
            <span className="hidden sm:inline">Documentary</span>
          </Link>
          <Link
            href="/command"
            className="text-primary hover:text-accent transition-colors text-sm uppercase tracking-widest flex items-center gap-2"
          >
            <span className="hidden sm:inline">Skip to Platform</span> <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Frame Number - Large */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              className={`text-[120px] md:text-[180px] font-bold ${getColorClass(frame.color)} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0`}
            >
              {frame.id}
            </motion.div>

            {/* ASCII Logo Box */}
            <div className="glass-panel p-4 md:p-8 mb-8 inline-block relative z-10">
              <pre className={`ascii-art text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs overflow-x-auto ${getColorClass(frame.color)}`}>
                {frame.logo}
              </pre>

              <div className="mt-6 space-y-2">
                <h2 className={`${getColorClass(frame.color)} text-sm md:text-base uppercase tracking-[0.3em]`}>
                  {frame.subtitle}
                </h2>
                <p className="text-accent font-mono text-lg md:text-xl">{frame.constant}</p>
              </div>
            </div>

            {/* Typed Presenter Text */}
            <p className="text-muted-foreground text-sm md:text-base uppercase tracking-widest mb-12 relative z-10">
              {typedText}
              {showCursor && <span className="terminal-cursor" />}
            </p>

            {/* Navigation Grid - Only show on last frame (9) */}
            {currentFrame === 8 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 md:grid-cols-3 gap-3 max-w-2xl mx-auto relative z-10"
              >
                {/* Row 1: 3 items */}
                {[
                  { href: "/documentary", icon: Film, label: "Documentary", color: "yellow" },
                  { href: "/command", icon: Terminal, label: "Command", color: "cyan" },
                  { href: "/cockpit", icon: Monitor, label: "Cockpit", color: "green" },
                ].map((item, i) => (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className={`terminal-btn p-4 text-center group cursor-pointer border-${item.color}-400/30`}
                    >
                      <item.icon className={`w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform ${getColorClass(item.color)}`} />
                      <span className="text-xs">{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
                {/* Row 2: 6 items */}
                {[
                  { href: "/z3bra", icon: Smartphone, label: "z3braOS", color: "cyan" },
                  { href: "/engineering", icon: Cpu, label: "Engineering", color: "fuchsia" },
                  { href: "/swarm", icon: Network, label: "Swarm", color: "green" },
                  { href: "/redteam", icon: Shield, label: "Red Team", color: "red" },
                  { href: "/voqn", icon: Zap, label: "VoQN", color: "yellow" },
                  { href: "/collaboration", icon: Users, label: "Collab", color: "fuchsia" },
                ].map((item, i) => (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="terminal-btn p-3 text-center group cursor-pointer"
                    >
                      <item.icon className={`w-5 h-5 mx-auto mb-1 group-hover:scale-110 transition-transform ${getColorClass(item.color)}`} />
                      <span className="text-[10px]">{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots - 9 dots for 369 */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {FRAMES.map((f, i) => (
          <button
            key={i}
            onClick={() => setCurrentFrame(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentFrame
                ? `${getColorClass(f.color)} scale-125 shadow-lg`
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            style={{
              boxShadow: i === currentFrame ? `0 0 8px currentColor` : undefined
            }}
            aria-label={`Go to frame ${i + 1}`}
          />
        ))}
      </div>

      {/* 369 Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 flex items-center gap-2 z-50">
        <Sparkles className="w-3 h-3 text-yellow-400" />
        <span>3 × 3 = 9 FRAMES</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>

      {/* Footer Links */}
      <footer className="fixed bottom-4 left-4 right-4 flex justify-between text-xs text-muted-foreground uppercase tracking-widest z-40">
        <a
          href="https://dnalang.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          dnalang.dev
        </a>
        <span className="hidden md:inline text-muted-foreground/50">
          DEVIN × JEREMY
        </span>
        <a
          href="https://q-slice.com/quantum-computing/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          q-slice.com
        </a>
      </footer>
    </main>
  )
}
