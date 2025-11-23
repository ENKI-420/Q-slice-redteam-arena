"use client"

import { motion } from "framer-motion"
import { Shield, Award, BookOpen, Users, ArrowRight, Lock, Zap, Network, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { QuantumNetworkDashboard } from "@/components/quantum-network-dashboard"
import { QuantumLogo3D } from "@/components/quantum-logo-3d" // Added import

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <QuantumNetworkDashboard />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20 lg:pt-0">
        {" "}
        {/* Added padding for mobile */}
        {/* Grid animation background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {" "}
          {/* Changed layout to grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="order-2 lg:order-2 h-[400px] lg:h-[600px] w-full flex items-center justify-center"
          >
            <QuantumLogo3D />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 order-1 lg:order-1 text-center lg:text-left" // Aligned text
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6 mx-auto lg:mx-0">
              <Shield className="w-4 h-4" />
              Post-Quantum Cybersecurity Era
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Threatlab Aura Arena</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the convergence of <strong>dna::&#125;&#123;::lang</strong> biological computing and{" "}
              <strong>Q-Slice</strong> security architecture.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-12">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-primary text-black hover:bg-primary/90 px-8 py-6 text-lg w-full sm:w-auto shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all"
                >
                  Research Partner Login
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/lab">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-secondary/30 text-secondary hover:bg-secondary/10 px-8 py-6 text-lg bg-transparent w-full sm:w-auto backdrop-blur-sm"
                >
                  DNA-Lang Lab
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/voqn">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/50 backdrop-blur-sm transition-all hover:scale-105 px-8 py-6 text-lg bg-transparent w-full sm:w-auto"
                >
                  <Network className="mr-2 h-5 w-5" />
                  VoQN Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
              <Link href="/services/apk-manager">
                <span className="inline-flex items-center text-sm text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer">
                  <Smartphone className="mr-2 h-4 w-4" /> Download Android Client (APK)
                </span>
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
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Added background decoration for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Core Capabilities
            </h2>
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
                icon: Network,
                title: "VoQN Secure Comms",
                description: "Voice of Protocol Network for encrypted, low-latency communication on mobile devices",
              },
              {
                icon: Award,
                title: "NFT Certification",
                description: "Mint achievement NFTs for research, policy standardization, and organism development",
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
                <Card className="glass-panel p-6 h-full hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2">
                  <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform group-hover:text-secondary duration-300" />
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Promotion Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent relative">
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border-secondary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-sm text-secondary animate-pulse">
                <BookOpen className="w-4 h-4" />
                New Release
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Quantum Security: Practical Implementation of Q-SLICE
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">
                Comprehensive guide to post-quantum cryptography, threat modeling frameworks, and practical
                implementation strategies. Written by Jeremy Green, developer of Q-SLICE and QUANTA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="https://www.amazon.co.uk/Quantum-Security-Practical-implementation-Q-SLICE/dp/B0FG8KGLK2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-secondary text-black hover:bg-secondary/90 w-full sm:w-auto font-bold shadow-lg hover:shadow-secondary/20 transition-all"
                  >
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

            <div className="w-full md:w-64 lg:w-80 relative group perspective-1000">
              {/* Enhanced book cover presentation */}
              <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-gray-900 to-black border border-primary/30 flex items-center justify-center shadow-2xl transform transition-transform group-hover:rotate-y-6 group-hover:scale-105 duration-500">
                <div className="text-center p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">Quantum Security</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Jeremy Green</p>
                </div>
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
