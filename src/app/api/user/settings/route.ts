import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import UserSettings from "@/lib/models/user-settings"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    let settings = await UserSettings.findOne({ userId: user.id })

    if (!settings) {
      // Create default settings if none exist
      settings = await UserSettings.create({
        userId: user.id,
        theme: "dark",
        currency: "USD",
        language: "en",
        notificationPreferences: {
          email: true,
          push: true,
          budgetAlerts: true,
          goalAlerts: true,
          billReminders: true,
          weeklyReports: true,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ error: "Failed to fetch user settings" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    await connectToDatabase()

    const settings = await UserSettings.findOneAndUpdate(
      { userId: user.id },
      { $set: data },
      { new: true, upsert: true },
    )

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 })
  }
}
