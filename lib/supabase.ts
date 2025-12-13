/**
 * Supabase Client for Q-SLICE Threatlab Arena
 * ============================================
 * Multi-user platform with admin roles for:
 * - Devin Davis <research@dnalang.dev>
 * - Jeremy Green <jeremy.cyber@outlook.com>
 *
 * CAGE: 9HUP5 | Agile Defense Systems, LLC
 */

import { createClient } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side Supabase client (service role key)
export function createServerSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const ADMIN_EMAILS = [
  'research@dnalang.dev',      // Devin Davis
  'jeremy.cyber@outlook.com'   // Jeremy Green
]

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type UserRole = 'admin' | 'researcher' | 'operator' | 'viewer'

export interface QSliceUser {
  id: string
  email: string
  role: UserRole
  display_name?: string
  organization?: string
  device_fingerprint?: string
  quantum_entanglement_hash?: string
  created_at: string
  last_login?: string
  ccce_metrics?: {
    phi: number
    lambda: number
    gamma: number
    xi: number
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getCurrentUser(): Promise<QSliceUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get extended profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email || '',
    role: isAdmin(user.email) ? 'admin' : (profile?.role || 'viewer'),
    display_name: profile?.display_name || user.user_metadata?.full_name,
    organization: profile?.organization,
    device_fingerprint: profile?.device_fingerprint,
    quantum_entanglement_hash: profile?.quantum_entanglement_hash,
    created_at: user.created_at,
    last_login: profile?.last_login,
    ccce_metrics: profile?.ccce_metrics
  }
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string, metadata?: Record<string, unknown>) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAGIC LINK AUTH (Passwordless)
// ═══════════════════════════════════════════════════════════════════════════════

export async function signInWithMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export async function getSession() {
  return supabase.auth.getSession()
}

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return supabase.auth.onAuthStateChange(callback as any)
}
