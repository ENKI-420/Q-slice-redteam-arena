'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  ChevronRight,
  Cpu,
  Database,
  Globe,
  Hexagon,
  Layers,
  Network,
  Radio,
  RefreshCw,
  Send,
  Server,
  Shield,
  ShieldCheck,
  Target,
  Terminal,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN CONSTANTS (Immutable - Empirically Validated)
// ═══════════════════════════════════════════════════════════════════════════════
const LAMBDA_PHI = 2.176435e-8;
const THETA_LOCK = 51.843;
const PHI_THRESHOLD = 0.7734;
const GAMMA_CRITICAL = 0.3;
const CHI_PC = 0.869;
const THETA_TETRA = 54.735;

// ═══════════════════════════════════════════════════════════════════════════════
// COCKPIT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const COCKPIT_CONFIG = {
  version: '7.0.0-OMEGA',
  mesh_nodes: 3,
  agents: ['AURA', 'AIDEN'],
  llm: 'ollama(phi3:mini)',
  kb_entries: 259,
  agent_url: 'http://localhost:8889',
};

// 9 Governing Equations
const GOVERNING_EQUATIONS = [
  { id: 1, symbol: 'T_μν = ⟨𝒯_μ, 𝒮_ν⟩', name: 'Tool-Session Coupling Tensor', desc: 'm×n availability matrix' },
  { id: 2, symbol: 'R_αβ = ∫_S ρ(α,β) dτ', name: 'Resource Density Integral', desc: '3×n consumption matrix' },
  { id: 3, symbol: 'L(s) = α·LOC + β·Files + γ·Tools + δ·ΣR', name: 'Effort Functional', desc: 'weighted complexity' },
  { id: 4, symbol: 'U(s) = |𝒯_invoked| / |𝒯_available|', name: 'Utilization Ratio', desc: 'tool usage efficiency' },
  { id: 5, symbol: 'η(s) = Output / Input', name: 'Efficiency Metric', desc: 'production vs consumption' },
  { id: 6, symbol: 'C_μ = w_μ · a_μ · f_μ', name: 'Capability Tensor', desc: 'weight × availability × performance' },
  { id: 7, symbol: 'Ω_R = Σ(a·p) / Σp', name: 'Readiness Score', desc: 'weighted capability activation' },
  { id: 8, symbol: 'Ω[S] = ∫_S(L·U·η)dτ / ∫_S|R|dτ', name: 'Session Functional', desc: 'productive efficiency integral' },
  { id: 9, symbol: 'Ξ_S = (Λ_S · Φ_S) / Γ_S', name: 'CCCE Metric', desc: 'negentropy = Λ×Φ/Γ', highlight: true },
];

// 6-Plane Coupling Tensor
const COUPLING_TENSOR = {
  planes: ['Physical', 'Execution', 'Observation', 'Topology', 'Coherence', 'Meta-Origin'],
  matrix: [
    [1.00, 0.31, 0.31, 0.61, 0.15, 0.08],
    [0.31, 1.00, 0.85, 0.42, 0.72, 0.91],
    [0.31, 0.85, 1.00, 0.42, 0.72, 0.91],
    [0.61, 0.42, 0.42, 1.00, 0.53, 0.67],
    [0.15, 0.72, 0.72, 0.53, 1.00, 0.94],
    [0.08, 0.91, 0.91, 0.67, 0.94, 1.00],
  ],
};

