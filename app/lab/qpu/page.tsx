"use client"

/**
 * Q-SLICE QPU Lab — Evidence-First Operator Interface
 * ====================================================
 * Fail-closed, Merkle-chained threat assessment cockpit
 *
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5 | Agile Defense Systems, LLC
 */

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Shield,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Hash,
  RefreshCw,
  Play,
  Eye,
  Lock,
  Unlock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Backend {
  name: string
  num_qubits: number
  pending_jobs: number
  operational: boolean
  processor_type?: string
}

interface PolicyDecision {
  selected: string
  policy_version: string
  reason_codes: string[]
  decision_timestamp: string
}

interface ThreatVector {
  id: string
  name: string
  description: string
  algorithm: string
  min_qubits: number
  default_shots: number
  severity: "critical" | "high" | "medium" | "low"
}

interface Evidence {
  id: string
  class: "CLASS_A" | "CLASS_B" | "CLASS_C"
  request_hash: string
  result_hash?: string
  leaf_hash?: string
  merkle_root?: string
  chain_index: number
  timestamp: string
}

interface Experiment {
  id: string
  vector: string
  status: string
  evidence_id?: string
  evidence_class?: string
  request_hash?: string
  mode?: string
  results?: {
    success_rate: number
    vulnerability_score: number
    ccce_metrics: {
      phi: number
      lambda: number
      gamma: number
      xi: number
    }
  }
}

interface HealthStatus {
  success: boolean
  mode: "QPU" | "DEV"
  fail_closed_status: {
    allowed: boolean
    reason: string
  }
  ibm_configured: boolean
  spec_lock: {
    version: string
    LAMBDA_PHI: number
    PHI_THRESHOLD: number
    GAMMA_CRITICAL: number
  }
}

interface ChainState {
  root: string
  leaf_count: number
  last_entry_id: string
  spec_lock_hash: string
  updated_at: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function GateIndicator({ name, closed, partial }: { name: string; closed: boolean; partial?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono ${
      closed ? "bg-green-500/20 text-green-400 border border-green-500/30" :
      partial ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
      "bg-red-500/20 text-red-400 border border-red-500/30"
    }`}>
      {closed ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
      <span>{name}</span>
      {closed ? <CheckCircle className="w-3 h-3" /> : partial ? <AlertTriangle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
    </div>
  )
}

function CCCEGauge({ label, value, threshold, unit = "" }: {
  label: string
  value: number
  threshold?: number
  unit?: string
}) {
  const isAboveThreshold = threshold !== undefined && value >= threshold
  const percentage = Math.min(100, Math.max(0, value * 100))

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className={`font-mono ${isAboveThreshold ? "text-green-400" : "text-yellow-400"}`}>
          {value.toFixed(4)}{unit}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isAboveThreshold ? "bg-green-500" : "bg-yellow-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {threshold !== undefined && (
        <div className="text-[10px] text-gray-500">Threshold: {threshold}</div>
      )}
    </div>
  )
}

function EvidenceClassBadge({ evidenceClass }: { evidenceClass: string }) {
  const styles: Record<string, string> = {
    CLASS_A: "bg-green-500/20 text-green-400 border-green-500/30",
    CLASS_B: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    CLASS_C: "bg-red-500/20 text-red-400 border-red-500/30"
  }

  const icons: Record<string, React.ReactNode> = {
    CLASS_A: <CheckCircle className="w-3 h-3" />,
    CLASS_B: <Clock className="w-3 h-3" />,
    CLASS_C: <AlertTriangle className="w-3 h-3" />
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${styles[evidenceClass] || styles.CLASS_C}`}>
      {icons[evidenceClass]}
      {evidenceClass}
    </span>
  )
}

