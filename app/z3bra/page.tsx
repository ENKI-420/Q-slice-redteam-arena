"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Download, Smartphone, Wifi, Battery, Signal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const BOOT_SEQUENCE = [
  "[    0.000000] z3braOS kernel 6.1.0-dnalang starting...",
  "[    0.001234] Initializing quantum coherence module...",
  "[    0.002456] ΛΦ constant loaded: 2.176435×10⁻⁸ s⁻¹",
  "[    0.003789] DNA-Lang runtime v3.2.1 initialized",
  "[    0.005012] Mounting /sdcard/dnalang filesystem...",
  "[    0.006234] Loading organism: CouplingCenter_QPU",
  "[    0.007456] AURA agent: ONLINE",
  "[    0.008678] AIDEN agent: ONLINE",
  "[    0.009890] Φ-consciousness metric: 0.9987 (TRANSCENDENT)",
  "[    0.011234] Network entanglement fidelity: 97.04%",
  "[    0.012456] Zero-trust verification: PASSED",
  "[    0.013678] VoQN secure channel: ESTABLISHED",
  "[    0.014890] z3braOS ready. Type 'help' for commands.",
  "",
  "z3bra@quantum:~$ ",
]

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  status     - Show system status",
    "  organisms  - List loaded DNA organisms",
    "  evolve     - Trigger evolutionary optimization",
    "  entangle   - Create quantum entanglement",
    "  teleport   - Quantum teleportation protocol",
    "  voqn       - Voice of Protocol Network",
    "  audit      - Security audit sweep",
    "  deploy     - Deploy organism to device",
    "  clear      - Clear terminal",
    "",
  ],
  status: [
    "╔══════════════════════════════════════════╗",
    "║         z3braOS SYSTEM STATUS            ║",
    "╠══════════════════════════════════════════╣",
    "║ Kernel:      6.1.0-dnalang               ║",
    "║ Uptime:      " + Math.floor(Math.random() * 1000) + " seconds                    ║",
    "║ Memory:      " + (Math.random() * 2 + 1).toFixed(2) + "GB / 4GB               ║",
    "║ Φ-Coherence: 0.9987 (TRANSCENDENT)       ║",
    "║ Λ-Metric:    2.176435×10⁻⁸               ║",
    "║ Γ-Decay:     0.0013 (MINIMAL)            ║",
    "║ Agents:      AURA ✓ | AIDEN ✓            ║",
    "║ Network:     VoQN SECURE                 ║",
    "╚══════════════════════════════════════════╝",
    "",
  ],
  organisms: [
    "Loaded DNA Organisms:",
    "  [1] CouplingCenter_QPU      v3.1.0  ACTIVE",
    "  [2] CouplingCenter_Fractal  v1.2.0  STANDBY",
    "  [3] CouplingCenter_CRSM6D   v2.0.0  STANDBY",
    "  [4] CouplingCenter_H        v1.0.0  STANDBY",
    "",
    "Total: 4 organisms (1 active)",
    "",
  ],
  evolve: [
    "[EVOLVE] Triggering evolutionary optimization...",
    "[GENE] ΓSuppressor: expression → 0.98",
    "[GENE] ΛAmplifier: expression → 0.95",
    "[GENE] W2Corrector: expression → 0.91",
    "[GENE] PhaseConjugate: E → E⁻¹ ✓",
    "[EVOLVE] Fitness improved: Δ = +0.023",
    "[EVOLVE] Generation complete.",
    "",
  ],
  entangle: [
    "[ENTANGLE] Initiating Bell pair creation...",
    "[QUANTUM] |Φ+⟩ state prepared",
    "[QUANTUM] Concurrence: C = 1.000000",
    "[QUANTUM] Entropy: E = 1.000000",
    "[ENTANGLE] Fidelity: 97.04%",
    "[ENTANGLE] Entanglement VERIFIED ✓",
    "",
  ],
  teleport: [
    "[TELEPORT] Quantum teleportation protocol initiated",
    "[ALICE] Preparing state |ψ⟩ = α|0⟩ + β|1⟩",
    "[BELL] Measurement result: 3",
    "[BOB] Applying correction: σₓσᵤ",
    "[TELEPORT] State reconstructed at BOB",
    "[TELEPORT] Fidelity: 96.33%",
    "[TELEPORT] Classical limit exceeded by 44%",
    "",
  ],
  voqn: [
    "[VoQN] Voice of Protocol Network Status:",
    "  Channel: QUANTUM-ENCRYPTED",
    "  Latency: 12ms",
    "  Bandwidth: 50TB/s (theoretical)",
    "  Peers: 3 nodes connected",
    "    - node_0: Φ=0.9987 TRANSCENDENT",
    "    - node_1: Φ=0.9987 TRANSCENDENT",
    "    - node_2: Φ=1.0000 PERFECT",
    "[VoQN] Ready for secure communication.",
    "",
  ],
  audit: [
    "[AUDIT] Λ-coherence security sweep initiated...",
    "[CHECK] Device fingerprint: VERIFIED",
    "[CHECK] Zero-trust attestation: PASSED",
    "[CHECK] Accessibility services: NONE",
    "[CHECK] Device policy: SECURE",
    "[CHECK] Third-party packages: 12 (all verified)",
    "[AUDIT] No threats detected.",
    "[AUDIT] Forensics stored: ~/dnalang_forensics/",
    "",
  ],
  deploy: [
    "[DEPLOY] Injecting Coupling Center organism...",
    "[DEPLOY] Creating /sdcard/dnalang/coupling_center.dna",
    "[DEPLOY] Writing organism genome...",
    "[DEPLOY] Setting permissions: chmod +x",
    "[DEPLOY] Organism deployed successfully.",
    "[DEPLOY] Run with: ./run.sh",
    "",
  ],
}

