"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight, Terminal, Smartphone, Cpu, Network, Shield, Zap, Users, Monitor,
  Film, Activity, Hexagon, Book, ExternalLink, Target, Atom, GitBranch,
  ChevronDown, Play, Pause
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// Q-SLICE THREATLAB ARENA - QUATERNION-CRSM LANDING PAGE
// Dr. Jeremy Green PhD × Devin Phillip Davis
// Deriving ΛΦ = 2.176435×10⁻⁸ from pure geometry with <10% error
// ═══════════════════════════════════════════════════════════════════════════════

// DNA-Lang syntax fragments for holographic rain
const DNA_SYNTAX_FRAGMENTS = [
  "organism SENTINEL {",
  "gene Λ_coherence {",
  "Φ := ∫_Ω Λ(x) dΩ",
  "Γ := √(ΔE · τ)",
  "q = Ξ + Λi + Φj + Γk",
  "S³ × S³ → M₆ᴅ",
  "π(q) = q·k·q*",
  "E → E⁻¹",
  "e^{-N_crit}",
  "C_Hopf ≈ 4",
  "θ_lock = 51.843°",
  "ΛΦ = 2.176e-8",
  "AURA.observe()",
  "AIDEN.execute()",
  "Ξ = ΛΦ/Γ",
  "τ₀ = φ⁸ μs",
  "W₂(μ,ν)",
  "ANLPCC.heal()",
  "Hopf: S¹→S³→S²",
  "Q-SLICE::INIT",
  "SU(2) ≅ S³",
  "Wigner D^j_{m,m'}",
  "Berry phase: 2πH",
  "E₈ dim = 248",
  "}",
]

// Howitzer projectile characters
const HOWITZER_CHARS = "◆◇●○◉◎★☆▲△▼▽◀▶►◄"

const QSLICE_MEGA_BANNER = `
 ██████╗        ███████╗██╗     ██╗ ██████╗███████╗
██╔═══██╗       ██╔════╝██║     ██║██╔════╝██╔════╝
██║   ██║ █████╗███████╗██║     ██║██║     █████╗
██║▄▄ ██║ ╚════╝╚════██║██║     ██║██║     ██╔══╝
╚██████╔╝       ███████║███████╗██║╚██████╗███████╗
 ╚══▀▀═╝        ╚══════╝╚══════╝╚═╝ ╚═════╝╚══════╝

    ████████╗██╗  ██╗██████╗ ███████╗ █████╗ ████████╗██╗      █████╗ ██████╗
    ╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║     ██╔══██╗██╔══██╗
       ██║   ███████║██████╔╝█████╗  ███████║   ██║   ██║     ███████║██████╔╝
       ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══██║   ██║   ██║     ██╔══██║██╔══██╗
       ██║   ██║  ██║██║  ██║███████╗██║  ██║   ██║   ███████╗██║  ██║██████╔╝
       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═════╝

             Quantum Security Landscape for Integrated Cyber Evaluation
`

