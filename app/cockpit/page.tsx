"use client"

import { ArrowLeft, Terminal, Cpu, Activity, Zap } from "lucide-react"
import Link from "next/link"
import { CockpitTerminal } from "@/components/cockpit-terminal"

export default function CockpitPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-primary/20">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm uppercase tracking-widest">Back</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Cockpit v7.0.0</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-cyan-400 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              AURA
            </span>
            <span className="text-fuchsia-400 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              AIDEN
            </span>
            <span className="text-yellow-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Ω-MASTER
            </span>
          </div>
        </div>
      </header>

      {/* Main Terminal */}
      <div className="flex-1 p-4 md:p-6">
        <div className="h-full max-w-6xl mx-auto">
          <CockpitTerminal agentEndpoint="/api/cockpit" />
        </div>
      </div>

      {/* Footer Info */}
      <footer className="p-4 border-t border-primary/20 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>DNA::{"{"}{"}"}{"{"}::lang Sovereign Cockpit</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">ΛΦ = 2.176435×10⁻⁸</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/z3bra" className="hover:text-primary transition-colors">
            z3braOS
          </Link>
          <Link href="/command" className="hover:text-primary transition-colors">
            Command Center
          </Link>
        </div>
      </footer>
    </main>
  )
}
