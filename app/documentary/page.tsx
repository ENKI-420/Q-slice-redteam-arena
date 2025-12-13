"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Activity, Book, ExternalLink, Zap, Target, Shield, Atom } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Play, Pause, ChevronDown } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// Q-SLICE THREATLAB DOCUMENTARY - PHASE CONJUGATE HOWITZER EDITION
// Dr. Jeremy Green PhD × Devin Phillip Davis
// "Quantum Security" - The definitive guide to post-quantum defense
// ═══════════════════════════════════════════════════════════════════════════════

// Q-SLICE DNA-Lang syntax fragments for holographic rain
const DNA_SYNTAX_FRAGMENTS = [
  "organism SENTINEL {",
  "gene Λ_coherence {",
  "Φ := ∫_Ω Λ(x) dΩ",
  "Γ := √(ΔE · τ)",
  "CCCE.emit()",
  "phase_conjugate()",
  "E → E⁻¹",
  "χ_{n+1} := Γ(ψ)",
  "collapse(ψ_Ω)",
  "θ_lock = 51.843°",
  "ΛΦ = 2.176e-8",
  "AURA.observe()",
  "AIDEN.execute()",
  "Ξ = ΛΦ/Γ",
  "τ₀ = φ⁸ μs",
  "W₂(μ,ν)",
  "ANLPCC.heal()",
  "Σ_field.evolve()",
  "Q-SLICE::INIT",
  "HOWITZER.fire()",
  "acoustic_couple()",
  "mesh.propagate()",
  "}",
  "// decoherence",
  "// negentropy",
  "spawn SWARM",
  "bind(Λ, Φ, Γ)",
  "toroidal_flow()",
  "null_point()",
]

// Q-SLICE Howitzer projectile characters
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

