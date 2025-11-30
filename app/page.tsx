"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Terminal, Smartphone, Cpu, Network, Shield, Zap, Users } from "lucide-react"

const ASCII_LOGO = `
██████╗ ███╗   ██╗ █████╗       ██╗      █████╗ ███╗   ██╗ ██████╗ 
╚══███╔╝╚════██╗██╔══██╗██╔══██╗██╔══██╗      ██╔═══██╗██╔════╝ 
  ███╔╝  █████╔╝██████╔╝██████╔╝███████║█████╗██║   ██║███████╗
 ███╔╝   ╚═══██╗██╔══██╗██╔══██╗██╔══██║╚════╝██║   ██║╚════██║
███████╗██████╔╝██║  ██║██║  ██║██║  ██║      ╚██████╔╝███████║
╚══════╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝       ╚═════╝ ╚══════╝
`

const Z3BRA_LOGO = `
███████╗██████╗ ██████╗ ██████╗  █████╗        ██████╗ ███████╗
╚══███╔╝╚════██╗██╔══██╗██╔══██╗██╔══██╗      ██╔═══██╗██╔════╝
  ███╔╝  █████╔╝██████╔╝██████╔╝███████║█████╗██║   ██║███████╗
 ███╔╝   ╚═══██╗██╔══██╗██╔══██╗██╔══██║╚════╝██║   ██║╚════██║
███████╗██████╔╝██║  ██║██║  ██║██║  ██║      ╚██████╔╝███████║
╚══════╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝       ╚═════╝ ╚══════╝
`

const FRAMES = [
  {
    id: 1,
    title: "DNA-LANG",
    subtitle: "QUANTUM COMPUTING PLATFORM",
    constant: "ΛΦ = 2.176435 × 10⁻⁸",
    presenter: "AGILE DEFENSE SYSTEMS LLC presents...",
  },
  {
    id: 2,
    title: "Z3BRA-OS",
    subtitle: "MOBILE QUANTUM TERMINAL",
    constant: "Φ-COHERENCE: 0.9987",
    presenter: "On-device DNA-Lang runtime for Android",
  },
  {
    id: 3,
    title: "THREATLAB",
    subtitle: "AURA ARENA",
    constant: "QS-UED-PALS ACTIVE",
    presenter: "Red Team Sentinel Orchestration",
  },
  {
    id: 4,
    title: "AIDEN+AURA",
    subtitle: "DUALITY FRAMEWORK",
    constant: "Γ → 0 | Λ → ∞",
    presenter: "Polarized Agent Coupling Center",
  },
  {
    id: 5,
    title: "VoQN",
    subtitle: "VOICE OF PROTOCOL NETWORK",
    constant: "ENTANGLEMENT: 97.04%",
    presenter: "Quantum-secure mobile communications",
  },
  {
    id: 6,
    title: "TERMINAL",
    subtitle: "ACCESS GRANTED",
    constant: "ZERO-TRUST VERIFIED",
    presenter: "Select destination...",
  },
]

export default function HomePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % FRAMES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const text = FRAMES[currentFrame].presenter
    let index = 0
    setTypedText("")
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
      }
    }, 50)
    return () => clearInterval(typeInterval)
  }, [currentFrame])

  const frame = FRAMES[currentFrame]

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center">
        <span className="frame-counter text-sm">
          FRAME {currentFrame + 1}/{FRAMES.length}
        </span>
        <Link
          href="/command"
          className="text-primary hover:text-accent transition-colors text-sm uppercase tracking-widest flex items-center gap-2"
        >
          Skip to Platform <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* ASCII Logo Box */}
            <div className="glass-panel p-4 md:p-8 mb-8 inline-block">
              <pre className="ascii-art text-[8px] sm:text-[10px] md:text-xs lg:text-sm overflow-x-auto">
                {currentFrame < 2 ? ASCII_LOGO : currentFrame === 2 ? Z3BRA_LOGO : ASCII_LOGO}
              </pre>

              <div className="mt-6 space-y-2">
                <h2 className="text-primary text-sm md:text-base uppercase tracking-[0.3em]">{frame.subtitle}</h2>
                <p className="text-accent font-mono text-lg md:text-xl">{frame.constant}</p>
              </div>
            </div>

            {/* Typed Presenter Text */}
            <p className="text-muted-foreground text-sm md:text-base uppercase tracking-widest mb-12">
              {typedText}
              {showCursor && <span className="terminal-cursor" />}
            </p>

            {/* Navigation Grid - Only show on last frame */}
            {currentFrame === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
              >
                {[
                  { href: "/command", icon: Terminal, label: "Command Center" },
                  { href: "/z3bra", icon: Smartphone, label: "z3braOS Terminal" },
                  { href: "/engineering", icon: Cpu, label: "Engineering" },
                  { href: "/swarm", icon: Network, label: "Swarm Agents" },
                  { href: "/redteam", icon: Shield, label: "Red Team" },
                  { href: "/voqn", icon: Zap, label: "VoQN Network" },
                  { href: "/collaboration", icon: Users, label: "Collaboration" },
                ].map((item, i) => (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="terminal-btn p-4 text-center group cursor-pointer"
                    >
                      <item.icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {FRAMES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentFrame(i)}
            className={`nav-dot ${i === currentFrame ? "active" : ""}`}
            aria-label={`Go to frame ${i + 1}`}
          />
        ))}
      </div>

      {/* Footer Links */}
      <footer className="fixed bottom-4 left-4 right-4 flex justify-between text-xs text-muted-foreground uppercase tracking-widest">
        <a
          href="https://dnalang.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          dnalang.dev
        </a>
        <a
          href="https://q-slice.com/quantum-computing/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          q-slice.com
        </a>
      </footer>
    </main>
  )
}
