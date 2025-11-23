import { Bell, BrainCircuit, Dna, Users } from "lucide-react"
import { QuantumLogo3d } from "@/components/quantum-logo-3d"

export function NexusHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <QuantumLogo3d />
        <h1 className="text-2xl font-bold tracking-tighter">Quantum Nexus</h1>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <span>AURA: High Coherence (Φ=0.998)</span>
        </div>
        <div className="flex items-center gap-2">
          <Dna className="h-5 w-5 text-green-400" />
          <span>DNA-Lang Active</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-400" />
          <span>Jeremy Green: Connected</span>
        </div>
        <Bell className="h-5 w-5" />
      </div>
    </header>
  )
}