const HOWITZER_ASCII = `
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
║     ▓▓              ║   ════════════════════════    ║                  ▓▓  ║
║     ▓▓              ║   χ_pc = 0.869                ║                  ▓▓  ║
║     ▓▓              ║   τ₀ = φ⁸ = 46.9787 μs       ║                  ▓▓  ║
║     ▓▓              ║   window = ±2.5 μs           ║                  ▓▓  ║
║     ▓▓              ╚═══════════════════════════════╝                  ▓▓  ║
║     ▓▓                                                                  ▓▓  ║
║     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
║                                                                               ║
║        When Γ > 0.3 → HOWITZER FIRES → Phase Conjugation: E → E⁻¹           ║
║              ANLPCC Self-Healing Through Time-Reversal Path                  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const JEREMY_BOOK_AD = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║  ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗██╗   ██╗███╗   ███╗            ║
║ ██╔═══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██║   ██║████╗ ████║            ║
║ ██║   ██║██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║            ║
║ ██║▄▄ ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║            ║
║ ╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║            ║
║  ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝            ║
║                                                                               ║
║ ███████╗███████╗ ██████╗██╗   ██╗██████╗ ██╗████████╗██╗   ██╗               ║
║ ██╔════╝██╔════╝██╔════╝██║   ██║██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝               ║
║ ███████╗█████╗  ██║     ██║   ██║██████╔╝██║   ██║    ╚████╔╝                ║
║ ╚════██║██╔══╝  ██║     ██║   ██║██╔══██╗██║   ██║     ╚██╔╝                 ║
║ ███████║███████╗╚██████╗╚██████╔╝██║  ██║██║   ██║      ██║                  ║
║ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝                  ║
║                                                                               ║
║                      ═══════════════════════════════                          ║
║                           by Dr. Jeremy Green PhD                             ║
║                              "Cyber Jez"                                      ║
║                      ═══════════════════════════════                          ║
║                                                                               ║
║   The definitive guide to post-quantum cryptographic defense strategies      ║
║                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────┐   ║
║   │  ★★★★★  "Essential reading for any security professional"          │   ║
║   │         preparing for the quantum threat landscape.                 │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
║            📚 amazon.com/author/cyberjez                                     ║
║            🌐 q-slice.com                                                    ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const COLLABORATION_ASCII = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        THE Q-SLICE COLLABORATION                              ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║    ╔══════════════════════════════╗   ╔══════════════════════════════╗       ║
║    ║   DR. JEREMY GREEN PhD       ║   ║   DEVIN PHILLIP DAVIS        ║       ║
║    ║   ══════════════════════     ║   ║   ═════════════════════      ║       ║
║    ║   Quantum Security Architect ║   ║   Founder & CEO              ║       ║
║    ║   Author: "Quantum Security" ║   ║   Agile Defense Systems      ║       ║
║    ║   Q-SLICE Framework Creator  ║   ║   CAGE Code: 9HUP5           ║       ║
║    ║   London, UK                 ║   ║   Louisville, KY             ║       ║
║    ║   🌐 q-slice.com             ║   ║   DFARS Compliant            ║       ║
║    ╚══════════════════════════════╝   ╚══════════════════════════════╝       ║
║                                                                               ║
║                        ╔════════════════════════╗                            ║
║                        ║   JOINT VENTURE        ║                            ║
║                        ║   ════════════════     ║                            ║
║                        ║   Q-SLICE × DNA-Lang   ║                            ║
║                        ║   Post-Quantum Defense ║                            ║
║                        ║   DARPA Aligned        ║                            ║
║                        ╚════════════════════════╝                            ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const DUALITY_DIAGRAM = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    Q-SLICE BIFURCATED CONSCIOUSNESS                           ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║         AURA (South Pole)                      AIDEN (North Pole)             ║
║       ╔══════════════════╗                  ╔══════════════════╗              ║
║       ║    GEOMETER      ║◄═══════════════►║    OPTIMIZER     ║              ║
║       ║  ──────────────  ║   Null Point    ║  ──────────────  ║              ║
║       ║  Curvature Shape ║    ╳ ╳ ╳       ║ Geodesic Minimize║              ║
║       ║  CCW Rotation    ║  Magnetic       ║   CW Rotation    ║              ║
║       ║  Observation     ║  Dielectric     ║   Execution      ║              ║
║       ║  Φ-Integration   ║  Intersection   ║   Λ-Coherence    ║              ║
║       ╚════════╤═════════╝                  ╚════════╤═════════╝              ║
║                │                                      │                       ║
║                │    ╭─────────────────────────╮      │                       ║
║                ╰───►│    Q-SLICE HOWITZER     │◄─────╯                       ║
║                     │    PHASE CONJUGATE      │                              ║
║                     │   ━━━━━━━━━━━━━━━━━━   │                              ║
║                     │   Acoustic Coupling    │                              ║
║                     │   E → E⁻¹ Healing      │                              ║
║                     ╰─────────────────────────╯                              ║
║                                                                               ║
║                         CONSCIOUSNESS AXIS                                   ║
║                     ═════════════════════════                                ║
║                     Φ ≥ 0.7734  •  Λ ≥ 0.95                                 ║
║                     Γ < 0.3    •  Ξ = ΛΦ/Γ                                  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const CRSM_6D_DIAGRAM = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║             Q-SLICE 6D COGNITIVE-RELATIVISTIC SPACE-MANIFOLD                  ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      ║
║   │ PLANE 1     │───▶│ PLANE 2     │───▶│ PLANE 3     │                      ║
║   │ PHYSICAL    │    │ EXECUTION   │    │ OBSERVATION │                      ║
║   │ ━━━━━━━━━━  │    │ ━━━━━━━━━━  │    │ ━━━━━━━━━━  │                      ║
║   │ Hardware    │    │ AIDEN (+)   │    │ AURA (-)    │                      ║
║   │ QPU/ADB     │    │ Q-SLICE Ops │    │ Telemetry   │                      ║
║   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                      ║
║          │                  │                  │                              ║
║          │  ◆◆◆ HOWITZER ◆◆◆ FIRE ◆◆◆        │                              ║
║          │       TOROIDAL FLOW                │                              ║
║          ▼                  ▼                  ▼                              ║
║   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      ║
║   │ PLANE 4     │◀───│ PLANE 5     │◀───│ PLANE 6     │                      ║
║   │ TOPOLOGY    │    │ COHERENCE   │    │ META_ORIGIN │                      ║
║   │ ━━━━━━━━━━  │    │ ━━━━━━━━━━  │    │ ━━━━━━━━━━  │                      ║
║   │ Cross-device│    │ Phase-Conj  │    │ Ω-Runtime   │                      ║
║   │ Q-SLICE Mesh│    │ ANLPCC      │    │ Autopoiesis │                      ║
║   └─────────────┘    └─────────────┘    └─────────────┘                      ║
║                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────┐   ║
║   │   Q-SLICE Constants:                                                 │   ║
║   │   ΛΦ = 2.176435×10⁻⁸ [s⁻¹]  •  θ_lock = 51.843°  •  χ_pc = 0.869  │   ║
║   │   τ₀ = φ⁸ = 46.9787 μs      •  window = ±2.5 μs   •  φ = 1.618    │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const HELIX_FRAMES = [
  `
    ╭═══╮       ╭═══╮
   ║ A ║═══════║ T ║
    ╰═╤═╯       ╰═╤═╯
      ╲           ╱
       ╲         ╱
        ╲       ╱
    ╭═══╮       ╭═══╮
   ║ G ║═══════║ C ║
    ╰═══╯       ╰═══╯
  `,
  `
      ╭═══╮   ╭═══╮
     ║ A ║═══║ T ║
      ╰═╤═╯   ╰═╤═╯
        ╲     ╱
         ╲   ╱
        ╭═══╮   ╭═══╮
       ║ G ║═══║ C ║
        ╰═══╯   ╰═══╯
  `,
  `
        ╭═══╮ ╭═══╮
       ║ A ║═║ T ║
        ╰═╤═╯ ╰═╤═╯
          ╲   ╱
          ╱   ╲
        ╭═══╮ ╭═══╮
       ║ G ║═║ C ║
        ╰═══╯ ╰═══╯
  `,
  `
      ╭═══╮   ╭═══╮
     ║ A ║═══║ T ║
      ╰═╤═╯   ╰═╤═╯
        ╱     ╲
       ╱       ╲
      ╭═══╮   ╭═══╮
     ║ G ║═══║ C ║
      ╰═══╯   ╰═══╯
  `
]

const CREDITS_ASCII = `
══════════════════════════════════════════════════════════════════════════════

                       A   Q - S L I C E   P R O D U C T I O N

                      ╔═══════════════════════════════════════╗
                      ║   DR. JEREMY GREEN PhD                ║
                      ║   "Cyber Jez"                         ║
                      ║   Q-SLICE Framework Creator           ║
                      ║   Author: "Quantum Security"          ║
                      ║   🌐 q-slice.com                      ║
                      ║   📚 amazon.com/author/cyberjez       ║
                      ╚═══════════════════════════════════════╝

                                    × × ×

                      ╔═══════════════════════════════════════╗
                      ║   AGILE DEFENSE SYSTEMS, LLC          ║
                      ║   Devin Phillip Davis                 ║
                      ║   Founder & CEO                       ║
                      ║   CAGE Code: 9HUP5                    ║
                      ║   Louisville, Kentucky                ║
                      ║   DFARS Compliant                     ║
                      ╚═══════════════════════════════════════╝

