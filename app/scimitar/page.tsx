'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Mouse, Settings, Zap, Play, Save, RefreshCw,
  CheckCircle2, XCircle, Terminal, FileText, Navigation, Atom,
  Users, Code, Cpu, Activity, Lock, Radio
} from 'lucide-react';

/**
 * Scimitar Elite Configuration Page
 * =================================
 * 12-button programmable mouse integration for Q-SLICE workflow
 *
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5 | Agile Defense Systems, LLC
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type ActionCategory = 'file' | 'navigation' | 'quantum' | 'terminal' | 'agent' | 'custom';

interface ButtonAction {
  id: string;
  name: string;
  description: string;
  category: ActionCategory;
  shortcut?: string;
  command?: string;
  api_endpoint?: string;
  agent_id?: string;
}

interface ButtonBinding {
  button: number;
  action: ButtonAction;
  enabled: boolean;
}

interface ScimitarProfile {
  id: string;
  name: string;
  description: string;
  bindings: ButtonBinding[];
  created_at: string;
  active: boolean;
}

interface DeviceStatus {
  name: string;
  buttons: number;
  connected: boolean;
  firmware: string;
}

interface ExecuteResult {
  button: number;
  action: ButtonAction;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY STYLING
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_CONFIG: Record<ActionCategory, { color: string; icon: typeof FileText; label: string }> = {
  file: { color: '#00ff88', icon: FileText, label: 'File Ops' },
  navigation: { color: '#00fff6', icon: Navigation, label: 'Navigation' },
  quantum: { color: '#ff00bb', icon: Atom, label: 'Quantum' },
  terminal: { color: '#ffbb00', icon: Terminal, label: 'Terminal' },
  agent: { color: '#bb00ff', icon: Users, label: 'Agents' },
  custom: { color: '#ff6600', icon: Code, label: 'Custom' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ScimitarPage() {
  // State
  const [device, setDevice] = useState<DeviceStatus | null>(null);
  const [profiles, setProfiles] = useState<ScimitarProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<ScimitarProfile | null>(null);
  const [availableActions, setAvailableActions] = useState<ButtonAction[]>([]);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [executeHistory, setExecuteHistory] = useState<ExecuteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configMode, setConfigMode] = useState(false);

  // Fetch device status and configuration
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/scimitar');
      if (!res.ok) throw new Error('Failed to fetch status');
      const data = await res.json();
      setDevice(data.device);
      setActiveProfile(data.active_profile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const fetchProfiles = useCallback(async () => {
    try {
      const res = await fetch('/api/scimitar?action=profiles');
      if (!res.ok) throw new Error('Failed to fetch profiles');
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    }
  }, []);

  const fetchActions = useCallback(async () => {
    try {
      const res = await fetch('/api/scimitar?action=actions');
      if (!res.ok) throw new Error('Failed to fetch actions');
      const data = await res.json();
      setAvailableActions(data.actions || []);
    } catch (err) {
      console.error('Failed to fetch actions:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStatus(), fetchProfiles(), fetchActions()]);
      setLoading(false);
    };
    init();
  }, [fetchStatus, fetchProfiles, fetchActions]);

  // Execute button action
  const executeButton = async (button: number) => {
    try {
      const res = await fetch('/api/scimitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'execute', button })
      });
      const data = await res.json();

      if (data.success && data.executed) {
        setExecuteHistory(prev => [data.executed, ...prev].slice(0, 10));
      }
    } catch (err) {
      console.error('Execute failed:', err);
    }
  };

  // Switch profile
  const switchProfile = async (profileId: string) => {
    try {
      const res = await fetch('/api/scimitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch_profile', profile_id: profileId })
      });
      const data = await res.json();

      if (data.success) {
        await fetchStatus();
        await fetchProfiles();
      }
    } catch (err) {
      console.error('Switch profile failed:', err);
    }
  };

  // Bind action to button
  const bindAction = async (button: number, actionId: string) => {
    try {
      const res = await fetch('/api/scimitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bind',
          button,
          binding: { action_id: actionId, enabled: true }
        })
      });
      const data = await res.json();

      if (data.success) {
        await fetchStatus();
        setSelectedButton(null);
      }
    } catch (err) {
      console.error('Bind failed:', err);
    }
  };

  // Auto-configure
  const autoConfig = async () => {
    try {
      const res = await fetch('/api/scimitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto_configure' })
      });
      const data = await res.json();

      if (data.success) {
        await fetchStatus();
        await fetchProfiles();
      }
    } catch (err) {
      console.error('Auto-configure failed:', err);
    }
  };

  // Get binding for button
  const getBinding = (button: number): ButtonBinding | undefined => {
    return activeProfile?.bindings.find(b => b.button === button);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-gray-200 font-sans">
      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/cockpit" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Cockpit</span>
              </Link>

              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: device?.connected ? [1, 1.1, 1] : 1 }}
                  transition={{ repeat: device?.connected ? Infinity : 0, duration: 2 }}
                  className={`w-2.5 h-2.5 rounded-full ${device?.connected ? 'bg-emerald-400' : 'bg-red-500'}`}
                  style={{ boxShadow: device?.connected ? '0 0 12px #00ff88' : '0 0 12px #ef4444' }}
                />
                <h1 className="font-mono font-bold text-sm md:text-base tracking-wide text-white flex items-center gap-2">
                  <Mouse className="w-4 h-4 text-cyan-400" />
                  <span>SCIMITAR ELITE</span>
                  <span className="text-pink-500">CONFIG</span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-[10px]">
              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-semibold border ${
                device?.connected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <Radio className="w-3 h-3" />
                {device?.connected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
              <div className="hidden md:block px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 font-semibold text-[9px]">
                SPEC_LOCK v2.2.0
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto w-full p-4 lg:p-6 space-y-5">
        {/* ═══════════════ ERROR BANNER ═══════════════ */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════ TOP ROW: Device + Profile ═══════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Device Status */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <h3 className="font-mono font-bold text-sm text-cyan-400 flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4" />
              DEVICE STATUS
            </h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Device:</span>
                <span className="text-white">{device?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Buttons:</span>
                <span className="text-cyan-400">{device?.buttons || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Firmware:</span>
                <span className="text-white/70">{device?.firmware || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Status:</span>
                <span className={device?.connected ? 'text-emerald-400' : 'text-red-400'}>
                  {device?.connected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Profile */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-bold text-sm text-pink-400 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                ACTIVE PROFILE
              </h3>
              <button
                onClick={() => setConfigMode(!configMode)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                  configMode
                    ? 'bg-pink-500/20 border border-pink-500/50 text-pink-400'
                    : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {configMode ? 'EDITING' : 'CONFIGURE'}
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-white/10 rounded-lg">
                <div className="font-mono font-bold text-white">{activeProfile?.name || 'None'}</div>
                <div className="text-[11px] text-white/50 mt-1">{activeProfile?.description || 'No profile selected'}</div>
              </div>
              <button
                onClick={autoConfig}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-[11px] font-mono text-cyan-400 hover:bg-cyan-500/20 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                AUTO-CONFIGURE OPTIMAL
              </button>
            </div>
          </div>

          {/* Profile Switcher */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <h3 className="font-mono font-bold text-sm text-amber-400 flex items-center gap-2 mb-4">
              <Users className="w-4 h-4" />
              PROFILES ({profiles.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => switchProfile(profile.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                    profile.active
                      ? 'bg-emerald-500/15 border border-emerald-500/30'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="font-mono text-[11px] font-bold text-white">{profile.name}</div>
                    <div className="text-[9px] text-white/40">{profile.description}</div>
                  </div>
                  {profile.active && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ BUTTON GRID ═══════════════ */}
        <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-mono font-bold text-lg text-white flex items-center gap-2">
              <Mouse className="w-5 h-5 text-cyan-400" />
              12-BUTTON LAYOUT
            </h3>
            <div className="flex gap-2">
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1.5 text-[9px] font-mono">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-white/40">{config.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Button Grid Visualization */}
          <div className="bg-black/50 rounded-xl p-6 border border-white/5">
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(button => {
                const binding = getBinding(button);
                const category = binding?.action.category || 'custom';
                const config = CATEGORY_CONFIG[category];
                const isSelected = selectedButton === button;

                return (
                  <motion.button
                    key={button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => configMode ? setSelectedButton(button) : executeButton(button)}
                    className={`relative aspect-square rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-500/20'
                        : binding
                          ? 'border-white/20 bg-white/5 hover:border-white/40'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                    style={{
                      boxShadow: binding ? `0 0 20px ${config.color}20, inset 0 0 15px ${config.color}10` : 'none'
                    }}
                  >
                    {/* Button Number */}
                    <div className="absolute top-2 left-2 font-mono text-[10px] text-white/30 font-bold">
                      {button}
                    </div>

                    {/* Action Content */}
                    <div className="flex flex-col items-center justify-center h-full p-2">
                      {binding ? (
                        <>
                          <config.icon className="w-5 h-5 mb-1" style={{ color: config.color }} />
                          <div className="font-mono text-[10px] text-white/80 text-center leading-tight">
                            {binding.action.name}
                          </div>
                          <div className="text-[8px] text-white/40 mt-0.5">
                            {binding.action.shortcut || binding.action.category}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-dashed border-white/20 mb-1" />
                          <div className="font-mono text-[9px] text-white/30">Unbound</div>
                        </>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="selection"
                        className="absolute inset-0 border-2 border-pink-500 rounded-xl"
                        style={{ boxShadow: '0 0 20px rgba(255, 0, 187, 0.5)' }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Row Labels */}
            <div className="mt-4 flex justify-center gap-8 font-mono text-[9px] text-white/30">
              <span>Row 1: File Ops</span>
              <span>Row 2: Navigation</span>
              <span>Row 3: Quantum Ops</span>
            </div>
          </div>
        </section>

        {/* ═══════════════ BINDING PANEL (when button selected) ═══════════════ */}
        <AnimatePresence>
          {selectedButton !== null && configMode && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-pink-500/30 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono font-bold text-sm text-pink-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  BIND ACTION TO BUTTON {selectedButton}
                </h3>
                <button
                  onClick={() => setSelectedButton(null)}
                  className="text-white/50 hover:text-white text-sm"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {availableActions.map(action => {
                  const config = CATEGORY_CONFIG[action.category];
                  const Icon = config.icon;

                  return (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => bindAction(selectedButton, action.id)}
                      className="p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-left"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                        <span className="font-mono text-[10px] font-bold text-white">{action.name}</span>
                      </div>
                      <div className="text-[9px] text-white/50">{action.description}</div>
                      {action.shortcut && (
                        <div className="mt-2 px-1.5 py-0.5 bg-white/10 rounded text-[8px] text-white/60 inline-block font-mono">
                          {action.shortcut}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ═══════════════ EXECUTION HISTORY ═══════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Executions */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <h3 className="font-mono font-bold text-sm text-emerald-400 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4" />
              EXECUTION HISTORY
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {executeHistory.length === 0 ? (
                <div className="text-center text-white/30 text-sm py-4">
                  No executions yet. Click a button to execute.
                </div>
              ) : (
                executeHistory.map((exec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 bg-white/[0.02] border border-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center bg-cyan-500/20 rounded text-[10px] font-mono text-cyan-400 font-bold">
                        {exec.button}
                      </div>
                      <div>
                        <div className="font-mono text-[11px] text-white">{exec.action.name}</div>
                        <div className="text-[9px] text-white/40">{exec.action.category}</div>
                      </div>
                    </div>
                    <div className="text-[9px] text-white/30 font-mono">
                      {new Date(exec.timestamp).toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <h3 className="font-mono font-bold text-sm text-amber-400 flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" />
              QUICK EXECUTE
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(button => {
                const binding = getBinding(button);
                return (
                  <button
                    key={button}
                    onClick={() => executeButton(button)}
                    disabled={!binding}
                    className={`p-3 rounded-lg font-mono text-sm transition-all ${
                      binding
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-[10px]">{button}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ INTEGRATION INFO ═══════════════ */}
        <section className="bg-gradient-to-r from-cyan-500/5 via-transparent to-pink-500/5 border border-white/10 rounded-xl p-5">
          <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-cyan-400" />
            API INTEGRATION
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px]">
            <div className="p-3 bg-black/30 rounded-lg border border-white/5">
              <div className="text-cyan-400 mb-2">GET /api/scimitar</div>
              <div className="text-white/50">Retrieve device status and active profile</div>
            </div>
            <div className="p-3 bg-black/30 rounded-lg border border-white/5">
              <div className="text-pink-400 mb-2">POST /api/scimitar</div>
              <div className="text-white/50">Execute actions, switch profiles, bind buttons</div>
            </div>
            <div className="p-3 bg-black/30 rounded-lg border border-white/5">
              <div className="text-amber-400 mb-2">?action=actions|profiles</div>
              <div className="text-white/50">Query available actions or all profiles</div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-white/5 bg-black/80 backdrop-blur-sm py-4 mt-6">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
          <div className="flex flex-wrap justify-between items-center gap-4 text-[9px] font-mono text-white/40">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white/60">SCIMITAR ELITE INTEGRATION</span>
              <span className="text-white/15">|</span>
              <span>Corsair 12-Button Mouse</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">SPEC_LOCK v2.2.0</span>
              <span className="text-white/15">|</span>
              <span>CAGE: 9HUP5</span>
              <span className="text-white/15">|</span>
              <span className="text-cyan-400">Q-SLICE.COM</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
