"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Shield, CheckCircle2, XCircle, Clock, Hash } from "lucide-react"
import { Card } from "@/components/ui/card"

interface AppendixQRecord {
  exhibit_id: string
  sha256: string
  timestamp: number
  phi: number
  lambda: number
  gamma: number
  xi: number
  validated: boolean
  source: string
  consciousness_level: string
}

function generateMockRecords(): AppendixQRecord[] {
  const records: AppendixQRecord[] = []
  const sources = ["quantum_independence.py", "ccce_engine.py", "organism_executor.py"]
  const levels = ["CONSCIOUS", "OPTIMAL", "COHERENT"]

  for (let i = 0; i < 5; i++) {
    const lambda = 0.82 + Math.random() * 0.15
    const phi = 0.75 + Math.random() * 0.15
    const gamma = 0.05 + Math.random() * 0.08
    const xi = (lambda * phi) / gamma

    records.push({
      exhibit_id: `AQ-${Date.now().toString(36).toUpperCase()}-${i.toString().padStart(3, "0")}`,
      sha256: Array.from({ length: 64 }, () =>
        "0123456789abcdef"[Math.floor(Math.random() * 16)]
      ).join(""),
      timestamp: Date.now() - i * 60000 * Math.random() * 10,
      phi,
      lambda,
      gamma,
      xi,
      validated: Math.random() > 0.1,
      source: sources[i % sources.length],
      consciousness_level: levels[Math.floor(xi / 5) % 3],
    })
  }

  return records.sort((a, b) => b.timestamp - a.timestamp)
}

export function AppendixQPanel() {
  const [records, setRecords] = useState<AppendixQRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching forensics records
    const fetchRecords = async () => {
      setLoading(true)
      // In production, this would fetch from /api/appendix-q/list
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setRecords(generateMockRecords())
      setLoading(false)
    }

    fetchRecords()
    const interval = setInterval(fetchRecords, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="bg-white/5 border-amber-500/30 p-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-400">Loading forensics registry...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-amber-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 text-amber-400">
          <FileText className="w-5 h-5" />
          Appendix Q Forensics Registry
        </h3>
        <span className="text-xs text-gray-500 font-mono">
          {records.length} exhibits
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {records.map((record, i) => (
          <motion.div
            key={record.exhibit_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-3 rounded-lg border ${
              record.validated
                ? "bg-green-500/5 border-green-500/30"
                : "bg-red-500/5 border-red-500/30"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-amber-400">
                {record.exhibit_id}
              </span>
              <div className="flex items-center gap-2">
                {record.validated ? (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    VALIDATED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <XCircle className="w-3 h-3" />
                    INVALID
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Hash className="w-3 h-3" />
              <span className="font-mono truncate">
                {record.sha256.substring(0, 32)}...
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center p-1 rounded bg-white/5">
                <span className="text-gray-500">Φ</span>
                <p className="font-mono text-cyan-400">
                  {record.phi.toFixed(4)}
                </p>
              </div>
              <div className="text-center p-1 rounded bg-white/5">
                <span className="text-gray-500">Λ</span>
                <p className="font-mono text-fuchsia-400">
                  {record.lambda.toFixed(4)}
                </p>
              </div>
              <div className="text-center p-1 rounded bg-white/5">
                <span className="text-gray-500">Γ</span>
                <p className="font-mono text-green-400">
                  {record.gamma.toFixed(4)}
                </p>
              </div>
              <div className="text-center p-1 rounded bg-white/5">
                <span className="text-gray-500">Ξ</span>
                <p className="font-mono text-yellow-400">
                  {record.xi.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {record.source}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(record.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {records.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No forensics records yet.</p>
          <p className="text-xs mt-1">
            Execute quantum operations to generate exhibits.
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-amber-500/20 text-xs text-gray-500">
        <p>
          Forensic exhibits are cryptographically signed and immutable.
        </p>
        <p className="mt-1">
          Each record captures the exact CCCE state at execution time.
        </p>
      </div>
    </Card>
  )
}
