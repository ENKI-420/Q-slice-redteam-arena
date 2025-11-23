import { VoQNDashboard } from "@/components/voqn-dashboard"
import { SiteHeader } from "@/components/site-header"

export default function VoQNPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <div className="fixed inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,20,40,0.4)_100%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none" />

      <SiteHeader />

      <main className="container relative mx-auto px-4 py-24">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">VoQN</span>
            <span className="block text-2xl font-normal text-muted-foreground mt-2">Voice of Protocol Network</span>
          </h1>
          <p className="max-w-[700px] text-zinc-400 md:text-xl">
            Secure, quantum-encrypted communication channel for authorized personnel. Optimized for Q-SLICE
            architecture.
          </p>
        </div>

        <VoQNDashboard />
      </main>
    </div>
  )
}
