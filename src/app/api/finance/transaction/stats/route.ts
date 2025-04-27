import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { Transaction } from "@/lib/models/transaction"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get transactions for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const transactions = await Transaction.find({
      userId: user.id,
      date: { $gte: thirtyDaysAgo },
    })

    // Calculate stats
    const totalTransactions = transactions.length

    const incomeTransactions = transactions.filter((t) => t.type === "income")
    const expenseTransactions = transactions.filter((t) => t.type === "expense")

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

    const averageTransaction = totalTransactions > 0 ? (totalIncome + totalExpenses) / totalTransactions : 0

    return NextResponse.json({
      totalTransactions,
      totalIncome,
      totalExpenses,
      averageTransaction,
    })
  } catch (error) {
    console.error("Error fetching transaction stats:", error)
    return NextResponse.json({ error: "Failed to fetch transaction stats" }, { status: 500 })
  }
}
