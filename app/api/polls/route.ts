import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (will be replaced with database)
const polls: any[] = []

export async function GET() {
  try {
    return NextResponse.json({ polls }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch polls" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, options } = await request.json()
    const userId = request.cookies.get("user_id")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!title || !options || options.length < 2) {
      return NextResponse.json({ error: "Invalid poll data" }, { status: 400 })
    }

    const newPoll = {
      id: "poll_" + Date.now(),
      title,
      description,
      options: options.map((text: string, idx: number) => ({
        id: "opt_" + idx,
        text,
        votes: 0,
      })),
      totalVotes: 0,
      active: true,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    }

    polls.push(newPoll)

    return NextResponse.json({ poll: newPoll }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create poll" }, { status: 500 })
  }
}
