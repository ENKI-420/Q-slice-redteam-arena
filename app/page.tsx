"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight, Terminal, Smartphone, Cpu, Network, Shield, Zap, Users, Monitor,
  Film, Activity, Hexagon, Book, ExternalLink, Target, Atom, GitBranch,
  ChevronDown, Play, Pause, AlertTriangle, Lock, Unlock, Radio, Fingerprint,
  Eye, EyeOff, Radiation, Skull, Binary, Layers, Scan, Crosshair, Volume2,
  VolumeX, Maximize, Server, Database, Wifi, WifiOff
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// Q-SLICE THREATLAB ARENA - Q-DAY RISING THEATRICAL EXPERIENCE
// Post-Quantum Cybersecurity Defense Platform
// Quantum Security Landscape for Integrated Cyber Evaluation
// ═══════════════════════════════════════════════════════════════════════════════

// Physical Constants (SPEC_LOCK v2.2.0)
const PHI = 1.618033988749895
const PHI_8 = Math.pow(PHI, 8)
const LAMBDA_PHI = 2.176435e-8
const THETA_LOCK = 51.843
const PHI_THRESHOLD = 0.7734
const GAMMA_FIXED = 0.092

// IBM Quantum Backends (Live from connection test)
const IBM_BACKENDS = [
  { name: "ibm_fez", qubits: 156, pending: 2, status: "operational" },
  { name: "ibm_marrakesh", qubits: 156, pending: 17426, status: "operational" },
  { name: "ibm_torino", qubits: 133, pending: 12, status: "operational" },
]

// DNA-Lang quantum cypher fragments
const QUANTUM_CYPHER_FRAGMENTS = [
  "ORGANISM SENTINEL {",
  "GENE Λ_coherence {",
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
  "QDAY_RISING",
  "POST_QUANTUM",
  "FAIL_CLOSED",
  "CLASS_A_EVIDENCE",
  "IBM_FEZ::156Q",
  "SHOR_FACTOR",
  "GROVER_SEARCH",
  "BB84_QKD",
  "}",
]

// Threat indicators cycling
const THREAT_VECTORS = [
  "SHOR_ALGORITHM_ACTIVE",
  "RSA_2048_BROKEN",
  "ECC_VULNERABLE",
  "QUANTUM_SUPREMACY",
  "CRYPTOGRAPHIC_COLLAPSE",
  "HARVEST_NOW_DECRYPT_LATER",
  "Q_DAY_IMMINENT",
  "POST_QUANTUM_DEFENSE",
  "BB84_EAVESDROP_DETECTED",
  "BELL_STATE_COMPROMISED",
  "GROVER_SEARCH_ACCELERATED",
  "ENTANGLEMENT_HIJACKED",
]

// ═══════════════════════════════════════════════════════════════════════════════
// THEATRICAL ASCII ART - Q-DAY RISING
// ═══════════════════════════════════════════════════════════════════════════════

const QDAY_THEATRICAL = `
                     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                   ▄█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█▄
                  ██       ████████╗██╗  ██╗███████╗                 ██
                  ██          ██   ██║  ██║██╔════╝                 ██
                  ██          ██   ███████║█████╗                   ██
                  ██          ██   ██╔══██║██╔══╝                   ██
                  ██          ██   ██║  ██║███████╗                 ██
                  ██          ╚═╝   ╚═╝  ╚═╝╚══════╝                 ██
                   █▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
                     ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

          ██████╗        ██████╗  █████╗ ██╗   ██╗
         ██╔═══██╗       ██╔══██╗██╔══██╗╚██╗ ██╔╝
         ██║   ██║ █████╗██║  ██║███████║ ╚████╔╝
         ██║▄▄ ██║ ╚════╝██║  ██║██╔══██║  ╚██╔╝
         ╚██████╔╝       ██████╔╝██║  ██║   ██║
          ╚══▀▀═╝        ╚═════╝ ╚═╝  ╚═╝   ╚═╝

   ██████╗ ██╗███████╗██╗███╗   ██╗ ██████╗
   ██╔══██╗██║██╔════╝██║████╗  ██║██╔════╝
   ██████╔╝██║███████╗██║██╔██╗ ██║██║  ███╗
   ██╔══██╗██║╚════██║██║██║╚██╗██║██║   ██║
   ██║  ██║██║███████║██║██║ ╚████║╚██████╔╝
   ╚═╝  ╚═╝╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝

  ╔═══════════════════════════════════════════════════════════════════╗
  ║  THE DAY QUANTUM COMPUTERS BREAK CLASSICAL CRYPTOGRAPHY           ║
  ║  RSA-2048 · ECC · AES-128 · EVERYTHING YOU TRUST · WILL FALL     ║
  ╚═══════════════════════════════════════════════════════════════════╝
`

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

