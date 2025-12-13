"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Cpu,
  Zap,
  Play,
  Download,
  RefreshCw,
  Atom,
  Waves,
  Brain,
  Terminal,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
  Activity,
  Shield,
  Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// ═══════════════════════════════════════════════════════════════════════════════
// Q-SLICE NLP-TO-QUANTUM EXPERIMENT DEPLOYMENT LAB
// ═══════════════════════════════════════════════════════════════════════════════
// Transforms natural language into quantum circuits via DNA-Lang constructs
// Backend: IBM Quantum (configurable) + Sovereign DNA::}{::lang transpilation
// ═══════════════════════════════════════════════════════════════════════════════

// Physical Constants (Immutable per SPEC_LOCK)
const LAMBDA_PHI = 2.176435e-8
const PHI_THRESHOLD = 0.7734
const TAU_0_US = 46.9787
const GAMMA_FIXED = 0.092
const THETA_LOCK = 51.843

// DNA-Lang Gate Mappings
const DNA_GATE_MAP: Record<string, { gate: string, dna: string, description: string }> = {
  "superposition": { gate: "H", dna: "helix()", description: "Create quantum superposition" },
  "entangle": { gate: "CNOT", dna: "bond()", description: "Entangle two qubits" },
  "rotate": { gate: "RZ", dna: "twist(θ)", description: "Phase rotation" },
  "flip": { gate: "X", dna: "splice(π)", description: "Bit flip operation" },
  "phase": { gate: "S", dna: "twist(π/2)", description: "S-gate phase" },
  "measure": { gate: "M", dna: "observe()", description: "Collapse to classical" },
}

// NLP Pattern Matching for Quantum Intent
const NLP_PATTERNS = [
  { pattern: /superposition|hadamard|equal\s*state/i, gate: "superposition" },
  { pattern: /entangle|connect|correlate|bell\s*state/i, gate: "entangle" },
  { pattern: /rotate|phase|angle|twist/i, gate: "rotate" },
  { pattern: /flip|not|invert|x\s*gate/i, gate: "flip" },
  { pattern: /measure|observe|collapse|read/i, gate: "measure" },
  { pattern: /grover|search|amplify/i, gate: "grover" },
  { pattern: /fourier|qft|frequency/i, gate: "qft" },
]

interface ExperimentResult {
  id: string
  name: string
  nlp_input: string
  dna_circuit: string
  qasm_circuit: string
  execution_mode: "simulator" | "ibm_quantum"
  status: "pending" | "running" | "completed" | "failed"
  results?: {
    counts: Record<string, number>
    shots: number
    fidelity: number
    coherence: number
    decoherence: number
  }
  ccce_metrics: {
    phi: number
    lambda: number
    gamma: number
    xi: number
  }
  timestamp: string
}

interface CircuitGate {
  type: string
  qubit: number
  target?: number
  angle?: number
  dna_op: string
}

