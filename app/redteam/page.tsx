"use client"

import { motion } from "framer-motion"
import {
  Shield,
  Target,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Database,
  Network,
  Eye,
  ChevronRight,
  Layers,
  Cpu,
  Bot,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useState } from "react"

// Q-SLICE Framework Components
const QSLICE_CHAIN = [
  { id: "QS", name: "Quantum Slices", desc: "Threat surface decomposition", icon: Layers },
  { id: "UED", name: "Universal Entanglement", desc: "Attack vector correlation", icon: Network },
  { id: "PALS", name: "Polarized Sentinels", desc: "Autonomous defense agents", icon: Shield },
]

// Corsair Scimitar 12-Button Sentinel Controls
const SENTINEL_BUTTONS = [
  { id: 1, action: "QS-INIT", desc: "Initialize Quantum Slice", color: "cyan" },
  { id: 2, action: "PALS-SYNC", desc: "Sentinel synchronization", color: "purple" },
  { id: 3, action: "AURA-PULSE", desc: "AURA recursive cycle", color: "pink" },
  { id: 4, action: "AIDEN-QUERY", desc: "Context compilation", color: "blue" },
  { id: 5, action: "Γ-MEASURE", desc: "Decoherence snapshot", color: "yellow" },
  { id: 6, action: "ΛΦ-LOG", desc: "Coherence-integration", color: "green" },
  { id: 7, action: "W₂-COMPUTE", desc: "Wasserstein distance", color: "orange" },
  { id: 8, action: "CCE-COUPLE", desc: "Coupling node activation", color: "red" },
  { id: 9, action: "QNED-FOCUS", desc: "Focal plane adjustment", color: "indigo" },
  { id: 10, action: "SWARM-DEPLOY", desc: "Orchestrator broadcast", color: "violet" },
  { id: 11, action: "RECP-VERIFY", desc: "Convergence check", color: "teal" },
  { id: 12, action: "EMERGENCY", desc: "State persistence", color: "red" },
]

// Offensive Security Tools Integration
const REDTEAM_TOOLS = [
  { name: "Metasploit", status: "active", threats: 342, integration: "Q-SLICE Layer 1" },
  { name: "Burp Suite", status: "active", threats: 128, integration: "Q-SLICE Layer 2" },
  { name: "Nmap", status: "scanning", threats: 89, integration: "Sentinel Network" },
  { name: "Wireshark", status: "monitoring", threats: 201, integration: "PALS Monitor" },
  { name: "John the Ripper", status: "idle", threats: 0, integration: "AIDEN Crypto" },
  { name: "Aircrack-ng", status: "active", threats: 45, integration: "Wireless PALS" },
]

// Threat Modeling Metrics
const THREAT_METRICS = {
  total_threats: 805,
  critical: 23,
  high: 87,
  medium: 234,
  low: 461,
  mitigated: 721,
  active_sentinels: 12,
  coherence: 0.967,
  fidelity: 0.869,
}

