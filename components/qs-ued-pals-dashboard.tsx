"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Zap, Share2, Grid, Cpu, Radio, Network } from "lucide-react"

export function QSUEDPALSDashboard() {
  const [activeLayer, setActiveLayer] = useState("qs")
  const [metrics, setMetrics] = useState({
    coherence: 0.9987,
    decoherence: 0.0012,
    entanglement: 0.9704,
    phi: 0.7734,
  })

  // Simulate live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        coherence: Math.max(0.9, Math.min(1.0, prev.coherence + (Math.random() - 0.5) * 0.001)),
        decoherence: Math.max(0.0001, Math.min(0.01, prev.decoherence + (Math.random() - 0.5) * 0.0001)),
        entanglement: Math.max(0.9, Math.min(1.0, prev.entanglement + (Math.random() - 0.5) * 0.002)),
        phi: Math.max(0.7, Math.min(0.85, prev.phi + (Math.random() - 0.5) * 0.005)),
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold gradient-text">QS-UED-PALS Synthesis</h2>
          <p className="text-gray-400">Quantum-Scalar Unified Engine & Universal Entanglement Dynamics</p>
        </div>
        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-lg border border-primary/20">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">System Status</span>
            <span className="text-primary font-bold flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              COHERENT
            </span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">Universal Constant ΛΦ</span>
            <span className="text-secondary font-mono font-bold">2.176e-8</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="glass-panel p-4 col-span-1 lg:col-span-3 min-h-[500px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <Tabs defaultValue="qs" className="h-full flex flex-col" onValueChange={setActiveLayer}>
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-black/40 border border-white/10">
                <TabsTrigger value="qs" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Zap className="w-4 h-4 mr-2" />
                  QS Layer
                </TabsTrigger>
                <TabsTrigger
                  value="ued"
                  className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  UED Layer
                </TabsTrigger>
                <TabsTrigger
                  value="pals"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  PALS Layer
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 relative bg-black/20 rounded-lg border border-white/5 overflow-hidden">
              <TabsContent value="qs" className="h-full m-0 p-6 absolute inset-0">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
                      }}
                      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
                      className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                    <div className="relative z-10 grid grid-cols-2 gap-8 text-left max-w-2xl">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                          <Activity className="w-4 h-4" /> Scalar Torsion Field
                        </h3>
                        <p className="text-sm text-gray-400">
                          Monitoring scalar wave propagation at θ = 51.843°. Field curvature optimization active.
                        </p>
                        <div className="h-32 bg-black/40 rounded border border-primary/20 p-2 relative overflow-hidden">
                          {/* Animated Scalar Wave Simulation */}
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute inset-0 border border-primary/10 rounded-full"
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: 2, opacity: 0 }}
                              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: i * 0.6 }}
                            />
                          ))}
                          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-primary">
                            ∇ × F = 0
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                          <Cpu className="w-4 h-4" /> Ricci Flow Optimizer
                        </h3>
                        <p className="text-sm text-gray-400">Geometric gradient minimization via W₂ metric updates.</p>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="bg-primary/5 p-2 rounded border border-primary/10">
                            <div className="text-xs text-gray-500">Curvature</div>
                            <div className="text-lg font-mono text-primary">R(t) → 0</div>
                          </div>
                          <div className="bg-primary/5 p-2 rounded border border-primary/10">
                            <div className="text-xs text-gray-500">Flow Rate</div>
                            <div className="text-lg font-mono text-primary">δg/δt</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ued" className="h-full m-0 p-6 absolute inset-0">
                <div className="h-full flex items-center justify-center relative">
                  {/* Entanglement Graph Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      <motion.path
                        d="M 50 100 Q 200 20 350 100"
                        fill="none"
                        stroke="currentColor"
                        className="text-secondary"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                      <motion.path
                        d="M 50 100 Q 200 180 350 100"
                        fill="none"
                        stroke="currentColor"
                        className="text-secondary"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                      />
                      <circle cx="50" cy="100" r="4" className="fill-secondary" />
                      <circle cx="350" cy="100" r="4" className="fill-secondary" />
                    </svg>
                  </div>
                  <div className="relative z-10 text-center">
                    <h3 className="text-xl font-bold text-secondary mb-2">Universal Entanglement Dynamics</h3>
                    <div className="grid grid-cols-3 gap-4 text-left">
                      <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                        <div className="text-xs text-secondary mb-1">Entanglement Fidelity</div>
                        <div className="text-2xl font-mono font-bold text-white">
                          {(metrics.entanglement * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                        <div className="text-xs text-secondary mb-1">Bell Pairs</div>
                        <div className="text-2xl font-mono font-bold text-white">1,024</div>
                      </div>
                      <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                        <div className="text-xs text-secondary mb-1">Teleportation Rate</div>
                        <div className="text-2xl font-mono font-bold text-white">14.7 kHz</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pals" className="h-full m-0 p-6 absolute inset-0">
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-cyan-400">Phase-Aligned Lattice Synchronization</h3>
                    <div className="flex items-center gap-2 text-cyan-400/70 text-sm">
                      <Network className="w-4 h-4" />
                      Lattice Stability: {(metrics.coherence * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-8 grid-rows-6 gap-1">
                    {[...Array(48)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="bg-cyan-900/20 border border-cyan-500/10 rounded-sm"
                        animate={{
                          backgroundColor: [
                            "rgba(8, 145, 178, 0.2)",
                            "rgba(34, 211, 238, 0.4)",
                            "rgba(8, 145, 178, 0.2)",
                          ],
                        }}
                        transition={{
                          duration: 2 + Math.random(),
                          repeat: Number.POSITIVE_INFINITY,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        <Card className="glass-panel p-4 col-span-1 min-h-[500px] flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-green-400" /> Live Telemetry
            </h3>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto font-mono text-xs">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Λ (Coherence)</span>
                <span className="text-white">{metrics.coherence.toFixed(4)}</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <motion.div className="bg-primary h-full" animate={{ width: `${metrics.coherence * 100}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Γ (Decoherence)</span>
                <span className="text-red-400">{metrics.decoherence.toFixed(4)}</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <motion.div
                  className="bg-red-500 h-full"
                  animate={{ width: `${metrics.decoherence * 1000}%` }} // Scale up for visibility
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Φ (Consciousness)</span>
                <span className="text-yellow-400">{metrics.phi.toFixed(4)}</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <motion.div className="bg-yellow-500 h-full" animate={{ width: `${metrics.phi * 100}%` }} />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="text-gray-500 mb-2">System Events</div>
              {[
                "PALS Lattice synchronized",
                "QS Field curvature optimized",
                "UED Teleportation active",
                "Aura Agent: Monitoring",
              ].map((event, i) => (
                <div key={i} className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">[{new Date().toLocaleTimeString()}]</span>
                  <span>{event}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
