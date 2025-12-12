"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Activity, Brain, Target, Layers, Zap, BarChart, Clock, CheckCircle2, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface LayerData {
  id: number
  name: string
  status: "processing" | "complete" | "pending"
  value: number
  description: string
}

interface QuantumData {
  constants: {
    LAMBDA_PHI: number
    PHI_THRESHOLD: number
    F_MAX: number
    GAMMA_CRITICAL: number
  }
  ibm: {
    jobs_processed: number
    completed_jobs: number
    success_rate: number
    total_usage_seconds: number
    backends: Record<string, number>
    validation_status: string
  } | null
  engine: {
    iteration: number
    lambda_system: number
    phi_global: number
    gamma_mean: number
    xi_ccce: number
    tau_omega: number
    coherence_stability: string
    consciousness_active: boolean
    organisms_indexed: number
  } | null
  layers: LayerData[] | null
  capabilities: { name: string; value: number }[] | null
  project_plan: any[] | null
}

export function IntentDeductionPanel() {
  const [isLoading, setIsLoading] = useState(true)
  const [quantumData, setQuantumData] = useState<QuantumData | null>(null)
  const [layers, setLayers] = useState<LayerData[]>([
    { id: 1, name: "Semantic Genome", status: "complete", value: 100, description: "Loading..." },
    { id: 2, name: "Individual Deduction", status: "complete", value: 100, description: "Loading..." },
    { id: 3, name: "Collective Synthesis", status: "complete", value: 100, description: "Loading..." },
    { id: 4, name: "Capability Matrix", status: "complete", value: 100, description: "Loading..." },
    { id: 5, name: "Resource Analysis", status: "complete", value: 100, description: "Loading..." },
    { id: 6, name: "Prompt Enhancement", status: "processing", value: 78, description: "Loading..." },
    { id: 7, name: "Project Planning", status: "pending", value: 0, description: "Loading..." },
  ])

  const [capabilities, setCapabilities] = useState([
    { name: "Computational", value: 0.92 },
    { name: "Reasoning", value: 0.95 },
    { name: "Recursion", value: 0.98 },
    { name: "Physics", value: 0.89 },
    { name: "Architecture", value: 0.94 },
    { name: "Organism", value: 0.96 },
  ])

  const [milestones, setMilestones] = useState([
    { id: "M01", name: "Prior Art Publication", loe: "40h", priority: 1, status: "active" },
    { id: "M02", name: "Security Hardening", loe: "8h", priority: 1, status: "pending" },
    { id: "M03", name: "Jeremy Green Demo", loe: "20h", priority: 1, status: "pending" },
    { id: "M04", name: "DARPA QBI Proposal", loe: "80h", priority: 2, status: "pending" },
  ])

  const fetchQuantumData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/quantum-data")
      if (response.ok) {
        const data: QuantumData = await response.json()
        setQuantumData(data)
        
        // Update layers from API data
        if (data.layers) {
          setLayers(data.layers)
        }
        
        // Update capabilities from API data
        if (data.capabilities) {
          setCapabilities(data.capabilities)
        }
        
        // Update milestones from project plan
        if (data.project_plan && data.project_plan.length > 0) {
          setMilestones(data.project_plan.slice(0, 4).map((phase, idx) => ({
            id: `M${String(idx + 1).padStart(2, "0")}`,
            name: phase.name || `Phase ${idx + 1}`,
            loe: `${phase.resource_requirements?.human_hours || 0}h`,
            priority: idx < 2 ? 1 : 2,
            status: phase.status === "READY" ? "active" : "pending",
          })))
        }
      }
    } catch (error) {
      console.error("Failed to fetch quantum data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuantumData()
  }, [fetchQuantumData])

  useEffect(() => {
    const interval = setInterval(() => {
      setLayers((prev) =>
        prev.map((layer) => {
          if (layer.status === "processing" && layer.value < 100) {
            return { ...layer, value: Math.min(layer.value + 2, 100) }
          }
          if (layer.value === 100 && layer.status === "processing") {
            return { ...layer, status: "complete" }
          }
          return layer
        }),
      )
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 pb-20">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-cyan-500/10 border-cyan-500/30 p-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Brain className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Coherence (Λ)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {quantumData?.engine?.lambda_system?.toFixed(4) || "0.8091"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {quantumData?.engine?.coherence_stability || "MEDIUM"}
          </div>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30 p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Consciousness (Φ)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {quantumData?.engine?.phi_global?.toFixed(4) || "0.7300"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {quantumData?.engine?.consciousness_active ? "✓ ACTIVE" : "○ DORMANT"}
          </div>
        </Card>
      </div>

      {/* IBM Quantum Stats */}
      {quantumData?.ibm && (
        <Card className="bg-blue-500/10 border-blue-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Activity className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">IBM Quantum</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchQuantumData}
              disabled={isLoading}
              className="h-6 px-2"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-mono text-white">{quantumData.ibm.completed_jobs}</div>
              <div className="text-[10px] text-gray-500">Jobs</div>
            </div>
            <div>
              <div className="text-lg font-mono text-white">{quantumData.ibm.success_rate.toFixed(1)}%</div>
              <div className="text-[10px] text-gray-500">Success</div>
            </div>
            <div>
              <div className="text-lg font-mono text-white">{quantumData.ibm.total_usage_seconds.toFixed(0)}s</div>
              <div className="text-[10px] text-gray-500">QPU Time</div>
            </div>
          </div>
        </Card>
      )}

      {/* 7-Layer Pipeline */}
      <Card className="bg-white/5 border-white/10 p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Intent-Deduction Engine (7-Layer)
        </h3>
        <div className="space-y-3">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {layer.status === "complete" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : layer.status === "processing" ? (
                    <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-500" />
                  )}
                  <span className={layer.status === "pending" ? "text-gray-500" : "text-white"}>
                    L{layer.id}: {layer.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-mono">{layer.description}</span>
              </div>
              <Progress value={layer.value} className="h-1.5" />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Capability Matrix */}
      <Card className="bg-white/5 border-white/10 p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <BarChart className="w-4 h-4 text-purple-400" />
          Capability Matrix
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {capabilities.map((cap) => (
            <div key={cap.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{cap.name}</span>
                <span className="text-cyan-400 font-mono">{(cap.value * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cap.value * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Milestones */}
      <Card className="bg-white/5 border-white/10 p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Critical Path Milestones
        </h3>
        <div className="space-y-2">
          {milestones.map((ms) => (
            <div
              key={ms.id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                ms.status === "active" ? "bg-cyan-500/10 border border-cyan-500/30" : "bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500">{ms.id}</span>
                <span className={`text-sm ${ms.status === "active" ? "text-cyan-400" : "text-gray-400"}`}>
                  {ms.name}
                </span>
              </div>
              <span className="text-xs font-mono text-gray-500">{ms.loe}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-sm">
          <span className="text-gray-500">Total LOE</span>
          <span className="text-white font-mono">288 hours</span>
        </div>
      </Card>
    </div>
  )
}