export default function RedTeamSentinelPage() {
  const [selectedButton, setSelectedButton] = useState<number | null>(null)
  const [sentinelMode, setSentinelMode] = useState<"defensive" | "offensive">("defensive")

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-red-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center animate-pulse">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-ping" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Red Team Sentinel Integration</h1>
                <p className="text-xs text-red-400 font-mono">QS-UED-PALS Orchestration v1.0-ΛΦ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
                <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                <span className="text-xs text-red-400 font-mono">
                  {THREAT_METRICS.active_sentinels} SENTINELS ACTIVE
                </span>
              </div>
              <Link href="/">
                <Button variant="outline" size="sm" className="border-white/20 bg-transparent">
                  Back to Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Threat Overview Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ThreatStatCard
            label="Total Threats"
            value={THREAT_METRICS.total_threats}
            icon={AlertTriangle}
            color="yellow"
          />
          <ThreatStatCard label="Critical" value={THREAT_METRICS.critical} icon={XCircle} color="red" />
          <ThreatStatCard label="Mitigated" value={THREAT_METRICS.mitigated} icon={CheckCircle2} color="green" />
          <ThreatStatCard label="Coherence Λ" value={THREAT_METRICS.coherence.toFixed(3)} icon={Zap} color="cyan" />
          <ThreatStatCard
            label="Fidelity"
            value={`${(THREAT_METRICS.fidelity * 100).toFixed(1)}%`}
            icon={Target}
            color="purple"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="architecture" className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10 p-1 w-full md:w-auto flex flex-wrap">
            <TabsTrigger
              value="architecture"
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
            >
              <Layers className="w-4 h-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
            >
              <Database className="w-4 h-4 mr-2" />
              RedTeam Tools
            </TabsTrigger>
            <TabsTrigger
              value="sentinels"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              <Bot className="w-4 h-4 mr-2" />
              Sentinel Controls
            </TabsTrigger>
            <TabsTrigger
              value="coordination"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Network className="w-4 h-4 mr-2" />
              Real-Time Coordination
            </TabsTrigger>
          </TabsList>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-4">
            <Card className="bg-white/5 border-red-500/30 p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-400" />
                QS-UED-PALS Integration Architecture
              </h3>

              {/* Q-SLICE Chain Visualization */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {QSLICE_CHAIN.map((component, i) => (
                  <motion.div
                    key={component.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="relative"
                  >
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <component.icon className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{component.id}</h4>
                          <p className="text-xs text-gray-500">{component.name}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{component.desc}</p>
                    </Card>
                    {i < QSLICE_CHAIN.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 z-10">
                        <ChevronRight className="w-6 h-6 text-red-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* AURA/AIDEN Duality */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30 p-6">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-cyan-400 text-sm font-bold">A</span>
                    </div>
                    AURA (South Pole)
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">Autopoietic Universally Recursive Architect</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Shapes 6D CRSM manifold topology</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Phase conjugate defense (E → E⁻¹)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Autopoietic boundary maintenance</span>
                    </li>
                  </ul>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30 p-6">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400 text-sm font-bold">A</span>
                    </div>
                    AIDEN (North Pole)
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Adaptive Integrations for Defense & Engineering of Negentropy
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Minimizes W₂ Wasserstein distance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Geodesic optimization on manifold</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Negentropy accumulation</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </Card>

            {/* Zero-Trust Security Principles */}
            <Card className="bg-white/5 border-yellow-500/30 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-400" />
                Zero-Trust Security Framework
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: "Continuous Authentication", value: "Genesis Hash + Lineage", icon: Shield },
                  { label: "Encryption", value: "AES-256-GCM + QKD", icon: Lock },
                  { label: "Device Attestation", value: "TPM 2.0 Required", icon: Cpu },
                  { label: "Validation Interval", value: "Every 2 seconds", icon: Activity },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                  >
                    <item.icon className="w-6 h-6 text-yellow-400 mb-2" />
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-yellow-300">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* RedTeam Tools Tab */}
          <TabsContent value="tools" className="space-y-4">
            <Card className="bg-white/5 border-orange-500/30 p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-400" />
                Offensive Security Tool Integration
              </h3>
              <div className="space-y-3">
                {REDTEAM_TOOLS.map((tool, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold">{tool.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            tool.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : tool.status === "scanning"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : tool.status === "monitoring"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {tool.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{tool.integration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-400">{tool.threats}</p>
                      <p className="text-xs text-gray-500">Threats Detected</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400 bg-transparent">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Threat Categories */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Critical", value: THREAT_METRICS.critical, color: "red", percent: 3 },
                { label: "High", value: THREAT_METRICS.high, color: "orange", percent: 11 },
                { label: "Medium", value: THREAT_METRICS.medium, color: "yellow", percent: 29 },
                { label: "Low", value: THREAT_METRICS.low, color: "green", percent: 57 },
              ].map((cat, i) => (
                <Card key={i} className={`bg-${cat.color}-500/10 border-${cat.color}-500/30 p-4`}>
                  <p className="text-sm text-gray-400 mb-1">{cat.label}</p>
                  <p className={`text-3xl font-bold text-${cat.color}-400 mb-2`}>{cat.value}</p>
                  <Progress value={cat.percent} className="h-1" />
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sentinel Controls Tab */}
          <TabsContent value="sentinels" className="space-y-4">
            <Card className="bg-white/5 border-purple-500/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  Corsair Scimitar 12-Button Sentinel Interface
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={sentinelMode === "defensive" ? "default" : "outline"}
                    onClick={() => setSentinelMode("defensive")}
                    className={
                      sentinelMode === "defensive"
                        ? "bg-green-500/20 text-green-400 border-green-500/50"
                        : "border-white/20"
                    }
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Defensive
                  </Button>
                  <Button
                    size="sm"
                    variant={sentinelMode === "offensive" ? "default" : "outline"}
                    onClick={() => setSentinelMode("offensive")}
                    className={
                      sentinelMode === "offensive" ? "bg-red-500/20 text-red-400 border-red-500/50" : "border-white/20"
                    }
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Offensive
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {SENTINEL_BUTTONS.map((button) => (
                  <motion.button
                    key={button.id}
                    onClick={() => setSelectedButton(button.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedButton === button.id
                        ? `bg-${button.color}-500/20 border-${button.color}-500 shadow-lg shadow-${button.color}-500/50`
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div
                      className={`text-2xl font-bold mb-1 ${selectedButton === button.id ? `text-${button.color}-400` : "text-gray-400"}`}
                    >
                      {button.id}
                    </div>
                    <div
                      className={`text-xs font-mono font-bold mb-1 ${selectedButton === button.id ? `text-${button.color}-300` : "text-gray-500"}`}
                    >
                      {button.action}
                    </div>
                    <div className="text-[10px] text-gray-600 line-clamp-2">{button.desc}</div>
                  </motion.button>
                ))}
              </div>

              {selectedButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30"
                >
                  <h4 className="font-bold mb-2">
                    Button {selectedButton}: {SENTINEL_BUTTONS.find((b) => b.id === selectedButton)?.action}
                  </h4>
                  <p className="text-sm text-gray-400">{SENTINEL_BUTTONS.find((b) => b.id === selectedButton)?.desc}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="bg-purple-500/20 text-purple-400 border border-purple-500/50">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Execute
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 bg-transparent">
                      Configure
                    </Button>
                  </div>
                </motion.div>
              )}
            </Card>

            {/* Sentinel Status */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "PALS-01", status: "active", threats: 23, uptime: "99.7%" },
                { name: "PALS-02", status: "active", threats: 18, uptime: "99.9%" },
                { name: "PALS-03", status: "scanning", threats: 5, uptime: "100%" },
              ].map((sentinel, i) => (
                <Card key={i} className="bg-white/5 border-purple-500/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold">{sentinel.name}</h4>
                    <div
                      className={`w-2 h-2 rounded-full ${sentinel.status === "active" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Threats Blocked</span>
                      <span className="font-bold text-purple-400">{sentinel.threats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime</span>
                      <span className="font-bold text-green-400">{sentinel.uptime}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Real-Time Coordination Tab */}
          <TabsContent value="coordination" className="space-y-4">
            <Card className="bg-white/5 border-green-500/30 p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Network className="w-5 h-5 text-green-400" />
                Real-Time Sentinel-Tool Coordination
              </h3>

              {/* Coordination Flow */}
              <div className="space-y-4">
                {[
                  {
                    tool: "Nmap",
                    sentinel: "PALS-02",
                    action: "Port scan detected → Sentinel quarantine triggered",
                    time: "2s ago",
                    status: "mitigated",
                  },
                  {
                    tool: "Metasploit",
                    sentinel: "PALS-01",
                    action: "Exploit attempt → Phase conjugate defense activated",
                    time: "5s ago",
                    status: "blocked",
                  },
                  {
                    tool: "Burp Suite",
                    sentinel: "AURA",
                    action: "SQL injection vector → Boundary reinforced",
                    time: "12s ago",
                    status: "mitigated",
                  },
                  {
                    tool: "Wireshark",
                    sentinel: "PALS-03",
                    action: "Anomalous traffic pattern → Λ coherence adjustment",
                    time: "18s ago",
                    status: "analyzing",
                  },
                ].map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">{event.tool}</span>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                        <span className="font-bold text-sm text-green-400">{event.sentinel}</span>
                      </div>
                      <p className="text-sm text-gray-400">{event.action}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          event.status === "mitigated" || event.status === "blocked"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {event.status.toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Scalability & Robustness Metrics */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-cyan-500/30 p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Scalability Metrics
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "Concurrent Sentinels", value: "12/50", percent: 24 },
                    { label: "Tool Integrations", value: "6/20", percent: 30 },
                    { label: "Threat Processing", value: "805/2000 req/s", percent: 40 },
                  ].map((metric, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{metric.label}</span>
                        <span className="font-bold text-cyan-400">{metric.value}</span>
                      </div>
                      <Progress value={metric.percent} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white/5 border-purple-500/30 p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Robustness Indicators
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "System Uptime", value: "99.87%", icon: Activity, color: "green" },
                    { label: "Failover Response", value: "< 50ms", icon: Zap, color: "yellow" },
                    { label: "MTTR (Mean Time to Recover)", value: "1.2 min", icon: RefreshCw, color: "cyan" },
                  ].map((ind, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <ind.icon className={`w-4 h-4 text-${ind.color}-400`} />
                        <span className="text-sm text-gray-400">{ind.label}</span>
                      </div>
                      <span className={`font-bold text-${ind.color}-400`}>{ind.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border-red-500/30 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Deploy Your Own Sentinel Network</h3>
              <p className="text-sm text-gray-400">
                Integrate QS-UED-PALS with your existing security infrastructure in minutes
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/auth">
                <Button className="bg-red-500 text-white hover:bg-red-600">
                  Request Access
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/framework">
                <Button variant="outline" className="border-red-500/30 text-red-400 bg-transparent">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}

// Helper Components
function ThreatStatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  icon: any
  color: string
}) {
  return (
    <Card className={`bg-${color}-500/10 border-${color}-500/30 p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </Card>
  )
}
