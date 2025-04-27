import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import SupportTicket from "@/lib/models/support-ticket"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const tickets = await SupportTicket.find({ userId: user.id }).sort({ createdAt: -1 })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error fetching support tickets:", error)
    return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    await connectToDatabase()

    const ticket = await SupportTicket.create({
      userId: user.id,
      subject: data.subject,
      message: data.message,
      category: data.category,
      priority: data.priority || "medium",
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error("Error creating support ticket:", error)
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 })
  }
}
