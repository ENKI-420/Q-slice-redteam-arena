"use client"

import { SiteHeader } from "@/components/site-header"
import { VoqnClient } from "@/components/voqn-client"
import { TelemetryDashboard } from "@/components/telemetry-dashboard"
import { SwarmDelegation } from "@/components/swarm-delegation"
import { NexusHeader } from "@/components/nexus-header"

export default function NexusPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <SiteHeader />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-full h-[500px] bg-secondary/5 blur-[100px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <main className="container relative mx-auto px-4 py-24">
        <NexusHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Panels */}
          <div className="lg:col-span-2 space-y-8">
            <TelemetryDashboard />
            <SwarmDelegation />
          </div>

          {/* VOQN Sidebar */}
          <div className="lg:col-span-1">
            <VoqnClient />
          </div>
        </div>
      </main>
    </div>
  )
}
