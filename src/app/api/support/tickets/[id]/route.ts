import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import SupportTicket from "@/lib/models/support-ticket"
import { getAuthUser } from "@/lib/auth"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: NextRequest, props: Props) {
  try {
    const params = await props.params
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const ticket = await SupportTicket.findOne({ _id: params.id, userId: user.id })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error fetching support ticket:", error)
    return NextResponse.json({ error: "Failed to fetch support ticket" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, props: Props) {
  try {
    const params = await props.params
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    await connectToDatabase()

    // Only allow adding responses or changing status
    const updateData: any = {}

    if (data.status) {
      updateData.status = data.status
    }

    if (data.message) {
      updateData.$push = {
        responses: {
          message: data.message,
          isStaff: false,
          createdAt: new Date(),
        },
      }
    }

    const ticket = await SupportTicket.findOneAndUpdate({ _id: params.id, userId: user.id }, updateData, { new: true })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error updating support ticket:", error)
    return NextResponse.json({ error: "Failed to update support ticket" }, { status: 500 })
  }
}