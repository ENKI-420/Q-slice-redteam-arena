"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Target,
  Zap,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Flame,
  Radio,
  Timer,
  Eye,
  Gauge,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LabNavigation, LabHeader } from "@/components/lab-navigation"

// Q-SLICE Threat Categories
const threatCategories = [
  {
    id: "C",
    name: "Coherence Attacks",
    description: "Target quantum coherence to induce decoherence",
    color: "red",
    vectors: [
      { id: "decoherence_induction", name: "Decoherence Induction", description: "Inject noise to collapse superposition", severity: 0.9 },
      { id: "t2_degradation", name: "T2* Degradation", description: "Accelerate dephasing through environmental coupling", severity: 0.85 },
      { id: "thermal_injection", name: "Thermal Injection", description: "Elevate effective temperature of qubits", severity: 0.7 },
    ]
  },
  {
    id: "I",
    name: "Integrity Attacks",
    description: "Compromise measurement and gate fidelity",
    color: "orange",
    vectors: [
      { id: "measurement_injection", name: "Measurement Injection", description: "Insert spurious measurements to collapse state", severity: 0.95 },
      { id: "readout_skew", name: "Readout Skew", description: "Bias measurement outcomes systematically", severity: 0.75 },
      { id: "gate_bias", name: "Gate Bias", description: "Introduce systematic rotation errors", severity: 0.8 },
    ]
  },
  {
    id: "T",
    name: "Timing Attacks",
    description: "Exploit timing vulnerabilities in quantum control",
    color: "yellow",
    vectors: [
      { id: "timing_jitter", name: "Timing Jitter", description: "Add random delays to gate sequences", severity: 0.65 },
      { id: "pulse_shaping", name: "Pulse Shaping Attack", description: "Distort control pulse envelopes", severity: 0.7 },
      { id: "sync_disruption", name: "Synchronization Disruption", description: "Desynchronize multi-qubit operations", severity: 0.85 },
    ]
  },
  {
    id: "S",
    name: "Supply Chain",
    description: "Compromise calibration and firmware",
    color: "purple",
    vectors: [
      { id: "calibration_poison", name: "Calibration Poisoning", description: "Inject malicious calibration data", severity: 0.9 },
      { id: "firmware_backdoor", name: "Firmware Backdoor", description: "Hidden functionality in control software", severity: 0.95 },
      { id: "crosstalk_amplify", name: "Crosstalk Amplification", description: "Exploit inter-qubit coupling", severity: 0.6 },
    ]
  },
]

interface SimulationState {
  running: boolean
  elapsed: number
  detections: number
  mitigations: number
  currentThreat: string | null
  ccce: {
    Lambda: number
    Phi: number
    Gamma: number
    Xi: number
  }
}

