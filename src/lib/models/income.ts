import mongoose from "mongoose"

// Define the Income schema
const incomeSchema = new mongoose.Schema({
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
  source: {
    type: String,
    required: true,
    enum: ["salary", "freelance", "investments", "rental", "side-business", "other"],
  },
  description: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
    enum: ["one-time", "weekly", "bi-weekly", "monthly", "quarterly", "annually"],
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

// Create the model if it doesn't exist or use the existing one
export const Income = mongoose.models.Income || mongoose.model("Income", incomeSchema)

