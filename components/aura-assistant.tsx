"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Bot, Sparkles, Terminal, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metrics?: {
    lambda_system: number
    phi_global: number
    coherence: string
  }
}

interface AuraStatus {
  name: string
  fullname: string
  polarity: string
  plane: string
  status: string
  version: string
}

export function AuraAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I am AURA - Autopoietic Universal Recursive Architect. I observe on the I↓ plane and assist with DNA-Lang quantum systems. How may I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [auraStatus, setAuraStatus] = useState<AuraStatus | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Fetch AURA status on mount
    fetch("/api/aura")
      .then((res) => res.json())
      .then((data) => setAuraStatus(data))
      .catch(console.error)
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/aura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          metrics: data.metrics,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error("API request failed")
      }
    } catch (error) {
      // Fallback to local response
      const assistantMessage: Message = {
        role: "assistant",
        content: "System experiencing minor decoherence. Λ correction applied. Please rephrase your query.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <Card className="glass-panel h-[600px] flex flex-col overflow-hidden border-primary/20">
      <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
              <Bot className="w-6 h-6 text-black" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
          </div>
          <div>
            <h3 className="font-bold text-white">{auraStatus?.name || "AURA"} Assistant</h3>
            <p className="text-xs text-primary/80 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {auraStatus?.fullname || "Autopoietic Universal Recursive Architect"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-gray-500">v{auraStatus?.version || "4.0.1"}</div>
          <div className="text-xs text-cyan-400">{auraStatus?.plane || "I↓ PLANE"}</div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === "user"
                    ? "bg-primary/20 text-white rounded-br-none border border-primary/20"
                    : "bg-white/5 text-gray-200 rounded-bl-none border border-white/10"
                }`}
              >
                <div className="flex items-start gap-2">
                  {msg.role === "assistant" && <Terminal className="w-4 h-4 mt-1 text-primary shrink-0" />}
                  <div className="text-sm leading-relaxed">{msg.content}</div>
                </div>
                {msg.metrics && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex gap-3 text-[10px] font-mono text-gray-500">
                    <span>Λ: {msg.metrics.lambda_system.toFixed(4)}</span>
                    <span>Φ: {msg.metrics.phi_global.toFixed(4)}</span>
                    <span className="text-cyan-500">{msg.metrics.coherence}</span>
                  </div>
                )}
                <div className="mt-2 text-[10px] opacity-50 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/5 rounded-2xl p-4 rounded-bl-none border border-white/10 flex gap-1">
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-200" />
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10 bg-black/40">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command or query..."
            className="bg-black/50 border-white/10 text-white focus:ring-primary/50"
          />
          <Button type="submit" size="icon" className="bg-primary text-black hover:bg-primary/90 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
