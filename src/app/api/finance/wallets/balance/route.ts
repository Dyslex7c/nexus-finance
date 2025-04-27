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

    // Fetch all wallets for the current user
    const wallets = await Wallet.find({ userId: user.id })
    
    // Calculate total balance across all wallets
    const totalBalance = wallets.reduce((total, wallet) => total + wallet.balance, 0)
    
    // For monthly change calculation, we need historical data
    // Since you don't appear to store historical balances directly,
    // we'll need to adapt this approach
    
    // Option 1: If you have a transactions collection that tracks changes to wallets
    // You could use that to calculate the monthly change
    
    // For now, as a placeholder, we'll return the total balance
    // and set the monthly change to 0 until you implement transaction tracking
    const monthlyChange = 0
    const monthlyChangePercent = 0
    
    // If you want to implement this properly, you would need to:
    // 1. Store wallet balance history or transaction history
    // 2. Calculate the balance at the start of the month
    // 3. Compare it with the current balance
    
    return NextResponse.json({
      totalBalance: parseFloat(totalBalance.toFixed(2)),
      monthlyChange: parseFloat(monthlyChange.toFixed(2)),
      monthlyChangePercent: parseFloat(monthlyChangePercent.toFixed(1)),
    })
  } catch (error) {
    console.error("Error fetching wallet balance:", error)
    return NextResponse.json({ error: "Failed to fetch wallet balance" }, { status: 500 })
  }
}