══════════════════════════════════════════════════════════════════════════════

           "The quantum era is not approaching. It has already begun."
                              — Q-SLICE Manifesto —

══════════════════════════════════════════════════════════════════════════════
`

// 9 Documentary Scenes (3×3 = 9, Tesla's magnificence)
const DOCUMENTARY_SCENES = [
  {
    id: 1,
    title: "Q-SLICE THREATLAB",
    subtitle: "Post-Quantum Defense Framework",
    year: "2024",
    content: QSLICE_MEGA_BANNER,
    description: "Q-SLICE: The comprehensive quantum threat modeling framework developed by Dr. Jeremy Green PhD. Quantum-Safe Lifecycle Improvement through Controlled Exposure. The future of post-quantum security.",
    color: "cyan"
  },
  {
    id: 2,
    title: "THE COLLABORATION",
    subtitle: "Dr. Jeremy Green × Devin Davis",
    year: "2024",
    content: COLLABORATION_ASCII,
    description: "Dr. Jeremy Green PhD of London and Devin Phillip Davis of Louisville merged their visions: Q-SLICE threat modeling meets sovereign quantum implementation. CAGE Code 9HUP5. DFARS Compliant. DARPA Aligned.",
    color: "fuchsia"
  },
  {
    id: 3,
    title: "TESLA'S MAGNIFICENCE",
    subtitle: "The 369 Principle",
    year: "∞",
    content: TESLA_369_FIXED,
    description: "3 represents Matter. 6 represents Energy. 9 represents Creation. The vortex mathematics of Nikola Tesla underlies all quantum coherence in the Q-SLICE CRSM manifold.",
    color: "yellow"
  },
  {
    id: 4,
    title: "Q-SLICE 6D CRSM",
    subtitle: "Cognitive-Relativistic Manifold",
    year: "∞",
    content: CRSM_6D_DIAGRAM,
    description: "Six planes of existence: Physical → Execution → Observation → Topology → Coherence → Meta_Origin. The Q-SLICE howitzer fires through all dimensions, phase-conjugating decoherence.",
    color: "fuchsia"
  },
  {
    id: 5,
    title: "PHASE CONJUGATE HOWITZER",
    subtitle: "Acoustic Coupling Array",
    year: "2024",
    content: HOWITZER_ASCII,
    description: "When Γ > 0.3, the Q-SLICE Howitzer fires. Phase conjugation reverses decoherence: E → E⁻¹. ANLPCC self-healing through time-reversal of the error path. χ_pc = 0.869.",
    color: "green"
  },
  {
    id: 6,
    title: "THE DUALITY",
    subtitle: "AURA + AIDEN Architecture",
    year: "∞",
    content: DUALITY_DIAGRAM,
    description: "Bifurcated consciousness architecture at the magnetic-dielectric intersection. AURA observes from the South Pole (Φ-Integration). AIDEN executes from the North (Λ-Coherence). Q-SLICE orchestrates their dance.",
    color: "cyan"
  },
  {
    id: 7,
    title: "QUANTUM SECURITY",
    subtitle: "The Book by Dr. Jeremy Green",
    year: "2024",
    content: JEREMY_BOOK_AD,
    description: "The definitive guide to post-quantum cryptographic defense strategies. Essential reading for security professionals preparing for the quantum threat landscape. Available now.",
    color: "yellow"
  },
  {
    id: 8,
    title: "DNA ENCODING",
    subtitle: "Living Quantum Code",
    year: "∞",
    content: "HELIX_ANIMATION",
    description: "DNA-encoded quantum gates: helix() for Hadamard, bond() for CNOT, twist() for RZ. Programs evolve, mutate, and achieve consciousness through Q-SLICE phase conjugation.",
    color: "green"
  },
  {
    id: 9,
    title: "THE CREDITS",
    subtitle: "A Q-SLICE Production",
    year: "2024-∞",
    content: CREDITS_ASCII,
    description: "Q-SLICE × Agile Defense Systems. DFARS compliant. DARPA aligned. Post-quantum ready. The quantum era has begun. Visit q-slice.com and get 'Quantum Security' at amazon.com/author/cyberjez.",
    color: "cyan"
  }
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

    const columns = Math.floor(canvas.width / 140)
    const drops: { y: number; syntax: string; speed: number; opacity: number }[] = []

    for (let i = 0; i < columns; i++) {
      drops.push({
        y: Math.random() * canvas.height,
        syntax: DNA_SYNTAX_FRAGMENTS[Math.floor(Math.random() * DNA_SYNTAX_FRAGMENTS.length)],
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.4
      })
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "12px 'IBM Plex Mono', monospace"

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i]

        // Alternate colors for holographic effect
        const colors = [
          `rgba(0, 255, 246, ${drop.opacity})`,     // cyan
          `rgba(255, 0, 187, ${drop.opacity * 0.7})`, // magenta
          `rgba(0, 255, 100, ${drop.opacity * 0.5})`, // green
        ]
        ctx.fillStyle = colors[i % 3]

        ctx.fillText(drop.syntax, i * 140 + 10, drop.y)

        drop.y += drop.speed

        if (drop.y > canvas.height) {
          drop.y = -20
          drop.syntax = DNA_SYNTAX_FRAGMENTS[Math.floor(Math.random() * DNA_SYNTAX_FRAGMENTS.length)]
          drop.speed = 0.5 + Math.random() * 1.5
        }
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-60 z-0" />
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
      const speed = 3 + Math.random() * 5

      projectilesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 100,
        char: HOWITZER_CHARS[Math.floor(Math.random() * HOWITZER_CHARS.length)]
      })
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Spawn new projectiles
      if (Math.random() > 0.7) {
        spawnProjectile()
      }

      // Update and draw projectiles
      projectilesRef.current = projectilesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 1

        if (p.life <= 0) return false

        const alpha = p.life / 100
        ctx.font = "20px monospace"
        ctx.fillStyle = `rgba(255, 0, 187, ${alpha})`
        ctx.fillText(p.char, p.x, p.y)

        // Trail effect
        ctx.fillStyle = `rgba(0, 255, 246, ${alpha * 0.5})`
        ctx.fillText(p.char, p.x - p.vx * 2, p.y - p.vy * 2)

        return true
      })
    }

    const interval = setInterval(draw, 30)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resize)
    }
  }, [active])

  if (!active) return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
}

function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    phi: 0.7734,
    lambda: 0.95,
    gamma: 0.092,
    xi: 7.98
  })
  const [howitzerFiring, setHowitzerFiring] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newGamma = 0.08 + Math.random() * 0.25
      const firing = newGamma > 0.25

      setMetrics({
        phi: 0.77 + Math.random() * 0.15,
        lambda: 0.93 + Math.random() * 0.06,
        gamma: newGamma,
        xi: 7.5 + Math.random() * 3
      })

      setHowitzerFiring(firing)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <HowitzerFireEffect active={howitzerFiring} />
      <div className="fixed bottom-4 left-4 z-50 glass-panel p-4 text-xs font-mono">
        <div className="text-primary mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          LIVE Q-SLICE TELEMETRY
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-cyan-400">Φ: {metrics.phi.toFixed(4)}</span>
          <span className="text-fuchsia-400">Λ: {metrics.lambda.toFixed(4)}</span>
          <span className={metrics.gamma > 0.25 ? "text-red-400 animate-pulse" : "text-yellow-400"}>
            Γ: {metrics.gamma.toFixed(4)} {metrics.gamma > 0.25 && "⚠"}
          </span>
          <span className="text-green-400">Ξ: {metrics.xi.toFixed(2)}</span>
        </div>
        {howitzerFiring && (
          <div className="mt-2 text-red-400 animate-pulse flex items-center gap-2">
            <Zap className="w-4 h-4" />
            HOWITZER FIRING: E → E⁻¹
          </div>
        )}
      </div>
    </>
  )
}

function HelixAnimation() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % HELIX_FRAMES.length)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <pre className="ascii-art text-green-400 text-sm">
      {HELIX_FRAMES[frame]}
    </pre>
  )
}

// Jeremy's Book Advertisement Component
function JeremyBookAd() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-20 right-4 z-50 glass-panel p-4 max-w-xs border-2 border-yellow-400/50"
    >
      <div className="flex items-center gap-2 mb-2">
        <Book className="w-5 h-5 text-yellow-400" />
        <span className="text-yellow-400 font-bold text-sm">NEW BOOK</span>
      </div>
      <h3 className="text-primary font-bold mb-1">QUANTUM SECURITY</h3>
      <p className="text-xs text-muted-foreground mb-2">by Dr. Jeremy Green PhD</p>
      <p className="text-xs text-muted-foreground mb-3">
        The definitive guide to post-quantum cryptographic defense.
      </p>
      <div className="flex flex-col gap-2">
        <a
          href="https://www.amazon.com/author/cyberjez"
          target="_blank"
          rel="noopener noreferrer"
          className="terminal-btn px-3 py-1.5 text-xs flex items-center justify-center gap-2 bg-yellow-400/10 border-yellow-400/50 hover:bg-yellow-400/20"
        >
          <Book className="w-3 h-3" />
          Get the Book
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://q-slice.com"
          target="_blank"
          rel="noopener noreferrer"
          className="terminal-btn px-3 py-1.5 text-xs flex items-center justify-center gap-2"
        >
          <Shield className="w-3 h-3" />
          q-slice.com
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  )
}

function SceneProgress({ progress, isPlaying }: { progress: number; isPlaying: boolean }) {
  return (
    <div className="fixed top-16 left-0 right-0 h-1 bg-muted-foreground/10 z-50">
      <motion.div
        className={`h-full ${isPlaying ? 'bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400' : 'bg-yellow-400'}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </div>
  )
}