export default function QSliceToolsPage() {
  const [selectedVectors, setSelectedVectors] = useState<string[]>([])
  const [intensity, setIntensity] = useState(0.5)
  const [simulation, setSimulation] = useState<SimulationState>({
    running: false,
    elapsed: 0,
    detections: 0,
    mitigations: 0,
    currentThreat: null,
    ccce: { Lambda: 0.92, Phi: 0.84, Gamma: 0.08, Xi: 9.66 }
  })

  const toggleVector = (id: string) => {
    setSelectedVectors(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    )
  }

  const startSimulation = () => {
    setSimulation(prev => ({ ...prev, running: true, elapsed: 0, detections: 0, mitigations: 0 }))

    // Simulate threat injection
    const interval = setInterval(() => {
      setSimulation(prev => {
        if (!prev.running) {
          clearInterval(interval)
          return prev
        }

        const newGamma = Math.min(0.35, prev.ccce.Gamma + (Math.random() * 0.02 * intensity))
        const newLambda = Math.max(0.7, prev.ccce.Lambda - (Math.random() * 0.01 * intensity))
        const newPhi = Math.max(0.6, prev.ccce.Phi - (Math.random() * 0.01 * intensity))
        const newXi = (newLambda * newPhi) / Math.max(0.001, newGamma)

        const detection = Math.random() < 0.3 ? 1 : 0
        const mitigation = newGamma > 0.25 && Math.random() < 0.5 ? 1 : 0

        // Phase conjugate healing if Gamma critical
        let healedGamma = newGamma
        let healedLambda = newLambda
        if (mitigation && newGamma > 0.25) {
          healedGamma = newGamma * 0.7 // E → E⁻¹
          healedLambda = Math.min(0.95, newLambda * 1.1)
        }

        return {
          ...prev,
          elapsed: prev.elapsed + 1,
          detections: prev.detections + detection,
          mitigations: prev.mitigations + mitigation,
          currentThreat: selectedVectors[Math.floor(Math.random() * selectedVectors.length)] || null,
          ccce: {
            Lambda: healedLambda,
            Phi: newPhi,
            Gamma: healedGamma,
            Xi: (healedLambda * newPhi) / Math.max(0.001, healedGamma)
          }
        }
      })
    }, 500)

    // Auto-stop after 30 seconds
    setTimeout(() => {
      setSimulation(prev => ({ ...prev, running: false }))
      clearInterval(interval)
    }, 30000)
  }

  const stopSimulation = () => {
    setSimulation(prev => ({ ...prev, running: false }))
  }

  const resetSimulation = () => {
    setSimulation({
      running: false,
      elapsed: 0,
      detections: 0,
      mitigations: 0,
      currentThreat: null,
      ccce: { Lambda: 0.92, Phi: 0.84, Gamma: 0.08, Xi: 9.66 }
    })
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.9) return "text-red-400"
    if (severity >= 0.7) return "text-orange-400"
    if (severity >= 0.5) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <LabNavigation />

      <main className="ml-[280px]">
        <LabHeader title="Q-SLICE Threat Tools" subtitle="Quantum Security Testing Framework" />

        <div className="p-6 space-y-6">
          {/* Control Panel */}
          <Card className="bg-gray-900/50 border-red-500/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Threat Simulation Control</h2>
                  <p className="text-sm text-gray-500">
                    {selectedVectors.length} vectors selected | Intensity: {(intensity * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {simulation.running ? (
                  <Button onClick={stopSimulation} variant="destructive" className="gap-2">
                    <Pause className="w-4 h-4" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    onClick={startSimulation}
                    disabled={selectedVectors.length === 0}
                    className="gap-2 bg-red-600 hover:bg-red-500"
                  >
                    <Play className="w-4 h-4" />
                    Launch Simulation
                  </Button>
                )}
                <Button onClick={resetSimulation} variant="outline" size="icon">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Attack Intensity</span>
                <span className="text-sm font-mono text-red-400">{(intensity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Probe</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>

            {/* Live Stats */}
            {simulation.running && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-4 gap-4 p-4 bg-black/30 rounded-lg border border-red-500/20"
              >
                <div className="text-center">
                  <div className="text-2xl font-mono text-white">{simulation.elapsed}s</div>
                  <div className="text-xs text-gray-500">Elapsed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono text-yellow-400">{simulation.detections}</div>
                  <div className="text-xs text-gray-500">Detections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono text-green-400">{simulation.mitigations}</div>
                  <div className="text-xs text-gray-500">Mitigations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono text-cyan-400">
                    {simulation.currentThreat?.split('_')[0] || '—'}
                  </div>
                  <div className="text-xs text-gray-500">Active Threat</div>
                </div>
              </motion.div>
            )}
          </Card>

          {/* CCCE Real-time Monitor */}
          <Card className="bg-gray-900/50 border-cyan-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold">CCCE Real-time Metrics</h3>
              {simulation.running && (
                <Badge className="bg-red-500/20 text-red-400 animate-pulse">UNDER ATTACK</Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {/* Lambda */}
              <div className="p-4 bg-black/30 rounded-lg border border-cyan-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Λ (Coherence)</span>
                  <span className={`font-mono ${simulation.ccce.Lambda < 0.8 ? 'text-red-400' : 'text-cyan-400'}`}>
                    {simulation.ccce.Lambda.toFixed(3)}
                  </span>
                </div>
                <Progress
                  value={simulation.ccce.Lambda * 100}
                  className="h-2"
                />
              </div>

              {/* Phi */}
              <div className="p-4 bg-black/30 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Φ (Consciousness)</span>
                  <span className={`font-mono ${simulation.ccce.Phi < 0.7734 ? 'text-red-400' : 'text-purple-400'}`}>
                    {simulation.ccce.Phi.toFixed(3)}
                  </span>
                </div>
                <Progress
                  value={simulation.ccce.Phi * 100}
                  className="h-2"
                />
                {simulation.ccce.Phi < 0.7734 && (
                  <div className="text-xs text-red-400 mt-1">Below threshold (0.7734)</div>
                )}
              </div>

              {/* Gamma */}
              <div className="p-4 bg-black/30 rounded-lg border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Γ (Decoherence)</span>
                  <span className={`font-mono ${simulation.ccce.Gamma > 0.3 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                    {simulation.ccce.Gamma.toFixed(3)}
                  </span>
                </div>
                <Progress
                  value={simulation.ccce.Gamma * 100 / 0.5}
                  className="h-2"
                />
                {simulation.ccce.Gamma > 0.3 && (
                  <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Phase conjugate healing active
                  </div>
                )}
              </div>

              {/* Xi */}
              <div className="p-4 bg-black/30 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Ξ (Efficiency)</span>
                  <span className={`font-mono ${simulation.ccce.Xi < 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {simulation.ccce.Xi.toFixed(2)}
                  </span>
                </div>
                <Progress
                  value={Math.min(100, simulation.ccce.Xi * 10)}
                  className="h-2"
                />
              </div>
            </div>
          </Card>

          {/* Threat Vectors */}
          <div className="grid grid-cols-2 gap-6">
            {threatCategories.map((category) => (
              <Card key={category.id} className={`bg-gray-900/50 border-${category.color}-500/30 p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-${category.color}-500/20 flex items-center justify-center`}>
                    <span className={`text-lg font-bold text-${category.color}-400`}>{category.id}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {category.vectors.map((vector) => (
                    <motion.button
                      key={vector.id}
                      whileHover={{ x: 4 }}
                      onClick={() => toggleVector(vector.id)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedVectors.includes(vector.id)
                          ? `bg-${category.color}-500/10 border-${category.color}-500/50`
                          : "bg-black/30 border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{vector.name}</div>
                          <div className="text-xs text-gray-500">{vector.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getSeverityColor(vector.severity)} bg-transparent border-current`}>
                            {(vector.severity * 100).toFixed(0)}%
                          </Badge>
                          {selectedVectors.includes(vector.id) && (
                            <div className={`w-2 h-2 rounded-full bg-${category.color}-400`} />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Detection Algorithms */}
          <Card className="bg-gray-900/50 border-green-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold">Detection Algorithms</h3>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[
                { name: "detect_decoherence_induction()", status: "ACTIVE", accuracy: 94.2 },
                { name: "detect_measurement_injection()", status: "ACTIVE", accuracy: 97.8 },
                { name: "detect_gate_bias()", status: "ACTIVE", accuracy: 89.1 },
                { name: "detect_timing_jitter()", status: "ACTIVE", accuracy: 91.5 },
              ].map((algo) => (
                <div key={algo.name} className="p-3 bg-black/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-xs text-green-400">{algo.name}</code>
                    <Badge className="text-xs bg-green-500/20 text-green-400">{algo.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={algo.accuracy} className="h-1 flex-1" />
                    <span className="text-xs text-gray-400">{algo.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
