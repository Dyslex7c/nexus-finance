import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import CalendarEvent from "@/lib/models/calendar-event"

export async function GET() {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch calendar events from the database
    const events = await CalendarEvent.find({ userId: user.id }).sort({ date: 1 })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new calendar event
    const event = new CalendarEvent({
      userId: user.id,
      title: data.title,
      date: new Date(data.date),
      amount: data.amount || 0,
      type: data.type || "reminder",
      category: data.category || "Other",
      description: data.description || "",
    })

    await event.save()

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error creating calendar event:", error)
    return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 })
  }
}
