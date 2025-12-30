"use client"

import { QSUEDPALSDashboard } from "@/components/qs-ued-pals-dashboard"
import { AuraAssistant } from "@/components/aura-assistant"
import { SiteHeader } from "@/components/site-header"
import { motion } from "framer-motion"

export default function EngineeringPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <SiteHeader />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-full h-[500px] bg-secondary/5 blur-[100px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <main className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="flex flex-col gap-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold mb-2">AIDEN+AURA Framework</h1>
            <p className="text-xl text-gray-400">Duality Engineering Synthesis & Quantum Control Plane</p>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <QSUEDPALSDashboard />
              </motion.div>
            </div>

            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="sticky top-24"
              >
                <AuraAssistant />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
