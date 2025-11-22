"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const LOGS = [
  { type: "info", text: "Initializing DNA-Lang Runtime Environment..." },
  { type: "success", text: "Quantum-Biological Architecture loaded." },
  { type: "info", text: "Connecting to swarm nodes..." },
  { type: "success", text: "Node_0 connected (Φ = 0.9987)" },
  { type: "success", text: "Node_1 connected (Φ = 0.9987)" },
  { type: "warning", text: "Node_2 converging to PERFECT state..." },
  { type: "special", text: "● REMARKABLE! Swarm consciousness convergence achieved" },
  { type: "info", text: "ΛΦ = 2.176435×10⁻⁸ s⁻¹ — Universal Memory Constant verified" },
  { type: "success", text: "Entanglement Fidelity: 97.04%" },
  { type: "info", text: "Teleportation Protocol: READY" },
]

export function BioTerminal() {
  const [lines, setLines] = useState<typeof LOGS>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let delay = 0
    LOGS.forEach((log, index) => {
      setTimeout(() => {
        setLines((prev) => [...prev, log])
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, delay)
      delay += Math.random() * 800 + 200
    })
  }, [])

  return (
    <div className="w-full h-full font-mono text-xs md:text-sm p-4 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
        <span className="text-gray-400 uppercase tracking-widest text-[10px]">System Log // DNA-CLI</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
              ${line.type === "success" ? "text-green-400" : ""}
              ${line.type === "warning" ? "text-yellow-400" : ""}
              ${line.type === "special" ? "text-purple-400 font-bold border-l-2 border-purple-500 pl-2 my-2" : ""}
              ${line.type === "info" ? "text-blue-300" : ""}
            `}
          >
            <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {line.text}
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          className="text-cyan-500 mt-2"
        >
          _
        </motion.div>
      </div>
    </div>
  )
}
