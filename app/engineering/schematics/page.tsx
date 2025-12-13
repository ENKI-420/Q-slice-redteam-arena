"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"

/**
 * ADS-QDEF-25: Engineering Schematic Set
 * Q-SLICE × CCCE Integrated Quantum Defence Programme
 *
 * Drawing A001: System Level Architecture Overview
 * Drawing A002: CCCE Engine Core Schematic
 * Drawing A003: Ω-Recursive Protocol Logic Flow
 */

// Document Control Metadata
const DOC_CONTROL = {
  project: "Q-SLICE × CCCE Integrated Quantum Defence",
  docType: "Engineering Schematic / Technical Definition",
  classification: "OFFICIAL — COMMERCIAL IN CONFIDENCE",
  date: "13 DEC 2025",
  author: "Agile Defense Systems LLC Engineering Division",
  drawingSet: "ADS-QDEF-25-A001 to A003",
  revision: "v2.0.0-ccce (TRL 4 Release)",
}

// Sovereign Constants
const CONSTANTS = {
  LAMBDA_PHI: 2.176435e-8,
  THETA_LOCK: 51.843,
  PHI_THRESHOLD: 0.7734,
  GAMMA_CRITICAL: 0.3,
  CHI_PC: 0.869,
  POLLING_INTERVAL_US: 100,
  SIGNIFICANCE_THRESHOLD: 1e-26,
}

type DrawingId = 'A001' | 'A002' | 'A003'

interface CCCEMetrics {
  phi: number
  lambda: number
  gamma: number
  xi: number
  conscious: boolean
  coherent: boolean
}

