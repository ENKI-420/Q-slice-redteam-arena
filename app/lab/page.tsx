"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cpu,
  Zap,
  Shield,
  Activity,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  RefreshCw,
  FileJson,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Beaker,
  Target,
  Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { LabNavigation, LabHeader } from "@/components/lab-navigation"

// === TYPES ===
interface LabStatus {
  credentials: {
    any_available: boolean
    providers: string[]
    ibm_quantum: boolean
    aws_braket: boolean
  }
  fail_closed: {
    enforced: boolean
  }
  constants: {
    PHI: number
    TAU_0_US: number
    WINDOW_US: number
  }
  gates: Record<string, string>
}

interface RunRecord {
  run_id: string
  spec_sha256: string
  provider_job_id: string
  provider: string
  device: string
  status: string
  created_utc: string
  experiment_family: string
  tau_points?: number[]
}

interface PollResult {
  status: string
  analysis?: {
    tau_peak_us: number
    tau_0_us: number
    f_peak: number
  }
  ccce?: {
    Lambda: number
    Phi: number
    Gamma: number
    Xi: number
  }
  stats?: {
    sigma_empirical: number
    within_window: boolean
  }
  claim_tag?: string
  grade?: string
}

// === CONSTANTS ===
const PHI = 1.618033988749895
const TAU_0 = Math.pow(PHI, 8)

