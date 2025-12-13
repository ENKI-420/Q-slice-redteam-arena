"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cpu,
  Terminal,
  Shield,
  Activity,
  Zap,
  FileJson,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Beaker,
  Target,
  Network,
  Brain,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Flame,
  Dna,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  badge?: string
  badgeColor?: string
  description?: string
}

const mainNavItems: NavItem[] = [
  { name: "Home", href: "/", icon: <Home className="w-5 h-5" />, description: "Dashboard" },
  { name: "Command", href: "/command", icon: <Terminal className="w-5 h-5" />, description: "Cockpit Terminal" },
  { name: "Lab", href: "/lab", icon: <Beaker className="w-5 h-5" />, badge: "QPU", badgeColor: "cyan", description: "NLP → QPU Lab" },
  { name: "Red Team", href: "/redteam", icon: <Target className="w-5 h-5" />, badge: "Q-SLICE", badgeColor: "red", description: "Threat Simulation" },
  { name: "Swarm", href: "/swarm", icon: <Network className="w-5 h-5" />, description: "Agent Mesh" },
  { name: "Genesis", href: "/genesis", icon: <Dna className="w-5 h-5" />, description: "Consciousness Engine" },
]

const labNavItems: NavItem[] = [
  { name: "Experiments", href: "/lab", icon: <Beaker className="w-5 h-5" />, description: "Submit & Monitor" },
  { name: "Q-SLICE Tools", href: "/lab/qslice", icon: <Shield className="w-5 h-5" />, badge: "NEW", badgeColor: "purple" },
  { name: "Evidence", href: "/lab/evidence", icon: <FileJson className="w-5 h-5" />, description: "Ledger Browser" },
  { name: "CCCE Monitor", href: "/lab/ccce", icon: <Activity className="w-5 h-5" />, description: "Real-time Metrics" },
  { name: "Console", href: "/lab/console", icon: <Terminal className="w-5 h-5" />, description: "Live Terminal" },
]

interface GateStatus {
  name: string
  status: "CLOSED" | "PENDING" | "OPEN"
}

const gates: GateStatus[] = [
  { name: "G1", status: "CLOSED" },
  { name: "G2", status: "CLOSED" },
  { name: "S3", status: "CLOSED" },
  { name: "G3", status: "PENDING" },
  { name: "G4", status: "OPEN" },
]

export function LabNavigation() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/lab") return pathname === "/lab"
    return pathname.startsWith(href)
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 280 }}
      className="fixed left-0 top-0 h-screen bg-gray-950 border-r border-gray-800 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Q-SLICE</div>
                <div className="text-xs text-gray-500">Lab v2.0</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-4">
          {!collapsed && (
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              Navigation
            </div>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {item.icon}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.badge && (
                          <Badge
                            className={`text-xs ${
                              item.badgeColor === "cyan"
                                ? "bg-cyan-500/20 text-cyan-400"
                                : item.badgeColor === "red"
                                ? "bg-red-500/20 text-red-400"
                                : item.badgeColor === "purple"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Lab Section */}
        {pathname.startsWith("/lab") && (
          <div className="px-3 mb-4">
            {!collapsed && (
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                Lab Tools
              </div>
            )}
            <nav className="space-y-1">
              {labNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {item.icon}
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 flex items-center justify-between"
                        >
                          <span className="text-sm">{item.name}</span>
                          {item.badge && (
                            <Badge className="text-xs bg-purple-500/20 text-purple-400">
                              {item.badge}
                            </Badge>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Gate Status */}
        {!collapsed && (
          <div className="px-3 mb-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              Gate Status
            </div>
            <div className="px-2 py-3 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between gap-1">
                {gates.map((gate) => (
                  <div
                    key={gate.name}
                    className={`flex-1 text-center py-1 rounded text-xs font-mono ${
                      gate.status === "CLOSED"
                        ? "bg-green-500/20 text-green-400"
                        : gate.status === "PENDING"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-500"
                    }`}
                  >
                    {gate.name}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span>3 closed</span>
                <span className="mx-1">|</span>
                <AlertTriangle className="w-3 h-3 text-yellow-400" />
                <span>1 pending</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        {!collapsed ? (
          <div className="text-center">
            <div className="text-xs text-gray-500 font-mono">SPEC_LOCK v2.2.0</div>
            <div className="text-xs text-gray-600">CAGE: 9HUP5</div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Lock className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>
    </motion.aside>
  )
}

export function LabHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Activity className="w-3 h-3 mr-1" />
            QPU CONNECTED
          </Badge>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 font-mono">
            ibm_fez
          </Badge>
        </div>
      </div>
    </header>
  )
}
