import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { SavingsGoal } from "@/lib/models/savings-goal"
import { requireAuth } from "@/lib/auth"

// GET /api/finance/savings-goal - Get all savings goals for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const savingsGoals = await SavingsGoal.find({ userId: user.id }).sort({ targetDate: 1 })

    return NextResponse.json({ savingsGoals })
  } catch (error) {
    console.error("Error fetching savings goals:", error)
    return NextResponse.json({ error: "Failed to fetch savings goals" }, { status: 500 })
  }
}

// POST /api/finance/savings-goal - Create a new savings goal
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.targetAmount || !data.targetDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new savings goal
    const newSavingsGoal = new SavingsGoal({
      userId: user.id,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount || 0,
      targetDate: new Date(data.targetDate),
      createdAt: new Date(),
    })

    await newSavingsGoal.save()

    return NextResponse.json({ savingsGoal: newSavingsGoal }, { status: 201 })
  } catch (error) {
    console.error("Error creating savings goal:", error)
    return NextResponse.json({ error: "Failed to create savings goal" }, { status: 500 })
  }
}

// PATCH /api/finance/savings-goal/:id - Update a savings goal
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const url = new URL(request.url)
    const id = url.pathname.split("/").pop()
    
    const data = await request.json()

    // Find the savings goal
    const savingsGoal = await SavingsGoal.findOne({
      _id: id,
      userId: user.id,
    })
    console.log(savingsGoal);
    
    if (!savingsGoal) {
      return NextResponse.json({ error: "Savings goal not found" }, { status: 404 })
    }

    // Update fields
    if (data.name) savingsGoal.name = data.name
    if (data.targetAmount) savingsGoal.targetAmount = data.targetAmount
    if (data.currentAmount !== undefined) savingsGoal.currentAmount = data.currentAmount
    if (data.targetDate) savingsGoal.targetDate = new Date(data.targetDate)

    await savingsGoal.save()

    return NextResponse.json({ savingsGoal })
  } catch (error) {
    console.error("Error updating savings goal:", error)
    return NextResponse.json({ error: "Failed to update savings goal" }, { status: 500 })
  }
}

// DELETE /api/finance/savings-goal/:id - Delete a savings goal
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const url = new URL(request.url)
    const id = url.pathname.split("/").pop()

    // Find and delete the savings goal
    const deletedSavingsGoal = await SavingsGoal.findOneAndDelete({
      _id: id,
      userId: user.id,
    })

    if (!deletedSavingsGoal) {
      return NextResponse.json({ error: "Savings goal not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting savings goal:", error)
    return NextResponse.json({ error: "Failed to delete savings goal" }, { status: 500 })
  }
}

