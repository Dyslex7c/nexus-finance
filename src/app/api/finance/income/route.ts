import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Income } from "@/lib/models/income"
import { Transaction } from "@/lib/models/transaction"
import { requireAuth } from "@/lib/auth"

// GET /api/finance/income - Get all income entries for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const income = await Income.find({ userId: user.id }).sort({ date: -1 })

    return NextResponse.json({ income })
  } catch (error) {
    console.error("Error fetching income:", error)
    return NextResponse.json({ error: "Failed to fetch income data" }, { status: 500 })
  }
}

// POST /api/finance/income - Create a new income entry
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const data = await request.json()

    // Validate required fields
    if (!data.amount || !data.source || !data.frequency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new income record
    const newIncome = new Income({
      userId: user.id,
      amount: data.amount,
      source: data.source,
      description: data.description || `${data.source} income`,
      frequency: data.frequency,
      date: new Date(),
    })

    await newIncome.save()

    // Also create a transaction record
    const newTransaction = new Transaction({
      userId: user.id,
      type: "income",
      amount: data.amount,
      category: data.source,
      description: data.description || `${data.source} income`,
      date: new Date(),
    })

    await newTransaction.save()

    return NextResponse.json({ income: newIncome }, { status: 201 })
  } catch (error) {
    console.error("Error creating income:", error)
    return NextResponse.json({ error: "Failed to create income entry" }, { status: 500 })
  }
}

// DELETE /api/finance/income/:id - Delete an income entry
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const url = new URL(request.url)
    const id = url.pathname.split("/").pop()

    // Find and delete the income entry
    const deletedIncome = await Income.findOneAndDelete({
      _id: id,
      userId: user.id,
    })

    if (!deletedIncome) {
      return NextResponse.json({ error: "Income entry not found" }, { status: 404 })
    }

    // Also delete the corresponding transaction
    await Transaction.findOneAndDelete({
      userId: user.id,
      type: "income",
      amount: deletedIncome.amount,
      category: deletedIncome.source,
      description: deletedIncome.description,
      date: deletedIncome.date,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting income:", error)
    return NextResponse.json({ error: "Failed to delete income entry" }, { status: 500 })
  }
}

