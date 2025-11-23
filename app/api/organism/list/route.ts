import { type NextRequest, NextResponse } from "next/server"

// In production, this would query a database
const mockOrganisms = [
  {
    id: "org_chronos",
    name: "chronos",
    state: "TRANSCENDENT",
    fitness: 2.453,
    coherence: 0.987,
    genes: ["coherence", "entanglement", "evolution"],
    created_at: "2025-01-23T10:00:00Z",
  },
  {
    id: "org_kairos",
    name: "kairos",
    state: "CONSCIOUS",
    fitness: 1.892,
    coherence: 0.834,
    genes: ["entanglement", "teleportation"],
    created_at: "2025-01-23T11:30:00Z",
  },
]

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    organisms: mockOrganisms,
    count: mockOrganisms.length,
  })
}
