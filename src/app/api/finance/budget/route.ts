import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Budget } from "@/lib/models/budget"
import { Expense } from "@/lib/models/expense"
import { requireAuth } from "@/lib/auth"

// GET /api/finance/budget - Get budget and spending for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()
    
    // Get current month's start and end dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    // Get user's budget allocations
    const budgets = await Budget.find({ userId: user.id })
    
    // Get current month's expenses by category
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: user.id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" }
        }
      }
    ])
    
    // Format the response with budget vs. actual spending
    const budgetComparison = budgets.map(budget => {
      const expense = expenses.find(e => e._id === budget.category)
      const spent = expense ? expense.spent : 0
      const remaining = budget.amount - spent
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
      
      return {
        category: budget.category,
        budgeted: budget.amount,
        spent,
        remaining,
        percentage
      }
    })
    
    return NextResponse.json({ budgetComparison })
  } catch (error) {
    console.error("Error fetching budget data:", error)
    return NextResponse.json(
      { error: "Failed to fetch budget data" },
      { status: 500 }
    )
  }
}

// POST /api/finance/budget - Create or update budget allocations
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()
    
    const data = await request.json()
    
    // Validate required fields
    if (!data.category || !data.amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Find existing budget for this category or create new one
    const existingBudget = await Budget.findOne({
      userId: user.id,
      category: data.category
    })
    
    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = data.amount
      await existingBudget.save()
      return NextResponse.json({ budget: existingBudget })
    } else {
      // Create new budget
      const newBudget = new Budget({
        userId: user.id,
        category: data.category,
        amount: data.amount
      })
      
      await newBudget.save()
      return NextResponse.json({ budget: newBudget }, { status: 201 })
    }
  } catch (error) {
    console.error("Error updating budget:", error)
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    )
  }
}