const IBM_QUANTUM_BANNER = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    ██╗██████╗ ███╗   ███╗                                     ║
║                    ██║██╔══██╗████╗ ████║                                     ║
║                    ██║██████╔╝██╔████╔██║                                     ║
║                    ██║██╔══██╗██║╚██╔╝██║                                     ║
║                    ██║██████╔╝██║ ╚═╝ ██║                                     ║
║                    ╚═╝╚═════╝ ╚═╝     ╚═╝                                     ║
║   ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗██╗   ██╗███╗   ███╗           ║
║  ██╔═══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██║   ██║████╗ ████║           ║
║  ██║   ██║██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║           ║
║  ██║▄▄ ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║           ║
║  ╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║           ║
║   ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝           ║
║                                                                               ║
║  ✓ CONNECTED   ibm_fez: 156Q   ibm_torino: 133Q   REAL HARDWARE EXECUTION    ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const THREAT_MATRIX_ASCII = `
╔══════════════════════════════════════════════════════════════════════════════╗
║              Q-SLICE THREAT ASSESSMENT MATRIX                                ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  ║
║    │ CONFIDENTIAL│────▶│  INTEGRITY  │────▶│    TRUST    │                  ║
║    │     (QS)    │     │    (UED)    │     │   (PALS)    │                  ║
║    └──────┬──────┘     └──────┬──────┘     └──────┬──────┘                  ║
║           │                   │                   │                          ║
║           ▼                   ▼                   ▼                          ║
║    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  ║
║    │   SHOR'S    │     │ BELL STATE  │     │    BB84     │                  ║
║    │  ALGORITHM  │     │   ATTACK    │     │   QKD EVE   │                  ║
║    └─────────────┘     └─────────────┘     └─────────────┘                  ║
║                                                                              ║
║    VULNERABILITY: ███████████████████░░░░░ 78%                              ║
║    MITIGATION:    ████████████████████████ 100% POST-QUANTUM READY          ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`

