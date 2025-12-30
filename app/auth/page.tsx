"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Shield, Mail, Lock, ArrowLeft, Loader2, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { generateQuantumJWT } from "@/lib/quantum-crypto" // Added import

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register" | "quantum-onboard">("login") // Added onboarding mode
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSynthesizing, setIsSynthesizing] = useState(false) // Added state for quantum synth
  const [quantumToken, setQuantumToken] = useState<string | null>(null) // Added state for token

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Authentication logic would go here
    console.log("[v0] Auth attempt:", { mode, email })
  }

  const handleQuantumSynthesis = async () => {
    setIsSynthesizing(true)
    // Simulate calculation delay based on "Einstein field equations"
    setTimeout(() => {
      const token = generateQuantumJWT(email || "anonymous_entity")
      setQuantumToken(token)
      setIsSynthesizing(false)
    }, 2500)
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

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 text-center">
                Authorized research partners only. This system is protected by post-quantum cryptography.
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
