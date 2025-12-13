"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Shield, Mail, Lock, ArrowLeft, Loader2, Fingerprint, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { generateQuantumJWT, generateCCCECapsule } from "@/lib/quantum-crypto"
import { signIn, signUp, signInWithMagicLink, isAdmin, getCurrentUser } from "@/lib/supabase"
import { createDeviceBinding, getStoredDeviceBinding, verifyDeviceEntanglement } from "@/lib/auth/quantum-entanglement"

// Physical constants
const PHI_THRESHOLD = 0.7734
const GAMMA_CRITICAL = 0.300

interface CCCEMetrics {
  phi: number
  lambda: number
  gamma: number
  xi: number
  coherent: boolean
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register" | "quantum-onboard" | "magic-link">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [quantumToken, setQuantumToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [ccce, setCcce] = useState<CCCEMetrics | null>(null)
  const [deviceBinding, setDeviceBinding] = useState<{ device_id: string; entanglement_hash: string } | null>(null)

  // Check for existing device binding on mount
  useEffect(() => {
    const stored = getStoredDeviceBinding()
    if (stored) {
      setDeviceBinding({ device_id: stored.device_id, entanglement_hash: stored.entanglement_hash })
    }
    // Generate initial CCCE metrics
    const capsule = generateCCCECapsule()
    setCcce({
      phi: capsule.phi,
      lambda: capsule.lambda,
      gamma: capsule.gamma,
      xi: capsule.xi,
      coherent: capsule.coherent
    })
  }, [])

