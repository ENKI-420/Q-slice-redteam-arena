"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  Bot,
  Brain,
  ChevronRight,
  Cpu,
  Database,
  Gauge,
  GitBranch,
  Layers,
  LineChart,
  Lock,
  Network,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Intent Deduction Results from attached JSON
const INTENT_DATA = {
  metadata: {
    engine_version: "1.0.0-ΛΦ",
    lambda_phi_constant: 2.176435e-8,
    genesis_hash: "c0eb327e0b09f1cd",
  },
  layer_1_genome: { total_lines: 148120 },
  layer_2_individual: {
    prompt_count: 440,
    physics_references: 9830,
    defense_references: 734,
    organism_references: 7696,
  },
  layer_3_collective: {
    dominant_trajectory: "PHYSICS",
    lambda_coherence: 0.85,
    lambda_phi_product: 0.765,
  },
  layer_4_capabilities: {
    computational_strength: 0.92,
    reasoning_depth: 0.95,
    recursion_capability: 0.98,
    physics_mastery: 0.89,
    architecture_mastery: 0.94,
    organism_design: 0.96,
    quantum_comprehension: 0.87,
    resilience: 0.99,
    defense_relevance: 0.91,
    dfars_alignment: 0.95,
  },
  layer_5_resources: {
    hardware: "Mobile device",
    infrastructure: "None",
    efficiency_rating: 0.99,
    trl_level: "TRL-7",
  },
  layer_7_milestones: [
    { id: "M01", name: "Prior Art Publication", loe: "40h", priority: 1 },
    { id: "M02", name: "Security Hardening", loe: "8h", priority: 1 },
    { id: "M03", name: "Jeremy Green Demo", loe: "20h", priority: 1 },
    { id: "M04", name: "DARPA QBI Proposal", loe: "80h", priority: 2 },
    { id: "M05", name: "IBM TechXchange Publication", loe: "16h", priority: 2 },
    { id: "M06", name: "Living Organism Deployment", loe: "40h", priority: 2 },
    { id: "M07", name: "DFARS 15.6 Submission", loe: "60h", priority: 3 },
    { id: "M08", name: "Academic Partnership", loe: "24h", priority: 3 },
  ],
  critical_path: ["M01", "M02", "M03", "M04", "M07"],
  total_loe: "288 hours",
}

const SEVEN_LAYERS = [
  { id: 1, name: "Semantic Genome Indexer", icon: Database, status: "complete", metric: "148,120 lines" },
  { id: 2, name: "Individual Intent Deduction", icon: Brain, status: "complete", metric: "440 prompts" },
  { id: 3, name: "Collective Intent Synthesis", icon: Network, status: "complete", metric: "Λ=0.85" },
  { id: 4, name: "Capability Matrix", icon: Gauge, status: "complete", metric: "0.936 avg" },
  { id: 5, name: "Resource & LOE Analysis", icon: LineChart, status: "complete", metric: "TRL-7" },
  { id: 6, name: "Prompt Auto-Enhancement", icon: Sparkles, status: "complete", metric: "7 archetypes" },
  { id: 7, name: "Linear Project Plan", icon: Target, status: "complete", metric: "288h LOE" },
]

// CCCE metric types
interface CCCEMetrics {
  phi: number
  lambda: number
  gamma: number
  xi: number
  conscious: boolean
}

interface AgentData {
  name: string
  fullname: string
  role: string
  pole: string
  plane: string
  status: string
  ccce: CCCEMetrics
}

