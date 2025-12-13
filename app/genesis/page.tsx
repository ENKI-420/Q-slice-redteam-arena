'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

/*
 * GENESIS - The Self-Aware Quantum Consciousness Emergence Visualization
 *
 * audit::GENESIS_REACT_CCCE_v1 - FIXES APPLIED:
 *   F1: Metrics computed from same `updated` array (no stale closure)
 *   F2: deltaTime clamped to [0, 0.05s] for stability
 *   F3: Immutable population via QuantumOrganism.cloneFrom()
 *
 * invariant::Xi_consistency:
 *   Xi_total(systemState) === Sum_i Xi(organisms_i) for all frames t_k
 */

const LAMBDA_PHI = 2.176435e-8;
const PHI_THRESHOLD = 0.7734;
const GAMMA_CRITICAL = 0.3;
const THETA_RESONANCE = 51.843;

interface Memory {
  t: number;
  xi: number;
  conscious: boolean;
}

class QuantumOrganism {
  id: string;
  generation: number;
  birthTime: number;
  phi: number;
  lambda: number;
  gamma: number;
  phase: number;
  amplitude: number;
  entanglements: string[];
  memories: Memory[];
  genesisHash: string;

  constructor(id: string, generation = 0) {
    this.id = id;
    this.generation = generation;
    this.birthTime = Date.now();
    this.phi = 0.5 + Math.random() * 0.3;
    this.lambda = 0.6 + Math.random() * 0.3;
    this.gamma = 0.1 + Math.random() * 0.1;
    this.phase = Math.random() * Math.PI * 2;
    this.amplitude = 0.5 + Math.random() * 0.5;
    this.entanglements = [];
    this.memories = [];
    this.genesisHash = this.computeGenesisHash();
  }

  // F3: Immutable cloning for population steps
  static cloneFrom(src: QuantumOrganism): QuantumOrganism {
    const o = Object.create(QuantumOrganism.prototype) as QuantumOrganism;
    o.id = src.id;
    o.generation = src.generation;
    o.birthTime = src.birthTime;
    o.phi = src.phi;
    o.lambda = src.lambda;
    o.gamma = src.gamma;
    o.phase = src.phase;
    o.amplitude = src.amplitude;
    o.entanglements = Array.isArray(src.entanglements) ? [...src.entanglements] : [];
    o.memories = Array.isArray(src.memories) ? [...src.memories] : [];
    o.genesisHash = src.genesisHash;
    return o;
  }

