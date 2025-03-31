import mongoose from "mongoose"

// Define the Transaction schema
const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["income", "expense"],
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
    index: true,
  },
})

// Create indexes for faster querying
transactionSchema.index({ userId: 1, date: -1 })
transactionSchema.index({ userId: 1, type: 1 })
transactionSchema.index({ userId: 1, category: 1 })

// Create the model if it doesn't exist or use the existing one
export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema)

