import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real application, you would calculate this from actual wallet data
    // For now, we'll return mock data
    const mockBalance = {
      totalBalance: 21531.22,
      monthlyChange: 1250.8,
      monthlyChangePercent: 6.2,
    }

    return NextResponse.json(mockBalance)
  } catch (error) {
    console.error("Error fetching wallet balance:", error)
    return NextResponse.json({ error: "Failed to fetch wallet balance" }, { status: 500 })
  }
}
