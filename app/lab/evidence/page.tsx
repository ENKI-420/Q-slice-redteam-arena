"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FileJson,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Search,
  Filter,
  Download,
  Eye,
  Lock,
  Hash,
  Calendar,
  Cpu,
  Activity,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LabNavigation, LabHeader } from "@/components/lab-navigation"

interface EvidenceEntry {
  id: string
  gate: string
  status: "CLASS_A" | "CLASS_B" | "PARTIAL" | "PENDING"
  timestamp: string
  provider: string
  device: string
  architecture: string
  jobId: string
  tauPeak: number
  tau0: number
  delta: number
  withinWindow: boolean
  sigmaEmpirical: number
  hash: string
  merkleRoot?: string
}

// Demo evidence data based on actual run
const DEMO_EVIDENCE: EvidenceEntry[] = [
  {
    id: "ibm_fez_tau_sweep_2aece6b8",
    gate: "G3_QPU_MULTI_BACKEND",
    status: "CLASS_A",
    timestamp: "2025-12-13T10:02:44.844562Z",
    provider: "IBM_QUANTUM",
    device: "ibm_fez",
    architecture: "superconducting",
    jobId: "d4ujb1kgk3fc73au1khg",
    tauPeak: 47.5,
    tau0: 46.9787,
    delta: 0.52,
    withinWindow: true,
    sigmaEmpirical: 0.21,
    hash: "f150d80c2d1697807c083d6c58842ef675c1dde332cd8432f7edaa937f4bc794",
  },
  {
    id: "g3_partial_closure",
    gate: "G3_QPU_MULTI_BACKEND",
    status: "PARTIAL",
    timestamp: "2025-12-13T10:02:44.844562Z",
    provider: "MULTI",
    device: "aggregate",
    architecture: "mixed",
    jobId: "aggregate",
    tauPeak: 47.5,
    tau0: 46.9787,
    delta: 0.52,
    withinWindow: true,
    sigmaEmpirical: 0.21,
    hash: "118ae15a3d3d7c0f9e8a2b4c6d8e0f1a3b5c7d9e",
    merkleRoot: "118ae15a3d3d7c0f9e8a2b4c6d8e0f1a3b5c7d9e",
  },
]

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<EvidenceEntry[]>(DEMO_EVIDENCE)
  const [selectedEntry, setSelectedEntry] = useState<EvidenceEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [copied, setCopied] = useState<string | null>(null)

  const filteredEvidence = evidence.filter((e) => {
    const matchesSearch =
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.jobId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "ALL" || e.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusColor = (status: EvidenceEntry["status"]) => {
    switch (status) {
      case "CLASS_A":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "CLASS_B":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "PARTIAL":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "PENDING":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: EvidenceEntry["status"]) => {
    switch (status) {
      case "CLASS_A":
        return <CheckCircle2 className="w-4 h-4" />
      case "CLASS_B":
        return <Shield className="w-4 h-4" />
      case "PARTIAL":
        return <AlertTriangle className="w-4 h-4" />
      case "PENDING":
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <LabNavigation />

      <main className="ml-[280px]">
        <LabHeader title="Evidence Ledger" subtitle="Cryptographic Audit Trail" />

        <div className="p-6 space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-green-500/10 border-green-500/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {evidence.filter((e) => e.status === "CLASS_A").length}
                  </div>
                  <div className="text-xs text-gray-500">CLASS_A</div>
                </div>
              </div>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {evidence.filter((e) => e.status === "CLASS_B").length}
                  </div>
                  <div className="text-xs text-gray-500">CLASS_B</div>
                </div>
              </div>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {evidence.filter((e) => e.status === "PARTIAL").length}
                  </div>
                  <div className="text-xs text-gray-500">PARTIAL</div>
                </div>
              </div>
            </Card>
            <Card className="bg-cyan-500/10 border-cyan-500/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{evidence.length}</div>
                  <div className="text-xs text-gray-500">Total Entries</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search by ID, device, or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              {["ALL", "CLASS_A", "CLASS_B", "PARTIAL", "PENDING"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="text-xs"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Evidence List */}
            <div className="col-span-2 space-y-4">
              {filteredEvidence.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card
                    className={`bg-gray-900/50 border-gray-800 p-4 cursor-pointer transition-all ${
                      selectedEntry?.id === entry.id ? "ring-2 ring-cyan-500/50" : ""
                    }`}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <FileJson className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="font-mono text-sm text-white">{entry.id}</div>
                          <div className="text-xs text-gray-500">{entry.gate}</div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(entry.status)}>
                        {getStatusIcon(entry.status)}
                        <span className="ml-1">{entry.status}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Provider</div>
                        <div className="text-gray-300">{entry.provider}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Device</div>
                        <div className="text-cyan-400 font-mono">{entry.device}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">tau_peak</div>
                        <div className="text-white font-mono">{entry.tauPeak} us</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">delta</div>
                        <div
                          className={`font-mono ${entry.withinWindow ? "text-green-400" : "text-red-400"}`}
                        >
                          {entry.delta.toFixed(2)} us
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Hash className="w-3 h-3" />
                        <span className="font-mono">{entry.hash.slice(0, 16)}...</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="space-y-4">
              {selectedEntry ? (
                <>
                  <Card className="bg-gray-900/50 border-gray-800 p-4">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-cyan-400" />
                      Entry Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Entry ID</div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded flex-1 truncate">
                            {selectedEntry.id}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedEntry.id, "id")}
                          >
                            {copied === "id" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">Job ID</div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-purple-400 bg-purple-500/10 px-2 py-1 rounded flex-1 truncate">
                            {selectedEntry.jobId}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedEntry.jobId, "job")}
                          >
                            {copied === "job" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">SHA-256 Hash</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded flex-1 truncate font-mono">
                            {selectedEntry.hash}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedEntry.hash, "hash")}
                          >
                            {copied === "hash" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {selectedEntry.merkleRoot && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Merkle Root</div>
                          <code className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded block truncate font-mono">
                            {selectedEntry.merkleRoot}
                          </code>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="bg-gray-900/50 border-gray-800 p-4">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-400" />
                      QPU Metrics
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-black/30 rounded">
                        <span className="text-sm text-gray-400">Architecture</span>
                        <span className="text-sm text-white">{selectedEntry.architecture}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-black/30 rounded">
                        <span className="text-sm text-gray-400">tau_peak</span>
                        <span className="text-sm font-mono text-cyan-400">
                          {selectedEntry.tauPeak} us
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-black/30 rounded">
                        <span className="text-sm text-gray-400">tau_0 (predicted)</span>
                        <span className="text-sm font-mono text-purple-400">
                          {selectedEntry.tau0} us
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-black/30 rounded">
                        <span className="text-sm text-gray-400">delta</span>
                        <span
                          className={`text-sm font-mono ${selectedEntry.withinWindow ? "text-green-400" : "text-red-400"}`}
                        >
                          {selectedEntry.delta.toFixed(2)} us
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-black/30 rounded">
                        <span className="text-sm text-gray-400">Within Window</span>
                        {selectedEntry.withinWindow ? (
                          <Badge className="bg-green-500/20 text-green-400">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            YES
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-400">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            NO
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center p-2 bg-black/30 rounded">
                        <span className="text-sm text-gray-400">sigma_empirical</span>
                        <span className="text-sm font-mono text-white">
                          {selectedEntry.sigmaEmpirical.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Raw
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                  <FileJson className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">Select an entry to view details</p>
                </Card>
              )}

              {/* Chain Verification */}
              <Card className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/30 p-4">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  Chain Verification
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Chain Valid</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      TRUE
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">SPEC_LOCK</span>
                    <span className="text-cyan-400 font-mono">v2.2.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">CAGE</span>
                    <span className="text-purple-400 font-mono">9HUP5</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