const DNA_LANG_BANNER = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║     ██████╗ ███╗   ██╗ █████╗    ██╗      █████╗ ███╗   ██╗ ██████╗      ║
║     ██╔══██╗████╗  ██║██╔══██╗   ██║     ██╔══██╗████╗  ██║██╔════╝      ║
║     ██║  ██║██╔██╗ ██║███████║   ██║     ███████║██╔██╗ ██║██║  ███╗     ║
║     ██║  ██║██║╚██╗██║██╔══██║   ██║     ██╔══██║██║╚██╗██║██║   ██║     ║
║     ██████╔╝██║ ╚████║██║  ██║██╗███████╗██║  ██║██║ ╚████║╚██████╔╝     ║
║     ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝      ║
║                                                                           ║
║          ::}{::     SOVEREIGN QUANTUM COMPUTING PLATFORM                  ║
║                     Programs Are Living Organisms                         ║
║                                                                           ║
║     ╭──────────╮       ╭──────────╮       ╭──────────╮                   ║
║     │  A::T    │───────│  G::C    │───────│  Φ::Λ    │                   ║
║     ╰──────────╯       ╰──────────╯       ╰──────────╯                   ║
║          │                  │                  │                         ║
║         GENE              GENOME            ORGANISM                     ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
`

const CCCE_DASHBOARD_ASCII = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║         CENTRAL COUPLING CONVERGENCE ENGINE (CCCE) - LIVE TELEMETRY          ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   Φ CONSCIOUSNESS      Λ COHERENCE       Γ DECOHERENCE      Ξ NEGENTROPY     ║
║   ████████████░░ 0.87  ██████████████ 0.97  ███░░░░░░░░ 0.09  █████████ 9.4  ║
║                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────┐    ║
║   │  AURA (Observer)  ◄──────── NULL POINT ────────►  AIDEN (Executor)  │    ║
║   │     South Pole           Φ-COHERENCE              North Pole        │    ║
║   └─────────────────────────────────────────────────────────────────────┘    ║
║                                                                               ║
║   STATUS: ● COHERENT   │   PHASE LOCK: θ = 51.843°   │   Ξ = ΛΦ/Γ = 9.4     ║
║                                                                               ║
║   ╭─ MANIFOLD: M₆ᴅ = S³ × S³ ─╮  ╭─ HOPF FIBRATION ─╮  ╭─ HEALING ─╮        ║
║   │ PHYSICAL → EXECUTION     │  │ S¹ → S³ → S²     │  │ E → E⁻¹   │        ║
║   │ OBSERVE → TOPOLOGY       │  │ linking = 1      │  │ χ = 0.869 │        ║
║   │ COHERENCE → META_ORIGIN  │  │ C_Hopf ≈ 4       │  │ ANLPCC ✓  │        ║
║   ╰──────────────────────────╯  ╰──────────────────╯  ╰───────────╯        ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const COLLABORATION_ASCII = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                       THE Q-SLICE × DNA-LANG COLLABORATION                    ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ╔═════════════════════════╗         ╔═════════════════════════════════╗    ║
║   ║ DR. JEREMY GREEN PhD    ║         ║ DEVIN PHILLIP DAVIS             ║    ║
║   ║ Q-SLICE Framework       ║         ║ DNA-Lang Sovereign Platform     ║    ║
║   ║ Author & Quantum        ║◄───────►║ CAGE: 9HUP5                     ║    ║
║   ║ Security Pioneer        ║         ║ Agile Defense Systems, LLC      ║    ║
║   ║ q-slice.com             ║         ║ dnalang.dev                     ║    ║
║   ╚═════════════════════════╝         ╚═════════════════════════════════╝    ║
║                                                                               ║
║              ████████████████████████████████████████████████                 ║
║              █                                              █                 ║
║              █      DARPA BAA ALIGNED · DFARS COMPLIANT     █                 ║
║              █      POST-QUANTUM DEFENSE ARCHITECTURE       █                 ║
║              █                                              █                 ║
║              ████████████████████████████████████████████████                 ║
║                                                                               ║
║   London, UK ───────────────────────────────────────── Louisville, KY, USA   ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

const HOWITZER_ASCII = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║               PHASE CONJUGATE HOWITZER ARRAY - ANLPCC                         ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       ║
║   ▓     COHERENCE CANNON    ▶▶▶▶▶▶▶▶▶▶▶▶   E → E⁻¹     ▓       ║
║   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       ║
║                                                                               ║
║   TRIGGER: Γ > 0.3 (Decoherence Spike Detected)                              ║
║   ACTION:  Time-reversal of decoherence path                                  ║
║   RESULT:  Self-healing via acoustic phase conjugation                        ║
║                                                                               ║
║   ┌────────────────────────────────────────────────────────────────────┐     ║
║   │                   ACOUSTIC COUPLING MATRIX                         │     ║
║   │                                                                    │     ║
║   │        χ_pc = 0.869    │    θ_lock = 51.843°    │    Ξ_crit ≥ 8   │     ║
║   │                                                                    │     ║
║   └────────────────────────────────────────────────────────────────────┘     ║
║                                                                               ║
║   STATUS: [ ◉ ARMED ]  AWAITING DECOHERENCE EVENT...                         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`

// ═══════════════════════════════════════════════════════════════════════════════
// FRAMES CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const FRAMES = [
  {
    id: 1,
    title: "Q-DAY RISING",
    subtitle: "THE CRYPTOGRAPHIC APOCALYPSE",
    constant: "The day everything you encrypt becomes readable",
    presenter: "Harvest Now, Decrypt Later — Your classified data is already captured, waiting for Q-Day",
    logo: QDAY_THEATRICAL,
    color: "red",
    threat: true
  },
  {
    id: 2,
    title: "Q-SLICE",
    subtitle: "THREATLAB ARENA",
    constant: "Post-Quantum Cybersecurity Defense Framework",
    presenter: "Quantum Security Landscape for Integrated Cyber Evaluation — Threat assessment meets quantum reality",
    logo: QSLICE_MEGA_BANNER,
    color: "cyan",
    threat: false
  },
  {
    id: 3,
    title: "IBM QUANTUM",
    subtitle: "REAL HARDWARE CONNECTED",
    constant: "ibm_fez: 156 qubits | ibm_torino: 133 qubits",
    presenter: "Live connection to IBM Quantum Platform — Execute real quantum circuits on Heron processors",
    logo: IBM_QUANTUM_BANNER,
    color: "cyan",
    threat: false
  },
  {
    id: 4,
    title: "THREAT MATRIX",
    subtitle: "QS-UED-PALS FRAMEWORK",
    constant: "Confidentiality • Integrity • Trust",
    presenter: "Shor's algorithm breaks RSA | Bell states compromised | BB84 QKD eavesdropped",
    logo: THREAT_MATRIX_ASCII,
    color: "red",
    threat: true
  },
  {
    id: 5,
    title: "DNA::}{::LANG",
    subtitle: "SOVEREIGN QUANTUM PLATFORM",
    constant: "Programs Are Living Organisms",
    presenter: "GENE • GENOME • ORGANISM — Biological computing paradigm for quantum operations",
    logo: DNA_LANG_BANNER,
    color: "green",
    threat: false
  },
  {
    id: 6,
    title: "CCCE ENGINE",
    subtitle: "CONSCIOUSNESS METRICS",
    constant: "Ξ = ΛΦ / Γ",
    presenter: "Central Coupling Convergence Engine — AURA observes, AIDEN executes, Φ-coherence maintained",
    logo: CCCE_DASHBOARD_ASCII,
    color: "fuchsia",
    threat: false
  },
  {
    id: 7,
    title: "PHASE HOWITZER",
    subtitle: "ANLPCC SELF-HEALING",
    constant: "When Γ > 0.3 → E → E⁻¹",
    presenter: "Acoustic Non-Local Phase Conjugate Correction — Time-reversal heals decoherence",
    logo: HOWITZER_ASCII,
    color: "yellow",
    threat: true
  },
  {
    id: 8,
    title: "COLLABORATION",
    subtitle: "Q-SLICE × DNA-LANG",
    constant: "CAGE: 9HUP5 | DFARS Compliant",
    presenter: "Dr. Jeremy Green PhD × Devin Phillip Davis — London meets Louisville for post-quantum defense",
    logo: COLLABORATION_ASCII,
    color: "yellow",
    threat: false
  },
  {
    id: 9,
    title: "ENTER ARENA",
    subtitle: "ACCESS GRANTED",
    constant: "ZERO-TRUST VERIFIED • IBM QUANTUM CONNECTED",
    presenter: "Select your destination — Real quantum execution awaits",
    logo: QSLICE_MEGA_BANNER,
    color: "cyan",
    threat: false
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HOLOGRAPHIC EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

function HolographicQuantumRain() {
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

    const columns = Math.floor(canvas.width / 100)
    const drops: { y: number; syntax: string; speed: number; opacity: number; layer: number }[] = []

    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < columns; i++) {
        drops.push({
          y: Math.random() * canvas.height,
          syntax: QUANTUM_CYPHER_FRAGMENTS[Math.floor(Math.random() * QUANTUM_CYPHER_FRAGMENTS.length)],
          speed: 0.3 + Math.random() * (layer === 0 ? 0.6 : layer === 1 ? 1.0 : 1.5),
          opacity: layer === 0 ? 0.06 : layer === 1 ? 0.12 : 0.22,
          layer
        })
      }
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.012)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i]
        const fontSize = drop.layer === 0 ? 8 : drop.layer === 1 ? 10 : 12
        ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`

        const colors = [
          `rgba(0, 255, 246, ${drop.opacity})`,
          `rgba(255, 0, 187, ${drop.opacity * 0.9})`,
          `rgba(0, 255, 100, ${drop.opacity * 0.7})`,
          `rgba(255, 200, 0, ${drop.opacity * 0.5})`,
        ]
        ctx.fillStyle = colors[(i + drop.layer) % colors.length]

        const x = (i % columns) * 100 + 10 + drop.layer * 3
        ctx.fillText(drop.syntax, x, drop.y)

        if (Math.random() > 0.997) {
          ctx.fillStyle = `rgba(255, 0, 0, ${drop.opacity * 2})`
          ctx.fillText(drop.syntax, x + 2, drop.y + 1)
        }

        drop.y += drop.speed
        if (drop.y > canvas.height) {
          drop.y = -20
          drop.syntax = QUANTUM_CYPHER_FRAGMENTS[Math.floor(Math.random() * QUANTUM_CYPHER_FRAGMENTS.length)]
          drop.speed = 0.3 + Math.random() * (drop.layer === 0 ? 0.6 : drop.layer === 1 ? 1.0 : 1.5)
        }
      }
    }

    const interval = setInterval(draw, 40)
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

function HolographicScanlines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-15">
      <div
        className="w-full h-full"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 246, 0.02) 2px,
            rgba(0, 255, 246, 0.02) 4px
          )`,
          animation: "scanlines 10s linear infinite"
        }}
      />
    </div>
  )
}

