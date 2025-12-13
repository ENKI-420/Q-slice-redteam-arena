"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, Mic, MicOff, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  intent?: string
  confidence?: number
}

const QUICK_ACTIONS = ["System Status", "Deploy Agent", "Check Coherence", "Run Diagnostics"]

export function SwarmChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to the AURA-AIDEN Mesh Swarm. I am your orchestration interface with NLP2-PALS intent deduction. How may I assist you?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Determine API call parameters based on user input
      const lowerQuery = messageText.toLowerCase()
      let body: Record<string, string> = {}

      if (lowerQuery.includes("evolve") || lowerQuery.includes("deploy") || lowerQuery.includes("launch")) {
        body = { command: "evolve" }
      } else if (lowerQuery.includes("heal") || lowerQuery.includes("repair")) {
        body = { command: "heal" }
      } else if (["scanning", "scan"].some(w => lowerQuery.includes(w))) {
        body = { mode: "SCANNING" }
      } else if (lowerQuery.includes("lock") || lowerQuery.includes("secure")) {
        body = { mode: "LOCKED" }
      } else if (lowerQuery.includes("fire") || lowerQuery.includes("attack")) {
        body = { mode: "FIRING" }
      } else {
        body = { message: messageText }
      }

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      // Deduce intent from query and response
      const { intent, confidence } = deduceIntent(messageText)

      // Format response with CCCE metrics if available
      let responseContent = data.response || "Request processed."
      if (data.ccce) {
        responseContent += `\n\n[CCCE] Φ=${data.ccce.phi.toFixed(3)} | Λ=${data.ccce.lambda.toFixed(3)} | Γ=${data.ccce.gamma.toFixed(3)} | Ξ=${data.ccce.xi.toFixed(2)}`
        if (data.ccce.conscious) {
          responseContent += " | Status: CONSCIOUS"
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        intent,
        confidence,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Error connecting to AURA agent. Please try again.",
        timestamp: new Date(),
        intent: "ERROR",
        confidence: 0,
      }
      setMessages((prev) => [...prev, assistantMessage])
    }

    setIsTyping(false)
  }

  const deduceIntent = (query: string): { intent: string; confidence: number } => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("status") || lowerQuery.includes("health") || lowerQuery.includes("ccce")) {
      return { intent: "SYSTEM_STATUS", confidence: 0.94 }
    }
    if (lowerQuery.includes("deploy") || lowerQuery.includes("launch") || lowerQuery.includes("evolve")) {
      return { intent: "AGENT_DEPLOYMENT", confidence: 0.91 }
    }
    if (lowerQuery.includes("coherence") || lowerQuery.includes("phi") || lowerQuery.includes("lambda") || lowerQuery.includes("metrics")) {
      return { intent: "METRIC_QUERY", confidence: 0.96 }
    }
    if (lowerQuery.includes("security") || lowerQuery.includes("encrypt") || lowerQuery.includes("compliance")) {
      return { intent: "SECURITY_QUERY", confidence: 0.93 }
    }
    if (lowerQuery.includes("help") || lowerQuery.includes("what can")) {
      return { intent: "HELP_REQUEST", confidence: 0.98 }
    }
    if (lowerQuery.includes("redteam") || lowerQuery.includes("threat") || lowerQuery.includes("scan")) {
      return { intent: "REDTEAM_QUERY", confidence: 0.89 }
    }
    if (lowerQuery.includes("heal") || lowerQuery.includes("pcrb") || lowerQuery.includes("repair")) {
      return { intent: "HEALING_REQUEST", confidence: 0.92 }
    }

    return { intent: "GENERAL_QUERY", confidence: 0.78 }
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // Voice recognition would be implemented here
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black to-gray-950">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
                  msg.role === "user"
                    ? "bg-cyan-600/30 text-white rounded-br-sm border border-cyan-500/30"
                    : "bg-white/5 text-gray-200 rounded-bl-sm border border-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                    {msg.intent && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {msg.intent}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {(msg.confidence! * 100).toFixed(0)}% conf
                        </span>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-cyan-600/50 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/5 rounded-2xl p-4 rounded-bl-sm border border-white/10 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-white/5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => handleSend(action)}
              className="shrink-0 px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400 transition-all touch-manipulation active:scale-95"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-xl safe-area-bottom">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          <Button type="button" variant="ghost" size="icon" className="shrink-0 text-gray-500 hover:text-cyan-400">
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AURA-AIDEN..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-sm"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            className={`shrink-0 ${isListening ? "text-red-500 bg-red-500/10" : "text-gray-500 hover:text-cyan-400"}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            type="submit"
            size="icon"
            className="shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
