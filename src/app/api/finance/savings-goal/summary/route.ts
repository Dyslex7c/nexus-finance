import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { SavingsGoal } from "@/lib/models/savings-goal"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all active savings goals
    const goals = await SavingsGoal.find({
      userId: user.id,
    }).sort({ targetDate: 1 })

    // Calculate summary data
    const totalGoals = goals.length
    const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)

    // Find the nearest goal (by target date)
    let nearestGoal = null
    if (goals.length > 0) {
      const today = new Date()

      // Filter goals with future target dates
      const futureGoals = goals.filter((goal) => new Date(goal.targetDate) > today)

      if (futureGoals.length > 0) {
        const nearest = futureGoals[0] // Already sorted by target date
        const targetDate = new Date(nearest.targetDate)
        const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const percentComplete = Math.min(Math.round((nearest.currentAmount / nearest.targetAmount) * 100), 100)

        nearestGoal = {
          name: nearest.name,
          daysLeft: daysLeft > 0 ? daysLeft : 0,
          percentComplete,
        }
      }
    }

    return NextResponse.json({
      totalGoals,
      totalSaved,
      totalTarget,
      nearestGoal,
    })
  } catch (error) {
    console.error("Error fetching savings goals summary:", error)
    return NextResponse.json({ error: "Failed to fetch savings goals summary" }, { status: 500 })
  }
}
