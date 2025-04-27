import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import Notification from "@/lib/models/notification"

export async function GET() {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch notifications from the database
    const notifications = await Notification.find({ userId: user.id }).sort({ createdAt: -1 }).limit(20)

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
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
    if (!data.title || !data.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new notification
    const notification = new Notification({
      userId: user.id,
      title: data.title,
      message: data.message,
      type: data.type || "system",
      read: false,
      date: new Date(),
    })

    await notification.save()

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