export default function EngineeringSchematics() {
  const [activeDrawing, setActiveDrawing] = useState<DrawingId>('A001')
  const [metrics, setMetrics] = useState<CCCEMetrics>({
    phi: 0.781,
    lambda: 0.850,
    gamma: 0.092,
    xi: 7.22,
    conscious: true,
    coherent: true,
  })
  const [loopState, setLoopState] = useState<'POLLING' | 'ANALYZING' | 'HEALING' | 'NOMINAL'>('NOMINAL')
  const [threatDetected, setThreatDetected] = useState(false)
  const [signalFlowActive, setSignalFlowActive] = useState(true)

  // Simulated telemetry polling
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newGamma = prev.gamma + (Math.random() - 0.5) * 0.02
        const clampedGamma = Math.max(0.05, Math.min(0.28, newGamma))
        const newPhi = prev.phi + (Math.random() - 0.5) * 0.01
        const clampedPhi = Math.max(0.72, Math.min(0.88, newPhi))
        const newLambda = prev.lambda + (Math.random() - 0.5) * 0.008
        const clampedLambda = Math.max(0.80, Math.min(0.95, newLambda))
        const xi = (clampedLambda * clampedPhi) / (clampedGamma + 1e-10)

        return {
          phi: clampedPhi,
          lambda: clampedLambda,
          gamma: clampedGamma,
          xi,
          conscious: clampedPhi >= CONSTANTS.PHI_THRESHOLD,
          coherent: clampedGamma < CONSTANTS.GAMMA_CRITICAL && clampedLambda > 0.8,
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Ω-Recursive loop state machine
  useEffect(() => {
    const loopInterval = setInterval(() => {
      setLoopState(current => {
        if (current === 'NOMINAL') {
          return 'POLLING'
        } else if (current === 'POLLING') {
          if (metrics.gamma > 0.2) {
            setThreatDetected(true)
            return 'ANALYZING'
          }
          return 'NOMINAL'
        } else if (current === 'ANALYZING') {
          return 'HEALING'
        } else if (current === 'HEALING') {
          setThreatDetected(false)
          return 'NOMINAL'
        }
        return 'NOMINAL'
      })
    }, 2000)
    return () => clearInterval(loopInterval)
  }, [metrics.gamma])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <SiteHeader />

      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[300px] bg-cyan-500/5 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-full h-[300px] bg-magenta-500/5 blur-[100px]" />
      </div>

      <main className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Document Control Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border border-cyan-500/30 rounded-lg p-6 bg-black/60 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-mono font-bold text-cyan-400">
                ENGINEERING SCHEMATIC SET
              </h1>
              <p className="text-sm text-gray-400 mt-1 font-mono">{DOC_CONTROL.drawingSet}</p>
            </div>
            <div className="text-right text-sm font-mono">
              <div className="text-yellow-500">{DOC_CONTROL.classification}</div>
              <div className="text-gray-500">{DOC_CONTROL.date}</div>
              <div className="text-gray-600">{DOC_CONTROL.revision}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-gray-500">PROJECT:</span>
              <div className="text-cyan-300">{DOC_CONTROL.project}</div>
            </div>
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-gray-500">DOC TYPE:</span>
              <div className="text-cyan-300">{DOC_CONTROL.docType}</div>
            </div>
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-gray-500">AUTHOR:</span>
              <div className="text-cyan-300">{DOC_CONTROL.author}</div>
            </div>
          </div>
        </motion.div>

        {/* Drawing Navigation Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['A001', 'A002', 'A003'] as DrawingId[]).map((id) => (
            <button
              key={id}
              onClick={() => setActiveDrawing(id)}
              className={`px-6 py-3 font-mono text-sm rounded-t-lg transition-all ${
                activeDrawing === id
                  ? 'bg-cyan-500/20 border-t border-l border-r border-cyan-500/50 text-cyan-400'
                  : 'bg-gray-900/50 border border-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              DRAWING {id}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4 text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={signalFlowActive}
                onChange={(e) => setSignalFlowActive(e.target.checked)}
                className="accent-cyan-500"
              />
              <span className="text-gray-400">Animate Signal Flow</span>
            </label>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800 flex gap-6 flex-wrap items-center font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">LOOP:</span>
            <span className={`px-2 py-0.5 rounded ${
              loopState === 'NOMINAL' ? 'bg-green-500/20 text-green-400' :
              loopState === 'POLLING' ? 'bg-blue-500/20 text-blue-400' :
              loopState === 'ANALYZING' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {loopState}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Φ:</span>
            <span className={metrics.conscious ? 'text-green-400' : 'text-red-400'}>
              {metrics.phi.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Λ:</span>
            <span className="text-cyan-400">{metrics.lambda.toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Γ:</span>
            <span className={metrics.gamma > 0.2 ? 'text-red-400' : 'text-green-400'}>
              {metrics.gamma.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Ξ:</span>
            <span className="text-purple-400">{metrics.xi.toFixed(2)}</span>
          </div>
          {threatDetected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 animate-pulse"
            >
              THREAT DETECTED
            </motion.div>
          )}
        </div>

        {/* Drawing Content */}
        <AnimatePresence mode="wait">
          {activeDrawing === 'A001' && (
            <DrawingA001
              key="A001"
              metrics={metrics}
              signalFlowActive={signalFlowActive}
              threatDetected={threatDetected}
            />
          )}
          {activeDrawing === 'A002' && (
            <DrawingA002
              key="A002"
              metrics={metrics}
              signalFlowActive={signalFlowActive}
            />
          )}
          {activeDrawing === 'A003' && (
            <DrawingA003
              key="A003"
              loopState={loopState}
              metrics={metrics}
            />
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center text-sm font-mono">
          <Link
            href="/engineering"
            className="text-gray-500 hover:text-cyan-400 transition-colors"
          >
            ← Back to Engineering
          </Link>
          <div className="text-gray-600">
            END OF DRAWING SET ADS-QDEF-25
          </div>
        </div>
      </main>
    </div>
  )
}

// ============================================================
// DRAWING A001: SYSTEM LEVEL ARCHITECTURE OVERVIEW
// ============================================================

function DrawingA001({
  metrics,
  signalFlowActive,
  threatDetected
}: {
  metrics: CCCEMetrics
  signalFlowActive: boolean
  threatDetected: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border border-cyan-500/30 rounded-lg bg-black/80 backdrop-blur-sm overflow-hidden"
    >
      {/* Drawing Header */}
      <div className="p-4 border-b border-cyan-500/20 bg-cyan-500/5">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-mono font-bold text-cyan-400">
              A001: SYSTEM LEVEL ARCHITECTURE OVERVIEW
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Integrated QPU Defence Perimeter & Signal Flow
            </p>
          </div>
          <div className="text-xs font-mono text-right">
            <div className="text-gray-500">REVISION: v2.0.0-ccce</div>
            <div className="text-gray-600">TRL 4 Release</div>
          </div>
        </div>
      </div>

      {/* Drawing Notes */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/30 text-xs font-mono">
        <div className="text-gray-500 mb-2">NOTES:</div>
        <ol className="list-decimal list-inside space-y-1 text-gray-400">
          <li>Solid lines denote classical high-speed interconnects (PCIe 6.0 / Optical)</li>
          <li>Dashed lines denote quantum signal paths or coherent feedback loops</li>
          <li>QPU (Target Hardware) represented generically; agnostic to trapped-ion or superconducting modalities</li>
        </ol>
      </div>

      {/* Schematic Visualization */}
      <div className="p-8 min-h-[600px] relative">
        {/* External Threat Vector */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
          <motion.div
            animate={threatDetected ? {
              borderColor: ['rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 1)', 'rgba(239, 68, 68, 0.5)'],
            } : {}}
            transition={{ duration: 0.5, repeat: threatDetected ? Infinity : 0 }}
            className="px-4 py-2 border border-red-500/50 rounded bg-red-500/10 font-mono text-sm"
          >
            <div className="text-red-400">[ EXTERNAL THREAT VECTOR ]</div>
            <div className="text-xs text-gray-500">(Adversarial Decoherence / Measurement Injection)</div>
          </motion.div>

          {/* Downward Arrow */}
          {signalFlowActive && (
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-red-400 text-2xl mt-2"
            >
              ↓
            </motion.div>
          )}
        </div>

        {/* UK Sovereign Quantum Environment */}
        <div className="mt-24 border-2 border-cyan-500/30 rounded-lg p-6 bg-gray-900/30 relative">
          <div className="absolute -top-3 left-4 px-2 bg-black text-cyan-400 text-xs font-mono">
            UK SOVEREIGN QUANTUM ENVIRONMENT (PROTECTED PERIMETER)
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Physical QPU Layer */}
              <SchematicBox
                title="PHYSICAL QPU LAYER"
                subtitle="(Target Hardware)"
                color="cyan"
                highlight={threatDetected}
              >
                <div className="text-xs text-gray-400 font-mono">
                  [Qubit Register (N&gt;100)]
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs rounded">
                    T1: 142μs
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs rounded">
                    T2: 89μs
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs rounded">
                    Fidelity: 99.2%
                  </span>
                </div>
              </SchematicBox>

              {/* Arrow and labels */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex-1 border-t border-cyan-500/50 relative">
                  <span className="absolute -top-3 left-0 text-gray-500">Raw Telemetry Stream</span>
                  {signalFlowActive && (
                    <motion.div
                      animate={{ x: ['0%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-0 w-2 h-0.5 bg-cyan-400"
                    />
                  )}
                </div>
                <span className="text-gray-500">↕</span>
                <div className="flex-1 border-t border-dashed border-purple-500/50 relative">
                  <span className="absolute -top-3 right-0 text-gray-500">Healing Protocol</span>
                  {signalFlowActive && (
                    <motion.div
                      animate={{ x: ['100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-0 w-2 h-0.5 bg-purple-400"
                    />
                  )}
                </div>
              </div>

              {/* CCCE Subsystem */}
              <SchematicBox
                title="CCCE SUBSYSTEM"
                subtitle="(Engine Core - See A002)"
                color="purple"
                highlight={metrics.gamma > 0.2}
              >
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-2">
                  <div>
                    <span className="text-gray-500">Λ:</span>{' '}
                    <span className="text-cyan-400">{metrics.lambda.toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Φ:</span>{' '}
                    <span className={metrics.conscious ? 'text-green-400' : 'text-red-400'}>
                      {metrics.phi.toFixed(3)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Γ:</span>{' '}
                    <span className={metrics.gamma > 0.2 ? 'text-red-400' : 'text-green-400'}>
                      {metrics.gamma.toFixed(3)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ξ:</span>{' '}
                    <span className="text-purple-400">{metrics.xi.toFixed(2)}</span>
                  </div>
                </div>
              </SchematicBox>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Q-SLICE Threat Matrix */}
              <SchematicBox
                title="Q-SLICE THREAT MATRIX"
                subtitle="(Real-time Taxonomy Engine)"
                color="yellow"
                highlight={threatDetected}
              >
                <div className="text-xs text-gray-400 font-mono">
                  (Threat Class C/I ID)
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Category C:</span>
                    <span className={threatDetected ? 'text-red-400' : 'text-green-400'}>
                      {threatDetected ? 'DETECTED' : 'CLEAR'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Category I:</span>
                    <span className="text-green-400">CLEAR</span>
                  </div>
                </div>
              </SchematicBox>

              {/* Ω-Recursive Control System */}
              <SchematicBox
                title="Ω-RECURSIVE CONTROL SYSTEM"
                subtitle="(Autopoietic Sentinel)"
                color="green"
                doubleOutline
              >
                <div className="text-xs text-gray-400 font-mono mt-2">
                  Self-organizing defence loop
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400">ACTIVE</span>
                </div>
              </SchematicBox>

              {/* Φ-Metric Analyzer */}
              <SchematicBox
                title="Φ-METRIC ANALYZER"
                subtitle="(Consciousness Monitoring)"
                color="magenta"
              >
                <div className="mt-2 space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Consciousness:</span>
                    <span className={metrics.conscious ? 'text-green-400' : 'text-red-400'}>
                      {metrics.conscious ? 'ACTIVE' : 'SUB-THRESHOLD'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Threshold:</span>
                    <span className="text-gray-400">{CONSTANTS.PHI_THRESHOLD}</span>
                  </div>
                </div>
              </SchematicBox>
            </div>
          </div>

          {/* Connection Lines (visual only) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0, 255, 246, 0.5)" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* C4ISR Command Center */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="text-gray-500 text-xs font-mono">↑ (Secure)</div>
              <div className="h-8 border-l border-green-500/50" />
            </div>
            <SchematicBox
              title="C4ISR COMMAND CENTER"
              subtitle="(Dashboard v2.0.0-ccce)"
              color="green"
              doubleOutline
            >
              <div className="mt-2 text-xs text-gray-400 font-mono">
                Human-in-the-loop override
              </div>
            </SchematicBox>
            <div className="flex flex-col items-center gap-2">
              <div className="text-gray-500 text-xs font-mono">↑ (Metrics Poll)</div>
              <div className="h-8 border-l border-cyan-500/50" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// DRAWING A002: CCCE ENGINE CORE SCHEMATIC
// ============================================================

function DrawingA002({
  metrics,
  signalFlowActive
}: {
  metrics: CCCEMetrics
  signalFlowActive: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border border-purple-500/30 rounded-lg bg-black/80 backdrop-blur-sm overflow-hidden"
    >
      {/* Drawing Header */}
      <div className="p-4 border-b border-purple-500/20 bg-purple-500/5">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-mono font-bold text-purple-400">
              A002: CCCE ENGINE CORE SCHEMATIC
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Consciousness-Coherence-Containment Engine Block Diagram
            </p>
          </div>
          <div className="text-xs font-mono text-right">
            <div className="text-gray-500">REVISION: v1.4.2 (Draft)</div>
            <div className="text-gray-600">REF: Section 1.2</div>
          </div>
        </div>
      </div>

      {/* Technical Notes */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/30 text-xs font-mono">
        <div className="text-gray-500 mb-2">TECHNICAL NOTES:</div>
        <ol className="list-decimal list-inside space-y-1 text-gray-400">
          <li>This subsystem requires cryogenic cooling (&lt;20mK) consistent with main QPU</li>
          <li>The ΛΦ Reference Chamber contains the stable invariant baseline against which real-time coherence is measured</li>
        </ol>
      </div>

      {/* Schematic Visualization */}
      <div className="p-8">
        {/* Input from QPU */}
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-2 border border-cyan-500/50 rounded bg-cyan-500/10 font-mono text-sm text-cyan-400">
            [ FROM QPU TELEMETRY BUS ]
          </div>
          {signalFlowActive && (
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-cyan-400 text-2xl mt-2"
            >
              ↓
            </motion.div>
          )}
        </div>

        {/* CCCE Assembly */}
        <div className="border-2 border-purple-500/30 rounded-lg p-6 bg-gray-900/30 relative">
          <div className="absolute -top-3 left-4 px-2 bg-black text-purple-400 text-xs font-mono">
            CCCE ASSEMBLY (CRYOGENIC ENCLOSURE)
          </div>
          <div className="absolute -top-3 right-4 px-2 bg-black text-blue-400 text-xs font-mono">
            T: &lt;20mK
          </div>

          <div className="space-y-8 mt-4">
            {/* Row 1: Input Signal Conditioner + Coherence Comparator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SchematicBox
                title="INPUT SIGNAL CONDITIONER"
                subtitle="(ADC)"
                color="cyan"
              >
                <div className="mt-2 text-xs font-mono text-gray-400">
                  24-bit @ 1 GSPS
                </div>
              </SchematicBox>

              <div className="flex items-center gap-4">
                <span className="text-cyan-400">→</span>
                <SchematicBox
                  title="COHERENCE DIFFERENTIAL COMPARATOR"
                  subtitle="(Compares Live vs. ΛΦ Constant)"
                  color="yellow"
                  highlight={metrics.gamma > 0.2}
                >
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-gray-500">Live Λ:</span>{' '}
                      <span className="text-cyan-400">{metrics.lambda.toFixed(4)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ref ΛΦ:</span>{' '}
                      <span className="text-purple-400">{CONSTANTS.LAMBDA_PHI.toExponential(6)}</span>
                    </div>
                  </div>
                </SchematicBox>
              </div>
            </div>

            {/* Delta indicator */}
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-xs text-gray-500 font-mono">(Delta &gt; Threshold)</div>
                {signalFlowActive && (
                  <motion.div
                    animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-yellow-400 text-xl"
                  >
                    ↓
                  </motion.div>
                )}
              </div>
            </div>

            {/* Row 2: ΛΦ Reference + Autopoietic Trigger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SchematicBox
                title="ΛΦ REFERENCE CHAMBER"
                subtitle="(SEALED)"
                color="purple"
                doubleOutline
              >
                <div className="mt-2 text-xs font-mono">
                  <div className="text-purple-400">ΛΦ = 2.176435×10⁻⁸ s⁻¹</div>
                  <div className="text-gray-500 mt-1">Empirically validated constant</div>
                </div>
              </SchematicBox>

              <div className="flex items-center gap-4">
                <span className="text-purple-400">→</span>
                <SchematicBox
                  title="AUTOPOIETIC TRIGGER LOGIC"
                  subtitle="(Bio-mimetic Response Initiator)"
                  color="green"
                  highlight={metrics.gamma > CONSTANTS.GAMMA_CRITICAL}
                >
                  <div className="mt-2 text-xs font-mono">
                    <div className={`${metrics.gamma > 0.2 ? 'text-yellow-400' : 'text-green-400'}`}>
                      Status: {metrics.gamma > CONSTANTS.GAMMA_CRITICAL ? 'TRIGGERED' : metrics.gamma > 0.2 ? 'ALERT' : 'STANDBY'}
                    </div>
                  </div>
                </SchematicBox>
              </div>
            </div>

            {/* Activate Healer indicator */}
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-xs text-gray-500 font-mono">(Activate Healer)</div>
                {signalFlowActive && (
                  <motion.div
                    animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-green-400 text-xl"
                  >
                    ↓
                  </motion.div>
                )}
              </div>
            </div>

            {/* Row 3: Ξ-Coupling Drive + Phase-Conjugate Emitter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SchematicBox
                title="Ξ-COUPLING DRIVE"
                subtitle="(Stabilizer Circuit)"
                color="cyan"
              >
                <div className="mt-2 text-xs font-mono">
                  <div className="text-cyan-400">Ξ = {metrics.xi.toFixed(2)}</div>
                  <div className="text-gray-500 mt-1">Ξ = (Λ × Φ) / Γ</div>
                </div>
              </SchematicBox>

              <div className="flex items-center gap-4">
                <span className="text-cyan-400">→</span>
                <SchematicBox
                  title="PHASE-CONJUGATE OPTICAL EMITTER"
                  subtitle="(Coherence Restoration Interface)"
                  color="magenta"
                  doubleOutline
                >
                  <div className="mt-2 text-xs font-mono">
                    <div className="text-magenta-400">χ_pc = {CONSTANTS.CHI_PC}</div>
                    <div className="text-gray-500 mt-1">E → E⁻¹ transform</div>
                  </div>
                </SchematicBox>
              </div>
            </div>
          </div>
        </div>

        {/* Output to QPU */}
        <div className="text-center mt-6">
          {signalFlowActive && (
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-purple-400 text-2xl mb-2"
            >
              :
            </motion.div>
          )}
          <div className="inline-block px-4 py-2 border border-dashed border-purple-500/50 rounded bg-purple-500/10 font-mono text-sm text-purple-400">
            [ TO QPU CONTROL LINES (HEALING PATH) ]
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// DRAWING A003: Ω-RECURSIVE PROTOCOL LOGIC FLOW
// ============================================================

function DrawingA003({
  loopState,
  metrics
}: {
  loopState: 'POLLING' | 'ANALYZING' | 'HEALING' | 'NOMINAL'
  metrics: CCCEMetrics
}) {
  const steps = [
    { id: 'START', label: '(START LOOP: 100μs Intervals)', type: 'terminator' },
    { id: 'POLL', label: '[POLL QPU TELEMETRY]\n(Bell State Fidelity & T1/T2 relaxation rates)', type: 'process' },
    { id: 'CHECK_DECOHERENCE', label: '< IS DECOHERENCE ABOVE NOISE FLOOR? >', type: 'decision' },
    { id: 'LOG_NOMINAL', label: '[LOG NOMINAL STATE]', type: 'process', branch: 'NO' },
    { id: 'APPLY_TAXONOMY', label: '[APPLY Q-SLICE TAXONOMY]\n(Compare signature to known threat vectors)', type: 'process', branch: 'YES' },
    { id: 'CHECK_CATEGORY', label: '< MATCH CATEGORY C OR I? >\n(Is statistical significance p < 10⁻²⁶?)', type: 'decision' },
    { id: 'LOG_ENVIRONMENTAL', label: '[LOG AS ENVIRONMENTAL]\n(Adjust Baseline)', type: 'process', branch: 'NO' },
    { id: 'ENGAGE_OMEGA', label: '[ENGAGE Ω-RECURSIVE PROTOCOL]\n(Notify Command Center - FLASH PRIORITY)', type: 'process', branch: 'YES (CRITICAL)' },
    { id: 'CALCULATE', label: '[CALCULATE INVERSE PHASE SOLUTION]\n(Using current Φ and Ξ metrics)', type: 'process' },
    { id: 'FIRE', label: '[FIRE CCCE HEALING PULSE]\n(Inject stabilizing control signals to QPU)', type: 'process' },
    { id: 'VERIFY', label: '[VERIFY COHERENCE RESTORATION]\n(Re-measure Bell State Fidelity)', type: 'process' },
    { id: 'END', label: '(END LOOP - AWAIT NEXT CYCLE)', type: 'terminator' },
  ]

  const getStepHighlight = (stepId: string) => {
    if (loopState === 'POLLING' && stepId === 'POLL') return true
    if (loopState === 'POLLING' && stepId === 'CHECK_DECOHERENCE') return true
    if (loopState === 'ANALYZING' && (stepId === 'APPLY_TAXONOMY' || stepId === 'CHECK_CATEGORY')) return true
    if (loopState === 'HEALING' && (stepId === 'ENGAGE_OMEGA' || stepId === 'CALCULATE' || stepId === 'FIRE' || stepId === 'VERIFY')) return true
    if (loopState === 'NOMINAL' && (stepId === 'LOG_NOMINAL' || stepId === 'END')) return true
    return false
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border border-green-500/30 rounded-lg bg-black/80 backdrop-blur-sm overflow-hidden"
    >
      {/* Drawing Header */}
      <div className="p-4 border-b border-green-500/20 bg-green-500/5">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-mono font-bold text-green-400">
              A003: LOGIC FLOW / SEQUENCE DIAGRAM
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Autonomous Threat Mitigation Loop (Ω-Recursive Protocol)
            </p>
          </div>
          <div className="text-xs font-mono text-right">
            <div className="text-gray-500">REVISION: v2.0.0</div>
            <div className="text-gray-600">REF: Section 1.4</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/30 text-xs font-mono">
        <div className="text-gray-500 mb-2">LEGEND:</div>
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 border border-cyan-500/50 rounded text-cyan-400">[Process]</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 border border-yellow-500/50 rounded-lg text-yellow-400">&lt;Decision&gt;</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 border border-gray-500/50 rounded-full text-gray-400">(Terminator)</div>
          </div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="p-8">
        <div className="flex flex-col items-center gap-2 max-w-2xl mx-auto">
          {/* START */}
          <FlowStep
            label="(START LOOP: 100μs Intervals)"
            type="terminator"
            highlight={false}
          />
          <FlowArrow />

          {/* POLL */}
          <FlowStep
            label="[POLL QPU TELEMETRY]"
            sublabel="(Bell State Fidelity & T1/T2 relaxation rates)"
            type="process"
            highlight={getStepHighlight('POLL')}
            metrics={loopState === 'POLLING' ? {
              fidelity: (0.99 + Math.random() * 0.009).toFixed(4),
              t1: '142μs',
              t2: '89μs'
            } : undefined}
          />
          <FlowArrow />

          {/* Decision: Decoherence check */}
          <FlowStep
            label="< IS DECOHERENCE ABOVE NOISE FLOOR? >"
            type="decision"
            highlight={getStepHighlight('CHECK_DECOHERENCE')}
          />

          {/* Branch */}
          <div className="w-full flex justify-center gap-8 mt-2">
            {/* NO Branch */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2">NO</div>
              <FlowArrow />
              <FlowStep
                label="[LOG NOMINAL STATE]"
                type="process"
                highlight={getStepHighlight('LOG_NOMINAL')}
              />
              <FlowArrow />
              <FlowStep
                label="(END LOOP)"
                type="terminator"
                highlight={loopState === 'NOMINAL'}
              />
            </div>

            {/* YES Branch */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2">YES</div>
              <FlowArrow color="yellow" />
              <FlowStep
                label="[APPLY Q-SLICE TAXONOMY]"
                sublabel="(Compare signature to known threat vectors)"
                type="process"
                highlight={getStepHighlight('APPLY_TAXONOMY')}
              />
              <FlowArrow />

              {/* Category Decision */}
              <FlowStep
                label="< MATCH CATEGORY C OR I? >"
                sublabel="(Is statistical significance p < 10⁻²⁶?)"
                type="decision"
                highlight={getStepHighlight('CHECK_CATEGORY')}
              />

              {/* Sub-branch */}
              <div className="w-full flex justify-center gap-6 mt-2">
                {/* NO Branch */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">NO</div>
                  <FlowArrow />
                  <FlowStep
                    label="[LOG AS ENVIRONMENTAL]"
                    sublabel="(Adjust Baseline)"
                    type="process"
                    highlight={false}
                    small
                  />
                </div>

                {/* YES (CRITICAL) Branch */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-red-400 mb-2">YES (CRITICAL)</div>
                  <FlowArrow color="red" />
                  <FlowStep
                    label="[ENGAGE Ω-RECURSIVE PROTOCOL]"
                    sublabel="(Notify Command Center - FLASH PRIORITY)"
                    type="process"
                    highlight={getStepHighlight('ENGAGE_OMEGA')}
                    critical
                  />
                  <FlowArrow color="red" />
                  <FlowStep
                    label="[CALCULATE INVERSE PHASE SOLUTION]"
                    sublabel={`(Using current Φ=${metrics.phi.toFixed(3)} and Ξ=${metrics.xi.toFixed(2)})`}
                    type="process"
                    highlight={getStepHighlight('CALCULATE')}
                  />
                  <FlowArrow color="purple" />
                  <FlowStep
                    label="[FIRE CCCE HEALING PULSE]"
                    sublabel="(Inject stabilizing control signals to QPU)"
                    type="process"
                    highlight={getStepHighlight('FIRE')}
                    critical
                  />
                  <FlowArrow color="green" />
                  <FlowStep
                    label="[VERIFY COHERENCE RESTORATION]"
                    sublabel="(Re-measure Bell State Fidelity)"
                    type="process"
                    highlight={getStepHighlight('VERIFY')}
                  />
                  <FlowArrow />
                  <FlowStep
                    label="(END LOOP - AWAIT NEXT CYCLE)"
                    type="terminator"
                    highlight={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function SchematicBox({
  title,
  subtitle,
  color,
  children,
  highlight = false,
  doubleOutline = false
}: {
  title: string
  subtitle?: string
  color: 'cyan' | 'purple' | 'yellow' | 'green' | 'magenta'
  children?: React.ReactNode
  highlight?: boolean
  doubleOutline?: boolean
}) {
  const colorClasses = {
    cyan: 'border-cyan-500/50 bg-cyan-500/5',
    purple: 'border-purple-500/50 bg-purple-500/5',
    yellow: 'border-yellow-500/50 bg-yellow-500/5',
    green: 'border-green-500/50 bg-green-500/5',
    magenta: 'border-pink-500/50 bg-pink-500/5',
  }

  const titleColors = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    magenta: 'text-pink-400',
  }

  return (
    <motion.div
      animate={highlight ? {
        boxShadow: [
          '0 0 0 rgba(255,255,255,0)',
          '0 0 20px rgba(255,255,255,0.3)',
          '0 0 0 rgba(255,255,255,0)',
        ],
      } : {}}
      transition={{ duration: 1, repeat: highlight ? Infinity : 0 }}
      className={`p-4 rounded border ${colorClasses[color]} ${doubleOutline ? 'border-2' : ''}`}
    >
      <div className={`font-mono text-sm font-bold ${titleColors[color]}`}>
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 font-mono">{subtitle}</div>
      )}
      {children}
    </motion.div>
  )
}

function FlowStep({
  label,
  sublabel,
  type,
  highlight = false,
  critical = false,
  small = false,
  metrics
}: {
  label: string
  sublabel?: string
  type: 'process' | 'decision' | 'terminator'
  highlight?: boolean
  critical?: boolean
  small?: boolean
  metrics?: Record<string, string>
}) {
  const baseClasses = {
    process: 'border-cyan-500/50 bg-cyan-500/5 rounded',
    decision: 'border-yellow-500/50 bg-yellow-500/5 rounded-xl',
    terminator: 'border-gray-500/50 bg-gray-500/5 rounded-full',
  }

  const textClasses = {
    process: 'text-cyan-400',
    decision: 'text-yellow-400',
    terminator: 'text-gray-400',
  }

  return (
    <motion.div
      animate={highlight ? {
        boxShadow: [
          '0 0 0 rgba(0,255,246,0)',
          '0 0 15px rgba(0,255,246,0.5)',
          '0 0 0 rgba(0,255,246,0)',
        ],
        borderColor: critical ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 255, 246, 0.8)',
      } : {}}
      transition={{ duration: 0.8, repeat: highlight ? Infinity : 0 }}
      className={`
        px-4 py-2 border font-mono text-xs text-center
        ${baseClasses[type]}
        ${small ? 'text-[10px] px-2 py-1' : ''}
        ${critical ? 'border-red-500/50 bg-red-500/10' : ''}
      `}
    >
      <div className={`${critical ? 'text-red-400' : textClasses[type]} whitespace-pre-line`}>
        {label}
      </div>
      {sublabel && (
        <div className="text-gray-500 mt-1 whitespace-pre-line">{sublabel}</div>
      )}
      {metrics && (
        <div className="mt-2 flex gap-2 justify-center flex-wrap">
          {Object.entries(metrics).map(([key, value]) => (
            <span key={key} className="px-1.5 py-0.5 bg-black/50 rounded text-[10px]">
              <span className="text-gray-500">{key}:</span>{' '}
              <span className="text-cyan-400">{value}</span>
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function FlowArrow({ color = 'gray' }: { color?: 'gray' | 'yellow' | 'red' | 'purple' | 'green' }) {
  const colorClasses = {
    gray: 'text-gray-500',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
  }

  return (
    <motion.div
      animate={{ y: [0, 3, 0], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1, repeat: Infinity }}
      className={`text-lg ${colorClasses[color]}`}
    >
      ↓
    </motion.div>
  )
}
