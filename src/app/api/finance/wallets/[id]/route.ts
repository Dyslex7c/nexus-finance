import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import Wallet from "@/lib/models/wallet"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: Request, props: Props) {
  try {
    const params = await props.params
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wallet = await Wallet.findOne({ _id: params.id, userId: user.id })

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }

    return NextResponse.json(wallet)
  } catch (error) {
    console.error("Error fetching wallet:", error)
    return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 })
  }
}

export async function PUT(request: Request, props: Props) {
  try {
    const params = await props.params
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const wallet = await Wallet.findOneAndUpdate({ _id: params.id, userId: user.id }, { $set: data }, { new: true })

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }

    return NextResponse.json(wallet)
  } catch (error) {
    console.error("Error updating wallet:", error)
    return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 })
  }
}

export async function DELETE(request: Request, props: Props) {
  try {
    const params = await props.params
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wallet = await Wallet.findOneAndDelete({ _id: params.id, userId: user.id })

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting wallet:", error)
    return NextResponse.json({ error: "Failed to delete wallet" }, { status: 500 })
  }
}