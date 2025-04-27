import mongoose, { Schema, type Document } from "mongoose"

export interface ISupportTicket extends Document {
  userId: string
  subject: string
  message: string
  status: string
  priority: string
  category: string
  responses: {
    message: string
    isStaff: boolean
    createdAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const SupportTicketSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true, default: "open", enum: ["open", "in_progress", "resolved", "closed"] },
    priority: { type: String, required: true, default: "medium", enum: ["low", "medium", "high", "urgent"] },
    category: { type: String, required: true, enum: ["account", "billing", "technical", "feature_request", "other"] },
    responses: [
      {
        message: { type: String, required: true },
        isStaff: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema)
