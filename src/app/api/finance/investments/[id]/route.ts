import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import Investment from "@/lib/models/investment"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, props: Props) {
  try {
    const params = await props.params
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const investment = await Investment.findOne({ _id: params.id, userId: user.id })

    if (!investment) {
      return NextResponse.json({ error: "Investment not found" }, { status: 404 })
    }

    return NextResponse.json(investment)
  } catch (error) {
    console.error("Error fetching investment:", error)
    return NextResponse.json({ error: "Failed to fetch investment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, props: Props) {
  try {
    const params = await props.params
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const investment = await Investment.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      { $set: data },
      { new: true },
    )

    if (!investment) {
      return NextResponse.json({ error: "Investment not found" }, { status: 404 })
    }

    return NextResponse.json(investment)
  } catch (error) {
    console.error("Error updating investment:", error)
    return NextResponse.json({ error: "Failed to update investment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  try {
    const params = await props.params
    await connectToDatabase()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const investment = await Investment.findOneAndDelete({ _id: params.id, userId: user.id })

    if (!investment) {
      return NextResponse.json({ error: "Investment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting investment:", error)
    return NextResponse.json({ error: "Failed to delete investment" }, { status: 500 })
  }
}