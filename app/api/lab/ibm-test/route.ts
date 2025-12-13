/**
 * IBM Quantum API Diagnostic Endpoint
 * Tests connectivity and authentication
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.IBM_QUANTUM_TOKEN || ''
  const tokenPreview = token ? `${token.slice(0, 8)}...${token.slice(-4)}` : 'NOT_SET'

  const results: Record<string, unknown> = {
    token_configured: !!token,
    token_length: token.length,
    token_preview: tokenPreview,
    tests: {}
  }

  // Test 1: IBM Auth endpoint
  try {
    const authResp = await fetch('https://auth.quantum-computing.ibm.com/api/users/loginWithToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiToken: token })
    })
    const authText = await authResp.text()
    results.tests = {
      ...results.tests as object,
      ibm_auth: {
        status: authResp.status,
        ok: authResp.ok,
        response: authText.slice(0, 500)
      }
    }
  } catch (e) {
    results.tests = {
      ...results.tests as object,
      ibm_auth: {
        error: e instanceof Error ? e.message : 'Unknown',
        type: 'fetch_failed'
      }
    }
  }

  // Test 2: IBM Runtime API (direct)
  try {
    const runtimeResp = await fetch('https://api.quantum-computing.ibm.com/runtime/programs', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    const runtimeText = await runtimeResp.text()
    results.tests = {
      ...results.tests as object,
      ibm_runtime_direct: {
        status: runtimeResp.status,
        ok: runtimeResp.ok,
        response: runtimeText.slice(0, 500)
      }
    }
  } catch (e) {
    results.tests = {
      ...results.tests as object,
      ibm_runtime_direct: {
        error: e instanceof Error ? e.message : 'Unknown',
        type: 'fetch_failed'
      }
    }
  }

  // Test 3: Generic HTTPS to verify Vercel can make external calls
  try {
    const httpResp = await fetch('https://httpbin.org/get', {
      headers: { 'Accept': 'application/json' }
    })
    results.tests = {
      ...results.tests as object,
      httpbin: {
        status: httpResp.status,
        ok: httpResp.ok
      }
    }
  } catch (e) {
    results.tests = {
      ...results.tests as object,
      httpbin: {
        error: e instanceof Error ? e.message : 'Unknown'
      }
    }
  }

  return NextResponse.json(results)
}
