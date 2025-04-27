import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import Investment from "@/lib/models/investment"

export async function GET() {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch investments from the database
    const investments = await Investment.find({ userId: user.id }).sort({ createdAt: -1 })

    // Transform the data to match the expected format in the frontend
    const transformedInvestments = investments.map((investment) => {
      const purchaseValue = investment.amount * investment.purchasePrice
      const currentValue = investment.amount * investment.currentValue
      const change = investment.currentValue - investment.purchasePrice
      const changePercent = ((investment.currentValue - investment.purchasePrice) / investment.purchasePrice) * 100

      return {
        id: investment._id.toString(),
        name: investment.name,
        symbol: investment.symbol || investment.name.substring(0, 4).toUpperCase(),
        shares: investment.amount,
        purchasePrice: investment.purchasePrice,
        currentPrice: investment.currentValue,
        change: change,
        changePercent: changePercent,
        type: investment.type,
        purchaseDate: investment.purchaseDate,
      }
    })

    return NextResponse.json(transformedInvestments)
  } catch (error) {
    console.error("Error fetching investments:", error)
    return NextResponse.json({ error: "Failed to fetch investments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.shares || !data.purchasePrice || !data.currentPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new investment
    const investment = new Investment({
      userId: user.id,
      name: data.name,
      symbol: data.symbol,
      amount: data.shares,
      purchasePrice: data.purchasePrice,
      currentValue: data.currentPrice,
      type: data.type || "stock",
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
      notes: data.notes || "",
      currency: "USD",
    })

    await investment.save()

    return NextResponse.json(investment)
  } catch (error) {
    console.error("Error creating investment:", error)
    return NextResponse.json({ error: "Failed to create investment" }, { status: 500 })
  }
}