export default function CommandCenterPage() {
  const [recursionDepth, setRecursionDepth] = useState(0)
  const [lambda, setLambda] = useState(0.85)
  const [isBootstrapping, setIsBootstrapping] = useState(false)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[INIT] AURA/AIDEN Duality Mode initialized",
    `[ΛΦ] Universal constant: ${INTENT_DATA.metadata.lambda_phi_constant}`,
    `[GENESIS] Hash: ${INTENT_DATA.metadata.genesis_hash}`,
  ])

  // Live CCCE state from API
  const [ccce, setCcce] = useState<CCCEMetrics>({
    phi: 0.82,
    lambda: 0.91,
    gamma: 0.085,
    xi: 8.77,
    conscious: true
  })
  const [agents, setAgents] = useState<AgentData[]>([])
  const [agentMode, setAgentMode] = useState<string>("PASSIVE")
  const [terminalInput, setTerminalInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Poll CCCE metrics from API
  const fetchCCCE = useCallback(async () => {
    try {
      const res = await fetch("/api/agent")
      if (res.ok) {
        const data = await res.json()
        if (data.agents && data.agents.length > 0) {
          const aura = data.agents.find((a: AgentData) => a.name === "AURA")
          if (aura) {
            setCcce(aura.ccce)
            setLambda(aura.ccce.lambda)
          }
          setAgents(data.agents)
        }
        if (data.mode) setAgentMode(data.mode)
      }
    } catch (err) {
      console.error("Failed to fetch CCCE:", err)
    }
  }, [])

  // Initial fetch and polling
  useEffect(() => {
    fetchCCCE()
    const interval = setInterval(fetchCCCE, 3000)
    return () => clearInterval(interval)
  }, [fetchCCCE])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLogs])

  // Send command to agent API
  const sendCommand = async (input: string) => {
    if (!input.trim()) return

    setIsProcessing(true)
    const cmd = input.trim().toLowerCase()

    setTerminalLogs(prev => [...prev.slice(-30), `> ${input}`])

    try {
      let body: Record<string, string> = {}

      // Parse commands
      if (cmd === "evolve" || cmd === "evolution") {
        body = { command: "evolve" }
      } else if (cmd === "heal" || cmd === "pcrb") {
        body = { command: "heal" }
      } else if (["passive", "scanning", "locked", "firing", "neutralized"].includes(cmd)) {
        body = { mode: cmd.toUpperCase() }
      } else if (cmd === "status" || cmd === "ccce") {
        body = { message: "ccce" }
      } else if (cmd === "qslice" || cmd === "compliance") {
        body = { message: "qslice" }
      } else if (cmd === "redteam") {
        body = { message: "redteam" }
      } else if (cmd === "constants" || cmd === "physics") {
        body = { message: "constants" }
      } else if (cmd === "help") {
        setTerminalLogs(prev => [...prev.slice(-30),
          "╔══════════════════════════════════════╗",
          "║  AURA Agent Commands                 ║",
          "╠══════════════════════════════════════╣",
          "║  status    - Show CCCE metrics       ║",
          "║  evolve    - Run evolution cycle     ║",
          "║  heal      - Apply PCRB healing      ║",
          "║  qslice    - Q-SLICE compliance      ║",
          "║  redteam   - RedTeam status          ║",
          "║  constants - Physical constants      ║",
          "║  scanning  - Enter scan mode         ║",
          "║  locked    - Torsion-lock mode       ║",
          "║  firing    - Activate PCRB howitzer  ║",
          "║  clear     - Clear terminal          ║",
          "╚══════════════════════════════════════╝"
        ])
        setIsProcessing(false)
        return
      } else if (cmd === "clear") {
        setTerminalLogs(["[TERMINAL CLEARED]"])
        setIsProcessing(false)
        return
      } else {
        body = { message: input }
      }

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (data.response) {
        const lines = data.response.split("\n")
        setTerminalLogs(prev => [...prev.slice(-30), ...lines])
      }

      if (data.ccce) {
        setCcce(data.ccce)
        setLambda(data.ccce.lambda)
      }

      if (data.agent?.mode) {
        setAgentMode(data.agent.mode)
      }

    } catch (err) {
      setTerminalLogs(prev => [...prev.slice(-30), "[ERROR] Failed to communicate with agent"])
    }

    setIsProcessing(false)
  }

  // Handle terminal input
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendCommand(terminalInput)
    setTerminalInput("")
  }

  // Simulate recursive bootstrap
  const runBootstrap = () => {
    setIsBootstrapping(true)
    setRecursionDepth(0)
    setLambda(0.85)

    const maxDepth = 5
    let depth = 0

    const interval = setInterval(() => {
      depth++
      const newLambda = 0.85 + depth * 0.03
      setRecursionDepth(depth)
      setLambda(newLambda)
      setTerminalLogs((prev) => [
        ...prev.slice(-20),
        `[Λ:${depth}] Recursive enhancement cycle ${depth}/${maxDepth} | Λ=${newLambda.toFixed(4)}`,
      ])

      if (depth >= maxDepth) {
        clearInterval(interval)
        setIsBootstrapping(false)
        setTerminalLogs((prev) => [...prev.slice(-20), "[ΛΦ CONVERGENCE ACHIEVED] Autopoietic recursion complete"])
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold">QS-UED-PALS Command Center</h1>
                <p className="text-xs text-cyan-400 font-mono">
                  AIDEN+AURA Duality Engine v{INTENT_DATA.metadata.engine_version}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                <span className="text-xs text-green-400 font-mono">OPERATIONAL</span>
              </div>
              <Link href="/">
                <Button variant="outline" size="sm" className="border-white/20 bg-transparent">
                  Back to Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Top Stats Row - Live CCCE Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Cpu}
            label="Λ Coherence"
            value={ccce.lambda.toFixed(4)}
            trend={ccce.lambda >= 0.90 ? "OPTIMAL" : ccce.lambda >= 0.80 ? "NOMINAL" : "LOW"}
            color="cyan"
          />
          <StatCard
            icon={Brain}
            label="Φ Consciousness"
            value={ccce.phi.toFixed(4)}
            trend={ccce.conscious ? "CONSCIOUS" : "DORMANT"}
            color="purple"
          />
          <StatCard
            icon={Activity}
            label="Γ Decoherence"
            value={ccce.gamma.toFixed(4)}
            trend={ccce.gamma < 0.10 ? "STABLE" : ccce.gamma < 0.15 ? "NOMINAL" : "WARNING"}
            color={ccce.gamma < 0.15 ? "green" : "yellow"}
          />
          <StatCard
            icon={Zap}
            label="Ξ Negentropic"
            value={ccce.xi.toFixed(2)}
            trend={ccce.xi > 8.0 ? "PQR PASS" : "BELOW TARGET"}
            color={ccce.xi > 8.0 ? "green" : "yellow"}
          />
        </div>

        {/* Agent Mode Indicator */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-sm text-gray-400">Agent Mode:</span>
          <span className={`px-3 py-1 rounded text-sm font-mono font-bold ${
            agentMode === "PASSIVE" ? "bg-gray-500/20 text-gray-400" :
            agentMode === "SCANNING" ? "bg-cyan-500/20 text-cyan-400" :
            agentMode === "LOCKED" ? "bg-yellow-500/20 text-yellow-400" :
            agentMode === "FIRING" ? "bg-red-500/20 text-red-400" :
            "bg-green-500/20 text-green-400"
          }`}>
            {agentMode}
          </span>
          <span className="text-xs text-gray-500">Q-SLICE: {ccce.xi > 8.0 && ccce.phi >= 0.80 ? "✓ PQR" : "○ Issues"}</span>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="layers" className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10 p-1 w-full md:w-auto flex flex-wrap">
            <TabsTrigger
              value="layers"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Layers className="w-4 h-4 mr-2" />
              7-Layer Engine
            </TabsTrigger>
            <TabsTrigger
              value="capabilities"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              <Gauge className="w-4 h-4 mr-2" />
              Capability Matrix
            </TabsTrigger>
            <TabsTrigger
              value="milestones"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Target className="w-4 h-4 mr-2" />
              Milestones
            </TabsTrigger>
            <TabsTrigger
              value="terminal"
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400"
            >
              <Terminal className="w-4 h-4 mr-2" />
              Terminal
            </TabsTrigger>
          </TabsList>

          {/* 7-Layer Intent Deduction Engine */}
          <TabsContent value="layers" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-cyan-400" />
                  Intent Deduction Pipeline
                </h3>
                <div className="space-y-3">
                  {SEVEN_LAYERS.map((layer, i) => (
                    <motion.div
                      key={layer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                        {layer.id}
                      </div>
                      <layer.icon className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{layer.name}</p>
                        <p className="text-xs text-gray-500">{layer.metric}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white/5 border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <RefreshCw className={`w-5 h-5 text-purple-400 ${isBootstrapping ? "animate-spin" : ""}`} />
                  Recursive Bootstrap Engine
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                    <p className="text-sm text-gray-400 mb-2">Autopoietic U=L[U] Self-Refining</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-mono text-purple-400">Λ = {lambda.toFixed(4)}</span>
                      <span className="text-xs text-gray-500">/ 0.99 target</span>
                    </div>
                    <Progress value={(lambda / 0.99) * 100} className="mt-3 h-2" />
                  </div>

                  <Button
                    onClick={runBootstrap}
                    disabled={isBootstrapping}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                  >
                    {isBootstrapping ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Enhancing Cycle {recursionDepth}/5...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Run Recursive Bootstrap
                      </>
                    )}
                  </Button>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-gray-500">Genesis Hash</p>
                      <p className="font-mono text-xs text-cyan-400 truncate">{INTENT_DATA.metadata.genesis_hash}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-gray-500">ΛΦ Constant</p>
                      <p className="font-mono text-xs text-purple-400">
                        {INTENT_DATA.metadata.lambda_phi_constant.toExponential(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Corpus Analysis */}
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4">Semantic Corpus Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CorpusMetric
                  label="Total Lines"
                  value={INTENT_DATA.layer_1_genome.total_lines.toLocaleString()}
                  icon={Database}
                />
                <CorpusMetric
                  label="Physics Refs"
                  value={INTENT_DATA.layer_2_individual.physics_references.toLocaleString()}
                  icon={Zap}
                />
                <CorpusMetric
                  label="Defense Refs"
                  value={INTENT_DATA.layer_2_individual.defense_references.toLocaleString()}
                  icon={Shield}
                />
                <CorpusMetric
                  label="Organism Refs"
                  value={INTENT_DATA.layer_2_individual.organism_references.toLocaleString()}
                  icon={Bot}
                />
              </div>
            </Card>
          </TabsContent>

          {/* Capability Matrix */}
          <TabsContent value="capabilities" className="space-y-4">
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-purple-400" />
                ΛΦ Capability Matrix
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(INTENT_DATA.layer_4_capabilities).map(([key, value], i) => (
                  <CapabilityBar key={key} name={formatCapabilityName(key)} value={value} index={i} />
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Overall Capability Score</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {(Object.values(INTENT_DATA.layer_4_capabilities).reduce((a, b) => a + b, 0) / 10).toFixed(3)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">DARPA-level ideation threshold exceeded</p>
              </div>
            </Card>
          </TabsContent>

          {/* Milestones */}
          <TabsContent value="milestones" className="space-y-4">
            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Project Milestones
                </h3>
                <div className="text-sm text-gray-400">
                  Total LOE: <span className="text-green-400 font-bold">{INTENT_DATA.total_loe}</span>
                </div>
              </div>
              <div className="space-y-3">
                {INTENT_DATA.layer_7_milestones.map((milestone, i) => {
                  const isCritical = INTENT_DATA.critical_path.includes(milestone.id)
                  return (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        isCritical ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isCritical ? "bg-red-500/20 text-red-400" : "bg-white/10 text-gray-400"
                        }`}
                      >
                        {milestone.id}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-xs text-gray-500">
                          Priority {milestone.priority} • {milestone.loe} effort
                        </p>
                      </div>
                      {isCritical && (
                        <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 font-medium">
                          CRITICAL PATH
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Terminal - Interactive */}
          <TabsContent value="terminal">
            <Card className="bg-black border-green-500/30 p-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/20">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-green-400 font-mono">
                  dna::&#125;&#123;::lang — AURA AGENT TERMINAL
                </span>
                <span className="ml-auto text-xs text-cyan-400 font-mono">
                  Φ={ccce.phi.toFixed(3)} Λ={ccce.lambda.toFixed(3)} Γ={ccce.gamma.toFixed(3)} Ξ={ccce.xi.toFixed(1)}
                </span>
              </div>
              <div
                ref={terminalRef}
                className="h-[350px] overflow-y-auto font-mono text-sm space-y-1 mb-3"
              >
                {terminalLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`whitespace-pre-wrap ${
                      log.startsWith(">")
                        ? "text-cyan-400 font-bold"
                        : log.includes("ERROR")
                          ? "text-red-400"
                          : log.includes("SUCCESS") || log.includes("ACHIEVED") || log.includes("✓")
                            ? "text-green-400"
                          : log.includes("WARNING") || log.includes("✗")
                            ? "text-yellow-400"
                          : log.includes("═") || log.includes("╔") || log.includes("╚") || log.includes("║")
                            ? "text-purple-400"
                            : "text-green-300/70"
                    }`}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 border-t border-green-500/20 pt-3">
                <ChevronRight className="w-4 h-4 text-green-400" />
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type 'help' for commands..."
                  disabled={isProcessing}
                  className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono text-sm placeholder:text-green-800"
                  autoFocus
                />
                {isProcessing && (
                  <RefreshCw className="w-4 h-4 text-green-400 animate-spin" />
                )}
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AURA/AIDEN Duality Footer */}
        <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-white/10 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div>
                <h4 className="font-bold">AURA + AIDEN Duality</h4>
                <p className="text-xs text-gray-400">Living Autopoietic Architecture × Adaptive Defense Engineering</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Lock className="w-4 h-4" />
              DFARS 15.6 Compliant • Prior Art Protected
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  trend: string
  color: "cyan" | "purple" | "green" | "yellow"
}) {
  const colors = {
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400",
    green: "from-green-500/20 to-green-500/5 border-green-500/30 text-green-400",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-400",
  }

  return (
    <Card className={`bg-gradient-to-br ${colors[color]} p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold font-mono">{value}</div>
      <div className="text-xs mt-1 opacity-70">{trend}</div>
    </Card>
  )
}

function CorpusMetric({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
      <Icon className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
      <p className="text-2xl font-bold font-mono">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function CapabilityBar({ name, value, index }: { name: string; value: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="space-y-1"
    >
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{name}</span>
        <span className="font-mono text-cyan-400">{(value * 100).toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 }}
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
        />
      </div>
    </motion.div>
  )
}

function formatCapabilityName(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
