import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Income } from "@/lib/models/income"
import { Expense } from "@/lib/models/expense"
import { requireAuth } from "@/lib/auth"

// GET /api/finance/summary - Get financial summary for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month" // "month", "year", "all"

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case "all":
      default:
        startDate = new Date(0) // Beginning of time
        break
    }

    // Get total income for the period
    const incomeResult = await Income.aggregate([
      {
        $match: {
          userId: user.id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])

    // Get total expenses for the period
    const expenseResult = await Expense.aggregate([
      {
        $match: {
          userId: user.id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])

    // Get expenses by category
    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          userId: user.id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          amount: "$total",
          _id: 0,
        },
      },
    ])

    // Get income by source
    const incomeBySource = await Income.aggregate([
      {
        $match: {
          userId: user.id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$source",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          source: "$_id",
          amount: "$total",
          _id: 0,
        },
      },
    ])

    // Calculate totals and savings
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0
    const totalExpenses = expenseResult.length > 0 ? expenseResult[0].total : 0
    const savings = totalIncome - totalExpenses

    return NextResponse.json({
      period,
      totalIncome,
      totalExpenses,
      savings,
      expensesByCategory,
      incomeBySource,
    })
  } catch (error) {
    console.error("Error fetching financial summary:", error)
    return NextResponse.json({ error: "Failed to fetch financial summary" }, { status: 500 })
  }
}

