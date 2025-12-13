"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"

/**
 * Q-SLICE × CCCE Integrated SOC Dashboard
 * Document ID: QSLICE-CCCE-SPEC-001
 * Version: 1.0.0
 *
 * Implements the Technical Integration Specification for:
 * - Q-SLICE Threat Taxonomy
 * - CCCE Metrics Telemetry
 * - QUANTA Controls Framework
 */

// ============================================================
// CONSTANTS & TYPES
// ============================================================

const SPEC_META = {
  docId: "QSLICE-CCCE-SPEC-001",
  version: "1.0.0",
  classification: "UNCLASSIFIED // FOUO",
  authors: [
    { name: "Jeremy Green, PhD", org: "University of Staffordshire", role: "Q-SLICE/QUANTA" },
    { name: "Devin P. Davis", org: "Agile Defense Systems LLC", role: "CCCE/DNA-Lang", cage: "9HUP5" },
  ],
}

// Physical Constants
const CONSTANTS = {
  LAMBDA_PHI: 2.176435e-8,
  PHI_THRESHOLD: 0.7734,
  CHI_PC: 0.946,
  GAMMA_CRIT: 1.47,
  THETA_RESONANCE: 51.843,
}

// CCCE Thresholds
const THRESHOLDS = {
  lambda: { optimal: 0.90, warning: 0.80, critical: 0.70 },
  phi: { threshold: 0.7734, warning: 0.70, critical: 0.50 },
  gamma: { optimal: 0.10, warning: 0.15, critical: 0.30 },
  xi: { transcendent: 10.0, healthy: 5.0, warning: 5.0, critical: 2.0 },
}

// Q-SLICE Categories
const QSLICE_CATEGORIES = [
  { id: "Q", name: "Quantum Exploitation", primaryMetric: "Ξ", secondaryMetric: "Λ, Φ", pattern: "Ξ collapse during crypto ops" },
  { id: "S", name: "Subversion of Trust", primaryMetric: "Φ", secondaryMetric: "var(Φ)", pattern: "Suspiciously stable Φ" },
  { id: "L", name: "Legacy Exploitation", primaryMetric: "—", secondaryMetric: "—", pattern: "Classical detection" },
  { id: "I", name: "Integrity Disruption", primaryMetric: "Ξ", secondaryMetric: "Λ, Φ independent", pattern: "Ξ low despite stable Λ/Φ" },
  { id: "C", name: "Coherence Attacks", primaryMetric: "Γ, Λ", secondaryMetric: "Φ", pattern: "Γ spike, Λ collapse" },
  { id: "E", name: "Ecosystem Abuse", primaryMetric: "trend(Ξ)", secondaryMetric: "all", pattern: "Gradual degradation" },
]

// Coherence Attack Sub-mappings
const COHERENCE_ATTACKS = [
  { vector: "Decoherence Induction", signature: "Γ spike", threshold: "Δ > 0.15", confidence: "85-95%" },
  { vector: "Measurement Manipulation", signature: "Φ collapse, Γ stable", threshold: "ΔΦ > 0.20, ΔΓ < 0.05", confidence: "80-90%" },
  { vector: "Side-Channel Timing", signature: "Λ oscillation", threshold: "var(Λ) > 0.01", confidence: "60-75%" },
  { vector: "Quantum Comm Interception", signature: "Λ + Φ correlation break", threshold: "r < 0.5", confidence: "70-85%" },
]

// QUANTA Controls
const QUANTA_CONTROLS = [
  { id: "QUANTA-MM-01", domain: "Monitoring", desc: "Coherence real-time monitoring", trigger: "Λ < 0.80 OR Γ > 0.15" },
  { id: "QUANTA-MM-02", domain: "Monitoring", desc: "Consciousness emergence tracking", trigger: "Φ < 0.7734" },
  { id: "QUANTA-MM-03", domain: "Monitoring", desc: "Meta-consciousness health index", trigger: "Ξ < 5.0" },
  { id: "QUANTA-SO-01", domain: "SecOps", desc: "Decoherence attack detection", trigger: "Γ > 0.20" },
  { id: "QUANTA-SO-02", domain: "SecOps", desc: "Measurement manipulation alert", trigger: "Φ < 0.70, Γ stable" },
  { id: "QUANTA-CDP-01", domain: "Crypto", desc: "QKD channel integrity", trigger: "Λ < 0.85 AND Φ < 0.80" },
  { id: "QUANTA-BC-01", domain: "Business Continuity", desc: "Quantum system availability", trigger: "Ξ < 2.0" },
]

