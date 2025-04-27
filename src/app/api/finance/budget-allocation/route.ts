import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { BudgetAllocation } from "@/lib/models/budget-allocation"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

// Validation schema for a single budget allocation
const budgetAllocationSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
  amount: z.number().min(0, { message: "Amount must be non-negative" }),
  percentage: z.number().min(0).max(100, { message: "Percentage must be between 0 and 100" }),
})

// Validation schema for the entire request
const budgetAllocationsRequestSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, { message: "Month must be in YYYY-MM format" }),
  totalIncome: z.number().positive({ message: "Total income must be positive" }),
  allocations: z.array(budgetAllocationSchema),
})

// GET /api/finance/budget-allocation - Get budget allocations for a specific month
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") // Format: YYYY-MM

    // If no month is provided, use current month
    const currentDate = new Date()
    const currentMonth = month || `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`

    // Find budget allocations for the specified month
    const budgetAllocations = await BudgetAllocation.find({
      userId: user.id,
      month: currentMonth,
    })

    return NextResponse.json({ budgetAllocations })
  } catch (error) {
    console.error("Error fetching budget allocations:", error)
    return NextResponse.json({ error: "Failed to fetch budget allocations" }, { status: 500 })
  }
}

// POST /api/finance/budget-allocation - Create or update budget allocations for a month
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const data = await request.json()

    // Validate input
    const result = budgetAllocationsRequestSchema.safeParse(data)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { month, totalIncome, allocations } = result.data

    // Delete existing allocations for this month (if any)
    await BudgetAllocation.deleteMany({
      userId: user.id,
      month,
    })

    // Create new allocations
    const budgetAllocations = await BudgetAllocation.insertMany(
      allocations.map((allocation) => ({
        userId: user.id,
        month,
        category: allocation.category,
        amount: allocation.amount,
        percentage: allocation.percentage,
        createdAt: new Date(),
      })),
    )

    return NextResponse.json({ success: true, budgetAllocations }, { status: 201 })
  } catch (error) {
    console.error("Error creating budget allocations:", error)
    return NextResponse.json({ error: "Failed to create budget allocations" }, { status: 500 })
  }
}
