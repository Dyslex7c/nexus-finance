import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import Investment from "@/lib/models/investment"

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

    // Fetch investments for the user
    const investments = await Investment.find({ userId: user.id })

    if (!investments || investments.length === 0) {
      return NextResponse.json([])
    }

    // Generate dates based on timeframe
    const now = new Date()
    let startDate: Date
    let interval = 1 // Days between data points
    let benchmarkGrowthMultiplier = 1.0001 // Default daily benchmark growth multiplier

    // Configure timeframe parameters
    switch (timeframe.toLowerCase()) {
      case "1w":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        interval = 1
        benchmarkGrowthMultiplier = 1.0001 // 0.01% daily for benchmark
        break
      case "1m":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        interval = 1
        benchmarkGrowthMultiplier = 1.0003 // 0.03% daily for benchmark
        break
      case "3m":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        interval = 3
        benchmarkGrowthMultiplier = 1.0003 // 0.03% daily for benchmark
        break
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        interval = 7
        benchmarkGrowthMultiplier = 1.0003 // 0.03% daily for benchmark
        break
      case "all":
        // Find earliest purchase date among all investments
        const earliestDate = investments.reduce((earliest, inv) => {
          return inv.purchaseDate < earliest ? inv.purchaseDate : earliest
        }, new Date())
        startDate = earliestDate
        interval = Math.max(7, Math.ceil((now.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000)))
        benchmarkGrowthMultiplier = 1.0003 // 0.03% daily for benchmark
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        interval = 1
    }

    // Calculate current total value of investments
    const currentTotalValue = investments.reduce((sum, inv) => {
      return sum + inv.amount * inv.currentValue
    }, 0)

    // Generate performance data from startDate to now
    const performanceData: PerformanceData[] = []
    const dates: Date[] = []

    // Generate array of dates for the performance chart
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + interval)) {
      dates.push(new Date(d))
    }

    // Make sure the last date is today
    if (dates[dates.length - 1].getDate() !== now.getDate()) {
      dates.push(new Date(now))
    }

    // Calculate portfolio value and benchmark for each date
    let benchmarkValue = currentTotalValue * 0.9 // Start benchmark at 90% of current value

    dates.forEach((date, index) => {
      // For simplicity, we'll approximate historical values
      // In a real app, you would use actual historical data

      // Calculate portfolio value - simple approximation based on purchase dates
      let portfolioValue = 0
      investments.forEach((inv) => {
        if (inv.purchaseDate <= date) {
          // If the investment was purchased before this date
          // Calculate approximate value based on time between purchase and current
          const totalDays = (now.getTime() - inv.purchaseDate.getTime()) / (24 * 60 * 60 * 1000)
          const daysSinceDate = (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)

          // Simple linear interpolation between purchase value and current value
          // In a real app, you'd use actual historical prices
          const purchaseValue =
            inv.amount * (inv.currentValue / (1 + (inv.currentValue - inv.currentValue) / inv.currentValue))
          const currentValue = inv.amount * inv.currentValue

          if (totalDays === 0) {
            portfolioValue += currentValue
          } else {
            // Linear interpolation
            portfolioValue += purchaseValue + (currentValue - purchaseValue) * (1 - daysSinceDate / totalDays)
          }
        }
      })

      // Increase benchmark value by the growth multiplier for each day
      if (index > 0) {
        const daysDiff = Math.floor((date.getTime() - dates[index - 1].getTime()) / (24 * 60 * 60 * 1000))
        benchmarkValue *= Math.pow(benchmarkGrowthMultiplier, daysDiff)
      }

      performanceData.push({
        date: date.toISOString().split("T")[0],
        value: Math.round(portfolioValue),
        benchmark: Math.round(benchmarkValue),
      })
    })

    return NextResponse.json(performanceData)
  } catch (error) {
    console.error("Error calculating investment performance:", error)
    return NextResponse.json({ error: "Failed to calculate investment performance" }, { status: 500 })
  }
}
