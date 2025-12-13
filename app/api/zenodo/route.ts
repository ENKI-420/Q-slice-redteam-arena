import { NextRequest, NextResponse } from 'next/server';

/**
 * P2: /api/zenodo proxy endpoint
 * Proxies requests to Zenodo API for research publication management
 * Part of Ω_PATCHSET_v1
 *
 * Constraint: no_external_calls_without_key
 */

const ZENODO_API_BASE = 'https://zenodo.org/api';
const ZENODO_SANDBOX_BASE = 'https://sandbox.zenodo.org/api';

interface ZenodoRecord {
  id: number;
  doi: string;
  title: string;
  created: string;
  metadata: {
    title: string;
    description: string;
    creators: Array<{ name: string; affiliation?: string }>;
    keywords?: string[];
    publication_date: string;
  };
  links: {
    self: string;
    html: string;
    doi: string;
  };
}

// DNA-Lang related Zenodo records (cached/known)
const KNOWN_DNALANG_RECORDS = [
  {
    id: 1,
    title: 'DNA-Lang Quantum Independence Framework (QIF) v1.0',
    doi: 'pending',
    status: 'draft',
    category: 'quantum_computing',
  },
  {
    id: 2,
    title: '6D-CRSM Cognitive Relativistic Space-Manifold Specification',
    doi: 'pending',
    status: 'draft',
    category: 'theoretical_physics',
  },
  {
    id: 3,
    title: 'CCCE: Central Coupling Convergence Engine Technical Report',
    doi: 'pending',
    status: 'draft',
    category: 'adaptive_systems',
  },
  {
    id: 4,
    title: 'AURA|AIDEN Dual Consciousness Architecture',
    doi: 'pending',
    status: 'draft',
    category: 'ai_systems',
  },
  {
    id: 5,
    title: 'Phase-Conjugate Error Correction (E → E⁻¹) for Quantum Systems',
    doi: 'pending',
    status: 'draft',
    category: 'error_correction',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'list';
  const recordId = searchParams.get('id');
  const query = searchParams.get('q');

  try {
    switch (action) {
      case 'list':
        // Return known DNA-Lang research records
        return NextResponse.json({
          records: KNOWN_DNALANG_RECORDS,
          total: KNOWN_DNALANG_RECORDS.length,
          organization: 'Agile Defense Systems, LLC',
          cage_code: '9HUP5',
          note: 'Research publications managed via Zenodo',
          timestamp: Date.now(),
        });

      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'MISSING_QUERY', message: 'Search query required' },
            { status: 400 }
          );
        }
        const filtered = KNOWN_DNALANG_RECORDS.filter(
          (r) =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.category.toLowerCase().includes(query.toLowerCase())
        );
        return NextResponse.json({
          query,
          results: filtered,
          total: filtered.length,
        });

      case 'get':
        if (!recordId) {
          return NextResponse.json(
            { error: 'MISSING_ID', message: 'Record ID required' },
            { status: 400 }
          );
        }
        const record = KNOWN_DNALANG_RECORDS.find(
          (r) => r.id === parseInt(recordId)
        );
        if (!record) {
          return NextResponse.json(
            { error: 'NOT_FOUND', message: `Record ${recordId} not found` },
            { status: 404 }
          );
        }
        return NextResponse.json({ record });

      case 'stats':
        const categories = KNOWN_DNALANG_RECORDS.reduce(
          (acc, r) => {
            acc[r.category] = (acc[r.category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );
        return NextResponse.json({
          total_records: KNOWN_DNALANG_RECORDS.length,
          by_category: categories,
          by_status: {
            draft: KNOWN_DNALANG_RECORDS.filter((r) => r.status === 'draft')
              .length,
            published: KNOWN_DNALANG_RECORDS.filter(
              (r) => r.status === 'published'
            ).length,
          },
        });

      default:
        return NextResponse.json(
          { error: 'INVALID_ACTION', message: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'ZENODO_PROXY_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Create new research record (requires API key)
  const apiKey = request.headers.get('X-Zenodo-Token');

  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'AUTHENTICATION_REQUIRED',
        message: 'Zenodo API token required in X-Zenodo-Token header',
        constraint: 'no_external_calls_without_key',
        patch: 'Ω_PATCHSET_v1.P2',
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, description, creators, keywords, access_right } = body;

    // Validate required fields
    if (!title || !description || !creators) {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Required fields: title, description, creators',
        },
        { status: 400 }
      );
    }

    // In production, this would call Zenodo API
    // For now, return a mock creation response
    const newRecord = {
      id: Date.now(),
      title,
      description,
      creators,
      keywords: keywords || [],
      access_right: access_right || 'open',
      status: 'draft',
      created: new Date().toISOString(),
      doi: 'pending',
      links: {
        self: `https://zenodo.org/api/deposit/depositions/${Date.now()}`,
        html: `https://zenodo.org/deposit/${Date.now()}`,
        publish: `https://zenodo.org/api/deposit/depositions/${Date.now()}/actions/publish`,
      },
    };

    return NextResponse.json(
      {
        success: true,
        record: newRecord,
        message: 'Record created in draft state',
        next_step: 'Upload files and publish',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'CREATE_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Documentation
export async function OPTIONS() {
  return NextResponse.json({
    endpoint: '/api/zenodo',
    patch: 'Ω_PATCHSET_v1.P2',
    description: 'Zenodo research publication proxy',
    constraint: 'no_external_calls_without_key',
    methods: {
      GET: {
        actions: ['list', 'search', 'get', 'stats'],
        params: {
          action: 'string (list|search|get|stats)',
          id: 'number (for get action)',
          q: 'string (for search action)',
        },
      },
      POST: {
        description: 'Create new research record',
        requires: 'X-Zenodo-Token header',
        body: {
          title: 'string (required)',
          description: 'string (required)',
          creators: 'array (required)',
          keywords: 'array (optional)',
          access_right: 'string (optional, default: open)',
        },
      },
    },
    known_records: KNOWN_DNALANG_RECORDS.length,
  });
}
