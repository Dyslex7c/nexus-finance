import mongoose from "mongoose"

// Define the BudgetAllocation schema
const budgetAllocationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  month: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/, // Format: YYYY-MM
  },
  category: {
    type: String,
    required: true,
    enum: [
      "housing",
      "transportation",
      "food",
      "utilities",
      "entertainment",
      "healthcare",
      "shopping",
      "personal",
      "debt",
      "other",
    ],
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create compound index for userId, month, and category
budgetAllocationSchema.index({ userId: 1, month: 1, category: 1 }, { unique: true })

// Create the model if it doesn't exist or use the existing one
export const BudgetAllocation =
  mongoose.models.BudgetAllocation || mongoose.model("BudgetAllocation", budgetAllocationSchema)
