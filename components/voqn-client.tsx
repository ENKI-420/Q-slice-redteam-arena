"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mic, Video, User, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const jeremyGreen = {
  name: "Jeremy Green",
  title: "Lead, Q-Slice Integration",
  avatar: "/placeholder-user.jpg",
}

export function VoqnClient() {
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active">("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)

  const handleCall = () => {
    setCallStatus("connecting")
    setTimeout(() => setCallStatus("active"), 3000)
  }

  const handleEndCall = () => {
    setCallStatus("idle")
  }

  return (
    <Card className="glass-panel h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-cyan-400">VOQN</CardTitle>
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-xs font-mono text-yellow-400">θ=51.843°</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <AnimatePresence mode="wait">
          {callStatus === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-4"
            >
              <User className="w-24 h-24 text-white/30" />
              <h3 className="text-xl font-semibold">{jeremyGreen.name}</h3>
              <p className="text-white/50">{jeremyGreen.title}</p>
              <Button
                onClick={handleCall}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white rounded-full w-20 h-20 shadow-[0_0_20px_rgba(16,185,129,0.7)]"
              >
                <Phone className="w-8 h-8" />
              </Button>
              <p className="text-xs text-white/40 mt-2">Initiate Secure Quantum Link</p>
            </motion.div>
          )}

          {callStatus === "connecting" && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-dashed border-cyan-400"
              />
              <h3 className="text-xl font-semibold mt-4">Connecting...</h3>
              <p className="text-white/50">Establishing Quantum Entanglement</p>
            </motion.div>
          )}

          {callStatus === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-between h-full w-full"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold">{jeremyGreen.name}</h3>
                <p className="text-cyan-400">00:00:00</p>
              </div>
              <div className="relative w-48 h-48">
                <img src={jeremyGreen.avatar} alt="Jeremy Green" className="rounded-full object-cover w-full h-full" />
                <div className="absolute bottom-2 right-2 bg-black/50 p-1 rounded-full">
                  <Mic className={`w-4 h-4 ${isMuted ? "text-red-500" : "text-white"}`} />
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-6">
                <Button variant="ghost" onClick={() => setIsMuted(!isMuted)} className={`rounded-full w-14 h-14 ${isMuted ? "bg-red-500/50" : "bg-white/10"}`}>
                  <Mic className="w-6 h-6" />
                </Button>
                <Button variant="ghost" onClick={() => setVideoEnabled(!videoEnabled)} className={`rounded-full w-14 h-14 ${!videoEnabled ? "bg-red-500/50" : "bg-white/10"}`}>
                  <Video className="w-6 h-6" />
                </Button>
                <Button onClick={handleEndCall} className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16">
                  <Phone className="w-7 h-7" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