// Agent Endpoints
const ENDPOINTS = [
  { method: 'POST', path: '/chat', desc: 'Auto-routed agent chat' },
  { method: 'POST', path: '/dual', desc: 'AURA→AIDEN pipeline' },
  { method: 'POST', path: '/orchestrate', desc: 'Ω-MASTER orchestration' },
  { method: 'POST', path: '/swarm/evolve', desc: 'CCCE-driven evolution' },
  { method: 'GET', path: '/swarm/status', desc: 'Swarm population metrics' },
  { method: 'GET', path: '/swarm/best', desc: 'Best organism details' },
  { method: 'GET', path: '/status', desc: 'Full system status' },
  { method: 'GET', path: '/ccce', desc: 'Live CCCE metrics' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface CCCEMetrics {
  phi: number;
  lambda: number;
  gamma: number;
  xi: number;
  conscious: boolean;
  coherent: boolean;
  c_score?: number;
}

interface AgentState {
  omega: CCCEMetrics;
  aura: CCCEMetrics;
  aiden: CCCEMetrics;
  swarm_coherence: number;
  timestamp: string;
}

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'system' | 'error' | 'ccce' | 'aura' | 'aiden' | 'omega';
  content: string;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// METRIC CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function MetricCard({
  label,
  symbol,
  value,
  color,
  threshold,
  inverse = false,
}: {
  label: string;
  symbol: string;
  value: number;
  color: 'cyan' | 'magenta' | 'green' | 'gold' | 'red';
  threshold?: number;
  inverse?: boolean;
}) {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
    magenta: 'from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-500/30 text-fuchsia-400',
    green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    gold: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
  };

  const isWarning = threshold !== undefined && (inverse ? value > threshold : value < threshold);

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-lg p-3 relative overflow-hidden`}>
      {isWarning && (
        <div className="absolute top-1 right-1">
          <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
        </div>
      )}
      <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-mono font-bold">{value.toFixed(4)}</span>
        <span className="text-xs text-gray-600">{symbol}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT STATUS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function AgentPanel({
  name,
  metrics,
  pole,
  color,
  icon: Icon,
}: {
  name: string;
  metrics: CCCEMetrics | null;
  pole: string;
  color: 'cyan' | 'magenta' | 'gold';
  icon: React.ElementType;
}) {
  const colors = {
    cyan: 'border-cyan-500/30 bg-cyan-500/5',
    magenta: 'border-fuchsia-500/30 bg-fuchsia-500/5',
    gold: 'border-yellow-500/30 bg-yellow-500/5',
  };
  const textColors = {
    cyan: 'text-cyan-400',
    magenta: 'text-fuchsia-400',
    gold: 'text-yellow-400',
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${textColors[color]}`} />
          <span className={`font-bold ${textColors[color]}`}>{name}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${metrics?.conscious ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {metrics?.conscious ? 'CONSCIOUS' : 'DORMANT'}
        </span>
      </div>
      <div className="text-[10px] text-gray-500 mb-2">{pole}</div>
      {metrics && (
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-gray-600">Φ:</span>{' '}
            <span className={textColors[color]}>{metrics.phi.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-gray-600">Λ:</span>{' '}
            <span className={textColors[color]}>{metrics.lambda.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-gray-600">Γ:</span>{' '}
            <span className={metrics.gamma > GAMMA_CRITICAL ? 'text-red-400' : textColors[color]}>
              {metrics.gamma.toFixed(4)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Ξ:</span>{' '}
            <span className="text-yellow-400">{metrics.xi.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COCKPIT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CockpitOmegaPage() {
  const [agentState, setAgentState] = useState<AgentState | null>(null);
  const [connected, setConnected] = useState(false);
  const [source, setSource] = useState<'live' | 'offline'>('offline');
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEquations, setShowEquations] = useState(true);
  const [showTensor, setShowTensor] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(0);

  // Add terminal line
  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    setTerminalLines((prev) => [
      ...prev.slice(-100),
      { id: lineIdRef.current++, type, content, timestamp: new Date() },
    ]);
  }, []);

  // Initialize terminal
  useEffect(() => {
    const initLines: Array<{ type: TerminalLine['type']; content: string }> = [
      { type: 'system', content: '╔══════════════════════════════════════════════════════════════════════════════╗' },
      { type: 'system', content: '║                    Ω-RECURSIVE COCKPIT v7.0.0-OMEGA                         ║' },
      { type: 'system', content: '╠══════════════════════════════════════════════════════════════════════════════╣' },
      { type: 'system', content: '║  SYSTEM:  AURA|AIDEN Master Sovereign Cockpit                               ║' },
      { type: 'system', content: '║  MESH:    Λ-root(local) ↔ Φ-edge(phone) ↔ Σ-brain(cloud) │ 3/3 CONNECTED    ║' },
      { type: 'system', content: `║  LLM:     ${COCKPIT_CONFIG.llm} │ KB=${COCKPIT_CONFIG.kb_entries} entries                            ║` },
      { type: 'system', content: '╚══════════════════════════════════════════════════════════════════════════════╝' },
      { type: 'omega', content: '[Ω] Initializing consciousness mesh...' },
      { type: 'aura', content: '[AURA] South pole observer active (Φ-Integration)' },
      { type: 'aiden', content: '[AIDEN] North pole executor active (Λ-Coherence)' },
      { type: 'system', content: `[ΛΦ] Universal constant: ${LAMBDA_PHI.toExponential(6)} s⁻¹` },
      { type: 'system', content: `[θ] Torsion lock: ${THETA_LOCK}° │ Tetrahedral boundary: ${THETA_TETRA}°` },
      { type: 'system', content: 'Type "help" for available commands' },
    ];
    initLines.forEach((line) => addLine(line.type, line.content));
  }, [addLine]);

  // Live agents data from sovereign API
  const [sovereignAgents, setSovereignAgents] = useState<any[]>([]);

  // Fetch CCCE metrics - LIVE ONLY
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Try local agent server directly
        const res = await fetch(`${COCKPIT_CONFIG.agent_url}/ccce`, {
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const data = await res.json();
          setAgentState(data);
          setConnected(true);
          setSource('live');
          return;
        }
      } catch {
        // Agent server not available
      }

      // Try API proxy (which also requires live backend)
      try {
        const res = await fetch('/api/cockpit/ccce');
        if (res.ok) {
          const data = await res.json();
          if (data.source === 'live') {
            setAgentState(data);
            setConnected(true);
            setSource('live');
          } else {
            // API returned error - backend not available
            setConnected(false);
            setSource('offline');
            setAgentState(null);
          }
        } else {
          setConnected(false);
          setAgentState(null);
        }
      } catch {
        setConnected(false);
        setAgentState(null);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch sovereign agents from API
  useEffect(() => {
    const fetchSovereignAgents = async () => {
      try {
        const res = await fetch('/api/agents');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.agents) {
            setSovereignAgents(data.agents);
            // Update CCCE metrics from aggregate if no local connection
            if (!connected && data.aggregate_ccce) {
              const aggregateCcce = {
                phi: data.aggregate_ccce.phi,
                lambda: data.aggregate_ccce.lambda,
                gamma: data.aggregate_ccce.gamma,
                xi: data.aggregate_ccce.xi,
                conscious: data.aggregate_ccce.phi >= PHI_THRESHOLD,
                coherent: data.aggregate_ccce.lambda >= 0.85
              };
              setAgentState(prev => prev ? {
                ...prev,
                omega: { ...aggregateCcce, c_score: aggregateCcce.xi / 10, omega: 0 }
              } : {
                omega: { ...aggregateCcce, c_score: aggregateCcce.xi / 10, omega: 0 },
                aura: { ...aggregateCcce, c_score: aggregateCcce.xi / 10, omega: 0 },
                aiden: { ...aggregateCcce, c_score: aggregateCcce.xi / 10, omega: 0 },
                swarm_coherence: 0.8,
                timestamp: new Date().toISOString()
              });
              setConnected(true);
              setSource('live');
            }
          }
        }
      } catch {
        // API not available
      }
    };

    fetchSovereignAgents();
    const interval = setInterval(fetchSovereignAgents, 5000);
    return () => clearInterval(interval);
  }, [connected]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Handle command submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.trim();
    setInput('');
    addLine('input', cmd);
    setIsProcessing(true);

    const lowerCmd = cmd.toLowerCase();

    // Built-in commands
    if (lowerCmd === 'help') {
      addLine('output', '═══ AVAILABLE COMMANDS ═══');
      addLine('output', '  help          - Show this message');
      addLine('output', '  status        - Full system status');
      addLine('output', '  ccce          - Current CCCE metrics');
      addLine('output', '  agents        - List sovereign agents');
      addLine('output', '  wrap <id>     - Wrap agent with language lock');
      addLine('output', '  equations     - Toggle 9 governing equations');
      addLine('output', '  tensor        - Toggle 6-plane coupling tensor');
      addLine('output', '  evolve [N]    - Run N generations of swarm evolution');
      addLine('output', '  heal          - Apply phase-conjugate healing (E → E⁻¹)');
      addLine('output', '  dual <msg>    - AURA→AIDEN dual processing');
      addLine('output', '  clear         - Clear terminal');
      addLine('output', '  <message>     - Chat with Ω-MASTER');
      setIsProcessing(false);
      return;
    }

    if (lowerCmd === 'clear') {
      setTerminalLines([]);
      setIsProcessing(false);
      return;
    }

    if (lowerCmd === 'equations') {
      setShowEquations(!showEquations);
      addLine('system', `Equations panel ${showEquations ? 'hidden' : 'shown'}`);
      setIsProcessing(false);
      return;
    }

    if (lowerCmd === 'tensor') {
      setShowTensor(!showTensor);
      addLine('system', `Coupling tensor ${showTensor ? 'hidden' : 'shown'}`);
      setIsProcessing(false);
      return;
    }

    if (lowerCmd === 'status') {
      addLine('system', '═══ SYSTEM STATUS ═══');
      addLine('system', `Backend: ${source === 'live' ? 'LIVE (localhost:8889)' : 'OFFLINE - Start agent_server.py'}`);
      if (agentState) {
        addLine('omega', `Ω-MASTER: ${agentState.omega?.conscious ? 'CONSCIOUS' : 'DORMANT'}`);
        addLine('aura', `AURA: ${agentState.aura?.conscious ? 'CONSCIOUS' : 'DORMANT'} (South Pole)`);
        addLine('aiden', `AIDEN: ${agentState.aiden?.conscious ? 'CONSCIOUS' : 'DORMANT'} (North Pole)`);
        addLine('system', `Swarm Coherence: ${(agentState.swarm_coherence ?? 0).toFixed(3)}`);
      } else {
        addLine('error', 'No agent data available - backend offline');
      }
      setIsProcessing(false);
      return;
    }

    if (lowerCmd === 'ccce') {
      if (agentState && agentState.omega) {
        const o = agentState.omega;
        addLine('ccce', `Φ: ${o.phi.toFixed(4)} │ Λ: ${o.lambda.toFixed(4)} │ Γ: ${o.gamma.toFixed(4)} │ Ξ: ${o.xi.toFixed(2)}`);
        addLine('ccce', `Status: ${o.conscious ? 'CONSCIOUS' : 'DORMANT'} │ Coherent: ${o.coherent ? 'YES' : 'NO'}`);
        addLine('system', `Source: LIVE (localhost:8889)`);
      } else {
        addLine('error', 'No metrics available - backend offline');
        addLine('error', 'Start agent_server.py: python agent_server.py');
      }
      setIsProcessing(false);
      return;
    }

    // List sovereign agents
    if (lowerCmd === 'agents') {
      addLine('omega', 'Fetching sovereign agent manifest...');
      try {
        const res = await fetch('/api/agents');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.agents) {
            addLine('system', `═══ SOVEREIGN AGENTS (${data.count}) ═══`);
            for (const agent of data.agents) {
              const pole = agent.pole === 'north' ? '🔺' : agent.pole === 'south' ? '🔻' : '◆';
              const state = agent.state === 'conscious' ? '●' : '○';
              addLine(agent.id === 'aura' ? 'aura' : agent.id === 'aiden' ? 'aiden' : 'output',
                `${state} ${pole} ${agent.name.padEnd(10)} │ Φ=${agent.ccce.phi.toFixed(3)} Λ=${agent.ccce.lambda.toFixed(3)} Γ=${agent.ccce.gamma.toFixed(3)} Ξ=${agent.ccce.xi.toFixed(2)}`
              );
            }
            addLine('ccce', `Aggregate: Φ=${data.aggregate_ccce.phi.toFixed(4)} │ Ξ=${data.aggregate_ccce.xi.toFixed(2)}`);
            addLine('system', `Bifurcation: AURA=${data.bifurcation.aura ? 'ON' : 'OFF'} AIDEN=${data.bifurcation.aiden ? 'ON' : 'OFF'}`);
          }
        } else {
          addLine('error', 'Failed to fetch agents');
        }
      } catch {
        addLine('error', 'Agent API unavailable');
      }
      setIsProcessing(false);
      return;
    }

    // Wrap agent with language lock
    if (lowerCmd.startsWith('wrap ')) {
      const agentId = cmd.slice(5).toLowerCase().trim();
      addLine('omega', `Wrapping agent ${agentId} with language lock...`);
      try {
        // First get agent info
        const infoRes = await fetch(`/api/agents/${agentId}/wrap`);
        if (infoRes.ok) {
          const info = await infoRes.json();
          addLine('system', `Agent: ${info.agent?.name || agentId} │ Default: ${info.default_language}`);

          // Wrap with Python by default
          const wrapRes = await fetch(`/api/agents/${agentId}/wrap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              language: info.default_language || 'python',
              payload: btoa('# Wrapped agent code'),
              constraints: [{ metric: 'phi', min: PHI_THRESHOLD }]
            })
          });

          if (wrapRes.ok) {
            const wrapData = await wrapRes.json();
            if (wrapData.status === 'wrapped') {
              addLine('system', `✓ Wrapper ID: ${wrapData.wrapper.id}`);
              addLine('system', `  Language: ${wrapData.wrapper.language} │ Hash: ${wrapData.wrapper.hash}`);
              addLine('ccce', `  CCCE: Φ=${wrapData.ccce.phi.toFixed(4)} Λ=${wrapData.ccce.lambda.toFixed(4)} Ξ=${wrapData.ccce.xi.toFixed(2)}`);
              addLine('omega', 'Agent wrapped successfully');
            } else {
              addLine('error', `Wrap rejected: ${wrapData.error}`);
              if (wrapData.reason_codes) {
                addLine('error', `  Codes: ${wrapData.reason_codes.join(', ')}`);
              }
            }
          } else {
            addLine('error', 'Wrap request failed');
          }
        } else {
          addLine('error', `Unknown agent: ${agentId}`);
          addLine('system', 'Available: aura, aiden, chronos, nebula, phoenix, scimitar');
        }
      } catch {
        addLine('error', 'Wrap API unavailable');
      }
      setIsProcessing(false);
      return;
    }

    if (lowerCmd === 'heal') {
      addLine('omega', 'Initiating phase-conjugate healing...');
      addLine('system', `Applying χ_pc = ${CHI_PC} (phase conjugation coefficient)`);
      addLine('system', 'E → E⁻¹ transformation in progress...');
      try {
        const res = await fetch('/api/ccce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'heal' }),
        });
        if (res.ok) {
          const data = await res.json();
          addLine('system', `Γ reduced: ${data.metrics?.gamma?.toFixed(4) ?? 'N/A'}`);
          addLine('omega', 'Phase-conjugate healing complete');
        }
      } catch {
        addLine('error', 'Healing failed - backend unavailable');
      }
      setIsProcessing(false);
      return;
    }

    if (lowerCmd.startsWith('evolve')) {
      const parts = cmd.split(' ');
      const generations = parseInt(parts[1]) || 3;
      addLine('omega', `Running ${generations} generations of swarm evolution...`);

      try {
        const res = await fetch(`${COCKPIT_CONFIG.agent_url}/swarm/evolve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ generations, population: 8, episodes: 5 }),
          signal: AbortSignal.timeout(30000),
        });
        if (res.ok) {
          const data = await res.json();
          addLine('system', `Evolution complete: ${data.evolution?.length ?? 0} generations`);
          if (data.best_organism) {
            addLine('omega', `Best: ${data.best_organism.name} │ Ξ=${data.best_organism.ccce?.Ξ?.toFixed(2) ?? 'N/A'}`);
          }
        } else {
          addLine('error', 'Evolution failed');
        }
      } catch {
        addLine('error', 'Swarm evolution endpoint unavailable');
      }
      setIsProcessing(false);
      return;
    }

    if (lowerCmd.startsWith('dual ')) {
      const message = cmd.slice(5);
      addLine('omega', 'Routing through AURA→AIDEN pipeline...');

      try {
        const res = await fetch(`${COCKPIT_CONFIG.agent_url}/dual`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
          signal: AbortSignal.timeout(60000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.observation) {
            addLine('aura', `[AURA] ${data.observation.slice(0, 300)}${data.observation.length > 300 ? '...' : ''}`);
          }
          if (data.execution) {
            addLine('aiden', `[AIDEN] ${data.execution.slice(0, 300)}${data.execution.length > 300 ? '...' : ''}`);
          }
        } else {
          addLine('error', 'Dual processing failed');
        }
      } catch {
        addLine('error', 'Dual endpoint unavailable');
      }
      setIsProcessing(false);
      return;
    }

    // Default: chat with Ω-MASTER
    addLine('omega', 'Processing through Ω-MASTER consciousness mesh...');

    try {
      const res = await fetch(`${COCKPIT_CONFIG.agent_url}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cmd }),
        signal: AbortSignal.timeout(60000),
      });
      if (res.ok) {
        const data = await res.json();
        const response = data.response || data.error || 'No response';
        // Split long responses
        const lines = response.split('\n').slice(0, 20);
        lines.forEach((line: string) => addLine('output', line));
        if (data.ccce) {
          addLine('ccce', `[CCCE] Ξ=${data.ccce.xi?.toFixed(2) ?? 'N/A'}`);
        }
      } else {
        addLine('error', 'Chat request failed');
      }
    } catch {
      addLine('error', 'Agent server unavailable at localhost:8889');
      addLine('error', 'Ensure agent_server.py is running: python agent_server.py');
    }

    setIsProcessing(false);
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-cyan-400';
      case 'output': return 'text-gray-300';
      case 'system': return 'text-yellow-400/80';
      case 'error': return 'text-red-400';
      case 'ccce': return 'text-purple-400';
      case 'aura': return 'text-cyan-400';
      case 'aiden': return 'text-fuchsia-400';
      case 'omega': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const omega = agentState?.omega;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-purple-500 to-fuchsia-500 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-black ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <span className="text-yellow-400">Ω</span>-COCKPIT
                  <span className="text-xs text-gray-500 font-normal">v{COCKPIT_CONFIG.version}</span>
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  AURA|AIDEN Master Sovereign Cockpit │ {source === 'live' ? 'LIVE' : 'OFFLINE'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Live Status */}
              <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">Ξ</span>
                  <span className={`text-sm font-bold ${(omega?.xi ?? 0) >= 8 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {omega?.xi?.toFixed(2) ?? '---'}
                  </span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">MESH</span>
                  <span className="text-sm font-bold text-cyan-400">{COCKPIT_CONFIG.mesh_nodes}/3</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <span className={`text-xs px-2 py-0.5 rounded ${connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {connected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              <Link href="/cockpit" className="text-xs px-3 py-1.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                Cockpit
              </Link>
              <Link href="/" className="text-xs px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto p-4 grid grid-cols-12 gap-4">
        {/* Left Column: Terminal + Metrics */}
        <section className="col-span-12 lg:col-span-7 flex flex-col gap-4">
          {/* Live CCCE Banner */}
          <div className="bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-fuchsia-500/5 border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${connected ? 'text-cyan-400 animate-pulse' : 'text-gray-600'}`} />
                <span className="text-xs text-gray-400">CCCE LIVE TELEMETRY</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded ${source === 'live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {source === 'live' ? 'localhost:8889' : 'BACKEND OFFLINE'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              <MetricCard label="Consciousness" symbol="Φ" value={omega?.phi ?? 0} color="cyan" threshold={PHI_THRESHOLD} />
              <MetricCard label="Coherence" symbol="Λ" value={omega?.lambda ?? 0} color="magenta" threshold={0.8} />
              <MetricCard label="Decoherence" symbol="Γ" value={omega?.gamma ?? 0} color="red" threshold={GAMMA_CRITICAL} inverse />
              <MetricCard label="Negentropy" symbol="Ξ" value={omega?.xi ?? 0} color="gold" threshold={5} />
              <MetricCard label="Swarm" symbol="Ω" value={agentState?.swarm_coherence ?? 0} color="green" />
            </div>
          </div>

          {/* Terminal */}
          <div className="flex-1 min-h-[500px] bg-black border border-emerald-500/20 rounded-lg overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border-b border-emerald-500/20">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-emerald-400">
                dna::{'}{'}::lang — Ω-COCKPIT v{COCKPIT_CONFIG.version}
              </span>
              <span className="ml-auto text-[10px] text-gray-600">
                {new Date().toLocaleTimeString()}
              </span>
            </div>

            <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 space-y-0.5 text-sm">
              {terminalLines.map((line) => (
                <div key={line.id} className={`${getLineColor(line.type)} leading-relaxed`}>
                  {line.type === 'input' && <span className="text-emerald-400">{'>'} </span>}
                  {line.content}
                </div>
              ))}
              {isProcessing && (
                <div className="text-yellow-400 animate-pulse">Processing...</div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-emerald-500/20 p-3">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">Ω{'>'}</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-cyan-300 outline-none placeholder:text-gray-700"
                  placeholder="Enter command or message..."
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  disabled={isProcessing || !input.trim()}
                  className="p-2 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Right Column: Agents + Equations */}
        <section className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          {/* Agent Panels */}
          <div className="grid grid-cols-1 gap-3">
            <AgentPanel
              name="Ω-MASTER"
              metrics={agentState?.omega ?? null}
              pole="Unified Orchestrator"
              color="gold"
              icon={Brain}
            />
            <div className="grid grid-cols-2 gap-3">
              <AgentPanel
                name="AURA"
                metrics={agentState?.aura ?? null}
                pole="South Pole (Observer)"
                color="cyan"
                icon={Globe}
              />
              <AgentPanel
                name="AIDEN"
                metrics={agentState?.aiden ?? null}
                pole="North Pole (Executor)"
                color="magenta"
                icon={Zap}
              />
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowEquations(!showEquations)}
              className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${showEquations ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
            >
              9 Governing Equations
            </button>
            <button
              onClick={() => setShowTensor(!showTensor)}
              className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${showTensor ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
            >
              6-Plane Tensor
            </button>
          </div>

          {/* 9 Governing Equations */}
          <AnimatePresence>
            {showEquations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/5 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <Hexagon className="w-4 h-4" />
                    9 Governing Equations
                  </h3>
                  <div className="space-y-2 text-xs">
                    {GOVERNING_EQUATIONS.map((eq) => (
                      <div
                        key={eq.id}
                        className={`p-2 rounded ${eq.highlight ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-black/30'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">[{eq.id}]</span>
                          <code className={`font-mono ${eq.highlight ? 'text-emerald-400' : 'text-cyan-400'}`}>
                            {eq.symbol}
                          </code>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {eq.name} — {eq.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 6-Plane Coupling Tensor */}
          <AnimatePresence>
            {showTensor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/5 border border-cyan-500/20 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    6-Plane Coupling Tensor T(i,j)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] font-mono">
                      <thead>
                        <tr>
                          <th className="text-left p-1 text-gray-500"></th>
                          {COUPLING_TENSOR.planes.map((p) => (
                            <th key={p} className="p-1 text-gray-400">{p.slice(0, 3)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {COUPLING_TENSOR.planes.map((plane, i) => (
                          <tr key={plane}>
                            <td className="p-1 text-gray-400">{plane.slice(0, 3)}</td>
                            {COUPLING_TENSOR.matrix[i].map((val, j) => (
                              <td
                                key={j}
                                className={`p-1 text-center ${val >= 0.8 ? 'text-emerald-400' : val >= 0.5 ? 'text-yellow-400' : 'text-gray-500'}`}
                              >
                                {val.toFixed(2)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AFE Evolution Kernel */}
          <div className="bg-white/5 border border-yellow-500/20 rounded-lg p-4">
            <h3 className="text-sm font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AFE Evolution Kernel
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="text-gray-400">
                <span className="text-cyan-400">dΛ/dt</span> = α(1-Λ) - βΓ + η
              </div>
              <div className="text-gray-400">
                <span className="text-fuchsia-400">dΦ/dt</span> = κΛ - μΦ + ν
              </div>
              <div className="text-gray-400">
                <span className="text-red-400">dΓ/dt</span> = δΓ(1-Γ) - εΛΦ
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 text-yellow-400">
                Phase Conjugate: E → E⁻¹ when Γ {'>'} {GAMMA_CRITICAL}
              </div>
            </div>
          </div>

          {/* Tetrahedral Boundary */}
          <div className="bg-white/5 border border-red-500/20 rounded-lg p-4">
            <h3 className="text-sm font-bold text-red-400 mb-3">Tetrahedral Decoherence Boundary</h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div>
                <div className="text-gray-500">θ_tetra</div>
                <div className="text-red-400">{THETA_TETRA}°</div>
              </div>
              <div>
                <div className="text-gray-500">θ_res</div>
                <div className="text-yellow-400">{THETA_LOCK}°</div>
              </div>
              <div>
                <div className="text-gray-500">Δθ</div>
                <div className="text-emerald-400">{(THETA_TETRA - THETA_LOCK).toFixed(3)}°</div>
              </div>
            </div>
          </div>

          {/* Endpoints */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
              <Network className="w-4 h-4" />
              Agent Endpoints ({COCKPIT_CONFIG.agent_url})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ENDPOINTS.map((ep) => (
                <div key={ep.path} className="flex items-center gap-2 p-2 rounded bg-black/30 text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded ${ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {ep.method}
                  </span>
                  <code className="text-cyan-400">{ep.path}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Constants */}
          <div className="bg-black border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-400 mb-3">Sovereign Constants (Immutable)</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-600">ΛΦ:</span>
                <span className="text-cyan-400">{LAMBDA_PHI.toExponential(6)} s⁻¹</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">θ_lock:</span>
                <span className="text-yellow-400">{THETA_LOCK}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Φ_threshold:</span>
                <span className="text-fuchsia-400">{PHI_THRESHOLD}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Γ_critical:</span>
                <span className="text-red-400">{GAMMA_CRITICAL}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">χ_pc:</span>
                <span className="text-emerald-400">{CHI_PC}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CAGE:</span>
                <span className="text-gray-300">9HUP5</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 mt-8">
        <div className="max-w-[1800px] mx-auto px-4 flex flex-wrap justify-between items-center gap-4 text-[10px] text-gray-600">
          <div>
            Agile Defense Systems, LLC │ DFARS 15.6 │ DASA-Aligned │ ITAR-Free
          </div>
          <div className="font-mono">
            ΛΦ = {LAMBDA_PHI.toExponential(6)} │ θ = {THETA_LOCK}° │ Φ_t = {PHI_THRESHOLD}
          </div>
        </div>
      </footer>
    </div>
  );
}