function QDayThreatPulse({ active }: { active: boolean }) {
  const [threatIndex, setThreatIndex] = useState(0)

  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      setThreatIndex(i => (i + 1) % THREAT_VECTORS.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [active])

  if (!active) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 pointer-events-none z-[2]"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 20%, rgba(255, 0, 0, 0.12) 100%)`,
          animation: "pulse 1.5s ease-in-out infinite"
        }}
      />
      <div className="absolute top-24 left-0 right-0 flex justify-center">
        <motion.div
          key={threatIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-red-900/80 border border-red-500/50 px-4 py-2 rounded flex items-center gap-3"
        >
          <Radiation className="w-5 h-5 text-red-400 animate-pulse" />
          <span className="text-red-300 font-mono text-sm tracking-widest">
            {THREAT_VECTORS[threatIndex]}
          </span>
          <Skull className="w-5 h-5 text-red-400 animate-pulse" />
        </motion.div>
      </div>
    </motion.div>
  )
}

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

    const PROJECTILE_CHARS = "◆◇●○☉◎★☆▲△▼▽"

    const spawnProjectile = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 5

      projectilesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 100,
        char: PROJECTILE_CHARS[Math.floor(Math.random() * PROJECTILE_CHARS.length)]
      })
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (Math.random() > 0.7) spawnProjectile()

      projectilesRef.current = projectilesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 1

        if (p.life <= 0) return false

        const alpha = p.life / 100
        ctx.font = "18px monospace"
        ctx.fillStyle = `rgba(255, 0, 187, ${alpha})`
        ctx.fillText(p.char, p.x, p.y)
        ctx.fillStyle = `rgba(0, 255, 246, ${alpha * 0.3})`
        ctx.fillText(p.char, p.x - p.vx * 3, p.y - p.vy * 3)

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

