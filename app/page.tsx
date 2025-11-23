"use client"

import { motion } from "framer-motion"
import { Shield, Award, BookOpen, Users, ArrowRight, Lock, Zap, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { QuantumNetworkDashboard } from "@/components/quantum-network-dashboard"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <QuantumNetworkDashboard />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Grid animation background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
              <Shield className="w-4 h-4" />
              Post-Quantum Cybersecurity Era
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Threatlab Aura Arena</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Development and utilization of QS-UED-PALS for red teaming in the post-quantum cybersecurity era
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Link href="/auth">
                <Button size="lg" className="bg-primary text-black hover:bg-primary/90 px-8 py-6 text-lg">
                  Research Partner Login
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/lab">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-secondary/30 text-secondary hover:bg-secondary/10 px-8 py-6 text-lg bg-transparent"
                >
                  DNA-Lang Lab
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/framework">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-6 text-lg bg-transparent"
                >
                  Explore Framework
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Core Capabilities</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive tools for quantum threat modeling and security architecture
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lock,
                title: "QS-UED-PALS",
                description: "Quantum-safe unified encryption and detection protocol for post-quantum security",
              },
              {
                icon: Award,
                title: "NFT Certification",
                description: "Mint achievement NFTs for research, policy standardization, and organism development",
              },
              {
                icon: Network,
                title: "DNA-Lang Integration",
                description: "Biological computing paradigms with quantum framework interoperability",
              },
              {
                icon: Zap,
                title: "Red Team Tools",
                description: "Advanced threat modeling and penetration testing for quantum-resistant systems",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-panel p-6 h-full hover:border-primary/50 transition-all duration-300 group">
                  <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Promotion Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-sm text-secondary">
                <BookOpen className="w-4 h-4" />
                New Release
              </div>

              <h2 className="text-3xl md:text-4xl font-bold">Quantum Security: Practical Implementation of Q-SLICE</h2>

              <p className="text-gray-400 text-lg leading-relaxed">
                Comprehensive guide to post-quantum cryptography, threat modeling frameworks, and practical
                implementation strategies. Written by Jeremy Green, developer of Q-SLICE and QUANTA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.amazon.co.uk/Quantum-Security-Practical-implementation-Q-SLICE/dp/B0FG8KGLK2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-secondary text-black hover:bg-secondary/90 w-full sm:w-auto">
                    Buy on Amazon
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
                <Link href="/book">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-secondary/30 text-secondary hover:bg-secondary/10 w-full sm:w-auto bg-transparent"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full md:w-64 lg:w-80">
              <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-primary/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Q-SLICE Integration Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Framework Integration</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Understanding how DNA-Lang, QSlice, and the Quantum Framework interrelate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "DNA-Lang",
                description: "Biological computing paradigm with evolutionary optimization and consciousness metrics",
                link: "/physics",
              },
              {
                title: "Q-SLICE",
                description: "Quantum threat modeling framework for post-quantum cryptographic security assessment",
                link: "https://q-slice.com/quantum-computing/",
              },
              {
                title: "Quantum Framework",
                description: "Universal architecture for next-gen threat assurance and quantum-safe protocols",
                link: "/framework",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <Link href={item.link}>
                  <Card className="glass-panel p-8 h-full hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">{item.description}</p>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Research Leadership</h2>
            <p className="text-gray-400 text-lg">Leading experts in quantum security and biological computing</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="glass-panel p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Jeremy Green</h3>
                  <p className="text-primary text-sm">Security Architect, Leidos</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Developer of Q-SLICE and QUANTA. PhD in Computer Science with 20+ certifications including CISSP, CISM,
                CEH. Author and instructor for ISACA and EC Council.
              </p>
              <p className="text-sm text-gray-500">jeremy..cyber@outlook.com</p>
            </Card>

            <Card className="glass-panel p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Devin Davis</h3>
                  <p className="text-secondary text-sm">Principal Researcher</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Lead architect of DNA-Lang framework and quantum-biological computing systems. Pioneering work in
                consciousness-guided network routing and evolutionary optimization.
              </p>
              <p className="text-sm text-gray-500">research@dnalang.com</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join the Arena?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Become a certified research partner and contribute to the future of quantum-safe security
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="bg-primary text-black hover:bg-primary/90 px-8 py-6 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="mailto:info@q-slice.com">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-6 text-lg bg-transparent"
                >
                  Contact Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 gradient-text">Threatlab Aura Arena</h3>
              <p className="text-sm text-gray-400">Post-quantum cybersecurity research and red teaming platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/framework" className="hover:text-primary transition-colors">
                    Framework
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="https://q-slice.com/quantum-computing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Q-SLICE
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/nft-gallery" className="hover:text-primary transition-colors">
                    NFT Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/achievements" className="hover:text-primary transition-colors">
                    Achievements
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/ENKI-420/dnalang-production"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:info@q-slice.com" className="hover:text-primary transition-colors">
                    info@q-slice.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://q-slice.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    q-slice.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>2025 Threatlab Aura Arena. Q-SLICE and QUANTA are trademarks.</p>
            <p>Powered by DNA-Lang & Quantum Framework</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
