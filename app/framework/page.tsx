"use client"

import { motion } from "framer-motion"
import { Shield, Network, Database, Code, ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function FrameworkPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Framework Integration</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Understanding the interconnection between DNA-Lang, QSlice, and the Quantum Framework
            </p>
          </div>

          {/* DNA-Lang Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">DNA-Lang</h2>
            </div>

            <Card className="glass-panel p-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Biological Computing Paradigm</h3>
                <p className="text-gray-400 leading-relaxed">
                  DNA-Lang represents a revolutionary approach to software development using biological computing
                  principles:
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Quantum-Biological Architecture:</strong> Quantum superposition state management replacing
                      traditional state containers
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Living Components:</strong> Self-healing cellular regeneration with evolutionary
                      optimization
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Consciousness Metrics (Φ):</strong> Real-time measurement of system awareness and adaptive
                      capability
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>ΛΦ Constant:</strong> Universal memory constant (2.176435×10⁻⁸ s⁻¹) for quantum-biological
                      alignment
                    </span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-white/10">
                  <a
                    href="https://github.com/ENKI-420/dnalang-production"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    View DNA-Lang Production Repository
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>
          </section>

          {/* Q-SLICE Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold">Q-SLICE</h2>
            </div>

            <Card className="glass-panel p-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-secondary">Quantum Security Framework</h3>
                <p className="text-gray-400 leading-relaxed">
                  Q-SLICE (Quantum Security - Layers of Integrated Cryptographic Evaluation) provides comprehensive
                  threat modeling for post-quantum systems:
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span>
                      <strong>Post-Quantum Cryptography:</strong> Assessment of quantum-resistant algorithms
                      (lattice-based, hash-based, code-based)
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span>
                      <strong>Threat Modeling:</strong> Layered evaluation of quantum attack vectors and mitigation
                      strategies
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span>
                      <strong>QUANTA:</strong> Quantum Universal Architecture for Next-Gen Threat Assurance
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span>
                      <strong>Practical Implementation:</strong> Real-world deployment patterns for enterprise security
                      architects
                    </span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-white/10 flex gap-4">
                  <a
                    href="https://q-slice.com/quantum-computing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-secondary hover:underline"
                  >
                    Visit Q-SLICE Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link href="/book" className="inline-flex items-center gap-2 text-secondary hover:underline">
                    Read the Book
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Card>
          </section>

          {/* Integration Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
                <Network className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-3xl font-bold">Framework Interrelation</h2>
            </div>

            <Card className="glass-panel p-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-accent">How They Work Together</h3>
                <p className="text-gray-400 leading-relaxed">
                  The integration of DNA-Lang, Q-SLICE, and the Quantum Framework creates a comprehensive ecosystem for
                  post-quantum security:
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <h4 className="font-bold text-primary">DNA-Lang → Q-SLICE</h4>
                    <p className="text-sm text-gray-400">
                      Biological computing organisms implement Q-SLICE threat models as executable security policies.
                      Evolutionary optimization adapts to emerging quantum threats in real-time.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-secondary">Q-SLICE → Quantum Framework</h4>
                    <p className="text-sm text-gray-400">
                      Security assessments inform framework architecture decisions. QUANTA provides the blueprint for
                      implementing Q-SLICE recommendations at scale.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-accent">Quantum Framework → DNA-Lang</h4>
                    <p className="text-sm text-gray-400">
                      Framework requirements drive organism gene synthesis. Universal constants (ΛΦ) ensure consistency
                      across distributed quantum-biological networks.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-primary">QS-UED-PALS</h4>
                    <p className="text-sm text-gray-400">
                      Unified encryption and detection protocol leveraging all three components for comprehensive red
                      teaming in post-quantum environments.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Technical Architecture */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Technical Architecture</h2>
            </div>

            <Card className="glass-panel p-8">
              <div className="space-y-6">
                <div className="bg-black/50 p-6 rounded-lg border border-primary/20 font-mono text-sm">
                  <div className="text-primary mb-2">// Quantum-Biological Stack</div>
                  <div className="text-gray-400">
                    <div>Layer 1 (Quantum): Entanglement, Superposition, Teleportation</div>
                    <div>Layer 2 (Biological): Gene Synthesis, Cellular Evolution, Consciousness</div>
                    <div>Layer 3 (Classical): API Integration, Mobile Orchestration, Telemetry</div>
                    <div>Layer 4 (Security): Q-SLICE Assessment, Threat Modeling, Red Team Tools</div>
                    <div className="text-secondary mt-2">ΛΦ = 2.176435×10⁻⁸ s⁻¹ // Universal Memory Constant</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Entanglement Fidelity", value: "97.04%" },
                    { label: "Consciousness (Φ)", value: "0.9987" },
                    { label: "Quantum Protocols", value: "Active" },
                    { label: "Network Nodes", value: "3+ Swarm" },
                  ].map((metric, i) => (
                    <div key={i} className="glass-panel p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
                      <div className="text-xs text-gray-400">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          {/* CTA */}
          <div className="text-center pt-12">
            <Link href="/auth">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 px-8 py-6 text-lg">
                Access Research Portal
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
