import mongoose from "mongoose"

// Define the RecurringPayment schema
const recurringPaymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
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
  frequency: {
    type: String,
    required: true,
    enum: ["weekly", "bi-weekly", "monthly", "quarterly", "annually"],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create the model if it doesn't exist or use the existing one
export const RecurringPayment =
  mongoose.models.RecurringPayment || mongoose.model("RecurringPayment", recurringPaymentSchema)
