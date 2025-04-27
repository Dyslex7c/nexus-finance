import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

interface PerformanceData {
  date: string
  value: number
  benchmark: number
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
    const timeframe = searchParams.get("timeframe") || "1y"

    // Generate mock data based on timeframe
    const mockData: PerformanceData[] = []
    const now = new Date()
    const numPoints = timeframe === "1m" ? 30 : timeframe === "3m" ? 90 : timeframe === "6m" ? 180 : 365

    let portfolioValue = 10000
    let benchmarkValue = 10000

    for (let i = 0; i < numPoints; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - (numPoints - i))

      // Random daily change between -2% and +2%
      const portfolioChange = 1 + (Math.random() * 0.04 - 0.02)
      const benchmarkChange = 1 + (Math.random() * 0.03 - 0.015)

      portfolioValue *= portfolioChange
      benchmarkValue *= benchmarkChange

      mockData.push({
        date: date.toISOString().split("T")[0],
        value: Math.round(portfolioValue),
        benchmark: Math.round(benchmarkValue),
      })
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching investment performance:", error)
    return NextResponse.json({ error: "Failed to fetch investment performance" }, { status: 500 })
  }
}
