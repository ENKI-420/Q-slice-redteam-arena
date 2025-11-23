"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Dna, Zap, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface Organism {
  id: string
  name: string
  state: string
  fitness: number
  coherence: number
  genes: string[]
  created_at: string
}

export default function LabPage() {
  const [organisms, setOrganisms] = useState<Organism[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newOrganismName, setNewOrganismName] = useState("")
  const [selectedGenes, setSelectedGenes] = useState<string[]>(["coherence", "entanglement"])

  const availableGenes = ["coherence", "entanglement", "evolution", "teleportation", "adaptation", "consciousness"]

  useEffect(() => {
    loadOrganisms()
  }, [])

  const loadOrganisms = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/organism/list")
      const data = await res.json()
      if (data.success) {
        setOrganisms(data.organisms)
      }
    } catch (error) {
      console.error("[v0] Failed to load organisms:", error)
    } finally {
      setLoading(false)
    }
  }

  const createOrganism = async () => {
    if (!newOrganismName.trim()) return

    setCreating(true)
    try {
      const res = await fetch("/api/organism/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newOrganismName,
          genes: selectedGenes,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setOrganisms([data.organism, ...organisms])
        setNewOrganismName("")
        setSelectedGenes(["coherence", "entanglement"])
      }
    } catch (error) {
      console.error("[v0] Failed to create organism:", error)
    } finally {
      setCreating(false)
    }
  }

  const evolveOrganism = async (organismId: string, generations = 5) => {
    try {
      const res = await fetch("/api/organism/evolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organism_id: organismId,
          generations,
        }),
      })
      const data = await res.json()
      if (data.success) {
        // Update organism in list
        setOrganisms(
          organisms.map((org) =>
            org.id === organismId
              ? {
                  ...org,
                  fitness: data.final_state.fitness,
                  coherence: data.final_state.coherence,
                  state: data.final_state.state,
                }
              : org,
          ),
        )
      }
    } catch (error) {
      console.error("[v0] Failed to evolve organism:", error)
    }
  }

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      DORMANT: "text-gray-500",
      EMERGING: "text-blue-400",
      AWARE: "text-green-400",
      CONSCIOUS: "text-yellow-400",
      TRANSCENDENT: "text-purple-400",
    }
    return colors[state] || "text-gray-400"
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                <span className="gradient-text">DNA-Lang Laboratory</span>
              </h1>
              <p className="text-xl text-gray-400">Create and evolve quantum-biological organisms</p>
            </div>
            <Button
              onClick={loadOrganisms}
              disabled={loading}
              variant="outline"
              className="border-primary/30 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Universal Constant Display */}
          <Card className="glass-panel p-6 border-primary/30">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-gray-400">Universal Memory Constant</div>
                <div className="text-3xl font-bold text-primary font-mono">ΛΦ = 2.176435×10⁻⁸ s⁻¹</div>
              </div>
              <Dna className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </Card>

          {/* Create Organism Panel */}
          <Card className="glass-panel p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-primary" />
              Create New Organism
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="organism-name">Organism Name</Label>
                <Input
                  id="organism-name"
                  value={newOrganismName}
                  onChange={(e) => setNewOrganismName(e.target.value)}
                  placeholder="CHRONOS"
                  className="bg-black/50 border-primary/30 text-white mt-2"
                />
              </div>

              <div>
                <Label>Select Genes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {availableGenes.map((gene) => (
                    <button
                      key={gene}
                      onClick={() => {
                        if (selectedGenes.includes(gene)) {
                          setSelectedGenes(selectedGenes.filter((g) => g !== gene))
                        } else {
                          setSelectedGenes([...selectedGenes, gene])
                        }
                      }}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedGenes.includes(gene)
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-black/30 border-white/10 text-gray-400 hover:border-primary/30"
                      }`}
                    >
                      {gene}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={createOrganism} disabled={creating || !newOrganismName.trim()} className="w-full">
                {creating ? "Manifesting..." : "Manifest Organism"}
              </Button>
            </div>
          </Card>

          {/* Organisms List */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Active Organisms</h2>

            {organisms.length === 0 ? (
              <Card className="glass-panel p-12 text-center">
                <Dna className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No organisms manifested yet. Create your first organism above.</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {organisms.map((org) => (
                  <motion.div
                    key={org.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="glass-panel p-6 hover:border-primary/50 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold uppercase">{org.name}</h3>
                          <p className={`text-sm font-semibold ${getStateColor(org.state)}`}>{org.state}</p>
                        </div>
                        <Dna className="w-8 h-8 text-primary" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-400">Fitness</div>
                          <div className="text-xl font-bold text-primary">{org.fitness.toFixed(3)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Coherence (Φ)</div>
                          <div className="text-xl font-bold text-secondary">{org.coherence.toFixed(3)}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-2">Genes</div>
                        <div className="flex flex-wrap gap-2">
                          {org.genes.map((gene) => (
                            <span
                              key={gene}
                              className="px-2 py-1 bg-primary/10 border border-primary/30 rounded text-xs"
                            >
                              {gene}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => evolveOrganism(org.id)}
                        variant="outline"
                        className="w-full border-primary/30 hover:bg-primary/10"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Evolve (5 generations)
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