export default function LabPage() {
  // State
  const [status, setStatus] = useState<LabStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [nlpPrompt, setNlpPrompt] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [runs, setRuns] = useState<RunRecord[]>([])
  const [selectedRun, setSelectedRun] = useState<RunRecord | null>(null)
  const [pollResult, setPollResult] = useState<PollResult | null>(null)
  const [polling, setPolling] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    nlp: true,
    gates: true,
    queue: true,
    results: true,
  })

  // Experiment config
  const [experimentConfig, setExperimentConfig] = useState({
    family: "tau-sweep",
    provider: "ibm-quantum",
    device: "ibm_fez",
    shots: 2000,
    qslice_enabled: false,
    qslice_intensity: 0,
  })

  // Load status
  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/lab/status")
      const data = await res.json()
      if (data.ok) {
        setStatus(data)
      }
    } catch (error) {
      console.error("Failed to load status:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load runs
  const loadRuns = useCallback(async () => {
    try {
      const res = await fetch("/api/lab/run/submit")
      const data = await res.json()
      if (data.ok) {
        setRuns(data.runs || [])
      }
    } catch (error) {
      console.error("Failed to load runs:", error)
    }
  }, [])

  useEffect(() => {
    loadStatus()
    loadRuns()
  }, [loadStatus, loadRuns])

  // Submit experiment
  const submitExperiment = async () => {
    if (!status?.credentials.any_available) {
      alert("FAIL_CLOSED: No QPU credentials available")
      return
    }

    setSubmitting(true)
    try {
      const spec = {
        manifest_version: "qslice-dnalang-experiment/v1",
        spec_lock: "Δ1",
        created_utc: new Date().toISOString(),
        author: "Q-SLICE Lab",
        cage_code: "9HUP5",
        gate_state: status.gates,
        target: {
          provider: experimentConfig.provider,
          device_id: experimentConfig.device,
          shots: experimentConfig.shots,
          architecture_label: "superconducting",
        },
        experiment: {
          family: experimentConfig.family,
          description: nlpPrompt || `${experimentConfig.family} experiment`,
          parameters: {
            tau_points: [40, 42, 44, 45, 46, 46.5, 47, 47.5, 48, 50, 52, 54, 56],
            dt_us: 0.004,
          },
        },
        qslice: {
          enabled: experimentConfig.qslice_enabled,
          threat_vectors: [],
          intensity: experimentConfig.qslice_intensity,
        },
        ccce: {
          compute_metrics: true,
        },
        acceptance: {
          sigma_empirical_min: 5.0,
          architectures_required: 2,
        },
        evidence: {},
      }

      const res = await fetch("/api/lab/run/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spec }),
      })

      const data = await res.json()

      if (data.ok) {
        setRuns((prev) => [data, ...prev])
        setNlpPrompt("")
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Failed to submit experiment")
    } finally {
      setSubmitting(false)
    }
  }

  // Poll job
  const pollJob = async (run: RunRecord) => {
    setSelectedRun(run)
    setPolling(true)
    setPollResult(null)

    try {
      const res = await fetch("/api/lab/run/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: run.provider_job_id,
          provider: run.provider,
          is_batch: run.experiment_family === "tau-sweep",
          tau_points: run.tau_points,
        }),
      })

      const data = await res.json()
      if (data.ok) {
        setPollResult(data)
        // Update run status in list
        setRuns((prev) =>
          prev.map((r) =>
            r.run_id === run.run_id ? { ...r, status: data.status } : r
          )
        )
      }
    } catch (error) {
      console.error("Poll error:", error)
    } finally {
      setPolling(false)
    }
  }

  // Toggle section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Gate status badge
  const GateBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      CLOSED: "bg-green-500/20 text-green-400 border-green-500/30",
      PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      OPEN: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    const icons: Record<string, React.ReactNode> = {
      CLOSED: <CheckCircle2 className="w-3 h-3" />,
      PENDING: <Clock className="w-3 h-3" />,
      OPEN: <Unlock className="w-3 h-3" />,
    }
    return (
      <Badge className={`${colors[status] || colors.OPEN} flex items-center gap-1`}>
        {icons[status]}
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <LabNavigation />
        <main className="ml-[280px] flex items-center justify-center h-screen">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
            <p className="text-gray-400">Loading Lab Status...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <LabNavigation />

      <main className="ml-[280px]">
        <LabHeader title="Experiments" subtitle="NLP → QPU Deployment Lab" />

        <div className="p-6 space-y-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Beaker className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{runs.length}</div>
                  <div className="text-xs text-gray-500">Total Runs</div>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {runs.filter(r => r.status === "COMPLETED").length}
                  </div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {pollResult?.ccce?.Xi?.toFixed(1) || "—"}
                  </div>
                  <div className="text-xs text-gray-500">Current Ξ</div>
                </div>
              </div>
            </Card>
            <Card className={`p-4 ${status?.credentials.any_available
              ? "bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/30"
              : "bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status?.credentials.any_available ? "bg-green-500/20" : "bg-red-500/20"
                }`}>
                  <Shield className={`w-5 h-5 ${
                    status?.credentials.any_available ? "text-green-400" : "text-red-400"
                  }`} />
                </div>
                <div>
                  <div className={`text-lg font-bold ${
                    status?.credentials.any_available ? "text-green-400" : "text-red-400"
                  }`}>
                    {status?.credentials.any_available ? "READY" : "CLOSED"}
                  </div>
                  <div className="text-xs text-gray-500">QPU Status</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Fail-Closed Banner */}
          {!status?.credentials.any_available && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" />
                <div>
                  <p className="text-red-400 font-bold">FAIL_CLOSED: No QPU Credentials</p>
                  <p className="text-gray-400 text-sm">
                    Configure IBM_QUANTUM_TOKEN or AWS credentials to enable real QPU execution.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* NLP Compiler Panel */}
            <Card className="bg-gray-900/50 border-cyan-500/30">
              <div
                className="p-4 border-b border-gray-800 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("nlp")}
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold">NLP Compiler</h2>
                </div>
                {expandedSections.nlp ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.nlp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 space-y-4"
                  >
                    {/* NLP Input */}
                    <div>
                      <Label className="text-gray-400">Experiment Description (NLP)</Label>
                      <textarea
                        value={nlpPrompt}
                        onChange={(e) => setNlpPrompt(e.target.value)}
                        placeholder="Run a tau-sweep to validate phi^8 coherence revival on ibm_fez with 2000 shots..."
                        className="w-full mt-2 p-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 resize-none h-24 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    {/* Quick Config */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-400 text-sm">Family</Label>
                        <select
                          value={experimentConfig.family}
                          onChange={(e) =>
                            setExperimentConfig((c) => ({ ...c, family: e.target.value }))
                          }
                          className="w-full mt-1 p-2 bg-black/50 border border-gray-700 rounded text-white"
                        >
                          <option value="tau-sweep">Tau-Sweep (G3)</option>
                          <option value="bell">Bell State</option>
                          <option value="ghz">GHZ State</option>
                          <option value="qaoa">QAOA</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Device</Label>
                        <select
                          value={experimentConfig.device}
                          onChange={(e) =>
                            setExperimentConfig((c) => ({ ...c, device: e.target.value }))
                          }
                          className="w-full mt-1 p-2 bg-black/50 border border-gray-700 rounded text-white"
                        >
                          <option value="ibm_fez">ibm_fez (156q)</option>
                          <option value="ibm_torino">ibm_torino (133q)</option>
                          <option value="ibm_marrakesh">ibm_marrakesh (156q)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-400 text-sm">Shots</Label>
                        <Input
                          type="number"
                          value={experimentConfig.shots}
                          onChange={(e) =>
                            setExperimentConfig((c) => ({
                              ...c,
                              shots: parseInt(e.target.value) || 1000,
                            }))
                          }
                          className="mt-1 bg-black/50 border-gray-700"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={experimentConfig.qslice_enabled}
                            onChange={(e) =>
                              setExperimentConfig((c) => ({
                                ...c,
                                qslice_enabled: e.target.checked,
                              }))
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-gray-400 text-sm">Q-SLICE Threats</span>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={submitExperiment}
                      disabled={submitting || !status?.credentials.any_available}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Submitting to QPU...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Deploy to {experimentConfig.device}
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Gate Dashboard */}
            <Card className="bg-gray-900/50 border-yellow-500/30">
              <div
                className="p-4 border-b border-gray-800 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("gates")}
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-bold">Gate Dashboard</h2>
                </div>
                {expandedSections.gates ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.gates && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4"
                  >
                    <div className="space-y-3">
                      {status?.gates &&
                        Object.entries(status.gates).map(([gate, gateStatus]) => (
                          <div
                            key={gate}
                            className="flex items-center justify-between p-2 bg-black/30 rounded"
                          >
                            <span className="text-gray-300 font-mono text-sm">{gate}</span>
                            <GateBadge status={gateStatus} />
                          </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-black/30 rounded">
                      <div className="text-xs text-gray-500 mb-2">G3 Requirements</div>
                      <div className="text-sm text-gray-400">
                        <div>|A| ≥ 2 architectures</div>
                        <div>σ_empirical ≥ 5.0</div>
                        <div>raw_shots_saved = true</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Run Queue */}
            <Card className="bg-gray-900/50 border-purple-500/30">
              <div
                className="p-4 border-b border-gray-800 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("queue")}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold">Run Queue</h2>
                  <Badge variant="outline" className="ml-2">
                    {runs.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); loadRuns(); }}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              <AnimatePresence>
                {expandedSections.queue && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 max-h-80 overflow-y-auto"
                  >
                    {runs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Cpu className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No experiments submitted yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {runs.map((run) => (
                          <div
                            key={run.run_id}
                            className={`p-3 rounded border cursor-pointer transition-all ${
                              selectedRun?.run_id === run.run_id
                                ? "bg-purple-500/10 border-purple-500/50"
                                : "bg-black/30 border-gray-700 hover:border-gray-600"
                            }`}
                            onClick={() => pollJob(run)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-mono text-gray-300">
                                  {run.provider_job_id.slice(0, 16)}...
                                </div>
                                <div className="text-xs text-gray-500">
                                  {run.device} | {run.experiment_family}
                                </div>
                              </div>
                              <Badge
                                className={
                                  run.status === "COMPLETED"
                                    ? "bg-green-500/20 text-green-400"
                                    : run.status === "FAILED"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }
                              >
                                {run.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Results Panel */}
            <Card className="bg-gray-900/50 border-green-500/30">
              <div
                className="p-4 border-b border-gray-800 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("results")}
              >
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-bold">Results & Evidence</h2>
                </div>
                {expandedSections.results ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.results && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4"
                  >
                    {polling ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-green-400" />
                        <p className="text-gray-400">Polling job status...</p>
                      </div>
                    ) : pollResult ? (
                      <div className="space-y-4">
                        {/* Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Status</span>
                          <Badge
                            className={
                              pollResult.status === "COMPLETED"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }
                          >
                            {pollResult.status}
                          </Badge>
                        </div>

                        {pollResult.status === "COMPLETED" && (
                          <>
                            {/* Claim Tag */}
                            {pollResult.claim_tag && (
                              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                                <div className="text-xs text-gray-500 mb-1">Claim</div>
                                <div className="text-green-400 font-bold">
                                  {pollResult.claim_tag}
                                </div>
                              </div>
                            )}

                            {/* Analysis */}
                            {pollResult.analysis && (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-2 bg-black/30 rounded">
                                  <div className="text-xs text-gray-500">τ_peak</div>
                                  <div className="text-lg font-mono text-cyan-400">
                                    {pollResult.analysis.tau_peak_us.toFixed(2)} μs
                                  </div>
                                </div>
                                <div className="p-2 bg-black/30 rounded">
                                  <div className="text-xs text-gray-500">τ₀ (predicted)</div>
                                  <div className="text-lg font-mono text-gray-400">
                                    {TAU_0.toFixed(2)} μs
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* CCCE Metrics */}
                            {pollResult.ccce && (
                              <div className="grid grid-cols-4 gap-2">
                                <div className="p-2 bg-black/30 rounded text-center">
                                  <div className="text-xs text-gray-500">Λ</div>
                                  <div className="text-sm font-mono text-cyan-400">
                                    {pollResult.ccce.Lambda.toFixed(3)}
                                  </div>
                                </div>
                                <div className="p-2 bg-black/30 rounded text-center">
                                  <div className="text-xs text-gray-500">Φ</div>
                                  <div className="text-sm font-mono text-purple-400">
                                    {pollResult.ccce.Phi.toFixed(3)}
                                  </div>
                                </div>
                                <div className="p-2 bg-black/30 rounded text-center">
                                  <div className="text-xs text-gray-500">Γ</div>
                                  <div className="text-sm font-mono text-red-400">
                                    {pollResult.ccce.Gamma.toFixed(3)}
                                  </div>
                                </div>
                                <div className="p-2 bg-black/30 rounded text-center">
                                  <div className="text-xs text-gray-500">Ξ</div>
                                  <div className="text-sm font-mono text-green-400">
                                    {pollResult.ccce.Xi.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Stats */}
                            {pollResult.stats && (
                              <div className="p-3 bg-black/30 rounded">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-gray-400 text-sm">σ_empirical</span>
                                  <span className="font-mono text-lg">
                                    {pollResult.stats.sigma_empirical.toFixed(2)}
                                  </span>
                                </div>
                                <Progress
                                  value={Math.min(100, (pollResult.stats.sigma_empirical / 5) * 100)}
                                  className="h-2"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>0</span>
                                  <span className="text-yellow-400">5.0 (G3 threshold)</span>
                                </div>
                              </div>
                            )}

                            {/* Grade */}
                            {pollResult.grade && (
                              <div className="flex items-center justify-between p-2 bg-black/30 rounded">
                                <span className="text-gray-400">Grade</span>
                                <Badge className="bg-blue-500/20 text-blue-400">
                                  {pollResult.grade}
                                </Badge>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileJson className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Select a run to view results</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
          </div>

          {/* Physical Constants Footer */}
          <Card className="bg-gray-900/30 border-gray-800 p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6 text-gray-500 font-mono">
                <span>
                  τ₀ = φ⁸ = <span className="text-cyan-400">{TAU_0.toFixed(4)}</span> μs
                </span>
                <span>
                  ΛΦ = <span className="text-purple-400">2.176435×10⁻⁸</span> s⁻¹
                </span>
                <span>
                  Φ_th = <span className="text-green-400">0.7734</span>
                </span>
                <span>
                  Γ_crit = <span className="text-red-400">0.300</span>
                </span>
              </div>
              <div className="text-gray-600">
                FAIL_CLOSED: NO_SIM | NO_MOCK | REAL_QPU_ONLY
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
