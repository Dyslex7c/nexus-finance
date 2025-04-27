import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import Wallet from "@/lib/models/wallet"

export async function GET() {
  try {
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch wallets from the database
    const wallets = await Wallet.find({ userId: user.id }).sort({ createdAt: -1 })

    return NextResponse.json(wallets)
  } catch (error) {
    console.error("Error fetching wallets:", error)
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 })
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
    if (!data.name || data.balance === undefined || !data.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new wallet
    const wallet = new Wallet({
      userId: user.id,
      name: data.name,
      balance: data.balance,
      currency: data.currency || "USD",
      type: data.type,
      color: data.color || "#06b6d4",
      isDefault: data.isDefault || false,
    })

    await wallet.save()

    return NextResponse.json(wallet)
  } catch (error) {
    console.error("Error creating wallet:", error)
    return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 })
  }
}