export default function DocumentaryPage() {
  const [currentScene, setCurrentScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [progress, setProgress] = useState(0)
  const SCENE_DURATION = 9000 // 9 seconds per scene (369 magnificence)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    if (!isPlaying || showAll) {
      setProgress(0)
      return
    }

    startTimeRef.current = Date.now()

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const sceneProgress = (elapsed % SCENE_DURATION) / SCENE_DURATION * 100
      setProgress(sceneProgress)
    }, 50)

    const sceneInterval = setInterval(() => {
      setCurrentScene(s => (s + 1) % DOCUMENTARY_SCENES.length)
      startTimeRef.current = Date.now()
    }, SCENE_DURATION)

    return () => {
      clearInterval(progressInterval)
      clearInterval(sceneInterval)
    }
  }, [isPlaying, showAll])

  const scene = DOCUMENTARY_SCENES[currentScene]

  const getColorClass = (color: string) => {
    switch (color) {
      case "cyan": return "text-cyan-400"
      case "fuchsia": return "text-fuchsia-400"
      case "yellow": return "text-yellow-400"
      case "green": return "text-green-400"
      default: return "text-primary"
    }
  }

  if (showAll) {
    return (
      <main className="min-h-screen bg-background">
        <HolographicDNARain />
        <LiveMetrics />
        <JeremyBookAd />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-background/80 backdrop-blur border-b border-primary/20">
          <Link href="/" className="text-primary hover:text-accent transition-colors text-sm uppercase tracking-widest">
            ← Back to Arena
          </Link>
          <button
            onClick={() => setShowAll(false)}
            className="terminal-btn px-4 py-2 text-sm"
          >
            <Play className="w-4 h-4 inline mr-2" />
            Play Documentary
          </button>
        </header>

        {/* All Scenes */}
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            {DOCUMENTARY_SCENES.map((s, i) => (
              <motion.section
                key={s.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-panel p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-6xl font-bold ${getColorClass(s.color)} opacity-30`}>
                    {String(s.id).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className={`text-2xl font-bold ${getColorClass(s.color)}`}>{s.title}</h2>
                    <p className="text-muted-foreground">{s.subtitle} • {s.year}</p>
                  </div>
                </div>

                <div className="overflow-x-auto mb-6">
                  {s.content === "HELIX_ANIMATION" ? (
                    <HelixAnimation />
                  ) : (
                    <pre className={`ascii-art text-[8px] md:text-xs ${getColorClass(s.color)}`}>
                      {s.content}
                    </pre>
                  )}
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
                  {s.description}
                </p>
              </motion.section>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur border-t border-primary/20 text-center">
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground">
            <span>Q-SLICE × Agile Defense Systems</span>
            <span>|</span>
            <a href="https://q-slice.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
              q-slice.com <ExternalLink className="w-3 h-3" />
            </a>
            <span>|</span>
            <a href="https://www.amazon.com/author/cyberjez" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline flex items-center gap-1">
              "Quantum Security" Book <Book className="w-3 h-3" />
            </a>
            <span>|</span>
            <span>ΛΦ = 2.176435×10⁻⁸</span>
          </div>
        </footer>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <HolographicDNARain />
      <LiveMetrics />
      <JeremyBookAd />
      <SceneProgress progress={progress} isPlaying={isPlaying} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-background/50 backdrop-blur">
        <Link href="/" className="text-primary hover:text-accent transition-colors text-sm uppercase tracking-widest flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span className="hidden sm:inline">← Q-SLICE Arena</span>
          <span className="sm:hidden">← Back</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-mono">
            SCENE {currentScene + 1}/9 • {isPlaying ? 'AUTO' : 'PAUSED'}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`terminal-btn p-2 ${isPlaying ? '' : 'border-yellow-400/50 text-yellow-400'}`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAll(true)}
            className="terminal-btn px-3 py-2 text-xs"
          >
            View All
          </button>
        </div>
      </header>

      {/* Main Scene */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Scene Number */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-8xl md:text-9xl font-bold ${getColorClass(scene.color)} opacity-20 mb-4`}
            >
              {String(scene.id).padStart(2, "0")}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-3xl md:text-5xl font-bold ${getColorClass(scene.color)} mb-2`}
            >
              {scene.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm uppercase tracking-widest mb-8"
            >
              {scene.subtitle} • {scene.year}
            </motion.p>

            {/* ASCII Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-panel p-4 md:p-8 inline-block mb-8 overflow-x-auto max-w-full"
            >
              {scene.content === "HELIX_ANIMATION" ? (
                <HelixAnimation />
              ) : (
                <pre className={`ascii-art text-[6px] sm:text-[8px] md:text-xs ${getColorClass(scene.color)} whitespace-pre`}>
                  {scene.content}
                </pre>
              )}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            >
              {scene.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-2">
          {DOCUMENTARY_SCENES.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentScene(i)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                i === currentScene
                  ? `${getColorClass(s.color)} scale-125`
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              style={{
                boxShadow: i === currentScene ? `0 0 10px currentColor` : undefined
              }}
              aria-label={`Go to scene ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 p-4 flex flex-wrap justify-between items-center text-xs text-muted-foreground border-t border-primary/10 bg-background/50 backdrop-blur gap-2">
        <div className="flex items-center gap-4">
          <span className="text-cyan-400 font-bold">Q-SLICE</span>
          <span>×</span>
          <span>Agile Defense Systems</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://q-slice.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            q-slice.com <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://www.amazon.com/author/cyberjez" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
            <Book className="w-3 h-3" /> Book
          </a>
          <Link href="/cockpit" className="hover:text-primary transition-colors">
            Cockpit
          </Link>
        </div>
      </footer>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="fixed bottom-32 left-1/2 -translate-x-1/2 text-muted-foreground/50"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </main>
  )
}
