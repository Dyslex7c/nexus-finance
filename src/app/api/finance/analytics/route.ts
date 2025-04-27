import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Income } from "@/lib/models/income"
import { Expense } from "@/lib/models/expense"
import { Transaction } from "@/lib/models/transaction"
import { SavingsGoal } from "@/lib/models/savings-goal"
import { Budget } from "@/lib/models/budget"
import { requireAuth } from "@/lib/auth"

// GET /api/finance/analytics - Get comprehensive analytics data
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "6months" // "3months", "6months", "12months"

    // Calculate date ranges based on period
    const now = new Date()
    let startDate: Date
    let monthsToInclude: number

    switch (period) {
      case "3months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        monthsToInclude = 3
        break
      case "6months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        monthsToInclude = 6
        break
      case "12months":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1)
        monthsToInclude = 12
        break
    }

    // Generate array of months for the period
    const months = []
    for (let i = 0; i < monthsToInclude; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.unshift({
        month: monthDate.toLocaleString("default", { month: "short" }),
        year: monthDate.getFullYear(),
        monthNum: monthDate.getMonth(),
        startDate: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
        endDate: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59),
      })
    }

    // 1. Spending Trends - Daily spending for the selected period
    const spendingTrendsData = await Transaction.aggregate([
      {
        $match: {
          userId: user.id,
          type: "expense",
          date: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          date: "$_id",
          amount: 1,
          _id: 0,
        },
      },
      {
        $sort: { date: 1 },
      },
    ])

    // 2. Income vs Expense by Month
    const incomeByMonth = await Promise.all(
      months.map(async ({ startDate, endDate, month, year }) => {
        const result = await Income.aggregate([
          {
            $match: {
              userId: user.id,
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ])

        return {
          month: `${month} ${year}`,
          income: result.length > 0 ? result[0].total : 0,
        }
      }),
    )

    const expenseByMonth = await Promise.all(
      months.map(async ({ startDate, endDate, month, year }) => {
        const result = await Expense.aggregate([
          {
            $match: {
              userId: user.id,
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ])

        return {
          month: `${month} ${year}`,
          expense: result.length > 0 ? result[0].total : 0,
        }
      }),
    )

    // Combine income and expense data
    const incomeVsExpense = months.map((monthData, index) => {
      return {
        month: monthData.month,
        income: incomeByMonth[index].income,
        expense: expenseByMonth[index].expense,
        savings: incomeByMonth[index].income - expenseByMonth[index].expense,
      }
    })

    // 3. Savings Growth Over Time
    const savingsGrowth = []
    let cumulativeSavings = 0

    for (let i = 0; i < incomeVsExpense.length; i++) {
      cumulativeSavings += incomeVsExpense[i].savings
      savingsGrowth.push({
        month: incomeVsExpense[i].month,
        savings: cumulativeSavings,
      })
    }

    // 4. Category Comparison - Expenses by category for the period
    const categoryComparison = await Expense.aggregate([
      {
        $match: {
          userId: user.id,
          date: { $gte: startDate, $lte: now },
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
      {
        $sort: { amount: -1 },
      },
    ])

    // 5. Financial Summary
    // Total Income for the period
    const totalIncomeResult = await Income.aggregate([
      {
        $match: {
          userId: user.id,
          date: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])

    // Total Expenses for the period
    const totalExpensesResult = await Expense.aggregate([
      {
        $match: {
          userId: user.id,
          date: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])

    // Average Monthly Savings
    const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0
    const totalExpenses = totalExpensesResult.length > 0 ? totalExpensesResult[0].total : 0
    const totalSavings = totalIncome - totalExpenses
    const avgMonthlySavings = totalSavings / monthsToInclude

    // Savings Goal Progress
    const savingsGoals = await SavingsGoal.find({ userId: user.id })
    const totalSavingsGoalAmount = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    const totalSavingsGoalProgress = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    const savingsGoalPercentage =
      totalSavingsGoalAmount > 0 ? (totalSavingsGoalProgress / totalSavingsGoalAmount) * 100 : 0

    // Budget Utilization
    const budgets = await Budget.find({ userId: user.id })
    const totalBudgetAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0)
    const budgetUtilization = totalBudgetAmount > 0 ? (totalExpenses / totalBudgetAmount) * 100 : 0

    // Prepare the financial summary
    const financialSummary = {
      totalIncome,
      totalExpenses,
      totalSavings,
      avgMonthlySavings,
      savingsGoalPercentage,
      budgetUtilization,
    }

    return NextResponse.json({
      period,
      spendingTrends: spendingTrendsData,
      incomeVsExpense,
      savingsGrowth,
      categoryComparison,
      financialSummary,
    })
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
