import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

interface AllocationData {
  name: string
  value: number
  color: string
}

export async function GET() {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real application, you would calculate this from actual investment data
    // For now, we'll return mock data
    const mockAllocation: AllocationData[] = [
      { name: "Stocks", value: 60, color: "#06b6d4" },
      { name: "Bonds", value: 15, color: "#a855f7" },
      { name: "Real Estate", value: 10, color: "#22c55e" },
      { name: "Crypto", value: 10, color: "#eab308" },
      { name: "Cash", value: 5, color: "#64748b" },
    ]

    return NextResponse.json(mockAllocation)
  } catch (error) {
    console.error("Error fetching investment allocation:", error)
    return NextResponse.json({ error: "Failed to fetch investment allocation" }, { status: 500 })
  }
}
