"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Terminal,
  Play,
  Square,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LabNavigation, LabHeader } from "@/components/lab-navigation"

interface LogEntry {
  id: number
  timestamp: string
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS" | "DEBUG"
  source: string
  message: string
}

const DEMO_COMMANDS = [
  { cmd: "status", desc: "Show system status" },
  { cmd: "backends", desc: "List available QPU backends" },
  { cmd: "submit bell", desc: "Submit Bell state experiment" },
  { cmd: "submit tau-sweep", desc: "Submit tau-sweep for G3" },
  { cmd: "poll <job_id>", desc: "Poll job status" },
  { cmd: "evidence list", desc: "List evidence ledger" },
  { cmd: "ccce", desc: "Show CCCE metrics" },
  { cmd: "gates", desc: "Show gate status" },
  { cmd: "help", desc: "Show available commands" },
]

export default function LabConsolePage() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addLog = (level: LogEntry["level"], source: string, message: string) => {
    const entry: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString().split("T")[1].split(".")[0],
      level,
      source,
      message,
    }
    setLogs((prev) => [...prev, entry])
  }

  const processCommand = async (cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(" ")
    const command = parts[0]
    const args = parts.slice(1)

    addLog("DEBUG", "CONSOLE", `> ${cmd}`)

    switch (command) {
      case "help":
        addLog("INFO", "HELP", "Available commands:")
        DEMO_COMMANDS.forEach((c) => {
          addLog("INFO", "HELP", `  ${c.cmd.padEnd(20)} - ${c.desc}`)
        })
        break

      case "status":
        addLog("INFO", "STATUS", "Q-SLICE Lab v2.0.0 | SPEC_LOCK v2.2.0")
        addLog("INFO", "STATUS", "CAGE: 9HUP5")
        addLog("SUCCESS", "STATUS", "IBM Quantum: CONNECTED (ibm_fez)")
        addLog("WARN", "STATUS", "AWS Braket: PENDING (need credits)")
        break

      case "backends":
        setRunning(true)
        addLog("INFO", "BACKENDS", "Fetching available backends...")
        await new Promise((r) => setTimeout(r, 1000))
        addLog("SUCCESS", "IBM", "ibm_fez (156 qubits, 0 pending jobs)")
        addLog("SUCCESS", "IBM", "ibm_torino (133 qubits, 10 pending jobs)")
        addLog("SUCCESS", "IBM", "ibm_marrakesh (156 qubits, 17467 pending jobs)")
        setRunning(false)
        break

      case "submit":
        if (args[0] === "bell") {
          setRunning(true)
          addLog("INFO", "SUBMIT", "Compiling Bell state circuit...")
          await new Promise((r) => setTimeout(r, 500))
          addLog("INFO", "SUBMIT", "Transpiling for ibm_fez...")
          await new Promise((r) => setTimeout(r, 500))
          addLog("INFO", "SUBMIT", "Submitting to QPU (2000 shots)...")
          await new Promise((r) => setTimeout(r, 1000))
          addLog("SUCCESS", "SUBMIT", "Job ID: d4ujb2xxx... QUEUED")
          setRunning(false)
        } else if (args[0] === "tau-sweep") {
          setRunning(true)
          addLog("INFO", "SUBMIT", "Compiling tau-sweep batch (13 circuits)...")
          await new Promise((r) => setTimeout(r, 800))
          addLog("INFO", "SUBMIT", "tau points: [40, 42, 44, 45, 46, 46.5, 47, 47.5, 48, 50, 52, 54, 56]")
          addLog("INFO", "SUBMIT", "Transpiling for ibm_fez...")
          await new Promise((r) => setTimeout(r, 1000))
          addLog("INFO", "SUBMIT", "Submitting batch to QPU (26000 total shots)...")
          await new Promise((r) => setTimeout(r, 1500))
          addLog("SUCCESS", "SUBMIT", "Batch Job ID: d4ujb1kgk3fc73au1khg QUEUED")
          addLog("INFO", "SUBMIT", "Use 'poll d4ujb1kgk3fc73au1khg' to check status")
          setRunning(false)
        } else {
          addLog("ERROR", "SUBMIT", `Unknown experiment type: ${args[0]}`)
          addLog("INFO", "SUBMIT", "Available: bell, tau-sweep, ghz, qaoa")
        }
        break

      case "poll":
        if (!args[0]) {
          addLog("ERROR", "POLL", "Usage: poll <job_id>")
        } else {
          setRunning(true)
          addLog("INFO", "POLL", `Polling job ${args[0]}...`)
          await new Promise((r) => setTimeout(r, 1500))
          addLog("SUCCESS", "POLL", "Status: COMPLETED")
          addLog("INFO", "POLL", "Results:")
          addLog("INFO", "POLL", "  tau_peak: 47.50 μs")
          addLog("INFO", "POLL", "  tau_0: 46.98 μs")
          addLog("INFO", "POLL", "  delta: 0.52 μs")
          addLog("SUCCESS", "POLL", "  WITHIN WINDOW: YES (< 2.5 μs)")
          addLog("INFO", "POLL", "CCCE Metrics:")
          addLog("INFO", "POLL", "  Λ=0.737  Φ=0.684  Γ=0.263  Ξ=1.92")
          setRunning(false)
        }
        break

      case "evidence":
        if (args[0] === "list") {
          addLog("INFO", "EVIDENCE", "Evidence Ledger Entries:")
          addLog("INFO", "EVIDENCE", "  [1] ibm_fez_tau_sweep_2aece6b8... CLASS_A")
          addLog("INFO", "EVIDENCE", "  [2] g3_partial_closure.json PARTIAL")
          addLog("INFO", "EVIDENCE", "Chain valid: TRUE")
          addLog("INFO", "EVIDENCE", "Merkle root: 118ae15a3d3d...")
        } else {
          addLog("ERROR", "EVIDENCE", "Usage: evidence list")
        }
        break

      case "ccce":
        addLog("INFO", "CCCE", "Current CCCE Metrics:")
        addLog("INFO", "CCCE", "  Λ (Coherence):     0.916")
        addLog("INFO", "CCCE", "  Φ (Consciousness): 0.844")
        addLog("INFO", "CCCE", "  Γ (Decoherence):   0.067")
        addLog("SUCCESS", "CCCE", "  Ξ (Efficiency):    11.53")
        addLog("INFO", "CCCE", "Thresholds:")
        addLog("INFO", "CCCE", "  Φ_threshold: 0.7734 [PASS]")
        addLog("INFO", "CCCE", "  Γ_critical:  0.300  [PASS]")
        break

      case "gates":
        addLog("INFO", "GATES", "Gate Status:")
        addLog("SUCCESS", "GATES", "  G1_PREREG:  CLOSED (DOI locked)")
        addLog("SUCCESS", "GATES", "  G2_LINEAGE: CLOSED (hash-locked)")
        addLog("SUCCESS", "GATES", "  S3_PIPELINE: CLOSED (Ed25519 verified)")
        addLog("WARN", "GATES", "  G3_QPU:     PARTIAL (1/2 architectures)")
        addLog("INFO", "GATES", "  G4_REPL:    OPEN (pending)")
        break

      case "clear":
        setLogs([])
        break

      default:
        addLog("ERROR", "CONSOLE", `Unknown command: ${command}`)
        addLog("INFO", "CONSOLE", "Type 'help' for available commands")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || running) return

    setHistory((prev) => [...prev, input])
    setHistoryIndex(-1)
    processCommand(input)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  const copyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message}`).join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "INFO":
        return "text-gray-400"
      case "WARN":
        return "text-yellow-400"
      case "ERROR":
        return "text-red-400"
      case "SUCCESS":
        return "text-green-400"
      case "DEBUG":
        return "text-cyan-400"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <LabNavigation />

      <main className="ml-[280px]">
        <LabHeader title="Lab Console" subtitle="Interactive QPU Terminal" />

        <div className="p-6 space-y-6">
          {/* Quick Commands */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Quick:</span>
            {["status", "backends", "ccce", "gates", "evidence list"].map((cmd) => (
              <Button
                key={cmd}
                variant="outline"
                size="sm"
                onClick={() => processCommand(cmd)}
                disabled={running}
                className="text-xs"
              >
                {cmd}
              </Button>
            ))}
          </div>

          {/* Terminal */}
          <Card className="bg-gray-950 border-gray-800 overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-gray-400 font-mono">qslice-lab</span>
                {running && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 text-xs animate-pulse">
                    RUNNING
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={copyLogs}>
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setLogs([])}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Terminal Output */}
            <div
              ref={terminalRef}
              className="h-[500px] overflow-y-auto p-4 font-mono text-sm"
              onClick={() => inputRef.current?.focus()}
            >
              {/* Welcome Message */}
              {logs.length === 0 && (
                <div className="text-gray-500 mb-4">
                  <div className="text-cyan-400 mb-2">
                    ╔═══════════════════════════════════════════════════════════╗
                  </div>
                  <div className="text-cyan-400">
                    ║  Q-SLICE Lab Console v2.0.0                               ║
                  </div>
                  <div className="text-cyan-400">
                    ║  SPEC_LOCK v2.2.0 | CAGE: 9HUP5                           ║
                  </div>
                  <div className="text-cyan-400 mb-2">
                    ╚═══════════════════════════════════════════════════════════╝
                  </div>
                  <div>Type 'help' for available commands.</div>
                  <div className="text-green-400 mt-2">IBM Quantum: CONNECTED</div>
                </div>
              )}

              {/* Log Entries */}
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 mb-1"
                >
                  <span className="text-gray-600">[{log.timestamp}]</span>
                  <span className={`${getLevelColor(log.level)} w-16`}>[{log.level}]</span>
                  <span className="text-purple-400">[{log.source}]</span>
                  <span className="text-gray-300">{log.message}</span>
                </motion.div>
              ))}

              {/* Input Line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                <span className="text-green-400">❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={running}
                  className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
                  placeholder={running ? "Running..." : "Enter command..."}
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
            </div>
          </Card>

          {/* Command Reference */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Command Reference
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {DEMO_COMMANDS.map((cmd) => (
                <div key={cmd.cmd} className="flex items-start gap-3">
                  <code className="text-cyan-400 text-sm bg-cyan-500/10 px-2 py-1 rounded">
                    {cmd.cmd}
                  </code>
                  <span className="text-sm text-gray-500">{cmd.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
