import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { RecurringPayment } from "@/lib/models/recurring-payment"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

// Validation schema
const recurringPaymentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.number().positive({ message: "Amount must be positive" }),
  category: z.string().min(1, { message: "Category is required" }),
  frequency: z.enum(["weekly", "bi-weekly", "monthly", "quarterly", "annually"]),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  description: z.string().optional(),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)) || date === "", {
      message: "Invalid date format",
    })
    .optional(),
  isActive: z.boolean().default(true),
})

// GET /api/finance/recurring-payments - Get all recurring payments for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const recurringPayments = await RecurringPayment.find({ userId: user.id }).sort({ startDate: 1 })

    return NextResponse.json({ recurringPayments })
  } catch (error) {
    console.error("Error fetching recurring payments:", error)
    return NextResponse.json({ error: "Failed to fetch recurring payments" }, { status: 500 })
  }
}

// POST /api/finance/recurring-payments - Create a new recurring payment
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    const data = await request.json()

    // Validate input
    const result = recurringPaymentSchema.safeParse(data)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const validatedData = result.data

    // Create new recurring payment
    const newRecurringPayment = new RecurringPayment({
      userId: user.id,
      title: validatedData.title,
      amount: validatedData.amount,
      category: validatedData.category,
      frequency: validatedData.frequency,
      startDate: new Date(validatedData.startDate),
      description: validatedData.description || `${validatedData.title} payment`,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      isActive: validatedData.isActive,
      createdAt: new Date(),
    })

    await newRecurringPayment.save()

    return NextResponse.json({ recurringPayment: newRecurringPayment }, { status: 201 })
  } catch (error) {
    console.error("Error creating recurring payment:", error)
    return NextResponse.json({ error: "Failed to create recurring payment" }, { status: 500 })
  }
}

// PATCH /api/finance/recurring-payments/:id - Update a recurring payment
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    // Extract the ID from the URL
    const url = new URL(request.url)
    const id = url.pathname.split("/").pop()

    if (!id) {
      return NextResponse.json({ error: "Missing recurring payment ID" }, { status: 400 })
    }

    const data = await request.json()

    // Find the recurring payment
    const recurringPayment = await RecurringPayment.findOne({
      _id: id,
      userId: user.id,
    })

    if (!recurringPayment) {
      return NextResponse.json({ error: "Recurring payment not found" }, { status: 404 })
    }

    // Update fields
    if (data.title) recurringPayment.title = data.title
    if (data.amount !== undefined) recurringPayment.amount = data.amount
    if (data.category) recurringPayment.category = data.category
    if (data.frequency) recurringPayment.frequency = data.frequency
    if (data.startDate) recurringPayment.startDate = new Date(data.startDate)
    if (data.description) recurringPayment.description = data.description
    if (data.endDate) recurringPayment.endDate = new Date(data.endDate)
    if (data.isActive !== undefined) recurringPayment.isActive = data.isActive

    await recurringPayment.save()

    return NextResponse.json({ recurringPayment })
  } catch (error) {
    console.error("Error updating recurring payment:", error)
    return NextResponse.json({ error: "Failed to update recurring payment" }, { status: 500 })
  }
}

// DELETE /api/finance/recurring-payments/:id - Delete a recurring payment
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()
    await connectToDatabase()

    // Extract the ID from the URL
    const url = new URL(request.url)
    const id = url.pathname.split("/").pop()

    if (!id) {
      return NextResponse.json({ error: "Missing recurring payment ID" }, { status: 400 })
    }

    // Find and delete the recurring payment
    const deletedRecurringPayment = await RecurringPayment.findOneAndDelete({
      _id: id,
      userId: user.id,
    })

    if (!deletedRecurringPayment) {
      return NextResponse.json({ error: "Recurring payment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting recurring payment:", error)
    return NextResponse.json({ error: "Failed to delete recurring payment" }, { status: 500 })
  }
}
