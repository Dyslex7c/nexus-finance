import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import Investment from "@/lib/models/investment"

interface AllocationData {
  name: string
  value: number
  color: string
}

// Color palette for different investment types
const typeColors: Record<string, string> = {
  stock: "#06b6d4",
  bond: "#a855f7",
  etf: "#22c55e",
  mutual_fund: "#eab308",
  real_estate: "#ec4899",
  crypto: "#f43f5e",
  other: "#64748b",
}

export async function GET() {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all investments for the user
    const investments = await Investment.find({ userId: user.id })

    if (!investments || investments.length === 0) {
      return NextResponse.json([])
    }

    // Calculate total investment value
    const totalValue = investments.reduce((sum, inv) => sum + inv.amount * inv.currentValue, 0)

    // Group investments by type and calculate percentages
    const typeMap: Record<string, number> = {}

    investments.forEach((inv) => {
      const value = inv.amount * inv.currentValue
      if (typeMap[inv.type]) {
        typeMap[inv.type] += value
      } else {
        typeMap[inv.type] = value
      }
    })

    // Convert to allocation data with percentages
    const allocationData: AllocationData[] = Object.entries(typeMap).map(([type, value]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1).replace("_", " "),
      value: Math.round((value / totalValue) * 100),
      color: typeColors[type] || "#64748b",
    }))

    // Sort by value descending
    allocationData.sort((a, b) => b.value - a.value)

    return NextResponse.json(allocationData)
  } catch (error) {
    console.error("Error calculating investment allocation:", error)
    return NextResponse.json({ error: "Failed to calculate investment allocation" }, { status: 500 })
  }
}