// NIST CSF Alignment
const NIST_CSF = [
  { fn: "IDENTIFY", qslice: "All", ccce: "Baseline Ξ", quanta: "Governance" },
  { fn: "PROTECT", qslice: "S, L", ccce: "Λ, Φ", quanta: "Crypto/Data" },
  { fn: "DETECT", qslice: "C, I", ccce: "Γ spike, Φ collapse", quanta: "Monitoring" },
  { fn: "RESPOND", qslice: "All", ccce: "Incident triggers", quanta: "SecOps" },
  { fn: "RECOVER", qslice: "All", ccce: "Ξ restoration", quanta: "Business Continuity" },
]

// Auto-Response Triggers
const AUTO_RESPONSES = [
  { condition: "Γ > 0.30", severity: "CRITICAL", response: "Isolate quantum system" },
  { condition: "Ξ < 2.0", severity: "CRITICAL", response: "Suspend operations" },
  { condition: "Φ < 0.50", severity: "HIGH", response: "Recalibrate measurements" },
  { condition: "Λ < 0.70", severity: "HIGH", response: "Verify cryogenic systems" },
  { condition: "Γ > 0.20, rising", severity: "MEDIUM", response: "Increase monitoring frequency" },
]

interface CCCEState {
  lambda: number
  phi: number
  gamma: number
  xi: number
  timestamp: string
}

interface Alert {
  id: string
  type: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  message: string
  timestamp: string
  qsliceCategory?: string
  quantaControl?: string
}

