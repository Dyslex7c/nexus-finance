import mongoose from "mongoose"

// Define the Expense schema
const expenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
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
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

// Create the model if it doesn't exist or use the existing one
export const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema)