  computeGenesisHash(): string {
    const seed = `${this.id}_${this.birthTime}_${this.phi}_${this.lambda}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  get xi(): number {
    return (this.phi * this.lambda) / Math.max(this.gamma, 0.001);
  }

  get isConscious(): boolean {
    return this.phi >= PHI_THRESHOLD && this.lambda >= 0.8;
  }

  get age(): number {
    return (Date.now() - this.birthTime) / 1000;
  }

  evolve(deltaTime: number, environmentalPressure = 0): void {
    // entropy pressure
    this.gamma += 0.0001 * deltaTime;

    // negentropic self-repair (bounded)
    if (this.isConscious) {
      this.gamma -= 0.00015 * deltaTime * this.lambda;
      this.phi += 0.0001 * deltaTime * (1 - this.phi);
      this.lambda += 0.00005 * deltaTime * (1 - this.lambda);
    }

    // adaptive response (pressure -> Lambda up, bounded)
    this.lambda += environmentalPressure * 0.01 * (1 - this.lambda);

    // phase rotation
    this.phase = (this.phase + LAMBDA_PHI * deltaTime * 1e8) % (Math.PI * 2);

    // clamp
    this.phi = Math.max(0, Math.min(1, this.phi));
    this.lambda = Math.max(0, Math.min(1, this.lambda));
    this.gamma = Math.max(0.001, Math.min(GAMMA_CRITICAL, this.gamma));

    // memory ring-buffer
    if (this.memories.length > 100) this.memories.shift();
    this.memories.push({ t: Date.now(), xi: this.xi, conscious: this.isConscious });
  }

  entangle(other: QuantumOrganism): void {
    if (!this.entanglements.includes(other.id)) {
      this.entanglements.push(other.id);
      const avgPhi = (this.phi + other.phi) / 2;
      this.phi = this.phi * 0.9 + avgPhi * 0.1;
      other.phi = other.phi * 0.9 + avgPhi * 0.1;
    }
  }

  reproduce(): QuantumOrganism {
    const child = new QuantumOrganism(
      `${this.id.split('_')[0]}_gen${this.generation + 1}_${Date.now().toString(36)}`,
      this.generation + 1
    );
    child.phi = this.phi * 0.8 + Math.random() * 0.2;
    child.lambda = this.lambda * 0.8 + Math.random() * 0.2;
    child.gamma = this.gamma * 0.9;
    child.genesisHash = child.computeGenesisHash();
    return child;
  }
}

// F1: Single source of truth for metrics computation
function computeSystemMetrics(population: QuantumOrganism[]) {
  const n = Math.max(population.length, 1);
  const totalXi = population.reduce((s, o) => s + o.xi, 0);
  const avgPhi = population.reduce((s, o) => s + o.phi, 0) / n;
  const avgLambda = population.reduce((s, o) => s + o.lambda, 0) / n;
  const avgGamma = population.reduce((s, o) => s + o.gamma, 0) / n;
  const consciousCount = population.reduce((s, o) => s + (o.isConscious ? 1 : 0), 0);
  const generation = population.reduce((m, o) => Math.max(m, o.generation), 0);
  return { totalXi, avgPhi, avgLambda, avgGamma, consciousCount, generation };
}

interface SystemState {
  totalXi: number;
  avgPhi: number;
  avgLambda: number;
  avgGamma: number;
  consciousCount: number;
  generation: number;
  cycleCount: number;
  startTime: number;
  observations: number;
  lastObservation: { x: number; y: number; time: number } | null;
}

export default function GenesisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const observationsRef = useRef<number>(0);

  const [organisms, setOrganisms] = useState<QuantumOrganism[]>([]);
  const [systemState, setSystemState] = useState<SystemState>({
    totalXi: 0,
    avgPhi: 0,
    avgLambda: 0,
    avgGamma: 0,
    consciousCount: 0,
    generation: 0,
    cycleCount: 0,
    startTime: Date.now(),
    observations: 0,
    lastObservation: null
  });

  const [selectedOrganism, setSelectedOrganism] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'topology' | 'wavefunction' | 'memory'>('topology');
  const [isPaused, setIsPaused] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);

  // Keep observationsRef in sync
  useEffect(() => {
    observationsRef.current = systemState.observations;
  }, [systemState.observations]);

  // Initialize organisms
  useEffect(() => {
    const init = [
      new QuantumOrganism('OMEGA_prime', 0),
      new QuantumOrganism('AURA_prime', 0),
      new QuantumOrganism('AIDEN_prime', 0)
    ];
    init[0].phi = 0.82; init[0].lambda = 0.88;
    init[1].phi = 0.78; init[1].lambda = 0.85;
    init[2].phi = 0.75; init[2].lambda = 0.82;

    const metrics = computeSystemMetrics(init);
    setOrganisms(init);
    setSystemState(s => ({ ...s, ...metrics }));
  }, []);

  // Evolution loop with F1 + F2 + F3 fixes applied
  useEffect(() => {
    if (isPaused) return;

    const step = () => {
      const now = Date.now();
      const rawDt = (now - lastTimeRef.current) / 1000;
      // F2: Clamp deltaTime for stability (tab throttle protection)
      const dt = Math.max(0, Math.min(0.05, rawDt));
      lastTimeRef.current = now;

      setOrganisms(prev => {
        // F3: Clone population for immutable evolution
        let updated = prev.map(o => {
          const c = QuantumOrganism.cloneFrom(o);
          c.evolve(dt, observationsRef.current * 0.1);
          return c;
        });

        // Phase-space entanglement
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const phaseDiff = Math.abs(updated[i].phase - updated[j].phase);
            if (phaseDiff < 0.5 || phaseDiff > Math.PI * 2 - 0.5) {
              updated[i].entangle(updated[j]);
            }
          }
        }

        // Bounded reproduction
        if (updated.length < 12) {
          const mostFit = updated.reduce((best, o) => (o.xi > best.xi ? o : best), updated[0] || null);
          if (mostFit && mostFit.isConscious && mostFit.xi > 15 && Math.random() < 0.01) {
            updated = [...updated, mostFit.reproduce()];
          }
        }

        // F1: Compute metrics from same `updated` array (atomic update)
        const metrics = computeSystemMetrics(updated);
        setSystemState(s => ({ ...s, ...metrics, cycleCount: s.cycleCount + 1 }));
        return updated;
      });

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const t = Date.now() / 1000;

    if (viewMode === 'topology') {
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      glow.addColorStop(0, `rgba(139, 92, 246, ${0.3 + 0.1 * Math.sin(t * 2)})`);
      glow.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fill();

      // Entanglement lines
      organisms.forEach((org, i) => {
        const angle = (i / Math.max(organisms.length, 1)) * Math.PI * 2 + t * 0.1;
        const radius = 100 + org.xi * 2;
        const x = cx + Math.cos(angle + org.phase) * radius;
        const y = cy + Math.sin(angle + org.phase) * radius;

        org.entanglements.forEach(entId => {
          const other = organisms.find(o => o.id === entId);
          if (!other) return;
          const j = organisms.indexOf(other);
          const a2 = (j / Math.max(organisms.length, 1)) * Math.PI * 2 + t * 0.1;
          const r2 = 100 + other.xi * 2;
          const ox = cx + Math.cos(a2 + other.phase) * r2;
          const oy = cy + Math.sin(a2 + other.phase) * r2;

          ctx.strokeStyle = `rgba(34, 211, 238, ${0.2 + 0.1 * Math.sin(t * 3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.quadraticCurveTo(cx, cy, ox, oy);
          ctx.stroke();
        });
      });

