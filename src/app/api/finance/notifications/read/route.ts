import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import Notification from "@/lib/models/notification"

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.id) {
      // Mark all as read
      await Notification.updateMany({ userId: user.id, read: false }, { $set: { read: true } })

      return NextResponse.json({ success: true, message: "All notifications marked as read" })
    } else {
      // Mark specific notification as read
      const notification = await Notification.findOneAndUpdate(
        { _id: data.id, userId: user.id },
        { $set: { read: true } },
        { new: true },
      )

      if (!notification) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 })
      }

      return NextResponse.json(notification)
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}
