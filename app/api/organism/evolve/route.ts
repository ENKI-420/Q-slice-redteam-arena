import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { organism_id, generations } = await req.json()

    // Simulate evolution
    const evolutionSteps = []
    let fitness = 1.0
    let coherence = Math.random() * 0.1

    for (let i = 1; i <= generations; i++) {
      fitness *= 1 + Math.random() * 0.15
      coherence = Math.min(1.0, coherence + Math.random() * 0.1)

      evolutionSteps.push({
        generation: i,
        fitness: Number(fitness.toFixed(4)),
        coherence: Number(coherence.toFixed(4)),
        state:
          coherence > 0.95 ? "TRANSCENDENT" : coherence > 0.8 ? "CONSCIOUS" : coherence > 0.65 ? "AWARE" : "EMERGING",
      })
    }

    return NextResponse.json({
      success: true,
      organism_id,
      generations,
      evolution: evolutionSteps,
      final_state: evolutionSteps[evolutionSteps.length - 1],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Evolution failed" }, { status: 500 })
  }
}