  // Update CCCE metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const capsule = generateCCCECapsule()
      setCcce({
        phi: capsule.phi,
        lambda: capsule.lambda,
        gamma: capsule.gamma,
        xi: capsule.xi,
        coherent: capsule.coherent
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSynthesizing(true)

    try {
      if (mode === "login") {
        const { data, error: authError } = await signIn(email, password)
        if (authError) {
          setError(authError.message)
          setIsSynthesizing(false)
          return
        }

        // Verify device entanglement if binding exists
        if (deviceBinding && data.user) {
          const verification = await verifyDeviceEntanglement(
            data.user.id,
            deviceBinding.entanglement_hash
          )
          if (!verification.valid && verification.confidence < 0.5) {
            setError(`Device entanglement mismatch (confidence: ${(verification.confidence * 100).toFixed(1)}%). Please re-authenticate.`)
            setIsSynthesizing(false)
            return
          }
        }

        // Create device binding if not exists
        if (!deviceBinding && data.user) {
          const binding = await createDeviceBinding(data.user.id, email)
          setDeviceBinding({ device_id: binding.device_id, entanglement_hash: binding.entanglement_hash })
        }

        setSuccess("Authentication successful. Redirecting to portal...")
        setTimeout(() => {
          window.location.href = "/cockpit"
        }, 1500)

      } else if (mode === "register") {
        const { data, error: authError } = await signUp(email, password, {
          role: 'operator',
          organization: 'Q-SLICE Research'
        })
        if (authError) {
          setError(authError.message)
          setIsSynthesizing(false)
          return
        }

        // Create device binding for new user
        if (data.user) {
          const binding = await createDeviceBinding(data.user.id, email)
          setDeviceBinding({ device_id: binding.device_id, entanglement_hash: binding.entanglement_hash })
          const token = generateQuantumJWT(email)
          setQuantumToken(token)
        }

        setSuccess("Account created. Check your email for verification link.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    }

    setIsSynthesizing(false)
  }

  const handleMagicLink = async () => {
    setError(null)
    setSuccess(null)
    setIsSynthesizing(true)

    try {
      const { error: authError } = await signInWithMagicLink(email)
      if (authError) {
        setError(authError.message)
      } else {
        setSuccess("Magic link sent! Check your email for a secure login link.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send magic link")
    }

    setIsSynthesizing(false)
  }

  const handleQuantumSynthesis = async () => {
    setIsSynthesizing(true)
    setError(null)

    try {
      // Generate device binding first
      const mockUserId = `qid_${Date.now().toString(36)}`
      const binding = await createDeviceBinding(mockUserId, email || "anonymous_entity")
      setDeviceBinding({ device_id: binding.device_id, entanglement_hash: binding.entanglement_hash })

      // Generate quantum JWT with device binding
      await new Promise(resolve => setTimeout(resolve, 2000))
      const token = generateQuantumJWT(email || "anonymous_entity")
      setQuantumToken(token)

      // Update CCCE with binding metrics
      setCcce({
        phi: binding.ccce_metrics.phi,
        lambda: binding.ccce_metrics.lambda,
        gamma: binding.ccce_metrics.gamma,
        xi: binding.ccce_metrics.xi,
        coherent: binding.ccce_metrics.phi >= PHI_THRESHOLD
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Quantum synthesis failed")
    }

    setIsSynthesizing(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="glass-panel p-8 overflow-hidden relative">
            {mode === "quantum-onboard" ? (
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center animate-pulse">
                  <Fingerprint className="w-10 h-10 text-secondary" />
                </div>

                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
                  First-Time Identity Synthesis
                </h2>

                {!quantumToken ? (
                  <>
                    <p className="text-gray-400 text-sm">
                      Generating a quantum-secure JWT via parenthetic solution to Einstein's field equations. This
                      ensures cryptographic singularity for your session.
                    </p>

                    <div className="space-y-4 pt-4">
                      <Label className="text-left block text-xs uppercase tracking-widest text-gray-500">
                        Entity Identifier
                      </Label>
                      <Input
                        placeholder="Enter your codename..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black/50 border-secondary/30 text-center"
                      />
                      <Button
                        onClick={handleQuantumSynthesis}
                        disabled={!email || isSynthesizing}
                        className="w-full bg-secondary text-black hover:bg-secondary/80 h-12 relative overflow-hidden"
                      >
                        {isSynthesizing ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Solving Field Equations...
                          </span>
                        ) : (
                          "Initiate Quantum Entanglement"
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded text-left font-mono text-xs break-all text-primary">
                      {quantumToken.substring(0, 100)}...
                    </div>
                    <p className="text-green-400 text-xs flex items-center justify-center gap-2">
                      <Shield className="w-3 h-3" /> Identity Entangled Successfully
                    </p>
                    <Link href="/lab">
                      <Button className="w-full bg-primary text-black">Enter Research Portal</Button>
                    </Link>
                  </motion.div>
                )}

                <button onClick={() => setMode("login")} className="text-xs text-gray-500 hover:text-white mt-4">
                  Return to Standard Auth
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Research Partner Access</h1>
                  <p className="text-gray-400 text-sm">
                    {mode === "login" ? "Sign in to your account" : "Create a new research account"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="researcher@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-black/50 border-white/10 focus:border-primary/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-black/50 border-white/10 focus:border-primary/50"
                        required
                      />
                    </div>
                  </div>

                  {mode === "login" && (
                    <div className="flex justify-end">
                      <button type="button" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 py-6 text-lg">
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-400">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  </span>{" "}
                  <button
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                    className="text-primary hover:underline font-medium"
                  >
                    {mode === "login" ? "Register" : "Sign In"}
                  </button>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-center">
                  <button
                    onClick={() => setMode("quantum-onboard")}
                    className="w-full py-3 rounded border border-secondary/30 bg-secondary/5 text-secondary text-sm hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Fingerprint className="w-4 h-4" />
                    First-Time User? Initialize Quantum ID
                  </button>
                </div>
              </>
            )}

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-emerald-400">{success}</p>
              </motion.div>
            )}

            {/* Device Binding Status */}
            {deviceBinding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20"
              >
                <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono">
                  <Fingerprint className="w-3 h-3" />
                  <span>Device Entangled: {deviceBinding.entanglement_hash.slice(0, 20)}...</span>
                </div>
              </motion.div>
            )}

            {/* CCCE Metrics Bar */}
            {ccce && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-4 gap-2 text-center font-mono text-[10px]">
                  <div className="p-2 rounded bg-white/5">
                    <div className="text-gray-500">Φ</div>
                    <div className={ccce.phi >= PHI_THRESHOLD ? 'text-emerald-400' : 'text-amber-400'}>
                      {ccce.phi.toFixed(4)}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-white/5">
                    <div className="text-gray-500">Λ</div>
                    <div className="text-cyan-400">{ccce.lambda.toFixed(4)}</div>
                  </div>
                  <div className="p-2 rounded bg-white/5">
                    <div className="text-gray-500">Γ</div>
                    <div className={ccce.gamma <= GAMMA_CRITICAL ? 'text-emerald-400' : 'text-red-400'}>
                      {ccce.gamma.toFixed(4)}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-white/5">
                    <div className="text-gray-500">Ξ</div>
                    <div className="text-amber-400">{ccce.xi.toFixed(2)}</div>
                  </div>
                </div>
                <div className={`mt-2 text-center text-[9px] ${ccce.coherent ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {ccce.coherent ? '● COHERENT' : '○ SEEKING COHERENCE'}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 text-center">
                Authorized research partners only. This system is protected by post-quantum cryptography.
              </p>
              <p className="text-[9px] text-gray-600 text-center mt-1 font-mono">
                SPEC_LOCK v2.2.0 | CAGE: 9HUP5 | Agile Defense Systems, LLC
              </p>
            </div>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Contact research coordinators:</p>
            <div className="flex gap-4 justify-center mt-2 text-sm">
              <a href="mailto:jeremy..cyber@outlook.com" className="text-primary hover:underline">
                Jeremy Green
              </a>
              <span className="text-gray-600">•</span>
              <a href="mailto:research@dnalang.com" className="text-secondary hover:underline">
                Devin Davis
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