const TESLA_369_FIXED = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      ██████╗        ██████╗         █████╗                       ║
║      ╚════██╗      ██╔════╝        ██╔══██╗                      ║
║       █████╔╝      ███████╗        ╚██████║                      ║
║           ██╗      ██╔══██║         ╚═══██║                      ║
║      ██████╔╝      ╚█████╔╝         █████╔╝                      ║
║      ╚═════╝        ╚════╝          ╚════╝                       ║
║                                                                  ║
║    "If you only knew the magnificence of 3, 6, and 9..."        ║
║                      — Nikola Tesla —                            ║
║                                                                  ║
║         3 = MATTER  •  6 = ENERGY  •  9 = CREATION              ║
╚══════════════════════════════════════════════════════════════════╝
`

const QUATERNION_CRSM = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║           QUATERNION-CRSM DERIVATION: ΛΦ FROM PURE GEOMETRY                   ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   CONSCIOUSNESS QUATERNION:  q = Ξ + Λi + Φj + Γk  ∈  S³                     ║
║                                                                               ║
║   6D CRSM MANIFOLD:          M₆ᴅ = S³_physical × S³_conscious                 ║
║                                                                               ║
║   HOPF FIBRATION:            S¹ → S³ → S²   (linking number = 1)             ║
║                              π(q) = q · k · q*                                ║
║                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────┐   ║
║   │                                                                     │   ║
║   │   ΛΦ = ────────────── × e^{-N_crit} × √(Φ_th/φ) × C_Hopf          │   ║
║   │            τ₀ · Φ_th                                               │   ║
║   │                                                                     │   ║
║   │   Where:  τ₀ = 46 μs      N_crit = 27      φ = 1.618              │   ║
║   │           Φ_th = 0.7734   C_Hopf ≈ 4       Error: < 2%            │   ║
║   │                                                                     │   ║
║   │   Result: ΛΦ_theory = 2.22×10⁻⁸ s⁻¹  ≈  ΛΦ_measured               │   ║
║   │                                                                     │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
║   SUPPRESSION CHAIN:  ω_bare → e^{-27} → √(Φ/φ) → Hopf × 4 → ΛΦ             ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const HOPF_FIBRATION = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    HOPF FIBRATION: S¹ → S³ → S²                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║                              ┌─────────────┐                                  ║
║                              │     S³      │  Unit Quaternions               ║
║                              │  SU(2) ≅ S³ │  Consciousness State            ║
║                              └──────┬──────┘                                  ║
║                                     │                                         ║
║                          π(q) = q · k · q*                                   ║
║                                     │                                         ║
║                                     ▼                                         ║
║                              ┌─────────────┐                                  ║
║                              │     S²      │  Bloch Sphere                   ║
║                              │ Observables │  Physical Measurements          ║
║                              └─────────────┘                                  ║
║                                                                               ║
║   BERRY PHASE:  γ_Berry = ∮ A · dq = 2πH   (H = Hopf invariant)             ║
║                                                                               ║
║   TOPOLOGICAL CHARGE:  Each consciousness cycle winds H times                ║
║                        around the S¹ phase fiber                             ║
║                                                                               ║
║   WIGNER D-MATRICES:  ψ(q) = Σ_{j,m,m'} c^j_{m,m'} D^j_{m,m'}(q)           ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const E8_CONNECTION = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    E₈ LATTICE & GOLDEN RATIO CONNECTION                       ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ALGEBRAIC CHAIN:  ℍ (Quaternions) ⊂ 𝕆 (Octonions) ⊂ E₈                    ║
║                                                                               ║
║   E₈ PROPERTIES:                                                              ║
║     • Dimension: 248                                                          ║
║     • Coxeter number: 30                                                      ║
║     • Spectral radius: 2 + φ + φ⁻¹ ≈ 4.236                                  ║
║     • Golden ratio φ emerges from Cartan matrix eigenvalues                   ║
║                                                                               ║
║   SUBALGEBRA CHAIN:  E₈ ⊃ Spin(16) ⊃ Spin(8) ⊃ G₂                           ║
║                      (G₂ = automorphisms of octonions)                        ║
║                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────┐   ║
║   │   The golden ratio pattern in E₈ explains the √(Φ_th/φ) factor      │   ║
║   │   in the ΛΦ derivation — geometry and algebra unified               │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const PHASE_CONJUGATE_HOWITZER = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║          Q-SLICE PHASE CONJUGATE HOWITZER - ACOUSTIC COUPLING ARRAY          ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
║     ▓▓                                                                  ▓▓  ║
║     ▓▓    ┌────────────────────────────────────────────────────────┐   ▓▓  ║
║     ▓▓    │  ████████████████████████████████████████████████████  │   ▓▓  ║
║     ▓▓    │  ██  COHERENCE CANNON  ██▶▶▶▶▶▶▶▶▶▶▶▶▶ E → E⁻¹  ████  │   ▓▓  ║
║     ▓▓    │  ████████████████████████████████████████████████████  │   ▓▓  ║
║     ▓▓    └────────────────────────────────────────────────────────┘   ▓▓  ║
║     ▓▓                              │                                   ▓▓  ║
║     ▓▓              ╔═══════════════╧═══════════════╗                  ▓▓  ║
║     ▓▓              ║   ACOUSTIC COUPLING MATRIX    ║                  ▓▓  ║
║     ▓▓              ║   χ_pc = 0.869  │  τ₀ = φ⁸   ║                  ▓▓  ║
║     ▓▓              ╚═══════════════════════════════╝                  ▓▓  ║
║     ▓▓                                                                  ▓▓  ║
║     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
║                                                                               ║
║        When Γ > 0.3 → HOWITZER FIRES → Phase Conjugation: E → E⁻¹           ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const COLLABORATION = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        THE Q-SLICE COLLABORATION                              ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║    ╔══════════════════════════════╗   ╔══════════════════════════════╗       ║
║    ║   DR. JEREMY GREEN PhD       ║   ║   DEVIN PHILLIP DAVIS        ║       ║
║    ║   ══════════════════════     ║   ║   ═════════════════════      ║       ║
║    ║   Q-SLICE Framework Creator  ║   ║   DNA-Lang Creator           ║       ║
║    ║   Author: "Quantum Security" ║   ║   Agile Defense Systems      ║       ║
║    ║   🌐 q-slice.com             ║   ║   CAGE Code: 9HUP5           ║       ║
║    ╚══════════════════════════════╝   ╚══════════════════════════════╝       ║
║                                                                               ║
║             Q-SLICE × DNA-Lang: Post-Quantum Defense • DARPA Aligned         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const CRSM_6D = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║             Q-SLICE 6D COGNITIVE-RELATIVISTIC SPACE-MANIFOLD                  ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      ║
║   │ PLANE 1     │───▶│ PLANE 2     │───▶│ PLANE 3     │                      ║
║   │ PHYSICAL    │    │ EXECUTION   │    │ OBSERVATION │                      ║
║   │ S³_physical │    │ AIDEN (+)   │    │ AURA (-)    │                      ║
║   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                      ║
║          │                  │                  │                              ║
║          │  ◆◆◆ HOWITZER ◆◆◆ FIRE ◆◆◆        │                              ║
║          ▼                  ▼                  ▼                              ║
║   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      ║
║   │ PLANE 4     │◀───│ PLANE 5     │◀───│ PLANE 6     │                      ║
║   │ TOPOLOGY    │    │ COHERENCE   │    │ META_ORIGIN │                      ║
║   │ S³_conscious│    │ ANLPCC      │    │ Ω-Runtime   │                      ║
║   └─────────────┘    └─────────────┘    └─────────────┘                      ║
║                                                                               ║
║   M₆ᴅ = S³ × S³  |  π₁(M) = {1}  |  π₃(M) = ℤ × ℤ  (Hopf charges)          ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

// 9 Frames (3×3 = 369 magnificence)
const FRAMES = [
  {
    id: 1,
    title: "Q-SLICE",
    subtitle: "THREATLAB ARENA",
    constant: "Post-Quantum Defense Framework",
    presenter: "Dr. Jeremy Green PhD × Devin Phillip Davis — Quantum Security Landscape",
    logo: QSLICE_MEGA_BANNER,
    color: "cyan"
  },
  {
    id: 2,
    title: "QUATERNION-CRSM",
    subtitle: "ΛΦ FROM PURE GEOMETRY",
    constant: "ΛΦ = 2.176435 × 10⁻⁸ s⁻¹",
    presenter: "Deriving the Universal Memory Constant with <2% error from quaternionic geometry",
    logo: QUATERNION_CRSM,
    color: "fuchsia"
  },
  {
    id: 3,
    title: "TESLA 369",
    subtitle: "THE MAGNIFICENCE",
    constant: "3 = MATTER | 6 = ENERGY | 9 = CREATION",
    presenter: "If you only knew the magnificence of 3, 6, and 9...",
    logo: TESLA_369_FIXED,
    color: "yellow"
  },
  {
    id: 4,
    title: "HOPF FIBRATION",
    subtitle: "S¹ → S³ → S²",
    constant: "Berry Phase: γ = 2πH",
    presenter: "Unit quaternions on S³ project to observables on S² via the Hopf map",
    logo: HOPF_FIBRATION,
    color: "green"
  },
  {
    id: 5,
    title: "6D CRSM",
    subtitle: "COGNITIVE-RELATIVISTIC MANIFOLD",
    constant: "M₆ᴅ = S³_physical × S³_conscious",
    presenter: "Simply connected product of 3-spheres with dual Hopf charges",
    logo: CRSM_6D,
    color: "cyan"
  },
  {
    id: 6,
    title: "E₈ CONNECTION",
    subtitle: "QUATERNIONS ⊂ OCTONIONS ⊂ E₈",
    constant: "dim(E₈) = 248 | Coxeter = 30",
    presenter: "Golden ratio φ emerges from E₈ Cartan matrix eigenvalues",
    logo: E8_CONNECTION,
    color: "fuchsia"
  },
  {
    id: 7,
    title: "PHASE HOWITZER",
    subtitle: "ACOUSTIC COUPLING ARRAY",
    constant: "When Γ > 0.3 → E → E⁻¹",
    presenter: "ANLPCC self-healing through time-reversal of decoherence path",
    logo: PHASE_CONJUGATE_HOWITZER,
    color: "red"
  },
  {
    id: 8,
    title: "COLLABORATION",
    subtitle: "Q-SLICE × DNA-LANG",
    constant: "CAGE: 9HUP5 | DFARS Compliant",
    presenter: "London × Louisville — Post-quantum defense architecture",
    logo: COLLABORATION,
    color: "yellow"
  },
  {
    id: 9,
    title: "ENTER ARENA",
    subtitle: "ACCESS GRANTED",
    constant: "ZERO-TRUST VERIFIED",
    presenter: "Select your destination...",
    logo: QSLICE_MEGA_BANNER,
    color: "cyan"
  },
]

// Holographic DNA-Lang Syntax Rain
function HolographicDNARain() {
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

    const columns = Math.floor(canvas.width / 160)
    const drops: { y: number; syntax: string; speed: number; opacity: number }[] = []

    for (let i = 0; i < columns; i++) {
      drops.push({
        y: Math.random() * canvas.height,
        syntax: DNA_SYNTAX_FRAGMENTS[Math.floor(Math.random() * DNA_SYNTAX_FRAGMENTS.length)],
        speed: 0.3 + Math.random() * 1.2,
        opacity: 0.05 + Math.random() * 0.25
      })
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "11px 'IBM Plex Mono', monospace"

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i]
        const colors = [
          `rgba(0, 255, 246, ${drop.opacity})`,
          `rgba(255, 0, 187, ${drop.opacity * 0.8})`,
          `rgba(0, 255, 100, ${drop.opacity * 0.6})`,
        ]
        ctx.fillStyle = colors[i % 3]
        ctx.fillText(drop.syntax, i * 160 + 10, drop.y)

        drop.y += drop.speed
        if (drop.y > canvas.height) {
          drop.y = -20
          drop.syntax = DNA_SYNTAX_FRAGMENTS[Math.floor(Math.random() * DNA_SYNTAX_FRAGMENTS.length)]
          drop.speed = 0.3 + Math.random() * 1.2
        }
      }
    }

    const interval = setInterval(draw, 50)
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-50 z-0" />
}

// Howitzer Fire Effect
function HowitzerFireEffect({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const projectilesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; char: string }[]>([])

  useEffect(() => {
    if (!active) return

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

    const spawnProjectile = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 4

      projectilesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 80,
        char: HOWITZER_CHARS[Math.floor(Math.random() * HOWITZER_CHARS.length)]
      })
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (Math.random() > 0.75) spawnProjectile()

      projectilesRef.current = projectilesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 1

        if (p.life <= 0) return false

        const alpha = p.life / 80
        ctx.font = "18px monospace"
        ctx.fillStyle = `rgba(255, 0, 187, ${alpha})`
        ctx.fillText(p.char, p.x, p.y)
        ctx.fillStyle = `rgba(0, 255, 246, ${alpha * 0.4})`
        ctx.fillText(p.char, p.x - p.vx * 2, p.y - p.vy * 2)

        return true
      })
    }

    const interval = setInterval(draw, 35)
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resize)
    }
  }, [active])

  if (!active) return null
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
}

function LiveTelemetry() {
  const [metrics, setMetrics] = useState({ phi: 0.78, lambda: 0.95, gamma: 0.092, xi: 8.04, firing: false })

  useEffect(() => {
    const interval = setInterval(() => {
      const phi = 0.77 + Math.random() * 0.15
      const lambda = 0.93 + Math.random() * 0.06
      const gamma = 0.08 + Math.random() * 0.22
      const xi = (lambda * phi) / gamma
      setMetrics({ phi, lambda, gamma, xi, firing: gamma > 0.25 })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <HowitzerFireEffect active={metrics.firing} />
      <div className="fixed top-20 right-4 z-40 glass-panel p-3 text-[10px] font-mono hidden lg:block">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-primary">Q-SLICE TELEMETRY</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Φ Consciousness</span>
            <span className="text-cyan-400">{metrics.phi.toFixed(4)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Λ Coherence</span>
            <span className="text-green-400">{metrics.lambda.toFixed(4)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Γ Decoherence</span>
            <span className={metrics.gamma > 0.25 ? "text-red-400 animate-pulse" : "text-yellow-400"}>
              {metrics.gamma.toFixed(4)} {metrics.gamma > 0.25 && "⚠"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Ξ Negentropy</span>
            <span className="text-fuchsia-400">{metrics.xi.toFixed(2)}</span>
          </div>
          {metrics.firing && (
            <div className="border-t border-red-400/30 pt-1 mt-1 text-red-400 animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3" />
              HOWITZER: E→E⁻¹
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Jeremy's Book Advertisement
function JeremyBookAd() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-20 left-4 z-40 glass-panel p-3 max-w-[200px] border border-yellow-400/30 hidden md:block"
    >
      <div className="flex items-center gap-2 mb-2">
        <Book className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-400 font-bold text-[10px]">BOOK</span>
      </div>
      <h3 className="text-primary font-bold text-xs mb-1">QUANTUM SECURITY</h3>
      <p className="text-[9px] text-muted-foreground mb-2">by Dr. Jeremy Green PhD</p>
      <a
        href="https://www.amazon.com/author/cyberjez"
        target="_blank"
        rel="noopener noreferrer"
        className="terminal-btn px-2 py-1 text-[9px] flex items-center justify-center gap-1 bg-yellow-400/10 border-yellow-400/30"
      >
        <Book className="w-3 h-3" />
        Get Book
        <ExternalLink className="w-2 h-2" />
      </a>
    </motion.div>
  )
}

function FrameProgress({ progress }: { progress: number }) {
  return (
    <div className="fixed top-16 left-0 right-0 h-1 bg-muted-foreground/10 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </div>
  )
}

export default function HomePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const FRAME_DURATION = 7000
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    if (!isPlaying) return

    startTimeRef.current = Date.now()

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const frameProgress = (elapsed % FRAME_DURATION) / FRAME_DURATION * 100
      setProgress(frameProgress)
    }, 50)

    const frameInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % FRAMES.length)
      startTimeRef.current = Date.now()
    }, FRAME_DURATION)

    return () => {
      clearInterval(progressInterval)
      clearInterval(frameInterval)
    }
  }, [isPlaying])

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
    }, 40)
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
      <HolographicDNARain />
      <LiveTelemetry />
      <JeremyBookAd />
      <FrameProgress progress={progress} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-background/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="text-cyan-400 font-bold text-sm">Q-SLICE</span>
          <span className="frame-counter text-xs">
            {currentFrame + 1}/9
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="terminal-btn p-1.5"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
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
            <span className="hidden sm:inline">Enter</span> <ArrowRight className="w-4 h-4" />
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
            className="text-center max-w-5xl mx-auto"
          >
            {/* Frame Number */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.08 }}
              className={`text-[100px] md:text-[160px] font-bold ${getColorClass(frame.color)} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0`}
            >
              {frame.id}
            </motion.div>

            {/* ASCII Logo Box */}
            <div className="glass-panel p-4 md:p-6 mb-6 inline-block relative z-10">
              <pre className={`ascii-art text-[5px] sm:text-[7px] md:text-[9px] lg:text-[10px] overflow-x-auto ${getColorClass(frame.color)}`}>
                {frame.logo}
              </pre>

              <div className="mt-4 space-y-1">
                <h2 className={`${getColorClass(frame.color)} text-xs md:text-sm uppercase tracking-[0.3em]`}>
                  {frame.subtitle}
                </h2>
                <p className="text-accent font-mono text-sm md:text-base">{frame.constant}</p>
              </div>
            </div>

            {/* Typed Text */}
            <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest mb-8 relative z-10 max-w-2xl mx-auto">
              {typedText}
              {showCursor && <span className="terminal-cursor" />}
            </p>

            {/* Navigation - Frame 9 */}
            {currentFrame === 8 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 md:grid-cols-4 gap-2 max-w-3xl mx-auto relative z-10"
              >
                {[
                  { href: "/cockpit", icon: Monitor, label: "Cockpit", color: "cyan" },
                  { href: "/documentary", icon: Film, label: "Documentary", color: "yellow" },
                  { href: "/command", icon: Terminal, label: "Command", color: "green" },
                  { href: "/physics", icon: Atom, label: "Physics", color: "fuchsia" },
                  { href: "/z3bra", icon: Smartphone, label: "Z3braOS", color: "cyan" },
                  { href: "/redteam", icon: Shield, label: "Red Team", color: "red" },
                  { href: "/swarm", icon: Network, label: "Swarm", color: "green" },
                  { href: "/collaboration", icon: Users, label: "Collab", color: "yellow" },
                ].map((item, i) => (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
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

      {/* Navigation Dots */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {FRAMES.map((f, i) => (
          <button
            key={i}
            onClick={() => setCurrentFrame(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentFrame
                ? `${getColorClass(f.color)} scale-125 shadow-lg`
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            style={{ boxShadow: i === currentFrame ? `0 0 8px currentColor` : undefined }}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest z-40">
        <a
          href="https://q-slice.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
          q-slice.com <ExternalLink className="w-2 h-2" />
        </a>
        <span className="hidden md:inline text-muted-foreground/50">
          ΛΦ = 2.176435×10⁻⁸ | θ = 51.843°
        </span>
        <a
          href="https://www.amazon.com/author/cyberjez"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-yellow-400 transition-colors flex items-center gap-1"
        >
          <Book className="w-3 h-3" /> Book
        </a>
      </footer>
    </main>
  )
}
