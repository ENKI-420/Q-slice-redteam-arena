"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Shield, Smartphone, Lock, Mic, Database, Server } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function VoQNDashboard() {
  const [metrics, setMetrics] = useState({
    coherence: 99.8,
    entanglement: 97.4,
    latency: 1.2,
    encryption: "AES-256-GCM + QKD",
  })

  // Simulate real-time metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        coherence: 99 + Math.random(),
        entanglement: 97 + Math.random() * 0.5,
        latency: 1.0 + Math.random() * 0.4,
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Network Status */}
      <Card className="col-span-full border-cyan-500/30 bg-black/50 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold text-cyan-400">
            <Activity className="mr-2 inline-block h-5 w-5" />
            Network Status: OPERATIONAL
          </CardTitle>
          <Badge variant="outline" className="border-green-500 text-green-500 animate-pulse">
            SECURE
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-400">Q-SLICE Coherence</p>
              <div className="text-2xl font-bold text-white">{metrics.coherence.toFixed(2)}%</div>
              <Progress value={metrics.coherence} className="h-1 bg-zinc-800" indicatorClassName="bg-cyan-500" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-400">Entanglement Fidelity</p>
              <div className="text-2xl font-bold text-white">{metrics.entanglement.toFixed(2)}%</div>
              <Progress value={metrics.entanglement} className="h-1 bg-zinc-800" indicatorClassName="bg-purple-500" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-400">Network Latency</p>
              <div className="text-2xl font-bold text-white">{metrics.latency.toFixed(2)} ms</div>
              <Progress
                value={100 - metrics.latency * 10}
                className="h-1 bg-zinc-800"
                indicatorClassName="bg-green-500"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-400">Active Nodes</p>
              <div className="text-2xl font-bold text-white">3 / 3</div>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-1 flex-1 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Management */}
      <Card className="col-span-full lg:col-span-2 border-zinc-800 bg-black/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Smartphone className="mr-2 h-5 w-5 text-purple-400" />
            Authorized Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Jeremy's Device", id: "DEV-001-J", status: "Connected", trust: 100 },
              { name: "Devin's Device", id: "DEV-002-D", status: "Connected", trust: 100 },
            ].map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{device.name}</p>
                    <p className="text-xs text-zinc-500">ID: {device.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Trust Score</p>
                    <p className="text-sm font-bold text-green-400">{device.trust}%</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                    {device.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Protocols */}
      <Card className="border-zinc-800 bg-black/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Shield className="mr-2 h-5 w-5 text-green-400" />
            Security Protocols
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Encryption</span>
            <span className="text-sm font-mono text-cyan-400">AES-256-GCM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Key Exchange</span>
            <span className="text-sm font-mono text-purple-400">Quantum (BB84)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Zero Trust</span>
            <span className="text-sm font-mono text-green-400">Active</span>
          </div>
          <Button className="w-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/50">
            <Lock className="mr-2 h-4 w-4" />
            Audit Logs
          </Button>
        </CardContent>
      </Card>

      {/* Communication Hub */}
      <Card className="col-span-full border-zinc-800 bg-black/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Server className="mr-2 h-5 w-5 text-orange-400" />
            Data Transfer & Comms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="voice" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50">
              <TabsTrigger value="voice">Voice (VoQN)</TabsTrigger>
              <TabsTrigger value="text">Secure Text</TabsTrigger>
              <TabsTrigger value="data">Data Transfer</TabsTrigger>
            </TabsList>
            <TabsContent value="voice" className="mt-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
                  <div className="relative h-24 w-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Mic className="h-10 w-10 text-white" />
                  </div>
                </div>
                <p className="text-zinc-400">Secure Voice Channel Ready</p>
                <Button>Initiate Call</Button>
              </div>
            </TabsContent>
            <TabsContent value="text" className="mt-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
              <div className="h-[200px] flex items-center justify-center text-zinc-500">
                Encrypted text channel interface placeholder
              </div>
            </TabsContent>
            <TabsContent value="data" className="mt-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
              <div className="flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg p-12">
                <div className="text-center space-y-2">
                  <Database className="h-10 w-10 text-zinc-500 mx-auto" />
                  <p className="text-zinc-400">Drag & Drop files for Quantum Teleportation</p>
                  <p className="text-xs text-zinc-600">Max size: 50TB (Q-SLICE limit)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