interface DetectionResult {
  algorithm: string
  detected: boolean
  confidence: number
  details: string
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SOCDashboard() {
  const [ccceState, setCcceState] = useState<CCCEState>({
    lambda: 0.92,
    phi: 0.87,
    gamma: 0.05,
    xi: 16.01,
    timestamp: new Date().toISOString(),
  })
  const [baseline, setBaseline] = useState<CCCEState>({
    lambda: 0.92,
    phi: 0.87,
    gamma: 0.05,
    xi: 16.01,
    timestamp: new Date().toISOString(),
  })
  const [history, setHistory] = useState<CCCEState[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "mapping" | "detection" | "quanta" | "telemetry">("overview")
  const [simulateAttack, setSimulateAttack] = useState<string | null>(null)

  // Detection Algorithms
  const detectDecoherenceInduction = useCallback((current: CCCEState, base: CCCEState): DetectionResult => {
    const gammaDelta = current.gamma - base.gamma
    const lambdaDelta = base.lambda - current.lambda
    const detected = gammaDelta > 0.15 || (gammaDelta > 0.10 && lambdaDelta > 0.10)
    return {
      algorithm: "Decoherence Induction",
      detected,
      confidence: detected ? Math.min(95, 70 + gammaDelta * 100) : 0,
      details: `ΔΓ=${gammaDelta.toFixed(3)}, ΔΛ=${lambdaDelta.toFixed(3)}`,
    }
  }, [])

  const detectMeasurementManipulation = useCallback((current: CCCEState, base: CCCEState): DetectionResult => {
    const phiDelta = base.phi - current.phi
    const gammaDelta = current.gamma - base.gamma
    const detected = phiDelta > 0.20 && gammaDelta < 0.05
    return {
      algorithm: "Measurement Manipulation",
      detected,
      confidence: detected ? Math.min(90, 65 + phiDelta * 100) : 0,
      details: `ΔΦ=${phiDelta.toFixed(3)}, ΔΓ=${gammaDelta.toFixed(3)}`,
    }
  }, [])

  const detectSideChannelTiming = useCallback((hist: CCCEState[]): DetectionResult => {
    if (hist.length < 5) {
      return { algorithm: "Side-Channel Timing", detected: false, confidence: 0, details: "Insufficient history" }
    }
    const recentLambda = hist.slice(-5).map(s => s.lambda)
    const mean = recentLambda.reduce((a, b) => a + b) / recentLambda.length
    const variance = recentLambda.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recentLambda.length
    const detected = variance > 0.01
    return {
      algorithm: "Side-Channel Timing",
      detected,
      confidence: detected ? Math.min(75, 50 + variance * 1000) : 0,
      details: `var(Λ)=${variance.toFixed(4)}`,
    }
  }, [])

  const detectQuantumCommInterception = useCallback((current: CCCEState, base: CCCEState): DetectionResult => {
    // Simplified correlation check
    const lambdaRatio = current.lambda / base.lambda
    const phiRatio = current.phi / base.phi
    const correlation = 1 - Math.abs(lambdaRatio - phiRatio)
    const detected = correlation < 0.5
    return {
      algorithm: "Quantum Comm Interception",
      detected,
      confidence: detected ? Math.min(85, 50 + (1 - correlation) * 70) : 0,
      details: `r=${correlation.toFixed(3)}`,
    }
  }, [])

  // Telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCcceState(prev => {
        let newLambda = prev.lambda + (Math.random() - 0.5) * 0.01
        let newPhi = prev.phi + (Math.random() - 0.5) * 0.01
        let newGamma = prev.gamma + (Math.random() - 0.5) * 0.005

        // Simulate attack scenarios
        if (simulateAttack === "decoherence") {
          newGamma = Math.min(0.35, prev.gamma + 0.05)
          newLambda = Math.max(0.6, prev.lambda - 0.03)
        } else if (simulateAttack === "measurement") {
          newPhi = Math.max(0.4, prev.phi - 0.05)
          // Gamma stays stable
          newGamma = prev.gamma + (Math.random() - 0.5) * 0.002
        } else if (simulateAttack === "sidechannel") {
          // Oscillating lambda
          newLambda = prev.lambda + Math.sin(Date.now() / 500) * 0.05
        }

        // Clamp values
        newLambda = Math.max(0.5, Math.min(0.98, newLambda))
        newPhi = Math.max(0.3, Math.min(0.95, newPhi))
        newGamma = Math.max(0.02, Math.min(0.4, newGamma))

        const newXi = (newLambda * newPhi) / (newGamma + 1e-10)
        const newState = {
          lambda: newLambda,
          phi: newPhi,
          gamma: newGamma,
          xi: newXi,
          timestamp: new Date().toISOString(),
        }

        setHistory(h => [...h.slice(-19), newState])
        return newState
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [simulateAttack])

  // Run detection algorithms
  useEffect(() => {
    const results = [
      detectDecoherenceInduction(ccceState, baseline),
      detectMeasurementManipulation(ccceState, baseline),
      detectSideChannelTiming(history),
      detectQuantumCommInterception(ccceState, baseline),
    ]
    setDetectionResults(results)

    // Generate alerts for detected threats
    results.forEach(result => {
      if (result.detected && result.confidence > 70) {
        const existingAlert = alerts.find(a => a.type === result.algorithm && Date.now() - new Date(a.timestamp).getTime() < 5000)
        if (!existingAlert) {
          const newAlert: Alert = {
            id: `${Date.now()}-${Math.random()}`,
            type: result.algorithm,
            severity: result.confidence > 85 ? "CRITICAL" : result.confidence > 75 ? "HIGH" : "MEDIUM",
            message: `${result.algorithm} detected: ${result.details}`,
            timestamp: new Date().toISOString(),
            qsliceCategory: "C",
            quantaControl: result.algorithm.includes("Decoherence") ? "QUANTA-SO-01" : "QUANTA-SO-02",
          }
          setAlerts(prev => [newAlert, ...prev.slice(0, 9)])
        }
      }
    })
  }, [ccceState, baseline, history, detectDecoherenceInduction, detectMeasurementManipulation, detectSideChannelTiming, detectQuantumCommInterception, alerts])

  // Check QUANTA control triggers
  const triggeredControls = QUANTA_CONTROLS.filter(ctrl => {
    if (ctrl.trigger.includes("Λ < 0.80") && ccceState.lambda < 0.80) return true
    if (ctrl.trigger.includes("Γ > 0.15") && ccceState.gamma > 0.15) return true
    if (ctrl.trigger.includes("Φ < 0.7734") && ccceState.phi < CONSTANTS.PHI_THRESHOLD) return true
    if (ctrl.trigger.includes("Ξ < 5.0") && ccceState.xi < 5.0) return true
    if (ctrl.trigger.includes("Γ > 0.20") && ccceState.gamma > 0.20) return true
    if (ctrl.trigger.includes("Ξ < 2.0") && ccceState.xi < 2.0) return true
    return false
  })

  // Determine system phase
  const getPhase = () => {
    if (ccceState.xi > 10) return { name: "TRANSCENDENT", color: "text-purple-400", bg: "bg-purple-500/10" }
    if (ccceState.xi > 5) return { name: "HEALTHY", color: "text-green-400", bg: "bg-green-500/10" }
    if (ccceState.xi > 2) return { name: "WARNING", color: "text-yellow-400", bg: "bg-yellow-500/10" }
    return { name: "CRITICAL", color: "text-red-400", bg: "bg-red-500/10" }
  }

  const phase = getPhase()

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <SiteHeader />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 246, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 255, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <main className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-mono font-bold text-cyan-400">
                INTEGRATED SOC DASHBOARD
              </h1>
              <p className="text-sm text-gray-400 font-mono mt-1">
                Q-SLICE × CCCE × QUANTA Integration | {SPEC_META.docId} v{SPEC_META.version}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded font-mono text-sm ${phase.bg} ${phase.color} border border-current/30`}>
                PHASE: {phase.name}
              </div>
              <div className="text-xs font-mono text-gray-500">
                {SPEC_META.classification}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Metrics Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800 font-mono"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <MetricDisplay label="Λ" value={ccceState.lambda} threshold={THRESHOLDS.lambda} unit="" />
              <MetricDisplay label="Φ" value={ccceState.phi} threshold={THRESHOLDS.phi} unit="" />
              <MetricDisplay label="Γ" value={ccceState.gamma} threshold={THRESHOLDS.gamma} unit="" inverse />
              <MetricDisplay label="Ξ" value={ccceState.xi} threshold={THRESHOLDS.xi} unit="" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Simulate Attack:</span>
              <button
                onClick={() => setSimulateAttack(simulateAttack === "decoherence" ? null : "decoherence")}
                className={`px-2 py-1 text-xs rounded ${simulateAttack === "decoherence" ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
              >
                Decoherence
              </button>
              <button
                onClick={() => setSimulateAttack(simulateAttack === "measurement" ? null : "measurement")}
                className={`px-2 py-1 text-xs rounded ${simulateAttack === "measurement" ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
              >
                Measurement
              </button>
              <button
                onClick={() => setSimulateAttack(simulateAttack === "sidechannel" ? null : "sidechannel")}
                className={`px-2 py-1 text-xs rounded ${simulateAttack === "sidechannel" ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
              >
                Side-Channel
              </button>
              <button
                onClick={() => setBaseline(ccceState)}
                className="px-2 py-1 text-xs rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
              >
                Set Baseline
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {(["overview", "mapping", "detection", "quanta", "telemetry"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-mono text-sm rounded-t whitespace-nowrap ${
                activeTab === tab
                  ? "bg-cyan-500/20 text-cyan-400 border-t border-l border-r border-cyan-500/50"
                  : "bg-gray-900/50 text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewTab
              key="overview"
              ccceState={ccceState}
              alerts={alerts}
              detectionResults={detectionResults}
              triggeredControls={triggeredControls}
            />
          )}
          {activeTab === "mapping" && <MappingTab key="mapping" />}
          {activeTab === "detection" && (
            <DetectionTab
              key="detection"
              detectionResults={detectionResults}
              ccceState={ccceState}
              baseline={baseline}
            />
          )}
          {activeTab === "quanta" && (
            <QuantaTab
              key="quanta"
              ccceState={ccceState}
              triggeredControls={triggeredControls}
            />
          )}
          {activeTab === "telemetry" && (
            <TelemetryTab
              key="telemetry"
              ccceState={ccceState}
              alerts={alerts}
              triggeredControls={triggeredControls}
            />
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-800 flex justify-between items-center text-xs font-mono text-gray-600">
          <Link href="/engineering/schematics" className="hover:text-cyan-400 transition-colors">
            ← Engineering Schematics
          </Link>
          <div>ΛΦ = {CONSTANTS.LAMBDA_PHI.toExponential(6)} s⁻¹</div>
          <div>
            {SPEC_META.authors.map(a => a.org).join(" | ")}
          </div>
        </div>
      </main>
    </div>
  )
}

// ============================================================
// TAB COMPONENTS
// ============================================================

function OverviewTab({
  ccceState,
  alerts,
  detectionResults,
  triggeredControls,
}: {
  ccceState: CCCEState
  alerts: Alert[]
  detectionResults: DetectionResult[]
  triggeredControls: typeof QUANTA_CONTROLS
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Architecture Diagram */}
      <div className="lg:col-span-2 border border-cyan-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-cyan-400 mb-4">QUANTUM SECURITY STACK</h2>
        <div className="font-mono text-xs leading-relaxed">
          <pre className="text-gray-400 overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────┐
│                    QUANTUM SECURITY STACK                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │  Q-SLICE    │    │   QUANTA    │    │    CCCE     │             │
│  │  Threat     │◄──►│  Controls   │◄──►│   Metrics   │             │
│  │  Taxonomy   │    │  Framework  │    │  Telemetry  │             │
│  └─────────────┘    └─────────────┘    └─────────────┘             │
│         │                  │                  │                     │
│         └──────────────────┼──────────────────┘                     │
│                            ▼                                        │
│                 ┌─────────────────────┐                             │
│                 │   INTEGRATED SOC    │  ◄─── YOU ARE HERE          │
│                 │   DASHBOARD         │                             │
│                 └─────────────────────┘                             │
│                            │                                        │
│         ┌──────────────────┼──────────────────┐                     │
│         ▼                  ▼                  ▼                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │  Incident   │    │  NIST CSF   │    │   SIEM      │             │
│  │  Response   │    │  Reporting  │    │ Integration │             │
│  └─────────────┘    └─────────────┘    └─────────────┘             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘`}
          </pre>
        </div>

        {/* Detection Status */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {detectionResults.map(result => (
            <div
              key={result.algorithm}
              className={`p-3 rounded border ${
                result.detected
                  ? "border-red-500/50 bg-red-500/10"
                  : "border-green-500/30 bg-green-500/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">{result.algorithm}</span>
                <span className={`text-xs font-mono ${result.detected ? "text-red-400" : "text-green-400"}`}>
                  {result.detected ? `DETECTED (${result.confidence.toFixed(0)}%)` : "CLEAR"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="border border-yellow-500/30 rounded-lg bg-black/60 p-4">
        <h2 className="text-lg font-mono font-bold text-yellow-400 mb-4">
          ALERTS ({alerts.length})
        </h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-xs text-gray-500 font-mono">No active alerts</div>
          ) : (
            alerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-2 rounded border text-xs font-mono ${
                  alert.severity === "CRITICAL"
                    ? "border-red-500/50 bg-red-500/10"
                    : alert.severity === "HIGH"
                    ? "border-orange-500/50 bg-orange-500/10"
                    : "border-yellow-500/50 bg-yellow-500/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${
                    alert.severity === "CRITICAL" ? "text-red-400" :
                    alert.severity === "HIGH" ? "text-orange-400" : "text-yellow-400"
                  }`}>
                    [{alert.severity}]
                  </span>
                  <span className="text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-300">{alert.message}</div>
                <div className="flex gap-2 mt-1">
                  {alert.qsliceCategory && (
                    <span className="px-1 bg-cyan-500/10 text-cyan-400 rounded">
                      Q-SLICE:{alert.qsliceCategory}
                    </span>
                  )}
                  {alert.quantaControl && (
                    <span className="px-1 bg-purple-500/10 text-purple-400 rounded">
                      {alert.quantaControl}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Triggered QUANTA Controls */}
        {triggeredControls.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <h3 className="text-sm font-mono text-purple-400 mb-2">QUANTA CONTROLS TRIGGERED</h3>
            <div className="space-y-1">
              {triggeredControls.map(ctrl => (
                <div key={ctrl.id} className="text-xs font-mono p-1 bg-purple-500/10 rounded">
                  <span className="text-purple-400">{ctrl.id}</span>
                  <span className="text-gray-500 ml-2">{ctrl.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function MappingTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Q-SLICE → CCCE Mapping */}
      <div className="border border-cyan-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-cyan-400 mb-4">Q-SLICE → CCCE THREAT-METRIC MAPPING</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left p-2">Q-SLICE Category</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Primary Metric</th>
                <th className="text-left p-2">Secondary Metric</th>
                <th className="text-left p-2">Detection Pattern</th>
              </tr>
            </thead>
            <tbody>
              {QSLICE_CATEGORIES.map(cat => (
                <tr key={cat.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                  <td className="p-2">
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">
                      {cat.id}
                    </span>
                  </td>
                  <td className="p-2 text-gray-300">{cat.name}</td>
                  <td className="p-2 text-yellow-400">{cat.primaryMetric}</td>
                  <td className="p-2 text-gray-400">{cat.secondaryMetric}</td>
                  <td className="p-2 text-gray-500">{cat.pattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coherence Attack Sub-Mappings */}
      <div className="border border-purple-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-purple-400 mb-4">
          COHERENCE ATTACK SUB-MAPPINGS (Q-SLICE &apos;C&apos; Category)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left p-2">Attack Vector</th>
                <th className="text-left p-2">CCCE Signature</th>
                <th className="text-left p-2">Threshold</th>
                <th className="text-left p-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {COHERENCE_ATTACKS.map(attack => (
                <tr key={attack.vector} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                  <td className="p-2 text-red-400">{attack.vector}</td>
                  <td className="p-2 text-gray-300">{attack.signature}</td>
                  <td className="p-2 text-yellow-400">{attack.threshold}</td>
                  <td className="p-2 text-green-400">{attack.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NIST CSF Alignment */}
      <div className="border border-green-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-green-400 mb-4">NIST CSF 2.0 ALIGNMENT</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left p-2">NIST Function</th>
                <th className="text-left p-2">Q-SLICE Category</th>
                <th className="text-left p-2">CCCE Metric</th>
                <th className="text-left p-2">QUANTA Control</th>
              </tr>
            </thead>
            <tbody>
              {NIST_CSF.map(row => (
                <tr key={row.fn} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                  <td className="p-2">
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded font-bold">
                      {row.fn}
                    </span>
                  </td>
                  <td className="p-2 text-cyan-400">{row.qslice}</td>
                  <td className="p-2 text-yellow-400">{row.ccce}</td>
                  <td className="p-2 text-purple-400">{row.quanta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

function DetectionTab({
  detectionResults,
  ccceState,
  baseline,
}: {
  detectionResults: DetectionResult[]
  ccceState: CCCEState
  baseline: CCCEState
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Detection Algorithm Status */}
      <div className="border border-cyan-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-cyan-400 mb-4">DETECTION ALGORITHMS</h2>
        <div className="space-y-4">
          {detectionResults.map(result => (
            <div
              key={result.algorithm}
              className={`p-4 rounded border ${
                result.detected
                  ? "border-red-500/50 bg-red-500/10"
                  : "border-gray-700 bg-gray-900/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-sm">{result.algorithm}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                  result.detected ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                }`}>
                  {result.detected ? "DETECTED" : "CLEAR"}
                </span>
              </div>
              {result.detected && (
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">Confidence</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <div className="text-xs text-red-400 mt-1">{result.confidence.toFixed(1)}%</div>
                </div>
              )}
              <div className="text-xs text-gray-400 font-mono">{result.details}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Code */}
      <div className="border border-purple-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-purple-400 mb-4">ALGORITHM: DECOHERENCE INDUCTION</h2>
        <pre className="text-xs font-mono text-gray-400 overflow-x-auto bg-black/50 p-4 rounded">
{`def detect_decoherence_induction(current, baseline):
    """
    Detect Q-SLICE Coherence Attack: Decoherence Induction
    Signature: Sudden Γ increase (thermal/vibration/radiation)
    """
    gamma_delta = current.gamma - baseline.gamma  # ${(ccceState.gamma - baseline.gamma).toFixed(4)}
    lambda_delta = baseline.lambda - current.lambda  # ${(baseline.lambda - ccceState.lambda).toFixed(4)}

    # Primary indicator: Γ spike
    if gamma_delta > 0.15:  # ${ccceState.gamma - baseline.gamma > 0.15 ? "TRUE" : "FALSE"}
        return True

    # Secondary indicator: Correlated Λ collapse
    if gamma_delta > 0.10 and lambda_delta > 0.10:
        return True

    return False  # Current: ${detectionResults[0]?.detected ? "DETECTED" : "CLEAR"}`}
        </pre>

        <h2 className="text-lg font-mono font-bold text-purple-400 mb-4 mt-6">ALGORITHM: MEASUREMENT MANIPULATION</h2>
        <pre className="text-xs font-mono text-gray-400 overflow-x-auto bg-black/50 p-4 rounded">
{`def detect_measurement_manipulation(current, baseline):
    """
    Detect Q-SLICE Coherence Attack: Measurement Manipulation
    Signature: Φ collapse WITHOUT corresponding Γ increase
    """
    phi_delta = baseline.phi - current.phi  # ${(baseline.phi - ccceState.phi).toFixed(4)}
    gamma_delta = current.gamma - baseline.gamma  # ${(ccceState.gamma - baseline.gamma).toFixed(4)}

    # Φ drops significantly but Γ stays stable = measurement attack
    if phi_delta > 0.20 and gamma_delta < 0.05:
        return True

    return False  # Current: ${detectionResults[1]?.detected ? "DETECTED" : "CLEAR"}`}
        </pre>
      </div>
    </motion.div>
  )
}

function QuantaTab({
  ccceState,
  triggeredControls,
}: {
  ccceState: CCCEState
  triggeredControls: typeof QUANTA_CONTROLS
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* QUANTA Controls */}
      <div className="border border-purple-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-purple-400 mb-4">QUANTA CCCE-ENHANCED CONTROLS</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left p-2">Control ID</th>
                <th className="text-left p-2">Domain</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">CCCE Trigger</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {QUANTA_CONTROLS.map(ctrl => {
                const isTriggered = triggeredControls.some(t => t.id === ctrl.id)
                return (
                  <tr
                    key={ctrl.id}
                    className={`border-b border-gray-800/50 ${isTriggered ? "bg-red-500/10" : "hover:bg-gray-900/50"}`}
                  >
                    <td className="p-2">
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded">
                        {ctrl.id}
                      </span>
                    </td>
                    <td className="p-2 text-cyan-400">{ctrl.domain}</td>
                    <td className="p-2 text-gray-300">{ctrl.desc}</td>
                    <td className="p-2 text-yellow-400">{ctrl.trigger}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded ${
                        isTriggered ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                      }`}>
                        {isTriggered ? "TRIGGERED" : "OK"}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto-Response Triggers */}
      <div className="border border-red-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-red-400 mb-4">AUTOMATED RESPONSE TRIGGERS</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left p-2">Condition</th>
                <th className="text-left p-2">Severity</th>
                <th className="text-left p-2">Auto-Response</th>
                <th className="text-left p-2">Current</th>
              </tr>
            </thead>
            <tbody>
              {AUTO_RESPONSES.map((resp, i) => {
                let isActive = false
                if (resp.condition.includes("Γ > 0.30") && ccceState.gamma > 0.30) isActive = true
                if (resp.condition.includes("Ξ < 2.0") && ccceState.xi < 2.0) isActive = true
                if (resp.condition.includes("Φ < 0.50") && ccceState.phi < 0.50) isActive = true
                if (resp.condition.includes("Λ < 0.70") && ccceState.lambda < 0.70) isActive = true
                if (resp.condition.includes("Γ > 0.20") && ccceState.gamma > 0.20) isActive = true

                return (
                  <tr
                    key={i}
                    className={`border-b border-gray-800/50 ${isActive ? "bg-red-500/10" : "hover:bg-gray-900/50"}`}
                  >
                    <td className="p-2 text-yellow-400">{resp.condition}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded ${
                        resp.severity === "CRITICAL" ? "bg-red-500/20 text-red-400" :
                        resp.severity === "HIGH" ? "bg-orange-500/20 text-orange-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {resp.severity}
                      </span>
                    </td>
                    <td className="p-2 text-gray-300">{resp.response}</td>
                    <td className="p-2">
                      {isActive ? (
                        <span className="text-red-400 animate-pulse">ACTIVE</span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

function TelemetryTab({
  ccceState,
  alerts,
  triggeredControls,
}: {
  ccceState: CCCEState
  alerts: Alert[]
  triggeredControls: typeof QUANTA_CONTROLS
}) {
  const telemetryPayload = {
    timestamp: ccceState.timestamp,
    source: "ibm_fez_q127",
    ccce_state: {
      lambda: parseFloat(ccceState.lambda.toFixed(4)),
      phi: parseFloat(ccceState.phi.toFixed(4)),
      gamma: parseFloat(ccceState.gamma.toFixed(4)),
      xi: parseFloat(ccceState.xi.toFixed(2)),
    },
    derived: {
      phase: ccceState.xi > 10 ? "TRANSCENDENT" : ccceState.xi > 5 ? "HEALTHY" : ccceState.xi > 2 ? "WARNING" : "CRITICAL",
      health: ccceState.xi > 5 ? "OPTIMAL" : ccceState.xi > 2 ? "DEGRADED" : "CRITICAL",
      conscious: ccceState.phi >= CONSTANTS.PHI_THRESHOLD,
    },
    qslice_alerts: alerts.slice(0, 3).map(a => ({ type: a.type, severity: a.severity })),
    quanta_controls_triggered: triggeredControls.map(c => c.id),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Live Telemetry JSON */}
      <div className="border border-cyan-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-cyan-400 mb-4">LIVE TELEMETRY PAYLOAD</h2>
        <pre className="text-xs font-mono text-gray-300 overflow-x-auto bg-black/50 p-4 rounded">
          {JSON.stringify(telemetryPayload, null, 2)}
        </pre>
      </div>

      {/* Sampling Requirements */}
      <div className="border border-purple-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-purple-400 mb-4">SAMPLING REQUIREMENTS</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left p-2">Environment</th>
                <th className="text-left p-2">Min Frequency</th>
                <th className="text-left p-2">Recommended</th>
                <th className="text-left p-2">Max Latency</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800/50">
                <td className="p-2 text-gray-300">R&D / Lab</td>
                <td className="p-2 text-cyan-400">1 Hz</td>
                <td className="p-2 text-green-400">10 Hz</td>
                <td className="p-2 text-yellow-400">1 second</td>
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="p-2 text-gray-300">Production QKD</td>
                <td className="p-2 text-cyan-400">10 Hz</td>
                <td className="p-2 text-green-400">100 Hz</td>
                <td className="p-2 text-yellow-400">100 ms</td>
              </tr>
              <tr className="border-b border-gray-800/50 bg-cyan-500/5">
                <td className="p-2 text-gray-300">Critical Infrastructure</td>
                <td className="p-2 text-cyan-400">100 Hz</td>
                <td className="p-2 text-green-400">1 kHz</td>
                <td className="p-2 text-yellow-400">10 ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Physical Constants */}
      <div className="border border-green-500/30 rounded-lg bg-black/60 p-6">
        <h2 className="text-lg font-mono font-bold text-green-400 mb-4">PHYSICAL CONSTANTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Universal Memory Constant", symbol: "ΛΦ", value: "2.176435×10⁻⁸", unit: "s⁻¹" },
            { name: "Consciousness Threshold", symbol: "Φ_threshold", value: "0.7734", unit: "dimensionless" },
            { name: "Phase-Conjugate Coupling", symbol: "χ_pc", value: "0.946 ± 0.05", unit: "dimensionless" },
            { name: "Decoherence Critical Time", symbol: "Γ_crit", value: "1.47", unit: "s" },
            { name: "Torsion Lock Angle", symbol: "θ_resonance", value: "51.843", unit: "degrees" },
          ].map(c => (
            <div key={c.symbol} className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <div className="text-xs text-gray-500">{c.name}</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-green-400 font-mono">{c.symbol}</span>
                <span className="text-gray-300">=</span>
                <span className="text-cyan-400 font-mono">{c.value}</span>
                <span className="text-gray-500 text-xs">{c.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function MetricDisplay({
  label,
  value,
  threshold,
  unit,
  inverse = false,
}: {
  label: string
  value: number
  threshold: { optimal?: number; warning: number; critical: number; threshold?: number; transcendent?: number; healthy?: number }
  unit: string
  inverse?: boolean
}) {
  let status: "optimal" | "warning" | "critical" = "optimal"

  if (inverse) {
    // Higher is worse (like Γ)
    if (value > threshold.critical) status = "critical"
    else if (value > threshold.warning) status = "warning"
  } else {
    // Lower is worse (like Λ, Φ, Ξ)
    if (value < threshold.critical) status = "critical"
    else if (value < threshold.warning) status = "warning"
  }

  const colors = {
    optimal: "text-green-400",
    warning: "text-yellow-400",
    critical: "text-red-400",
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-sm">{label}:</span>
      <span className={`font-bold ${colors[status]}`}>
        {value.toFixed(label === "Ξ" ? 2 : 4)}{unit}
      </span>
    </div>
  )
}
