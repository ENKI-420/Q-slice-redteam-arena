"use client"

import { motion } from "framer-motion"

export function NexusHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4"
    >
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-blue-600">
        Quantum Nexus
      </h1>
      <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
        The unified collaboration portal bridging theoretical breakthroughs with real-time human-to-human interaction.
      </p>
    </motion.div>
  )
}