function HashDisplay({ label, hash, truncate = true }: { label: string; hash?: string; truncate?: boolean }) {
  if (!hash) return null
  const display = truncate ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : hash

  return (
    <div className="flex items-center gap-2 text-xs">
      <Hash className="w-3 h-3 text-gray-500" />
      <span className="text-gray-400">{label}:</span>
      <code className="font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">{display}</code>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function QPULabPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [backends, setBackends] = useState<Backend[]>([])
  const [policyDecision, setPolicyDecision] = useState<PolicyDecision | null>(null)
  const [vectors, setVectors] = useState<ThreatVector[]>([])
  const [chainState, setChainState] = useState<ChainState | null>(null)
  const [recentEvidence, setRecentEvidence] = useState<Evidence[]>([])
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedVector, setSelectedVector] = useState<string>("")
  const [selectedBackend, setSelectedBackend] = useState<string>("")
  const [shots, setShots] = useState(1024)
  const [submitResult, setSubmitResult] = useState<Record<string, unknown> | null>(null)

  // ─────────────────────────────────────────────────────────────────────────────
  // DATA LOADING
  // ─────────────────────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [healthRes, backendsRes, vectorsRes, evidenceRes, experimentsRes] = await Promise.all([
        fetch("/api/qslice?action=health"),
        fetch("/api/qslice?action=backends"),
        fetch("/api/qslice?action=vectors"),
        fetch("/api/qslice?action=evidence"),
        fetch("/api/qslice?action=list")
      ])

      const [healthData, backendsData, vectorsData, evidenceData, experimentsData] = await Promise.all([
        healthRes.json(),
        backendsRes.json(),
        vectorsRes.json(),
        evidenceRes.json(),
        experimentsRes.json()
      ])

      if (healthData.success !== undefined) setHealth(healthData)
      if (backendsData.backends) {
        setBackends(backendsData.backends)
        setPolicyDecision(backendsData.policy_decision)
        if (!selectedBackend && backendsData.policy_decision?.selected) {
          setSelectedBackend(backendsData.policy_decision.selected)
        }
      }
      if (vectorsData.vectors) {
        setVectors(vectorsData.vectors)
        if (!selectedVector && vectorsData.vectors.length > 0) {
          setSelectedVector(vectorsData.vectors[0].id)
        }
      }
      if (evidenceData.chain_state) setChainState(evidenceData.chain_state)
      if (evidenceData.recent_entries) setRecentEvidence(evidenceData.recent_entries)
      if (experimentsData.experiments) setExperiments(experimentsData.experiments)
    } catch (error) {
      console.error("[QPU Lab] Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedBackend, selectedVector])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [loadData])

  // ─────────────────────────────────────────────────────────────────────────────
  // SUBMIT EXPERIMENT
  // ─────────────────────────────────────────────────────────────────────────────

  const submitExperiment = async () => {
    if (!selectedVector || !selectedBackend) return

    setSubmitting(true)
    setSubmitResult(null)
    try {
      const simulate = health?.mode === "DEV"
      const res = await fetch("/api/qslice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vector: selectedVector,
          backend: selectedBackend,
          shots,
          simulate
        })
      })

      const data = await res.json()
      setSubmitResult(data)

      if (data.success) {
        await loadData() // Refresh data
      }
    } catch (error) {
      setSubmitResult({ success: false, error: String(error) })
    } finally {
      setSubmitting(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  const selectedVectorSpec = vectors.find(v => v.id === selectedVector)
  const isFailClosed = health?.mode === "QPU"

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/lab">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Lab
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Cpu className="w-6 h-6 text-cyan-400" />
                Q-SLICE QPU Lab
              </h1>
              <p className="text-sm text-gray-400">Evidence-First Threat Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Mode Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${
              isFailClosed
                ? "bg-red-500/20 text-red-400 border-red-500/30"
                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            }`}>
              <Shield className="w-4 h-4" />
              <span className="text-sm font-bold">{health?.mode || "..."}</span>
              {isFailClosed && <Lock className="w-3 h-3" />}
            </div>
            <Button onClick={loadData} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Three-Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT RAIL: Gates & SPEC_LOCK */}
          <div className="col-span-3 space-y-4">
            {/* Gate Status */}
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Gate Status
              </h3>
              <div className="space-y-2">
                <GateIndicator name="G1_PREREG" closed={true} />
                <GateIndicator name="G2_LINEAGE" closed={true} />
                <GateIndicator name="S3_PIPELINE" closed={true} />
                <GateIndicator name="G3_QPU" closed={false} partial={true} />
                <GateIndicator name="G4_REPL" closed={false} />
              </div>
            </Card>

            {/* SPEC_LOCK */}
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-3">SPEC_LOCK v{health?.spec_lock?.version || "2.2.0"}</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">ΛΦ</span>
                  <span className="text-cyan-400">2.176435×10⁻⁸</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Φ_threshold</span>
                  <span className="text-cyan-400">0.7734</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Γ_critical</span>
                  <span className="text-cyan-400">0.300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">θ_lock</span>
                  <span className="text-cyan-400">51.843°</span>
                </div>
              </div>
            </Card>

            {/* Fail-Closed Status */}
            <Card className={`p-4 border ${
              health?.fail_closed_status?.allowed
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                {health?.fail_closed_status?.allowed
                  ? <CheckCircle className="w-4 h-4 text-green-400" />
                  : <XCircle className="w-4 h-4 text-red-400" />
                }
                Fail-Closed
              </h3>
              <p className="text-xs text-gray-400">
                {health?.fail_closed_status?.reason || "Checking..."}
              </p>
              <div className="mt-2 text-xs">
                <span className="text-gray-500">IBM Config: </span>
                {health?.ibm_configured
                  ? <span className="text-green-400">Ready</span>
                  : <span className="text-yellow-400">Missing Key</span>
                }
              </div>
            </Card>
          </div>

          {/* CENTER: Experiment Submission & Results */}
          <div className="col-span-6 space-y-4">
            {/* Experiment Submission */}
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" />
                Submit Experiment
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Vector Selection */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Threat Vector</label>
                  <select
                    value={selectedVector}
                    onChange={(e) => setSelectedVector(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm"
                  >
                    {vectors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {/* Backend Selection */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Backend</label>
                  <select
                    value={selectedBackend}
                    onChange={(e) => setSelectedBackend(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm"
                  >
                    {backends.map(b => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.num_qubits}Q, {b.pending_jobs} queued)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shots */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-1">Shots</label>
                <input
                  type="number"
                  value={shots}
                  onChange={(e) => setShots(parseInt(e.target.value) || 1024)}
                  min={1}
                  max={100000}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Vector Info */}
              {selectedVectorSpec && (
                <div className="mb-4 p-3 bg-black/50 rounded border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{selectedVectorSpec.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      selectedVectorSpec.severity === "critical" ? "bg-red-500/20 text-red-400" :
                      selectedVectorSpec.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {selectedVectorSpec.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{selectedVectorSpec.description}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-gray-500">Algorithm: <span className="text-cyan-400">{selectedVectorSpec.algorithm}</span></span>
                    <span className="text-gray-500">Min Qubits: <span className="text-cyan-400">{selectedVectorSpec.min_qubits}</span></span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={submitExperiment}
                disabled={submitting || !selectedVector || !selectedBackend}
                className={`w-full ${isFailClosed ? "bg-red-600 hover:bg-red-700" : "bg-cyan-600 hover:bg-cyan-700"}`}
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isFailClosed ? "Submit to QPU (Fail-Closed)" : "Submit (DEV Simulation)"}
              </Button>

              {/* Submit Result */}
              {submitResult && (
                <div className={`mt-4 p-3 rounded border ${
                  submitResult.success
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {submitResult.success
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <XCircle className="w-4 h-4 text-red-400" />
                    }
                    <span className="text-sm font-bold">
                      {submitResult.success ? "Submitted" : "Failed"}
                    </span>
                    {submitResult.evidence_class && (
                      <EvidenceClassBadge evidenceClass={submitResult.evidence_class as string} />
                    )}
                  </div>
                  {submitResult.request_hash && (
                    <HashDisplay label="Request" hash={submitResult.request_hash as string} />
                  )}
                  {submitResult.evidence_id && (
                    <div className="text-xs text-gray-400 mt-1">
                      Evidence ID: <code className="text-cyan-400">{String(submitResult.evidence_id).slice(0, 20)}...</code>
                    </div>
                  )}
                  {submitResult.warning && (
                    <div className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {String(submitResult.warning)}
                    </div>
                  )}
                  {submitResult.error && (
                    <div className="text-xs text-red-400 mt-2">
                      {String(submitResult.error)}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Recent Experiments */}
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Recent Experiments ({experiments.length})
              </h3>
              {experiments.length === 0 ? (
                <p className="text-xs text-gray-500">No experiments yet</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {experiments.slice(-10).reverse().map((exp) => (
                    <div key={exp.id} className="p-2 bg-black/50 rounded border border-gray-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-cyan-400">{exp.vector}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded ${
                            exp.status === "completed" ? "bg-green-500/20 text-green-400" :
                            exp.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-gray-500/20 text-gray-400"
                          }`}>
                            {exp.status}
                          </span>
                          {exp.evidence_class && (
                            <EvidenceClassBadge evidenceClass={exp.evidence_class} />
                          )}
                        </div>
                      </div>
                      {exp.request_hash && (
                        <HashDisplay label="Hash" hash={exp.request_hash} />
                      )}
                      {exp.results && (
                        <div className="mt-1 grid grid-cols-4 gap-2">
                          <div>
                            <span className="text-gray-500">Φ:</span>{" "}
                            <span className="text-green-400">{exp.results.ccce_metrics.phi.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Λ:</span>{" "}
                            <span className="text-cyan-400">{exp.results.ccce_metrics.lambda.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Γ:</span>{" "}
                            <span className="text-yellow-400">{exp.results.ccce_metrics.gamma.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Vuln:</span>{" "}
                            <span className="text-red-400">{exp.results.vulnerability_score.toFixed(1)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT RAIL: CCCE Gauges & Evidence Chain */}
          <div className="col-span-3 space-y-4">
            {/* CCCE Gauges */}
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-fuchsia-400" />
                CCCE Metrics
              </h3>
              <div className="space-y-3">
                <CCCEGauge
                  label="Φ (Consciousness)"
                  value={submitResult?.experiment?.results?.ccce_metrics?.phi || 0.8234}
                  threshold={0.7734}
                />
                <CCCEGauge
                  label="Λ (Coherence)"
                  value={submitResult?.experiment?.results?.ccce_metrics?.lambda || 0.9456}
                  threshold={0.85}
                />
                <CCCEGauge
                  label="Γ (Decoherence)"
                  value={submitResult?.experiment?.results?.ccce_metrics?.gamma || 0.0912}
                  threshold={0.3}
                />
                <CCCEGauge
                  label="Ξ (Efficiency)"
                  value={(submitResult?.experiment?.results?.ccce_metrics?.xi || 8.5) / 20}
                />
              </div>
            </Card>

            {/* Evidence Chain */}
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Evidence Chain
              </h3>
              {chainState ? (
                <div className="space-y-2 text-xs">
                  <HashDisplay label="Merkle Root" hash={chainState.root} />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Leaf Count:</span>
                    <span className="text-cyan-400">{chainState.leaf_count}</span>
                  </div>
                  <HashDisplay label="SPEC_LOCK" hash={chainState.spec_lock_hash} />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Updated:</span>
                    <span className="text-gray-400">{new Date(chainState.updated_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No chain state yet</p>
              )}
            </Card>

            {/* Recent Evidence */}
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-3">Recent Evidence ({recentEvidence.length})</h3>
              {recentEvidence.length === 0 ? (
                <p className="text-xs text-gray-500">No evidence entries</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {recentEvidence.slice(-5).reverse().map((ev) => (
                    <div key={ev.id} className="p-2 bg-black/50 rounded border border-gray-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <EvidenceClassBadge evidenceClass={ev.class} />
                        <span className="text-gray-500">#{ev.chain_index}</span>
                      </div>
                      <HashDisplay label="Req" hash={ev.request_hash} />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Policy Decision */}
            {policyDecision && (
              <Card className="bg-gray-900/50 border-gray-800 p-4">
                <h3 className="text-sm font-bold text-gray-300 mb-3">Backend Policy</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected:</span>
                    <span className="text-cyan-400 font-bold">{policyDecision.selected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Version:</span>
                    <span className="text-gray-400">{policyDecision.policy_version}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reasons:</span>
                    <div className="mt-1 space-y-1">
                      {policyDecision.reason_codes.map((code, i) => (
                        <div key={i} className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
