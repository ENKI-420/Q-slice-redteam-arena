"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BrainCircuit, Cpu, Dna, Waves } from "lucide-react"

const telemetryData = [
  {
    name: "Aura Core",
    metric: "Coherence",
    value: "Φ=0.998",
    icon: BrainCircuit,
    color: "text-cyan-400",
  },
  {
    name: "Aiden Executor",
    metric: "QPU Load",
    value: "78%",
    icon: Cpu,
    color: "text-purple-400",
  },
  {
    name: "DNA-Lang",
    metric: "Somatic Drift",
    value: "ε < 0.01%",
    icon: Dna,
    color: "text-green-400",
  },
  {
    name: "Quantum Field",
    metric: "Curvature",
    value: "stable",
    icon: Waves,
    color: "text-yellow-400",
  },
]

export function TelemetryDashboard() {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-white">Visual Telemetry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {telemetryData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black/30 border-white/10 text-center p-4 h-full">
                <item.icon className={`w-10 h-10 mx-auto ${item.color}`} />
                <h4 className="mt-3 text-lg font-semibold">{item.name}</h4>
                <p className="text-sm text-white/60">{item.metric}</p>
                <p className={`mt-1 text-2xl font-bold font-mono ${item.color}`}>
                  {item.value}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
