"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Cpu,
  Activity,
  Zap,
  Server,
  Play,
  Square,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Gauge,
  ArrowLeft,
  Send,
  Terminal,
  Shield,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Physical constants
const CONSTANTS = {
  PHI: 1.618033988749895,
  TAU_0: Math.pow(1.618033988749895, 8),
  PHI_THRESHOLD: 0.7734,
  GAMMA_CRITICAL: 0.300,
  DELTA_WINDOW: 2.5,
}

interface Backend {
  id: string
  name: string
  provider: string
  architecture: string
  qubits: number
  status: string
  pending_jobs: number
  max_shots: number
  t1_avg: number
  t2_avg: number
  gate_fidelity: number
  readout_fidelity: number
  ccce: {
    lambda: number
    phi: number
    gamma: number
    xi: number
  }
}

interface Job {
  id: string
  backend: string
  status: string
  shots: number
  circuits: number
  submitted_at: string
  started_at?: string
  completed_at?: string
  results?: {
    tau_peak: number
    tau_0: number
    delta: number
    within_window: boolean
    counts: Record<string, number>
    ccce: {
      lambda: number
      phi: number
      gamma: number
      xi: number
    }
  }
}

export default function ScimitarElitePage() {
  const [backends, setBackends] = useState<Backend[]>([])
  const [selectedBackend, setSelectedBackend] = useState<Backend | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [aggregate, setAggregate] = useState<{
    total_backends: number
    online_backends: number
    total_qubits: number
    avg_gate_fidelity: number
    total_pending_jobs: number
  } | null>(null)

  // Fetch backends
  useEffect(() => {
    const fetchBackends = async () => {
      try {
        const res = await fetch('/api/scimitar')
        const data = await res.json()
        if (data.success) {
          setBackends(data.backends)
          setAggregate(data.aggregate)
          if (!selectedBackend && data.backends.length > 0) {
            setSelectedBackend(data.backends[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch backends:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBackends()
    const interval = setInterval(fetchBackends, 10000)
    return () => clearInterval(interval)
  }, [selectedBackend])

  // Submit job
  const submitJob = async (experiment: string) => {
    if (!selectedBackend) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/scimitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backend: selectedBackend.id,
          experiment,
          shots: 2000,
          circuits: experiment === 'tau-sweep' ? 13 : 1
        })
      })
      const data = await res.json()
      if (data.success) {
        // Poll for job status
        pollJob(data.job_id)
      }
    } catch (error) {
      console.error('Failed to submit job:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Poll job status
  const pollJob = async (jobId: string) => {
    const checkStatus = async () => {
      const res = await fetch(`/api/scimitar?action=status&jobId=${jobId}`)
      const data = await res.json()
      if (data.success) {
        setJobs(prev => {
          const existing = prev.findIndex(j => j.id === jobId)
          if (existing >= 0) {
            const updated = [...prev]
            updated[existing] = data.job
            return updated
          }
          return [data.job, ...prev]
        })

        if (data.job.status !== 'completed' && data.job.status !== 'failed') {
          setTimeout(checkStatus, 1000)
        }
      }
    }
    checkStatus()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500/20 text-green-400'
      case 'busy': return 'bg-yellow-500/20 text-yellow-400'
      case 'offline': return 'bg-red-500/20 text-red-400'
      case 'maintenance': return 'bg-gray-500/20 text-gray-400'
      case 'queued': return 'bg-blue-500/20 text-blue-400'
      case 'running': return 'bg-cyan-500/20 text-cyan-400 animate-pulse'
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'failed': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'IBM_QUANTUM': return <Cpu className="w-5 h-5 text-blue-400" />
      case 'AWS_BRAKET': return <Server className="w-5 h-5 text-orange-400" />
      case 'SOVEREIGN': return <Shield className="w-5 h-5 text-cyan-400" />
      default: return <Cpu className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">SCIMITAR Elite</h1>
                  <p className="text-xs text-gray-500">Sovereign QPU Orchestration</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className={aggregate?.online_backends && aggregate.online_backends > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                <Activity className="w-3 h-3 mr-1" />
                {aggregate?.online_backends || 0} Online
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400">
                SPEC_LOCK v2.2.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Aggregate Stats */}
        {aggregate && (
          <div className="grid grid-cols-5 gap-4">
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{aggregate.total_backends}</div>
                  <div className="text-xs text-gray-500">Total Backends</div>
                </div>
              </div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{aggregate.online_backends}</div>
                  <div className="text-xs text-gray-500">Online</div>
                </div>
              </div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{aggregate.total_qubits}</div>
                  <div className="text-xs text-gray-500">Total Qubits</div>
                </div>
              </div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {(aggregate.avg_gate_fidelity * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500">Avg Fidelity</div>
                </div>
              </div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {aggregate.total_pending_jobs.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Pending Jobs</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Backend List */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              QPU Backends
            </h2>

            {loading ? (
              <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                <RefreshCw className="w-8 h-8 text-cyan-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">Loading backends...</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {backends.map((backend) => (
                  <motion.div
                    key={backend.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card
                      className={`bg-gray-900/50 border-gray-800 p-4 cursor-pointer transition-all ${
                        selectedBackend?.id === backend.id ? 'ring-2 ring-cyan-500/50' : ''
                      }`}
                      onClick={() => setSelectedBackend(backend)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                            {getProviderIcon(backend.provider)}
                          </div>
                          <div>
                            <div className="font-bold">{backend.name}</div>
                            <div className="text-xs text-gray-500">{backend.architecture}</div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(backend.status)}>
                          {backend.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Qubits</div>
                          <div className="text-cyan-400 font-mono">{backend.qubits}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Gate Fidelity</div>
                          <div className="text-green-400 font-mono">
                            {(backend.gate_fidelity * 100).toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Pending</div>
                          <div className="text-yellow-400 font-mono">
                            {backend.pending_jobs.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Xi</div>
                          <div className="text-purple-400 font-mono">
                            {backend.ccce.xi.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* CCCE Bar */}
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Λ:</span>
                            <span className="text-cyan-400 font-mono">{backend.ccce.lambda.toFixed(3)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Φ:</span>
                            <span className="text-purple-400 font-mono">{backend.ccce.phi.toFixed(3)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Γ:</span>
                            <span className={`font-mono ${backend.ccce.gamma > 0.2 ? 'text-yellow-400' : 'text-green-400'}`}>
                              {backend.ccce.gamma.toFixed(3)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              Control Panel
            </h2>

            {selectedBackend ? (
              <>
                <Card className="bg-gray-900/50 border-gray-800 p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    {getProviderIcon(selectedBackend.provider)}
                    {selectedBackend.name}
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3 bg-black/30 rounded">
                      <div className="text-xs text-gray-500 mb-1">T1 Average</div>
                      <div className="text-lg font-mono text-cyan-400">
                        {selectedBackend.t1_avg === Infinity ? '∞' : `${selectedBackend.t1_avg.toFixed(1)} μs`}
                      </div>
                    </div>
                    <div className="p-3 bg-black/30 rounded">
                      <div className="text-xs text-gray-500 mb-1">T2 Average</div>
                      <div className="text-lg font-mono text-purple-400">
                        {selectedBackend.t2_avg === Infinity ? '∞' : `${selectedBackend.t2_avg.toFixed(1)} μs`}
                      </div>
                    </div>
                    <div className="p-3 bg-black/30 rounded">
                      <div className="text-xs text-gray-500 mb-1">Readout Fidelity</div>
                      <div className="text-lg font-mono text-green-400">
                        {(selectedBackend.readout_fidelity * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800 p-4">
                  <h3 className="font-bold mb-3">Quick Submit</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      disabled={submitting || selectedBackend.status === 'offline'}
                      onClick={() => submitJob('bell')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Bell State (2K shots)
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      disabled={submitting || selectedBackend.status === 'offline'}
                      onClick={() => submitJob('tau-sweep')}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Tau Sweep (13 circuits)
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      disabled={submitting || selectedBackend.status === 'offline'}
                      onClick={() => submitJob('ghz')}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      GHZ State (5K shots)
                    </Button>
                  </div>
                </Card>

                {/* Physical Constants */}
                <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 p-4">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    SPEC_LOCK Constants
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">τ₀ = φ⁸</span>
                      <span className="text-cyan-400">{CONSTANTS.TAU_0.toFixed(4)} μs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Φ_threshold</span>
                      <span className="text-purple-400">{CONSTANTS.PHI_THRESHOLD}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Γ_critical</span>
                      <span className="text-red-400">{CONSTANTS.GAMMA_CRITICAL}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Δ_window</span>
                      <span className="text-green-400">±{CONSTANTS.DELTA_WINDOW} μs</span>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">Select a backend</p>
              </Card>
            )}
          </div>
        </div>

        {/* Jobs */}
        {jobs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Recent Jobs
            </h2>
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <Card key={job.id} className="bg-gray-900/50 border-gray-800 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <code className="text-sm text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                        {job.id}
                      </code>
                      <span className="text-gray-500">{job.backend}</span>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status === 'running' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                      {job.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {job.status === 'failed' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {job.status.toUpperCase()}
                    </Badge>
                  </div>

                  {job.results && (
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">tau_peak</div>
                        <div className="text-cyan-400 font-mono">{job.results.tau_peak.toFixed(2)} μs</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">delta</div>
                        <div className={`font-mono ${job.results.within_window ? 'text-green-400' : 'text-red-400'}`}>
                          {job.results.delta.toFixed(2)} μs
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Within Window</div>
                        <Badge className={job.results.within_window ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {job.results.within_window ? 'YES' : 'NO'}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Ξ</div>
                        <div className="text-purple-400 font-mono">{job.results.ccce.xi.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Shots</div>
                        <div className="text-white font-mono">{job.shots.toLocaleString()}</div>
                      </div>
                    </div>
                  )}

                  {job.status === 'running' && (
                    <div className="mt-3">
                      <Progress value={60} className="h-1" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
