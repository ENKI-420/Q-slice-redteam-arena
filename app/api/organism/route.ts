import { NextRequest, NextResponse } from 'next/server';

/**
 * P1: /api/organism alias route
 * Redirects to /api/organisms for backwards compatibility
 * Part of Ω_PATCHSET_v1
 */

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const redirectUrl = url.href.replace('/api/organism', '/api/organisms');

  return NextResponse.redirect(redirectUrl, { status: 307 });
}

export async function POST(request: NextRequest) {
  // Forward POST to /api/organism/create
  const body = await request.json();

  const createUrl = new URL('/api/organism/create', request.url);

  return NextResponse.redirect(createUrl.href, {
    status: 307,
  });
}

// Documentation endpoint
export async function OPTIONS() {
  return NextResponse.json({
    endpoint: '/api/organism',
    type: 'ALIAS',
    redirects_to: '/api/organisms',
    note: 'Use /api/organisms directly for new integrations',
    patch: 'Ω_PATCHSET_v1.P1',
  });
}
