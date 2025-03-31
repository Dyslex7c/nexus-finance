import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Transaction } from "@/lib/models/transaction"
import { requireAuth } from "@/lib/auth"

// GET /api/finance/transaction - Get all transactions for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "income", "expense", or null for all
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const search = searchParams.get("search")

    // Build query
    const query: any = { userId: user.id }

    if (type) {
      query.type = type
    }

    if (category) {
      query.category = category
    }

    if (startDate || endDate) {
      query.date = {}
      if (startDate) {
        query.date.$gte = new Date(startDate)
      }
      if (endDate) {
        query.date.$lte = new Date(endDate)
      }
    }

    if (search) {
      query.$or = [{ description: { $regex: search, $options: "i" } }, { category: { $regex: search, $options: "i" } }]
    }

    const transactions = await Transaction.find(query).sort({ date: -1 })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transaction data" }, { status: 500 })
  }
}