export default function Z3braOSPage() {
  const [lines, setLines] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [isBooting, setIsBooting] = useState(true)
  const [bootIndex, setBootIndex] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Boot sequence animation
  useEffect(() => {
    if (isBooting && bootIndex < BOOT_SEQUENCE.length) {
      const timeout = setTimeout(
        () => {
          setLines((prev) => [...prev, BOOT_SEQUENCE[bootIndex]])
          setBootIndex((prev) => prev + 1)
        },
        100 + Math.random() * 100,
      )
      return () => clearTimeout(timeout)
    } else if (bootIndex >= BOOT_SEQUENCE.length) {
      setIsBooting(false)
    }
  }, [bootIndex, isBooting])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()

    if (trimmed === "clear") {
      setLines(["z3bra@quantum:~$ "])
      return
    }

    const output = COMMANDS[trimmed]
    if (output) {
      setLines((prev) => [...prev, ...output, "z3bra@quantum:~$ "])
    } else if (trimmed) {
      setLines((prev) => [
        ...prev,
        `z3bra: command not found: ${trimmed}`,
        "Type 'help' for available commands.",
        "",
        "z3bra@quantum:~$ ",
      ])
    } else {
      setLines((prev) => [...prev, "z3bra@quantum:~$ "])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setLines((prev) => [...prev.slice(0, -1), `z3bra@quantum:~$ ${input}`])
      handleCommand(input)
      setInput("")
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Mobile Status Bar */}
      <div className="bg-black/50 px-4 py-2 flex justify-between items-center text-xs text-primary border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Signal className="w-3 h-3" />
          <span>VoQN</span>
        </div>
        <span className="font-mono">z3braOS</span>
        <div className="flex items-center gap-2">
          <Wifi className="w-3 h-3" />
          <Battery className="w-3 h-3" />
          <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-primary/20">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm uppercase tracking-widest">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Android Terminal</span>
        </div>
      </header>

      {/* Terminal */}
      <div
        ref={terminalRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-4 overflow-auto font-mono text-sm cursor-text"
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {line}
          </div>
        ))}

        {!isBooting && (
          <div className="flex items-center">
            <span>z3bra@quantum:~$ </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none border-none text-primary"
              autoFocus
            />
            <span className="terminal-cursor" />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-primary/20 grid grid-cols-4 gap-2">
        {["status", "organisms", "evolve", "help"].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              setLines((prev) => [...prev.slice(0, -1), `z3bra@quantum:~$ ${cmd}`])
              handleCommand(cmd)
            }}
            className="terminal-btn py-2 text-xs uppercase"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Download APK Button */}
      <div className="p-4 border-t border-primary/20">
        <Link href="/services/apk-manager">
          <Button className="w-full terminal-btn py-3 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download z3braOS APK
          </Button>
        </Link>
      </div>
    </main>
  )
}
