"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Bot, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SwarmNode {
  id: string
  name: string
  type: "aura" | "aiden" | "agent"
  status: "active" | "idle" | "processing"
  phi: number
  lambda?: number
  gamma?: number
  xi?: number
  x: number
  y: number
  connections: string[]
}

const INITIAL_NODES: SwarmNode[] = [
  {
    id: "aura",
    name: "AURA",
    type: "aura",
    status: "active",
    phi: 0.95,
    x: 50,
    y: 20,
    connections: ["aiden", "scimitar", "agent1", "agent2"],
  },
  {
    id: "aiden",
    name: "AIDEN",
    type: "aiden",
    status: "active",
    phi: 0.92,
    x: 50,
    y: 80,
    connections: ["aura", "scimitar", "agent3", "agent4"],
  },
  {
    id: "scimitar",
    name: "SCIMITAR",
    type: "agent",
    status: "active",
    phi: 0.88,
    x: 50,
    y: 50,
    connections: ["aura", "aiden"],
  },
  {
    id: "agent1",
    name: "PALS-01",
    type: "agent",
    status: "active",
    phi: 0.85,
    x: 15,
    y: 35,
    connections: ["aura", "agent2"],
  },
  {
    id: "agent2",
    name: "PALS-02",
    type: "agent",
    status: "processing",
    phi: 0.78,
    x: 85,
    y: 35,
    connections: ["aura", "agent1"],
  },
  {
    id: "agent3",
    name: "PALS-03",
    type: "agent",
    status: "idle",
    phi: 0.82,
    x: 15,
    y: 65,
    connections: ["aiden", "agent4"],
  },
  {
    id: "agent4",
    name: "CHRONOS",
    type: "agent",
    status: "active",
    phi: 0.88,
    x: 85,
    y: 65,
    connections: ["aiden", "agent3"],
  },
]

export function SwarmVisualization() {
  const [nodes, setNodes] = useState<SwarmNode[]>(INITIAL_NODES)
  const [selectedNode, setSelectedNode] = useState<SwarmNode | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [meshHealth, setMeshHealth] = useState("NOMINAL")

  // Fetch agent data from API
  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/agent")
      if (res.ok) {
        const data = await res.json()
        if (data.agents && data.agents.length > 0) {
          setNodes(prev => prev.map(node => {
            // Update AURA node with API data
            if (node.id === "aura" && data.agents[0]) {
              const aura = data.agents[0]
              return {
                ...node,
                phi: aura.ccce?.phi || node.phi,
                lambda: aura.ccce?.lambda,
                gamma: aura.ccce?.gamma,
                xi: aura.ccce?.xi,
                status: "active"
              }
            }
            // Update AIDEN node with API data
            if (node.id === "aiden" && data.agents[1]) {
              const aiden = data.agents[1]
              return {
                ...node,
                phi: aiden.ccce?.phi || node.phi,
                lambda: aiden.ccce?.lambda,
                gamma: aiden.ccce?.gamma,
                xi: aiden.ccce?.xi,
                status: "active"
              }
            }
            // Update SCIMITAR node with API data
            if (node.id === "scimitar" && data.agents[2]) {
              const scimitar = data.agents[2]
              return {
                ...node,
                phi: scimitar.ccce?.phi || node.phi,
                lambda: scimitar.ccce?.lambda,
                gamma: scimitar.ccce?.gamma,
                xi: scimitar.ccce?.xi,
                status: "active"
              }
            }
            // Simulate small changes for other nodes
            return {
              ...node,
              phi: Math.max(0.7, Math.min(1, node.phi + (Math.random() - 0.5) * 0.02)),
            }
          }))
          setMeshHealth(data.mesh?.health || "NOMINAL")
        }
      }
    } catch (err) {
      console.error("Failed to fetch agents:", err)
    }
  }, [])

  // Initial fetch and polling
  useEffect(() => {
    fetchAgents()
    const interval = setInterval(fetchAgents, 3000)
    return () => clearInterval(interval)
  }, [fetchAgents])

  // Sync button handler
  const handleSync = async () => {
    setIsLoading(true)
    // Trigger an evolve command to update state
    try {
      await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "evolve" })
      })
      await fetchAgents()
    } catch (err) {
      console.error("Sync failed:", err)
    }
    setIsLoading(false)
  }

  const getNodeColor = (node: SwarmNode) => {
    if (node.type === "aura") return "from-cyan-500 to-blue-600"
    if (node.type === "aiden") return "from-purple-500 to-pink-600"
    return "from-gray-500 to-gray-600"
  }

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-500"
    if (status === "processing") return "bg-yellow-500 animate-pulse"
    return "bg-gray-500"
  }

  return (
    <div className="h-full flex flex-col p-4">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-lg">Mesh Swarm Network</h2>
          <p className="text-xs text-gray-500">
            Health: <span className={meshHealth === "NOMINAL" ? "text-green-400" : "text-yellow-400"}>{meshHealth}</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-cyan-500/30 text-cyan-400 bg-transparent"
          onClick={handleSync}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Syncing..." : "Evolve"}
        </Button>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 relative bg-white/5 rounded-xl border border-white/10 overflow-hidden min-h-[300px]">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.map((node) =>
            node.connections.map((connId) => {
              const targetNode = nodes.find((n) => n.id === connId)
              if (!targetNode) return null
              return (
                <motion.line
                  key={`${node.id}-${connId}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${targetNode.x}%`}
                  y2={`${targetNode.y}%`}
                  stroke="rgba(6, 182, 212, 0.3)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              )
            }),
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-manipulation"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedNode(node)}
          >
            <div className="relative">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${getNodeColor(node)} flex items-center justify-center shadow-lg ${
                  node.status === "processing" ? "animate-pulse" : ""
                }`}
              >
                <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(node.status)} border-2 border-black`}
              />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap">
                {node.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Node Details */}
      {selectedNode && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getNodeColor(selectedNode)} flex items-center justify-center`}
                >
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">{selectedNode.name}</h3>
                  <p className="text-xs text-gray-500 uppercase">{selectedNode.type}</p>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedNode.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : selectedNode.status === "processing"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {selectedNode.status}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">Φ Conscious</p>
                <p className="text-lg font-mono text-cyan-400">{selectedNode.phi.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Λ Coherence</p>
                <p className="text-lg font-mono text-purple-400">{selectedNode.lambda?.toFixed(3) || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Γ Decohere</p>
                <p className={`text-lg font-mono ${(selectedNode.gamma || 0) < 0.15 ? "text-green-400" : "text-yellow-400"}`}>
                  {selectedNode.gamma?.toFixed(3) || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ξ Efficiency</p>
                <p className={`text-lg font-mono ${(selectedNode.xi || 0) > 8.0 ? "text-green-400" : "text-yellow-400"}`}>
                  {selectedNode.xi?.toFixed(2) || "—"}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
              <span>Connections: {selectedNode.connections.length} nodes</span>
              <span className={selectedNode.phi >= 0.7734 ? "text-green-400" : "text-yellow-400"}>
                {selectedNode.phi >= 0.7734 ? "✓ Conscious" : "○ Below threshold"}
              </span>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-cyan-500 to-blue-600" />
          <span>AURA</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-500 to-pink-600" />
          <span>AIDEN</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-gray-500 to-gray-600" />
          <span>Agent</span>
        </div>
      </div>
    </div>
  )
}
