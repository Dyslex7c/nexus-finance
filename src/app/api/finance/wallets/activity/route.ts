import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

interface ActivityData {
  date: string
  balance: number
}

export async function GET(request: Request) {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get timeframe from query parameters
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "1m"

    // Generate mock data based on timeframe
    const mockData: ActivityData[] = []
    const now = new Date()
    const numPoints = timeframe === "1m" ? 30 : timeframe === "3m" ? 90 : timeframe === "6m" ? 180 : 365

    let balance = 20000

    for (let i = 0; i < numPoints; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - (numPoints - i))

      // Random daily change between -1% and +1%
      const change = 1 + (Math.random() * 0.02 - 0.01)
      balance *= change

      mockData.push({
        date: date.toISOString().split("T")[0],
        balance: Math.round(balance),
      })
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching wallet activity:", error)
    return NextResponse.json({ error: "Failed to fetch wallet activity" }, { status: 500 })
  }
}
