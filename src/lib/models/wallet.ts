import mongoose, { Schema, type Document } from "mongoose"

export interface IWallet extends Document {
  userId: string
  name: string
  type: string
  balance: number
  currency: string
  color: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

const WalletSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["checking", "savings", "credit", "investment", "cash", "crypto"] },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "USD" },
    color: { type: String, required: true, default: "#06b6d4" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Wallet || mongoose.model<IWallet>("Wallet", WalletSchema)
