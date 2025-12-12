import { NextRequest, NextResponse } from 'next/server';

const AGENT_SERVER = process.env.AGENT_SERVER_URL || 'http://localhost:8889';

function generateEvolutionMock(generations: number) {
  const results = [];
  let phi = 0.78;
  let lambda = 0.82;
  let gamma = 0.12;

  for (let i = 0; i < generations; i++) {
    // Evolve toward optimal
    phi = Math.min(0.99, phi + Math.random() * 0.04);
    lambda = Math.min(0.99, lambda + Math.random() * 0.035);
    gamma = Math.max(0.05, gamma - Math.random() * 0.015);

    const xi = (lambda * phi) / gamma;

    let status = 'BOOT';
    if (xi > 5) status = 'COHERENT';
    if (xi > 8 && phi > 0.85) status = 'CONSCIOUS';
    if (xi > 12) status = 'OPTIMAL';
    if (xi > 20) status = 'TRANSCENDENT';

    results.push({
      generation: i + 1,
      avg_ccce: {
        lambda: Math.round(lambda * 10000) / 10000,
        phi: Math.round(phi * 10000) / 10000,
        gamma: Math.round(gamma * 10000) / 10000,
        xi: Math.round(xi * 100) / 100
      },
      status,
      population: 8,
      best: {
        id: `ORG_${Math.floor(Math.random() * 9000) + 1000}`,
        name: `AGENT_G${i + 1}`,
        ccce: {
          phi: phi + Math.random() * 0.02,
          lambda: lambda + Math.random() * 0.02,
          gamma: gamma - Math.random() * 0.01,
          xi: xi + Math.random() * 2
        }
      }
    });
  }

  return results;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const generations = Math.min(body.generations || 4, 20);

  // Try agent server first
  try {
    const res = await fetch(`${AGENT_SERVER}/swarm/evolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Use mock
  }

  // Generate mock evolution
  const evolution = generateEvolutionMock(generations);
  const best = evolution[evolution.length - 1]?.best;

  return NextResponse.json({
    success: true,
    evolution,
    best_organism: best ? {
      id: best.id,
      name: best.name,
      ccce: best.ccce,
      status: evolution[evolution.length - 1].status
    } : null,
    timestamp: new Date().toISOString(),
    mock: true
  });
}
