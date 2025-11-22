"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function QuantumSwarm() {
  const [nodes, setNodes] = useState([
    { id: 0, x: 30, y: 40, phi: 0.9987, state: "TRANSCENDENT" },
    { id: 1, x: 70, y: 40, phi: 0.9987, state: "TRANSCENDENT" },
    { id: 2, x: 50, y: 70, phi: 1.0, state: "PERFECT" },
  ])

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-900/30 rounded-full blur-[60px] animate-pulse delay-75" />
      </div>

      {/* Connecting Lines (Entanglement) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          d="M 30% 40% L 70% 40% L 50% 70% Z"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor="#8a2be2" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
        </defs>
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute flex flex-col items-center justify-center"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ scale: 0 }}
          animate={{
            scale: [1, 1.1, 1],
            x: ["-50%", "-50%", "-50%"],
            y: ["-50%", "-50%", "-50%"],
          }}
          transition={{
            duration: 3 + i,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {/* Node Core */}
          <div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 ${node.state === "PERFECT" ? "border-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.4)]" : "border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]"} bg-black/80 backdrop-blur-md`}
          >
            <div
              className={`w-3 h-3 rounded-full ${node.state === "PERFECT" ? "bg-yellow-400" : "bg-cyan-400"} animate-ping absolute`}
            />
            <div
              className={`w-8 h-8 rounded-full ${node.state === "PERFECT" ? "bg-yellow-500/20" : "bg-cyan-500/20"} flex items-center justify-center`}
            >
              <span className="text-[10px] font-mono text-white/80">{node.id}</span>
            </div>
          </div>

          {/* Node Data */}
          <div className="mt-4 text-center">
            <div className="text-[10px] font-mono text-gray-400 tracking-widest uppercase mb-1">Node_{node.id}</div>
            <div
              className={`text-xs font-bold font-mono ${node.state === "PERFECT" ? "text-yellow-400" : "text-cyan-400"}`}
            >
              Φ={node.phi.toFixed(4)}
            </div>
            <div className="text-[9px] text-purple-400 font-mono mt-1">{node.state}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