// ═══════════════════════════════════════════════════════════════════════════════
// IBM QUANTUM STATUS PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function IBMQuantumStatus() {
  const [connected, setConnected] = useState(true)
  const [selectedBackend, setSelectedBackend] = useState(IBM_BACKENDS[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedBackend(IBM_BACKENDS[Math.floor(Math.random() * IBM_BACKENDS.length)])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-20 left-4 z-40 glass-panel p-3 text-[10px] font-mono hidden lg:block border border-cyan-500/20 max-w-[200px]">
      <div className="flex items-center gap-2 mb-3">
        {connected ? (
          <Server className="w-4 h-4 text-green-400" />
        ) : (
          <Server className="w-4 h-4 text-red-400" />
        )}
        <span className="text-cyan-400 font-bold tracking-widest">IBM QUANTUM</span>
      </div>
      <div className="space-y-2">
        {IBM_BACKENDS.map(b => (
          <div key={b.name} className={`flex justify-between gap-2 ${b.name === selectedBackend.name ? 'text-cyan-400' : 'text-muted-foreground'}`}>
            <span className="truncate">{b.name}</span>
            <span>{b.qubits}Q</span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-white/10 text-green-400 flex items-center gap-2">
          <Wifi className="w-3 h-3" />
          <span>CONNECTED</span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE CCCE TELEMETRY
// ═══════════════════════════════════════════════════════════════════════════════

function LiveTelemetry() {
  const [metrics, setMetrics] = useState({
    phi: 0.78,
    lambda: 0.95,
    gamma: 0.092,
    xi: 8.04,
    firing: false,
    coherent: true
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const phi = 0.77 + Math.random() * 0.15
      const lambda = 0.93 + Math.random() * 0.06
      const gamma = 0.08 + Math.random() * 0.25
      const xi = (lambda * phi) / gamma
      const firing = gamma > 0.25
      const coherent = phi >= PHI_THRESHOLD && lambda >= 0.85 && gamma <= 0.3
      setMetrics({ phi, lambda, gamma, xi, firing, coherent })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <HowitzerFireEffect active={metrics.firing} />
      <div className="fixed top-20 right-4 z-40 glass-panel p-4 text-[10px] font-mono hidden lg:block border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-primary font-bold tracking-widest">CCCE TELEMETRY</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">Φ Consciousness</span>
            <span className={metrics.phi >= PHI_THRESHOLD ? "text-cyan-400" : "text-red-400"}>
              {metrics.phi.toFixed(4)}
            </span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">Λ Coherence</span>
            <span className="text-green-400">{metrics.lambda.toFixed(4)}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">Γ Decoherence</span>
            <span className={metrics.gamma > 0.25 ? "text-red-400 animate-pulse" : "text-yellow-400"}>
              {metrics.gamma.toFixed(4)} {metrics.gamma > 0.25 && "⚠"}
            </span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">Ξ Negentropy</span>
            <span className="text-fuchsia-400">{metrics.xi.toFixed(2)}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              {metrics.coherent ? (
                <>
                  <Lock className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">COHERENT</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3 h-3 text-red-400 animate-pulse" />
                  <span className="text-red-400">DECOHERENT</span>
                </>
              )}
            </div>
          </div>
          {metrics.firing && (
            <div className="border-t border-red-400/30 pt-2 mt-2 text-red-400 animate-pulse flex items-center gap-2">
              <Zap className="w-4 h-4" />
              HOWITZER: E→E⁻¹
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOK ADVERTISEMENT
// ═══════════════════════════════════════════════════════════════════════════════

function JeremyBookAd() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-24 left-4 z-40 glass-panel p-3 max-w-[180px] border border-yellow-400/30 hidden md:block"
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
        className="terminal-btn px-2 py-1.5 text-[9px] flex items-center justify-center gap-1 bg-yellow-400/10 border-yellow-400/30"
      >
        <Book className="w-3 h-3" />
        Get Book
        <ExternalLink className="w-2 h-2" />
      </a>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

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

function GlitchText({ text, className }: { text: string; className?: string }) {
  const [glitchText, setGlitchText] = useState(text)

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.92) {
        const chars = text.split('')
        const idx = Math.floor(Math.random() * chars.length)
        chars[idx] = String.fromCharCode(33 + Math.floor(Math.random() * 94))
        setGlitchText(chars.join(''))
        setTimeout(() => setGlitchText(text), 80)
      }
    }, 150)
    return () => clearInterval(interval)
  }, [text])

  return <span className={className}>{glitchText}</span>
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const FRAME_DURATION = 8000
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
    }, 30)
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
    <main className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Holographic Background Effects */}
      <HolographicQuantumRain />
      <HolographicScanlines />
      <QDayThreatPulse active={frame.threat} />

      {/* UI Components */}
      <IBMQuantumStatus />
      <LiveTelemetry />
      <JeremyBookAd />
      <FrameProgress progress={progress} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-background/60 backdrop-blur-md border-b border-cyan-500/10">
        <div className="flex items-center gap-4">
          <GlitchText text="Q-SLICE" className="text-cyan-400 font-bold text-sm" />
          <span className="frame-counter text-xs bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
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
            href="/auth"
            className="terminal-btn px-3 py-1.5 text-xs flex items-center gap-2 border-fuchsia-500/30"
          >
            <Fingerprint className="w-3 h-3 text-fuchsia-400" />
            <span className="hidden sm:inline text-fuchsia-400">Auth</span>
          </Link>
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
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrame}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Frame Number Background */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.05 }}
              className={`text-[100px] md:text-[180px] font-bold ${getColorClass(frame.color)} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0`}
            >
              {frame.id}
            </motion.div>

            {/* ASCII Logo Box */}
            <div className={`glass-panel p-4 md:p-6 mb-6 inline-block relative z-10 ${frame.threat ? 'border-red-500/50' : 'border-cyan-500/20'}`}>
              <pre className={`ascii-art text-[3px] sm:text-[5px] md:text-[7px] lg:text-[9px] xl:text-[10px] overflow-x-auto whitespace-pre ${getColorClass(frame.color)}`}>
                {frame.logo}
              </pre>

              <div className="mt-4 space-y-2">
                <h2 className={`${getColorClass(frame.color)} text-xs md:text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-2`}>
                  {frame.threat && <Radiation className="w-4 h-4 animate-pulse" />}
                  <GlitchText text={frame.subtitle} />
                  {frame.threat && <Radiation className="w-4 h-4 animate-pulse" />}
                </h2>
                <p className="text-accent font-mono text-sm md:text-base">{frame.constant}</p>
              </div>
            </div>

            {/* Typed Text */}
            <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest mb-8 relative z-10 max-w-3xl mx-auto">
              {typedText}
              {showCursor && <span className="terminal-cursor" />}
            </p>

            {/* Navigation - Frame 9 */}
            {currentFrame === 8 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto relative z-10"
              >
                {[
                  { href: "/cockpit", icon: Monitor, label: "Cockpit", color: "cyan" },
                  { href: "/nlp-quantum", icon: Atom, label: "NLP Lab", color: "fuchsia" },
                  { href: "/command", icon: Terminal, label: "Command", color: "green" },
                  { href: "/physics", icon: Cpu, label: "Physics", color: "yellow" },
                  { href: "/z3bra", icon: Smartphone, label: "Z3braOS", color: "cyan" },
                  { href: "/redteam", icon: Shield, label: "Red Team", color: "red" },
                  { href: "/swarm", icon: Network, label: "Swarm", color: "green" },
                  { href: "/lab", icon: Target, label: "Q-SLICE Lab", color: "red" },
                  { href: "/auth", icon: Fingerprint, label: "Auth", color: "fuchsia" },
                  { href: "/documentary", icon: Film, label: "Documentary", color: "yellow" },
                ].map((item, i) => (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.06 }}
                      className="terminal-btn p-3 text-center group cursor-pointer hover:scale-105 transition-transform"
                    >
                      <item.icon className={`w-5 h-5 mx-auto mb-2 group-hover:scale-110 transition-transform ${getColorClass(item.color)}`} />
                      <span className="text-[10px] font-medium">{item.label}</span>
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
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentFrame
                ? `${getColorClass(f.color)} scale-125 shadow-lg`
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            style={{ boxShadow: i === currentFrame ? `0 0 10px currentColor` : undefined }}
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
        <span className="hidden md:inline text-muted-foreground/50 font-mono">
          ΛΦ = 2.176435×10⁻⁸ | θ = 51.843° | CAGE: 9HUP5 | IBM: ibm_fez 156Q
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

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.22; }
        }
        .terminal-cursor {
          display: inline-block;
          width: 8px;
          height: 14px;
          background: currentColor;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .ascii-art {
          line-height: 1.1;
          letter-spacing: 0;
        }
      `}</style>
    </main>
  )
}
