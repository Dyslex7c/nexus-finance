import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Expense } from "@/lib/models/expense"
import { Transaction } from "@/lib/models/transaction"
import { requireAuth } from "@/lib/auth"

// GET /api/finance/expense - Get all expense entries for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const expenses = await Expense.find({ userId: user.id }).sort({ date: -1 })

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ error: "Failed to fetch expense data" }, { status: 500 })
  }
}

// POST /api/finance/expense - Create a new expense entry
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const data = await request.json()

    // Validate required fields
    if (!data.amount || !data.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new expense record
    const newExpense = new Expense({
      userId: user.id,
      amount: data.amount,
      category: data.category,
      description: data.description || `${data.category} expense`,
      date: new Date(),
    })

    await newExpense.save()

    // Also create a transaction record
    const newTransaction = new Transaction({
      userId: user.id,
      type: "expense",
      amount: data.amount,
      category: data.category,
      description: data.description || `${data.category} expense`,
      date: new Date(),
    })

    await newTransaction.save()

    return NextResponse.json({ expense: newExpense }, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Failed to create expense entry" }, { status: 500 })
  }
}

// DELETE /api/finance/expense/:id - Delete an expense entry
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    // Extract the ID from the URL
    const url = new URL(request.url)
    const id = url.pathname.split("/").pop() // Extract the last segment as ID

    if (!id) {
      return NextResponse.json({ error: "Missing expense ID" }, { status: 400 })
    }

    // Find and delete the expense entry
    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId: user.id,
    })

    if (!deletedExpense) {
      return NextResponse.json({ error: "Expense entry not found" }, { status: 404 })
    }

    // Also delete the corresponding transaction
    await Transaction.findOneAndDelete({
      userId: user.id,
      type: "expense",
      amount: deletedExpense.amount,
      category: deletedExpense.category,
      description: deletedExpense.description,
      date: deletedExpense.date,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ error: "Failed to delete expense entry" }, { status: 500 })
  }
}


