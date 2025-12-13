/**
 * Scimitar Elite Integration API
 * ================================
 * 12-button programmable mouse integration for Q-SLICE workflow
 *
 * Button Layout:
 * ┌─────────────────┐
 * │  1   2   3   4  │  Row 1: File ops
 * │  5   6   7   8  │  Row 2: Navigation
 * │  9  10  11  12  │  Row 3: Quantum ops
 * └─────────────────┘
 *
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 */

import { NextRequest, NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type ActionCategory = 'file' | 'navigation' | 'quantum' | 'terminal' | 'agent' | 'custom'

interface ButtonAction {
  id: string
  name: string
  description: string
  category: ActionCategory
  shortcut?: string
  command?: string
  api_endpoint?: string
  agent_id?: string
}

interface ButtonBinding {
  button: number
  action: ButtonAction
  enabled: boolean
  hold_action?: ButtonAction  // Action when button is held
}

interface ScimitarProfile {
  id: string
  name: string
  description: string
  bindings: ButtonBinding[]
  created_at: string
  active: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// AVAILABLE ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const AVAILABLE_ACTIONS: ButtonAction[] = [
  // File Operations
  { id: 'save', name: 'Save', description: 'Save current file', category: 'file', shortcut: 'Ctrl+S' },
  { id: 'save_all', name: 'Save All', description: 'Save all open files', category: 'file', shortcut: 'Ctrl+Shift+S' },
  { id: 'format', name: 'Format', description: 'Format current document', category: 'file', shortcut: 'Shift+Alt+F' },
  { id: 'commit', name: 'Git Commit', description: 'Stage and commit changes', category: 'file', command: 'git add . && git commit' },
  { id: 'push', name: 'Git Push', description: 'Push to remote', category: 'file', command: 'git push' },

  // Navigation
  { id: 'terminal', name: 'Terminal', description: 'Toggle integrated terminal', category: 'navigation', shortcut: 'Ctrl+`' },
  { id: 'next_error', name: 'Next Error', description: 'Jump to next error', category: 'navigation', shortcut: 'F8' },
  { id: 'prev_error', name: 'Previous Error', description: 'Jump to previous error', category: 'navigation', shortcut: 'Shift+F8' },
  { id: 'search', name: 'Search', description: 'Global search', category: 'navigation', shortcut: 'Ctrl+Shift+F' },
  { id: 'go_to_def', name: 'Go to Definition', description: 'Jump to definition', category: 'navigation', shortcut: 'F12' },
  { id: 'quick_open', name: 'Quick Open', description: 'Open file by name', category: 'navigation', shortcut: 'Ctrl+P' },

  // Quantum Operations
  { id: 'ccce_status', name: 'CCCE Status', description: 'Display CCCE metrics', category: 'quantum', api_endpoint: '/api/cockpit/ccce' },
  { id: 'tau_sweep', name: 'τ-Sweep', description: 'Execute tau-sweep analysis', category: 'quantum', api_endpoint: '/api/lab/run/submit' },
  { id: 'evolve', name: 'Evolve', description: 'Trigger organism evolution', category: 'quantum', api_endpoint: '/api/organism/evolve' },
  { id: 'heal', name: 'Phase Heal', description: 'Trigger phase-conjugate healing', category: 'quantum', api_endpoint: '/api/cockpit/orchestrate' },
  { id: 'sync_mesh', name: 'Sync Mesh', description: 'Synchronize 3-node mesh', category: 'quantum', api_endpoint: '/api/cockpit/swarm/evolve' },

  // Terminal Commands
  { id: 'run_tests', name: 'Run Tests', description: 'Execute test suite', category: 'terminal', command: 'npm test' },
  { id: 'build', name: 'Build', description: 'Run build command', category: 'terminal', command: 'npm run build' },
  { id: 'dev_server', name: 'Dev Server', description: 'Start development server', category: 'terminal', command: 'npm run dev' },
  { id: 'lint', name: 'Lint', description: 'Run linter', category: 'terminal', command: 'npm run lint' },

  // Agent Operations
  { id: 'aura_observe', name: 'AURA Observe', description: 'Trigger AURA observation', category: 'agent', agent_id: 'aura', api_endpoint: '/api/agents/aura/wrap' },
  { id: 'aiden_execute', name: 'AIDEN Execute', description: 'Trigger AIDEN execution', category: 'agent', agent_id: 'aiden', api_endpoint: '/api/agents/aiden/wrap' },
  { id: 'phoenix_heal', name: 'PHOENIX Heal', description: 'Trigger PHOENIX healing', category: 'agent', agent_id: 'phoenix', api_endpoint: '/api/agents/phoenix/wrap' },
  { id: 'scimitar_analyze', name: 'SCIMITAR Analyze', description: 'Trigger SCIMITAR analysis', category: 'agent', agent_id: 'scimitar', api_endpoint: '/api/agents/scimitar/wrap' },

  // Custom
  { id: 'gen_code', name: 'Generate Code', description: 'NLP to code generation', category: 'custom', api_endpoint: '/api/cockpit/chat' },
  { id: 'omega_max', name: 'Omega Max', description: 'Full system status', category: 'custom', command: 'omega-max' },
  { id: 'omega_dash', name: 'Omega Dashboard', description: 'Live CCCE dashboard', category: 'custom', command: 'omega-dash' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT PROFILES
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_PROFILES: ScimitarProfile[] = [
  {
    id: 'quantum_dev',
    name: 'Quantum Development',
    description: 'Optimized for DNA-Lang and quantum workflow',
    active: true,
    created_at: new Date().toISOString(),
    bindings: [
      { button: 1, action: AVAILABLE_ACTIONS.find(a => a.id === 'save')!, enabled: true },
      { button: 2, action: AVAILABLE_ACTIONS.find(a => a.id === 'run_tests')!, enabled: true },
      { button: 3, action: AVAILABLE_ACTIONS.find(a => a.id === 'commit')!, enabled: true },
      { button: 4, action: AVAILABLE_ACTIONS.find(a => a.id === 'format')!, enabled: true },
      { button: 5, action: AVAILABLE_ACTIONS.find(a => a.id === 'terminal')!, enabled: true },
      { button: 6, action: AVAILABLE_ACTIONS.find(a => a.id === 'next_error')!, enabled: true },
      { button: 7, action: AVAILABLE_ACTIONS.find(a => a.id === 'prev_error')!, enabled: true },
      { button: 8, action: AVAILABLE_ACTIONS.find(a => a.id === 'search')!, enabled: true },
      { button: 9, action: AVAILABLE_ACTIONS.find(a => a.id === 'gen_code')!, enabled: true },
      { button: 10, action: AVAILABLE_ACTIONS.find(a => a.id === 'sync_mesh')!, enabled: true },
      { button: 11, action: AVAILABLE_ACTIONS.find(a => a.id === 'ccce_status')!, enabled: true },
      { button: 12, action: AVAILABLE_ACTIONS.find(a => a.id === 'evolve')!, enabled: true },
    ]
  },
  {
    id: 'agent_control',
    name: 'Agent Control',
    description: 'Direct control of AURA|AIDEN agents',
    active: false,
    created_at: new Date().toISOString(),
    bindings: [
      { button: 1, action: AVAILABLE_ACTIONS.find(a => a.id === 'aura_observe')!, enabled: true },
      { button: 2, action: AVAILABLE_ACTIONS.find(a => a.id === 'aiden_execute')!, enabled: true },
      { button: 3, action: AVAILABLE_ACTIONS.find(a => a.id === 'phoenix_heal')!, enabled: true },
      { button: 4, action: AVAILABLE_ACTIONS.find(a => a.id === 'scimitar_analyze')!, enabled: true },
      { button: 5, action: AVAILABLE_ACTIONS.find(a => a.id === 'terminal')!, enabled: true },
      { button: 6, action: AVAILABLE_ACTIONS.find(a => a.id === 'ccce_status')!, enabled: true },
      { button: 7, action: AVAILABLE_ACTIONS.find(a => a.id === 'heal')!, enabled: true },
      { button: 8, action: AVAILABLE_ACTIONS.find(a => a.id === 'omega_max')!, enabled: true },
      { button: 9, action: AVAILABLE_ACTIONS.find(a => a.id === 'tau_sweep')!, enabled: true },
      { button: 10, action: AVAILABLE_ACTIONS.find(a => a.id === 'sync_mesh')!, enabled: true },
      { button: 11, action: AVAILABLE_ACTIONS.find(a => a.id === 'evolve')!, enabled: true },
      { button: 12, action: AVAILABLE_ACTIONS.find(a => a.id === 'omega_dash')!, enabled: true },
    ]
  },
  {
    id: 'redteam',
    name: 'Red Team Operations',
    description: 'Q-SLICE threat analysis workflow',
    active: false,
    created_at: new Date().toISOString(),
    bindings: [
      { button: 1, action: AVAILABLE_ACTIONS.find(a => a.id === 'save')!, enabled: true },
      { button: 2, action: AVAILABLE_ACTIONS.find(a => a.id === 'build')!, enabled: true },
      { button: 3, action: AVAILABLE_ACTIONS.find(a => a.id === 'scimitar_analyze')!, enabled: true },
      { button: 4, action: AVAILABLE_ACTIONS.find(a => a.id === 'search')!, enabled: true },
      { button: 5, action: AVAILABLE_ACTIONS.find(a => a.id === 'terminal')!, enabled: true },
      { button: 6, action: AVAILABLE_ACTIONS.find(a => a.id === 'next_error')!, enabled: true },
      { button: 7, action: AVAILABLE_ACTIONS.find(a => a.id === 'prev_error')!, enabled: true },
      { button: 8, action: AVAILABLE_ACTIONS.find(a => a.id === 'quick_open')!, enabled: true },
      { button: 9, action: AVAILABLE_ACTIONS.find(a => a.id === 'tau_sweep')!, enabled: true },
      { button: 10, action: AVAILABLE_ACTIONS.find(a => a.id === 'ccce_status')!, enabled: true },
      { button: 11, action: AVAILABLE_ACTIONS.find(a => a.id === 'heal')!, enabled: true },
      { button: 12, action: AVAILABLE_ACTIONS.find(a => a.id === 'omega_max')!, enabled: true },
    ]
  }
]

// In-memory storage (would be persisted in production)
let profiles = [...DEFAULT_PROFILES]

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/scimitar - Get configuration
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'actions') {
    // Return available actions
    return NextResponse.json({
      success: true,
      actions: AVAILABLE_ACTIONS,
      categories: ['file', 'navigation', 'quantum', 'terminal', 'agent', 'custom']
    })
  }

  if (action === 'profiles') {
    // Return all profiles
    return NextResponse.json({
      success: true,
      profiles,
      active_profile: profiles.find(p => p.active)?.id || null
    })
  }

  // Default: return full status
  const activeProfile = profiles.find(p => p.active)

  return NextResponse.json({
    success: true,
    device: {
      name: 'Corsair Scimitar Elite',
      buttons: 12,
      connected: true, // Would check actual USB connection
      firmware: '1.0.0'
    },
    active_profile: activeProfile || null,
    profiles_count: profiles.length,
    button_layout: `
┌─────────────────┐
│  1   2   3   4  │  Row 1: ${activeProfile?.bindings.slice(0, 4).map(b => b.action.name).join(' | ')}
│  5   6   7   8  │  Row 2: ${activeProfile?.bindings.slice(4, 8).map(b => b.action.name).join(' | ')}
│  9  10  11  12  │  Row 3: ${activeProfile?.bindings.slice(8, 12).map(b => b.action.name).join(' | ')}
└─────────────────┘
    `.trim(),
    spec_lock: {
      version: '2.2.0',
      cage: '9HUP5'
    }
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/scimitar - Execute action or update config
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, button, profile_id, binding } = body

    // Execute button action
    if (action === 'execute' && typeof button === 'number') {
      const activeProfile = profiles.find(p => p.active)
      if (!activeProfile) {
        return NextResponse.json({ success: false, error: 'No active profile' }, { status: 400 })
      }

      const buttonBinding = activeProfile.bindings.find(b => b.button === button)
      if (!buttonBinding || !buttonBinding.enabled) {
        return NextResponse.json({ success: false, error: `Button ${button} not bound or disabled` }, { status: 400 })
      }

      const buttonAction = buttonBinding.action

      // Return the action to execute (client-side will handle actual execution)
      return NextResponse.json({
        success: true,
        executed: {
          button,
          action: buttonAction,
          timestamp: new Date().toISOString()
        },
        instruction: buttonAction.api_endpoint
          ? { type: 'api', endpoint: buttonAction.api_endpoint }
          : buttonAction.command
            ? { type: 'command', command: buttonAction.command }
            : buttonAction.shortcut
              ? { type: 'shortcut', keys: buttonAction.shortcut }
              : { type: 'unknown' }
      })
    }

    // Switch active profile
    if (action === 'switch_profile' && profile_id) {
      profiles = profiles.map(p => ({
        ...p,
        active: p.id === profile_id
      }))

      const newActive = profiles.find(p => p.active)
      return NextResponse.json({
        success: true,
        active_profile: newActive?.id,
        message: `Switched to profile: ${newActive?.name}`
      })
    }

    // Update button binding
    if (action === 'bind' && typeof button === 'number' && binding) {
      const activeProfile = profiles.find(p => p.active)
      if (!activeProfile) {
        return NextResponse.json({ success: false, error: 'No active profile' }, { status: 400 })
      }

      const actionToBind = AVAILABLE_ACTIONS.find(a => a.id === binding.action_id)
      if (!actionToBind) {
        return NextResponse.json({ success: false, error: `Action '${binding.action_id}' not found` }, { status: 400 })
      }

      const bindingIndex = activeProfile.bindings.findIndex(b => b.button === button)
      if (bindingIndex >= 0) {
        activeProfile.bindings[bindingIndex] = {
          button,
          action: actionToBind,
          enabled: binding.enabled !== false
        }
      } else {
        activeProfile.bindings.push({
          button,
          action: actionToBind,
          enabled: binding.enabled !== false
        })
      }

      return NextResponse.json({
        success: true,
        message: `Button ${button} bound to ${actionToBind.name}`,
        binding: activeProfile.bindings.find(b => b.button === button)
      })
    }

    // Auto-configure optimal bindings
    if (action === 'auto_configure') {
      const quantum_dev = DEFAULT_PROFILES.find(p => p.id === 'quantum_dev')
      if (quantum_dev) {
        profiles = profiles.map(p => p.id === 'quantum_dev' ? { ...quantum_dev, active: true } : { ...p, active: false })
      }

      return NextResponse.json({
        success: true,
        message: 'Auto-configured with Quantum Development profile',
        profile: profiles.find(p => p.active)
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
