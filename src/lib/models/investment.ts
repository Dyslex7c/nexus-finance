import mongoose, { Schema, type Document } from "mongoose"

export interface IInvestment extends Document {
  userId: string
  name: string
  type: string
  amount: number
  currentValue: number
  purchaseDate: Date
  currency: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

const InvestmentSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["stock", "bond", "etf", "mutual_fund", "real_estate", "crypto", "other"],
    },
    amount: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    purchaseDate: { type: Date, required: true },
    currency: { type: String, required: true, default: "USD" },
    notes: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Investment || mongoose.model<IInvestment>("Investment", InvestmentSchema)
