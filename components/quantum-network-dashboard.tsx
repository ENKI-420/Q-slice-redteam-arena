"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dna, Zap, Network, Activity, Radio, Cpu, Sparkles } from "lucide-react"

interface QuantumNode {
  id: string
  coherence: number
  entanglement: number
  status: "active" | "evolving" | "dormant"
  generation: number
}

export function QuantumNetworkDashboard() {
  const [nodes, setNodes] = useState<QuantumNode[]>([
    { id: "QN-001", coherence: 0.95, entanglement: 0.87, status: "active", generation: 1 },
    { id: "QN-002", coherence: 0.92, entanglement: 0.91, status: "active", generation: 1 },
    { id: "QN-003", coherence: 0.88, entanglement: 0.85, status: "evolving", generation: 2 },
    { id: "QN-004", coherence: 0.79, entanglement: 0.73, status: "dormant", generation: 1 },
  ])
  const [isEvolutionActive, setIsEvolutionActive] = useState(false)
  const [networkHealth, setNetworkHealth] = useState(89)

  useEffect(() => {
    if (!isEvolutionActive) return

    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.status === "evolving") {
            return {
              ...node,
              coherence: Math.min(0.99, node.coherence + Math.random() * 0.02),
              entanglement: Math.min(0.99, node.entanglement + Math.random() * 0.03),
              generation: node.generation + 1,
            }
          }
          return node
        }),
      )
      setNetworkHealth((prev) => Math.min(100, prev + Math.random() * 2))
    }, 2000)

    return () => clearInterval(interval)
  }, [isEvolutionActive])

  const triggerQuantumEvolution = () => {
    setIsEvolutionActive(!isEvolutionActive)
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        status: !isEvolutionActive ? "evolving" : "active",
      })),
    )
  }

  const totalCoherence = nodes.reduce((sum, n) => sum + n.coherence, 0) / nodes.length
  const totalEntanglement = nodes.reduce((sum, n) => sum + n.entanglement, 0) / nodes.length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Dna className="h-10 w-10 text-primary animate-pulse" />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              DNA-Lang Quantum Network
            </span>
          </h1>
          <p className="text-muted-foreground">Biological computing paradigms • Quantum-enhanced living software</p>
        </div>
        <Badge variant="outline" className="px-4 py-2 text-lg">
          <Activity className="h-4 w-4 mr-2" />
          Network Health: {networkHealth.toFixed(0)}%
        </Badge>
      </div>

      {/* Quantum Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quantum Coherence</p>
              <p className="text-3xl font-bold mt-1">{(totalCoherence * 100).toFixed(1)}%</p>
            </div>
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
              style={{ width: `${totalCoherence * 100}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Entanglement Strength</p>
              <p className="text-3xl font-bold mt-1">{(totalEntanglement * 100).toFixed(1)}%</p>
            </div>
            <Network className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
              style={{ width: `${totalEntanglement * 100}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 border-2 border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Nodes</p>
              <p className="text-3xl font-bold mt-1">{nodes.length}</p>
            </div>
            <Radio className="h-8 w-8 text-pink-500" />
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              {nodes.filter((n) => n.status === "evolving").length} evolving •{" "}
              {nodes.filter((n) => n.status === "active").length} stable
            </p>
          </div>
        </Card>
      </div>

      {/* Evolution Control */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Cpu className="h-6 w-6" />
              Quantum Evolution Engine
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Self-optimizing biological algorithms with O(√n) complexity
            </p>
          </div>
          <Button
            onClick={triggerQuantumEvolution}
            size="lg"
            className="gap-2"
            variant={isEvolutionActive ? "destructive" : "default"}
          >
            <Sparkles className="h-4 w-4" />
            {isEvolutionActive ? "Stop Evolution" : "Start Evolution"}
          </Button>
        </div>

        {/* Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nodes.map((node, index) => (
            <Card
              key={node.id}
              className={`p-4 transition-all duration-300 ${
                node.status === "evolving"
                  ? "border-2 border-primary shadow-lg shadow-primary/20 animate-pulse"
                  : "border"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold">{node.id}</span>
                  <Badge
                    variant={
                      node.status === "active" ? "default" : node.status === "evolving" ? "secondary" : "outline"
                    }
                  >
                    {node.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Coherence</span>
                      <span className="font-medium">{(node.coherence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 transition-all duration-500"
                        style={{ width: `${node.coherence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Entanglement</span>
                      <span className="font-medium">{(node.entanglement * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${node.entanglement * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t text-xs text-muted-foreground">Generation: {node.generation}</div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Quantum Field Visualization */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Network className="h-5 w-5" />
          Quantum Field Visualization
        </h3>
        <div className="relative h-64 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-8">
              {nodes.map((node, i) => (
                <div
                  key={node.id}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                    node.status === "evolving" ? "bg-primary/30 shadow-lg shadow-primary/50 scale-110" : "bg-primary/10"
                  }`}
                  style={{
                    animation: node.status === "evolving" ? "pulse 2s ease-in-out infinite" : "none",
                  }}
                >
                  <Dna
                    className={`h-12 w-12 ${node.status === "evolving" ? "text-primary animate-spin" : "text-primary/50"}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Quantum entangled particles demonstrating superposition and evolutionary adaptation
        </p>
      </Card>
    </div>
  )
}
