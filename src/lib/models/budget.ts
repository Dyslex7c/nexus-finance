import mongoose from "mongoose"

// Define the Budget schema
const budgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create a compound index for userId and category
budgetSchema.index({ userId: 1, category: 1 }, { unique: true })

// Create the model if it doesn't exist or use the existing one
export const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema)

