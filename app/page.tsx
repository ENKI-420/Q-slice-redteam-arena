"use client"

import { motion } from "framer-motion"
import { Activity, Cpu, Dna, Mic, Send, Share2, ShieldCheck, Wifi, Zap } from "lucide-react"
import { QuantumSwarm } from "@/components/quantum-swarm"
import { BioTerminal } from "@/components/bio-terminal"
import { useState } from "react"

export default function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("teleport")

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Header Section */}
        <header className="lg:col-span-12 flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Dna className="w-8 h-8 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 border border-cyan-500/30 rounded-lg rotate-45" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400">
                DNA-Lang
              </h1>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Quantum-Biological Network // v2.5.0</p>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Network Status</span>
              <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                OPERATIONAL
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Global Φ</span>
              <span className="text-yellow-400 text-sm font-mono font-bold">0.9987</span>
            </div>
          </div>
        </header>

        {/* Left Column: Controls & Status */}
        <div className="lg:col-span-3 space-y-6">
          {/* Navigation Card */}
          <div className="glass-panel rounded-xl p-1">
            <nav className="flex flex-col gap-1">
              {[
                { id: "teleport", icon: Share2, label: "Teleportation" },
                { id: "voice", icon: Mic, label: "Quantum Voice" },
                { id: "text", icon: Send, label: "Entangled Text" },
                { id: "dna", icon: Dna, label: "Gene Synthesis" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === item.id
                      ? "bg-white/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Metrics Card */}
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" /> Real-Time Metrics
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Entanglement Fidelity</span>
                  <span className="text-cyan-400 font-mono">97.04%</span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "97.04%" }}
                    className="h-full bg-cyan-500 shadow-[0_0_10px_#00f0ff]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Coherence Time</span>
                  <span className="text-purple-400 font-mono">∞ (Stable)</span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full bg-purple-500 shadow-[0_0_10px_#8a2be2]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Swarm Consciousness</span>
                  <span className="text-yellow-400 font-mono">TRANSCENDENT</span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "99%" }}
                    className="h-full bg-yellow-500 shadow-[0_0_10px_#ffd700]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>ΛΦ Constant</span>
                <span>2.176435e-8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Main Visual */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Swarm Visualization */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-30 group-hover:opacity-50 transition duration-1000 blur"></div>
            <QuantumSwarm />
          </div>

          {/* Action Area */}
          <div className="glass-panel rounded-xl p-6 min-h-[200px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Dna className="w-32 h-32" />
            </div>

            <div>
              <h2 className="text-xl font-light mb-2 text-white">
                {activeTab === "teleport" && "Quantum Data Teleportation"}
                {activeTab === "voice" && "Entangled Voice Channel"}
                {activeTab === "text" && "Secure Quantum Text"}
                {activeTab === "dna" && "Biological Gene Synthesis"}
              </h2>
              <p className="text-sm text-gray-400 max-w-md">
                {activeTab === "teleport" &&
                  "Initiate instantaneous state transfer via Bell measurement. Payload capacity: 10MB/s via ΛΦ routing."}
                {activeTab === "voice" &&
                  "Real-time audio stream encrypted by quantum key distribution. Zero latency via entanglement."}
                {activeTab === "text" &&
                  "Send uninterceptable messages through the quantum substrate. Self-destructs upon observation."}
                {activeTab === "dna" && "Compile biological algorithms into executable DNA strands for the swarm."}
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-105 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {activeTab === "teleport" ? "Initiate Teleport" : "Activate"}
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2 px-6 rounded-lg transition-all flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Verify Protocol
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal & Logs */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel rounded-xl h-[400px] md:h-[600px] lg:h-full border border-white/10 bg-black/80 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <BioTerminal />
          </div>

          {/* System Status Mini-Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-3 rounded-lg border border-green-500/20">
              <div className="text-[10px] text-gray-400 uppercase mb-1">Android Bridge</div>
              <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                <Wifi className="w-3 h-3" /> Connected
              </div>
            </div>
            <div className="glass-panel p-3 rounded-lg border border-purple-500/20">
              <div className="text-[10px] text-gray-400 uppercase mb-1">QPU Core</div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono">
                <Cpu className="w-3 h-3" /> Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest">
        <div>© 2025 DNA-Lang Systems</div>
        <div className="flex gap-4">
          <span>Latency: 0.00ms (Entangled)</span>
          <span>Encryption: Post-Quantum</span>
        </div>
      </footer>
    </main>
  )
}