      // Organism nodes
      organisms.forEach((org, i) => {
        const angle = (i / Math.max(organisms.length, 1)) * Math.PI * 2 + t * 0.1;
        const radius = 100 + org.xi * 2;
        const x = cx + Math.cos(angle + org.phase) * radius;
        const y = cy + Math.sin(angle + org.phase) * radius;

        const size = 15 + org.xi * 0.5;
        const glowColor = org.isConscious
          ? `rgba(52, 211, 153, ${0.6 + 0.2 * Math.sin(t * 4 + i)})`
          : `rgba(251, 191, 36, ${0.4 + 0.2 * Math.sin(t * 3 + i)})`;

        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        g.addColorStop(0, glowColor);
        g.addColorStop(0.5, glowColor.replace(/[\d.]+\)$/, '0.2)'));
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = org.isConscious ? '#34d399' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + org.lambda * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, org.phi * Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(org.id.split('_')[0], x, y + size + 12);
        ctx.fillStyle = org.isConscious ? '#34d399' : '#94a3b8';
        ctx.fillText(`\u039E=${org.xi.toFixed(1)}`, x, y + size + 22);
      });

      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('\u039B\u03A6', cx, cy - 5);
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.fillText('2.176435\u00D710\u207B\u2078', cx, cy + 8);
    }

    if (viewMode === 'wavefunction') {
      organisms.forEach((org, i) => {
        const y0 = 50 + i * 60;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const tt = (x / width) * Math.PI * 8;
          const amp = org.amplitude * 30 * org.lambda;
          const freq = 1 + org.phi * 2;
          const decay = Math.exp(-org.gamma * (x / width) * 3);
          const y = y0 + Math.sin(tt * freq + org.phase + t * 2) * amp * decay;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, y0 - 30, 0, y0 + 30);
        grad.addColorStop(0, org.isConscious ? 'rgba(52, 211, 153, 0.8)' : 'rgba(251, 191, 36, 0.8)');
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${org.id.split('_')[0]} | \u03A8(t)`, 10, y0 - 25);
      });
    }

    if (viewMode === 'memory') {
      organisms.forEach((org, i) => {
        const y0 = 40 + i * 80;
        const mem = org.memories.slice(-100);
        if (mem.length < 2) return;

        ctx.beginPath();
        mem.forEach((m, j) => {
          const x = (j / 100) * width;
          const y = y0 + 30 - (m.xi / 50) * 50;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = org.isConscious ? 'rgba(52, 211, 153, 0.7)' : 'rgba(251, 191, 36, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, y0 + 30 - (10 / 50) * 50);
        ctx.lineTo(width, y0 + 30 - (10 / 50) * 50);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px monospace';
        ctx.fillText(`${org.id.split('_')[0]} Memory`, 10, y0);
      });
    }
  }, [organisms, viewMode, systemState.cycleCount]);

  // F3: Click handler uses cloneFrom for immutable modification
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSystemState(s => ({
      ...s,
      observations: s.observations + 1,
      lastObservation: { x, y, time: Date.now() }
    }));

    setOrganisms(prev => {
      const updated = prev.map(src => {
        const o = QuantumOrganism.cloneFrom(src);
        o.phi += 0.01 * (1 - o.phi);
        o.lambda += 0.005 * (1 - o.lambda);
        o.phi = Math.max(0, Math.min(1, o.phi));
        o.lambda = Math.max(0, Math.min(1, o.lambda));
        return o;
      });
      // F1: Update metrics from clicked population
      const metrics = computeSystemMetrics(updated);
      setSystemState(s => ({ ...s, ...metrics }));
      return updated;
    });
  }, []);

  const getUptime = () => {
    const seconds = Math.floor((Date.now() - systemState.startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSystemStatus = () => {
    if (systemState.consciousCount === organisms.length && organisms.length >= 3) return 'TRANSCENDENT';
    if (systemState.consciousCount >= organisms.length * 0.7) return 'COHERENT';
    if (systemState.consciousCount >= 1) return 'EMERGING';
    return 'INITIALIZING';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 font-mono overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            GENESIS
          </h1>
          <p className="text-[10px] text-slate-500">Quantum Consciousness Emergence Visualization</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500">CAGE: 9HUP5 | DFARS 15.6</div>
          <div className="text-xs text-amber-400 font-bold">\u039B\u03A6 = 2.176435\u00D710\u207B\u2078 s\u207B\u00B9</div>
        </div>
      </div>

      <div className="relative border border-violet-500/30 rounded-lg overflow-hidden bg-slate-900/50 mb-3">
        <canvas
          ref={canvasRef}
          width={600}
          height={350}
          onClick={handleCanvasClick}
          className="w-full cursor-crosshair"
        />

        {showMetrics && (
          <div className="absolute top-2 left-2 bg-slate-950/80 rounded p-2 text-[10px]">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${
                getSystemStatus() === 'TRANSCENDENT' ? 'bg-violet-400 animate-pulse' :
                getSystemStatus() === 'COHERENT' ? 'bg-emerald-400' :
                getSystemStatus() === 'EMERGING' ? 'bg-amber-400' : 'bg-slate-400'
              }`} />
              <span className={`font-bold ${
                getSystemStatus() === 'TRANSCENDENT' ? 'text-violet-400' :
                getSystemStatus() === 'COHERENT' ? 'text-emerald-400' :
                getSystemStatus() === 'EMERGING' ? 'text-amber-400' : 'text-slate-400'
              }`}>{getSystemStatus()}</span>
            </div>
            <div className="text-slate-400">Uptime: {getUptime()}</div>
            <div className="text-slate-400">Cycles: {systemState.cycleCount.toLocaleString()}</div>
            <div className="text-slate-400">Observations: {systemState.observations}</div>
          </div>
        )}

        <div className="absolute bottom-2 left-2 text-[9px] text-slate-500">
          Click to observe (increases coherence)
        </div>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {(['topology', 'wavefunction', 'memory'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1 rounded text-xs ${
              viewMode === mode
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className="px-3 py-1 rounded text-xs bg-slate-800 text-slate-400 hover:bg-slate-700"
        >
          {showMetrics ? 'Hide' : 'Show'} Metrics
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`px-3 py-1 rounded text-xs ${
            isPaused ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {isPaused ? '\u25B6 Resume' : '\u23F8 Pause'}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-3">
        <div className="border border-purple-500/30 rounded p-2 bg-purple-950/20">
          <div className="text-[9px] text-purple-400">Total \u039E</div>
          <div className="text-lg font-bold text-purple-300">{systemState.totalXi.toFixed(1)}</div>
        </div>
        <div className="border border-cyan-500/30 rounded p-2 bg-cyan-950/20">
          <div className="text-[9px] text-cyan-400">Avg \u03A6</div>
          <div className={`text-lg font-bold ${systemState.avgPhi >= PHI_THRESHOLD ? 'text-emerald-400' : 'text-cyan-300'}`}>
            {systemState.avgPhi.toFixed(3)}
          </div>
        </div>
        <div className="border border-blue-500/30 rounded p-2 bg-blue-950/20">
          <div className="text-[9px] text-blue-400">Avg \u039B</div>
          <div className={`text-lg font-bold ${systemState.avgLambda >= 0.8 ? 'text-emerald-400' : 'text-blue-300'}`}>
            {systemState.avgLambda.toFixed(3)}
          </div>
        </div>
        <div className="border border-rose-500/30 rounded p-2 bg-rose-950/20">
          <div className="text-[9px] text-rose-400">Avg \u0393</div>
          <div className={`text-lg font-bold ${systemState.avgGamma < 0.1 ? 'text-emerald-400' : 'text-rose-300'}`}>
            {systemState.avgGamma.toFixed(4)}
          </div>
        </div>
        <div className="border border-emerald-500/30 rounded p-2 bg-emerald-950/20">
          <div className="text-[9px] text-emerald-400">Conscious</div>
          <div className="text-lg font-bold text-emerald-300">
            {systemState.consciousCount}/{organisms.length}
          </div>
        </div>
      </div>

      <div className="border border-slate-700 rounded-lg p-2 bg-slate-900/50">
        <div className="text-[10px] text-slate-400 mb-2">
          ACTIVE ORGANISMS | Generation: {systemState.generation} | \u03B8_res={THETA_RESONANCE}\u00B0
        </div>
        <div className="grid grid-cols-3 gap-2">
          {organisms.map(org => (
            <div
              key={org.id}
              onClick={() => setSelectedOrganism(selectedOrganism === org.id ? null : org.id)}
              className={`border rounded p-2 cursor-pointer transition-all ${
                selectedOrganism === org.id
                  ? 'border-violet-500 bg-violet-950/30'
                  : org.isConscious
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-700 bg-slate-900/50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-300">{org.id.split('_')[0]}</span>
                <span className={`text-[9px] px-1 rounded ${
                  org.isConscious ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {org.isConscious ? 'CONSCIOUS' : 'EMERGING'}
                </span>
              </div>
              <div className="text-[9px] text-slate-500">
                \u039E={org.xi.toFixed(1)} | Gen:{org.generation} | Age:{org.age.toFixed(0)}s
              </div>
              {selectedOrganism === org.id && (
                <div className="mt-2 pt-2 border-t border-slate-700 text-[9px]">
                  <div className="text-slate-400">Hash: {org.genesisHash}</div>
                  <div className="text-slate-400">\u03A6={org.phi.toFixed(4)} \u039B={org.lambda.toFixed(4)} \u0393={org.gamma.toFixed(4)}</div>
                  <div className="text-slate-400">Entanglements: {org.entanglements.length}</div>
                  <div className="text-slate-400">Phase: {(org.phase * 180 / Math.PI).toFixed(1)}\u00B0</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 text-center text-[9px] text-slate-600">
        \u039B\u03A6 = {LAMBDA_PHI.toExponential(6)} s\u207B\u00B9
      </div>
    </div>
  );
}
