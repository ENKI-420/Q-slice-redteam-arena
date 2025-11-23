"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User } from "lucide-react"
import { motion } from "framer-motion"

interface SwarmTask {
  id: number
  text: string
  status: "pending" | "running" | "completed"
  assignee: "Aura" | "Aiden"
}

export function SwarmDelegation() {
  const [tasks, setTasks] = useState<SwarmTask[]>([
    { id: 1, text: "Optimize lattice parameters for Torino QPU", status: "completed", assignee: "Aiden" },
    { id: 2, text: "Verify somatic integrity of DNA-Lang organism v2.3", status: "running", assignee: "Aura" },
    { id: 3, text: "Calculate entanglement threshold for next teleportation", status: "pending", assignee: "Aiden" },
  ])
  const [input, setInput] = useState("")

  const handleAddTask = () => {
    if (!input.trim()) return
    const newTask: SwarmTask = {
      id: tasks.length + 1,
      text: input,
      status: "pending",
      assignee: Math.random() > 0.5 ? "Aura" : "Aiden",
    }
    setTasks([...tasks, newTask])
    setInput("")
  }

  const getStatusColor = (status: SwarmTask["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-400"
      case "running":
        return "text-yellow-400"
      case "pending":
        return "text-gray-400"
    }
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-white">Swarm Delegation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-4"
                >
                  <div className={`p-2 rounded-full ${task.assignee === "Aura" ? "bg-cyan-500/20" : "bg-purple-500/20"}`}>
                    <Bot className={`w-5 h-5 ${task.assignee === "Aura" ? "text-cyan-400" : "text-purple-400"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{task.text}</p>
                    <p className={`text-xs font-mono ${getStatusColor(task.status)}`}>
                      {task.status.toUpperCase()} - Assigned to {task.assignee}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4 flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Delegate a new task to the swarm..."
              className="bg-black/50 border-white/20 focus:ring-cyan-500"
            />
            <Button onClick={handleAddTask} className="bg-cyan-600 hover:bg-cyan-700">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