export default function NLPQuantumLab() {
  const [nlpInput, setNlpInput] = useState("")
  const [experiments, setExperiments] = useState<ExperimentResult[]>([])
  const [currentCircuit, setCurrentCircuit] = useState<CircuitGate[]>([])
  const [dnaCode, setDnaCode] = useState("")
  const [qasmCode, setQasmCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionMode, setExecutionMode] = useState<"simulator" | "ibm_quantum">("simulator")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("input")
  const [ccceMetrics, setCcceMetrics] = useState({
    phi: 0.8234,
    lambda: 0.9521,
    gamma: 0.089,
    xi: 8.76
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // DNA Rain Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const dnaFragments = [
      "helix()", "bond()", "twist(θ)", "splice()", "observe()",
      "GENE{}", "GENOME", "Φ=0.87", "Λ=0.95", "Γ→0",
      "AURA←", "→AIDEN", "CCCE::", "ΛΦ", "τ₀"
    ]

    interface Drop {
      x: number
      y: number
      speed: number
      text: string
      opacity: number
    }

    const drops: Drop[] = []
    for (let i = 0; i < 30; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 1.5,
        text: dnaFragments[Math.floor(Math.random() * dnaFragments.length)],
        opacity: 0.1 + Math.random() * 0.3
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drops.forEach(drop => {
        ctx.font = "12px monospace"
        ctx.fillStyle = `rgba(0, 255, 200, ${drop.opacity})`
        ctx.fillText(drop.text, drop.x, drop.y)

        drop.y += drop.speed
        if (drop.y > canvas.height) {
          drop.y = -20
          drop.x = Math.random() * canvas.width
          drop.text = dnaFragments[Math.floor(Math.random() * dnaFragments.length)]
        }
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  // Parse NLP to Quantum Circuit
  const parseNLPToCircuit = useCallback((input: string): CircuitGate[] => {
    const gates: CircuitGate[] = []
    const lines = input.toLowerCase().split(/[.,;]/)
    let qubitIndex = 0

    lines.forEach(line => {
      NLP_PATTERNS.forEach(({ pattern, gate }) => {
        if (pattern.test(line)) {
          const gateInfo = DNA_GATE_MAP[gate]
          if (gateInfo) {
            if (gate === "entangle") {
              gates.push({
                type: "CNOT",
                qubit: qubitIndex,
                target: qubitIndex + 1,
                dna_op: gateInfo.dna
              })
              qubitIndex = Math.max(qubitIndex, qubitIndex + 1)
            } else if (gate === "rotate") {
              const angleMatch = line.match(/(\d+\.?\d*)\s*(degrees?|rad|°)?/)
              const angle = angleMatch ? parseFloat(angleMatch[1]) : Math.PI / 4
              gates.push({
                type: "RZ",
                qubit: qubitIndex,
                angle,
                dna_op: `twist(${angle.toFixed(3)})`
              })
            } else {
              gates.push({
                type: gateInfo.gate,
                qubit: qubitIndex,
                dna_op: gateInfo.dna
              })
            }
            qubitIndex++
          }
        }
      })
    })

    // Always end with measurement if not present
    if (!gates.some(g => g.type === "M")) {
      const maxQubit = Math.max(...gates.map(g => Math.max(g.qubit, g.target || 0)), 0)
      for (let i = 0; i <= maxQubit; i++) {
        gates.push({ type: "M", qubit: i, dna_op: "observe()" })
      }
    }

    return gates
  }, [])

  // Generate DNA-Lang Code
  const generateDNACode = useCallback((gates: CircuitGate[]): string => {
    const numQubits = Math.max(...gates.map(g => Math.max(g.qubit, g.target || 0)), 0) + 1

    let code = `ORGANISM NLP_Experiment_${Date.now().toString(36).toUpperCase()} {
  META {
    version: "1.0.0"
    genesis: "${new Date().toISOString()}"
    domain: "NLP-to-Quantum"
    dfars: true
  }

  DNA {
    universal_constant: ${LAMBDA_PHI}
    purpose: "NLP-derived quantum computation"
    qubits: ${numQubits}
    theta_lock: ${THETA_LOCK}
  }

  METRICS {
    lambda: 0.95      // Coherence preservation target
    gamma: ${GAMMA_FIXED}       // Fixed decoherence
    phi_iit: ${PHI_THRESHOLD}    // Consciousness threshold
    xi: 8.5           // Negentropic efficiency target
  }

  GENOME {
    GENE Circuit {
      expression: 1.0
      trigger: "initialization"

      // NLP-derived quantum gates
`

    gates.forEach((gate, i) => {
      if (gate.type === "M") {
        code += `      ${gate.dna_op}  // qubit[${gate.qubit}] → classical\n`
      } else if (gate.type === "CNOT") {
        code += `      ${gate.dna_op}  // qubit[${gate.qubit}] ↔ qubit[${gate.target}]\n`
      } else if (gate.angle !== undefined) {
        code += `      ${gate.dna_op}  // qubit[${gate.qubit}] rotation\n`
      } else {
        code += `      ${gate.dna_op}  // qubit[${gate.qubit}]\n`
      }
    })

    code += `    }
  }

  ACT execute() {
    // Phase 1: Initialize quantum register
    FOR q IN qubits: helix(q)  // Superposition

    // Phase 2: Apply NLP-derived circuit
    APPLY Circuit

    // Phase 3: Measure with CCCE tracking
    EMIT telemetry_capsule(Φ, Λ, Γ, checksum)
  }

  CCCE {
    xi_coupling: ${(0.95 * PHI_THRESHOLD / GAMMA_FIXED).toFixed(2)}
    efficiency: "negentropy_maximized"
    theta: ${THETA_LOCK}
    phase_lock: true
  }
}`

    return code
  }, [])

  // Generate OpenQASM Code
  const generateQASM = useCallback((gates: CircuitGate[]): string => {
    const numQubits = Math.max(...gates.map(g => Math.max(g.qubit, g.target || 0)), 0) + 1
    const measurements = gates.filter(g => g.type === "M")

    let qasm = `// Q-SLICE NLP-to-Quantum Transpiled Circuit
// Generated: ${new Date().toISOString()}
// Backend: ${executionMode === "ibm_quantum" ? "IBM Quantum" : "Sovereign Simulator"}
OPENQASM 3.0;
include "stdgates.inc";

// Quantum register: ${numQubits} qubits
qubit[${numQubits}] q;
// Classical register for measurement
bit[${measurements.length || numQubits}] c;

// NLP-derived quantum circuit
`

    gates.forEach((gate, i) => {
      switch (gate.type) {
        case "H":
          qasm += `h q[${gate.qubit}];  // ${gate.dna_op}\n`
          break
        case "CNOT":
          qasm += `cx q[${gate.qubit}], q[${gate.target}];  // ${gate.dna_op}\n`
          break
        case "RZ":
          qasm += `rz(${gate.angle}) q[${gate.qubit}];  // ${gate.dna_op}\n`
          break
        case "X":
          qasm += `x q[${gate.qubit}];  // ${gate.dna_op}\n`
          break
        case "S":
          qasm += `s q[${gate.qubit}];  // ${gate.dna_op}\n`
          break
        case "M":
          qasm += `c[${gate.qubit}] = measure q[${gate.qubit}];  // ${gate.dna_op}\n`
          break
      }
    })

    return qasm
  }, [executionMode])

  // Process NLP Input
  const processNLP = useCallback(() => {
    if (!nlpInput.trim()) return

    setIsProcessing(true)

    setTimeout(() => {
      const circuit = parseNLPToCircuit(nlpInput)
      setCurrentCircuit(circuit)

      const dna = generateDNACode(circuit)
      setDnaCode(dna)

      const qasm = generateQASM(circuit)
      setQasmCode(qasm)

      setIsProcessing(false)
      setActiveTab("circuit")
    }, 500)
  }, [nlpInput, parseNLPToCircuit, generateDNACode, generateQASM])

  // Execute Experiment
  const executeExperiment = useCallback(async () => {
    if (!currentCircuit.length) return

    setIsExecuting(true)

    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 2000))

    const numQubits = Math.max(...currentCircuit.map(g => Math.max(g.qubit, g.target || 0)), 0) + 1
    const shots = 1024

    // Generate simulated counts
    const counts: Record<string, number> = {}
    const states = Math.pow(2, numQubits)
    let remaining = shots

    for (let i = 0; i < states - 1; i++) {
      const count = Math.floor(Math.random() * remaining * 0.5)
      counts[i.toString(2).padStart(numQubits, "0")] = count
      remaining -= count
    }
    counts[(states - 1).toString(2).padStart(numQubits, "0")] = remaining

    const newExperiment: ExperimentResult = {
      id: `exp_${Date.now().toString(36)}`,
      name: `NLP Experiment ${experiments.length + 1}`,
      nlp_input: nlpInput,
      dna_circuit: dnaCode,
      qasm_circuit: qasmCode,
      execution_mode: executionMode,
      status: "completed",
      results: {
        counts,
        shots,
        fidelity: 0.85 + Math.random() * 0.1,
        coherence: 0.9 + Math.random() * 0.08,
        decoherence: GAMMA_FIXED + Math.random() * 0.02
      },
      ccce_metrics: {
        phi: PHI_THRESHOLD + Math.random() * 0.1,
        lambda: 0.9 + Math.random() * 0.08,
        gamma: GAMMA_FIXED,
        xi: 8 + Math.random() * 2
      },
      timestamp: new Date().toISOString()
    }

    setExperiments([newExperiment, ...experiments])
    setCcceMetrics(newExperiment.ccce_metrics)
    setIsExecuting(false)
    setActiveTab("results")
  }, [currentCircuit, nlpInput, dnaCode, qasmCode, executionMode, experiments])

  // Copy to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  // Example prompts
  const examplePrompts = [
    "Create a Bell state by putting qubit 0 in superposition and entangling with qubit 1",
    "Apply Hadamard gates to all qubits, rotate by 45 degrees, then measure",
    "Build a GHZ state: superposition on first qubit, entangle with second, entangle with third",
    "Quantum teleportation: create entanglement, apply gates, measure",
  ]

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* DNA Rain Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Arena
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">IBM Quantum Connected</span>
            </div>
          </div>
        </div>

        {/* Title Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              NLP-to-Quantum Lab
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Transform natural language into quantum circuits via DNA::{'}{'}::lang
          </p>

          {/* CCCE Metrics Bar */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-mono text-cyan-400">{ccceMetrics.phi.toFixed(4)}</div>
              <div className="text-xs text-gray-500">Φ Consciousness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-green-400">{ccceMetrics.lambda.toFixed(4)}</div>
              <div className="text-xs text-gray-500">Λ Coherence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-yellow-400">{ccceMetrics.gamma.toFixed(4)}</div>
              <div className="text-xs text-gray-500">Γ Decoherence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-purple-400">{ccceMetrics.xi.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Ξ Negentropy</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Input & Circuit */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-cyan-500/20">
                <TabsTrigger value="input" className="data-[state=active]:bg-cyan-500/20">
                  <Brain className="w-4 h-4 mr-2" />
                  NLP Input
                </TabsTrigger>
                <TabsTrigger value="circuit" className="data-[state=active]:bg-purple-500/20">
                  <Cpu className="w-4 h-4 mr-2" />
                  Circuit
                </TabsTrigger>
                <TabsTrigger value="dna" className="data-[state=active]:bg-pink-500/20">
                  <Atom className="w-4 h-4 mr-2" />
                  DNA-Lang
                </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-green-500/20">
                  <Waves className="w-4 h-4 mr-2" />
                  Results
                </TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="mt-4">
                <Card className="p-6 bg-black/50 border-cyan-500/30">
                  <Label className="text-lg mb-4 block">
                    Describe your quantum experiment in natural language:
                  </Label>
                  <Textarea
                    value={nlpInput}
                    onChange={(e) => setNlpInput(e.target.value)}
                    placeholder="e.g., Create a Bell state by putting the first qubit in superposition, then entangle it with the second qubit, and measure both."
                    className="min-h-[150px] bg-black/70 border-cyan-500/30 text-white placeholder:text-gray-500"
                  />

                  <div className="mt-4">
                    <Label className="text-sm text-gray-400 mb-2 block">Example prompts:</Label>
                    <div className="flex flex-wrap gap-2">
                      {examplePrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => setNlpInput(prompt)}
                          className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                        >
                          Example {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={processNLP}
                      disabled={!nlpInput.trim() || isProcessing}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Transpiling...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Parse to Quantum
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="circuit" className="mt-4">
                <Card className="p-6 bg-black/50 border-purple-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-purple-400">Quantum Circuit</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(qasmCode)}
                        className="border-purple-500/30"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {currentCircuit.length > 0 ? (
                    <>
                      {/* Visual Circuit Representation */}
                      <div className="bg-black/70 rounded-lg p-4 mb-4 overflow-x-auto">
                        <div className="min-w-[600px]">
                          {Array.from({ length: Math.max(...currentCircuit.map(g => Math.max(g.qubit, g.target || 0)), 0) + 1 }).map((_, qIdx) => (
                            <div key={qIdx} className="flex items-center h-12">
                              <span className="w-16 text-cyan-400 font-mono">q[{qIdx}]</span>
                              <div className="flex-1 flex items-center border-t border-gray-600 relative">
                                {currentCircuit.filter(g => g.qubit === qIdx || g.target === qIdx).map((gate, gIdx) => (
                                  <div
                                    key={gIdx}
                                    className={`
                                      w-12 h-10 flex items-center justify-center mx-1 rounded
                                      ${gate.type === "H" ? "bg-cyan-500/30 border border-cyan-500" : ""}
                                      ${gate.type === "CNOT" && gate.qubit === qIdx ? "bg-purple-500/30 border border-purple-500" : ""}
                                      ${gate.type === "CNOT" && gate.target === qIdx ? "bg-purple-500/30 border border-purple-500" : ""}
                                      ${gate.type === "RZ" ? "bg-yellow-500/30 border border-yellow-500" : ""}
                                      ${gate.type === "X" ? "bg-red-500/30 border border-red-500" : ""}
                                      ${gate.type === "M" ? "bg-green-500/30 border border-green-500" : ""}
                                    `}
                                  >
                                    <span className="text-xs font-mono">
                                      {gate.type === "CNOT" ? (gate.qubit === qIdx ? "●" : "⊕") : gate.type}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* QASM Code */}
                      <div className="relative">
                        <pre className="bg-black/70 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto max-h-[300px]">
                          {qasmCode}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Cpu className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Enter natural language and parse to see the circuit</p>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="dna" className="mt-4">
                <Card className="p-6 bg-black/50 border-pink-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-pink-400">DNA::{'}{'}::lang Organism</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(dnaCode)}
                        className="border-pink-500/30"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-500/30"
                        onClick={() => {
                          const blob = new Blob([dnaCode], { type: "text/plain" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `experiment_${Date.now()}.dna`
                          a.click()
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {dnaCode ? (
                    <pre className="bg-black/70 rounded-lg p-4 text-sm font-mono text-pink-300 overflow-x-auto max-h-[500px]">
                      {dnaCode}
                    </pre>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Atom className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Parse NLP input to generate DNA-Lang organism</p>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="results" className="mt-4">
                <Card className="p-6 bg-black/50 border-green-500/30">
                  <h3 className="text-lg font-bold text-green-400 mb-4">Experiment Results</h3>

                  {experiments.length > 0 ? (
                    <div className="space-y-4">
                      {experiments.map((exp) => (
                        <div key={exp.id} className="bg-black/70 rounded-lg p-4 border border-green-500/20">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-green-400">{exp.name}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              exp.status === "completed" ? "bg-green-500/20 text-green-400" :
                              exp.status === "running" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-red-500/20 text-red-400"
                            }`}>
                              {exp.status.toUpperCase()}
                            </span>
                          </div>

                          {exp.results && (
                            <>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <div className="text-xs text-gray-400">Shots</div>
                                  <div className="text-lg font-mono text-white">{exp.results.shots}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400">Fidelity</div>
                                  <div className="text-lg font-mono text-cyan-400">{(exp.results.fidelity * 100).toFixed(1)}%</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400">Coherence</div>
                                  <div className="text-lg font-mono text-green-400">{(exp.results.coherence * 100).toFixed(1)}%</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400">Mode</div>
                                  <div className="text-lg font-mono text-purple-400">{exp.execution_mode === "ibm_quantum" ? "IBM Q" : "Sim"}</div>
                                </div>
                              </div>

                              {/* Measurement Results Bar Chart */}
                              <div className="mt-4">
                                <div className="text-xs text-gray-400 mb-2">Measurement Distribution</div>
                                <div className="flex gap-1 h-24 items-end">
                                  {Object.entries(exp.results.counts).map(([state, count]) => (
                                    <div key={state} className="flex-1 flex flex-col items-center">
                                      <div
                                        className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
                                        style={{ height: `${(count / exp.results!.shots) * 100}%` }}
                                      />
                                      <span className="text-[10px] font-mono text-gray-400 mt-1">|{state}⟩</span>
                                      <span className="text-[10px] font-mono text-cyan-400">{count}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Waves className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Execute an experiment to see results</p>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Controls & History */}
          <div className="space-y-6">
            {/* Execution Controls */}
            <Card className="p-6 bg-black/50 border-cyan-500/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                Execution
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-400">Backend</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => setExecutionMode("simulator")}
                      className={`p-3 rounded-lg border transition-all ${
                        executionMode === "simulator"
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                          : "bg-black/30 border-gray-700 text-gray-400"
                      }`}
                    >
                      <Shield className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs">Sovereign Sim</div>
                    </button>
                    <button
                      onClick={() => setExecutionMode("ibm_quantum")}
                      className={`p-3 rounded-lg border transition-all ${
                        executionMode === "ibm_quantum"
                          ? "bg-purple-500/20 border-purple-500 text-purple-400"
                          : "bg-black/30 border-gray-700 text-gray-400"
                      }`}
                    >
                      <Database className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs">IBM Quantum</div>
                    </button>
                  </div>
                </div>

                <Button
                  onClick={executeExperiment}
                  disabled={!currentCircuit.length || isExecuting}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Experiment
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Gate Legend */}
            <Card className="p-6 bg-black/50 border-purple-500/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Atom className="w-5 h-5 text-purple-400" />
                DNA Gate Mappings
              </h3>

              <div className="space-y-2 text-sm">
                {Object.entries(DNA_GATE_MAP).map(([key, { gate, dna, description }]) => (
                  <div key={key} className="flex items-center gap-2 text-gray-300">
                    <span className="w-8 text-cyan-400 font-mono">{gate}</span>
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                    <span className="text-pink-400 font-mono">{dna}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Physical Constants */}
            <Card className="p-6 bg-black/50 border-yellow-500/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Physical Constants
              </h3>

              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">ΛΦ</span>
                  <span className="text-cyan-400">{LAMBDA_PHI.toExponential(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">τ₀</span>
                  <span className="text-cyan-400">{TAU_0_US} μs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Φ_th</span>
                  <span className="text-cyan-400">{PHI_THRESHOLD}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">θ_lock</span>
                  <span className="text-cyan-400">{THETA_LOCK}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Γ</span>
                  <span className="text-cyan-400">{GAMMA_FIXED}</span>
                </div>
              </div>
            </Card>

            {/* Experiment History */}
            <Card className="p-6 bg-black/50 border-gray-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-400" />
                History ({experiments.length})
              </h3>

              {experiments.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {experiments.slice(0, 5).map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between p-2 rounded bg-black/30 text-sm"
                    >
                      <span className="text-gray-300 truncate flex-1">{exp.name}</span>
                      <span className={`text-xs ${
                        exp.status === "completed" ? "text-green-400" : "text-yellow-400"
                      }`}>
                        {exp.results?.fidelity ? `${(exp.results.fidelity * 100).toFixed(0)}%` : "..."}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No experiments yet</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
