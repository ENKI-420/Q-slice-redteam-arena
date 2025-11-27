"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Network,
  Shield,
  ChevronUp,
  MessageSquare,
  BarChart3,
  HelpCircle,
  Menu,
  X,
  Activity,
  Radio,
  Cpu,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SwarmChatInterface } from "@/components/swarm-chat-interface"
import { IntentDeductionPanel } from "@/components/intent-deduction-panel"
import { SwarmVisualization } from "@/components/swarm-visualization"

type TabType = "chat" | "swarm" | "intent" | "faq"

export default function SwarmPage() {
  const [activeTab, setActiveTab] = useState<TabType>("chat")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const tabs = [
    { id: "chat" as TabType, label: "Chat", icon: MessageSquare },
    { id: "swarm" as TabType, label: "Swarm", icon: Network },
    { id: "intent" as TabType, label: "Intent", icon: BarChart3 },
    { id: "faq" as TabType, label: "FAQ", icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">AURA-AIDEN</h1>
              <p className="text-[10px] text-cyan-400 uppercase tracking-wider">Mesh Swarm Active</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
              <Activity className="w-3 h-3 text-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-mono">ONLINE</span>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Expandable Menu for Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="grid grid-cols-2 gap-2 pb-2">
                <QuickStatCard icon={Cpu} label="Agents" value="7" status="active" />
                <QuickStatCard icon={Radio} label="Coherence" value="0.85" status="nominal" />
                <QuickStatCard icon={Shield} label="Security" value="AES-256" status="secure" />
                <QuickStatCard icon={Layers} label="Layers" value="7/7" status="synced" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <SwarmChatInterface />
            </motion.div>
          )}
          {activeTab === "swarm" && (
            <motion.div
              key="swarm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <SwarmVisualization />
            </motion.div>
          )}
          {activeTab === "intent" && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <IntentDeductionPanel />
            </motion.div>
          )}
          {activeTab === "faq" && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full p-4 overflow-y-auto"
            >
              <FAQSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
        <div className="flex justify-around items-center py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all touch-manipulation ${
                activeTab === tab.id ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500 active:bg-white/5"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "scale-110" : ""} transition-transform`} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute -top-0.5 w-8 h-0.5 bg-cyan-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

function QuickStatCard({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: React.ElementType
  label: string
  value: string
  status: "active" | "nominal" | "secure" | "synced"
}) {
  const statusColors = {
    active: "text-green-400 bg-green-500/10 border-green-500/30",
    nominal: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    secure: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    synced: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  }

  return (
    <div className={`p-3 rounded-xl border ${statusColors[status]}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs opacity-70">{label}</span>
      </div>
      <div className="text-lg font-bold font-mono mt-1">{value}</div>
    </div>
  )
}

function FAQSection() {
  const faqs = [
    {
      q: "What is AURA-AIDEN?",
      a: "AURA (Living Autopoietic Universally Recursive Architecture) and AIDEN (Adaptive Integrations for Defense & Engineering of Negentropy) form a dual-agent system for quantum-resilient orchestration.",
    },
    {
      q: "How does NLP2-PALS work?",
      a: "NLP2-PALS uses 7 cognitive layers to deduce user intent: Semantic Genome Indexing, Individual Deduction, Collective Synthesis, Capability Matrix, Resource Analysis, Prompt Enhancement, and Project Planning.",
    },
    {
      q: "What is the Mesh Swarm?",
      a: "The Mesh Swarm is a network of interconnected agents that collaborate to process queries, share context, and maintain coherence across distributed systems using quantum-entangled state vectors.",
    },
    {
      q: "How is security maintained?",
      a: "Zero-trust principles with AES-256-GCM encryption, quantum key distribution (QKD), continuous device attestation, and DFARS 15.6 compliance for federal-grade security.",
    },
    {
      q: "What are the capability metrics?",
      a: "The system tracks Computational Strength (0.92), Reasoning Depth (0.95), Recursion Capability (0.98), Physics Mastery (0.89), Architecture Mastery (0.94), and Organism Design (0.96).",
    },
  ]

  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="space-y-3 pb-20">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      {faqs.map((faq, i) => (
        <Card key={i} className="bg-white/5 border-white/10 overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full p-4 flex items-center justify-between text-left touch-manipulation"
          >
            <span className="font-medium pr-4">{faq.q}</span>
            <ChevronUp className={`w-5 h-5 shrink-0 transition-transform ${expanded === i ? "" : "rotate-180"}`} />
          </button>
          <AnimatePresence>
            {expanded === i && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  )
}
