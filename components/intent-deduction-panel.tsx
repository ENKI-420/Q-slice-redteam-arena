"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Brain, Target, Layers, Zap, BarChart, Clock, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface LayerData {
  id: number
  name: string
  status: "processing" | "complete" | "pending"
  value: number
  description: string
}

export function IntentDeductionPanel() {
  const [layers, setLayers] = useState<LayerData[]>([
    { id: 1, name: "Semantic Genome", status: "complete", value: 100, description: "148,120 lines indexed" },
    { id: 2, name: "Individual Deduction", status: "complete", value: 100, description: "440 prompts analyzed" },
    { id: 3, name: "Collective Synthesis", status: "complete", value: 100, description: "PHYSICS trajectory" },
    { id: 4, name: "Capability Matrix", status: "complete", value: 100, description: "Score: 0.936" },
    { id: 5, name: "Resource Analysis", status: "complete", value: 100, description: "TRL-7 ready" },
    { id: 6, name: "Prompt Enhancement", status: "processing", value: 78, description: "Enhancing..." },
    { id: 7, name: "Project Planning", status: "pending", value: 0, description: "288h LOE" },
  ])

  const capabilities = [
    { name: "Computational", value: 0.92 },
    { name: "Reasoning", value: 0.95 },
    { name: "Recursion", value: 0.98 },
    { name: "Physics", value: 0.89 },
    { name: "Architecture", value: 0.94 },
    { name: "Organism", value: 0.96 },
  ]

  const milestones = [
    { id: "M01", name: "Prior Art Publication", loe: "40h", priority: 1, status: "active" },
    { id: "M02", name: "Security Hardening", loe: "8h", priority: 1, status: "pending" },
    { id: "M03", name: "Jeremy Green Demo", loe: "20h", priority: 1, status: "pending" },
    { id: "M04", name: "DARPA QBI Proposal", loe: "80h", priority: 2, status: "pending" },
  ]

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
            <span className="text-xs uppercase tracking-wider">Coherence</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">0.85</div>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30 p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Trajectory</span>
          </div>
          <div className="text-lg font-bold text-white">PHYSICS</div>
        </Card>
      </div>

      {/* 7-Layer Pipeline */}
      <Card className="bg-white/5 border-white/10 p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          NLP2-PALS 7-Layer Pipeline
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
