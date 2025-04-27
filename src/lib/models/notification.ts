import mongoose, { Schema, type Document } from "mongoose"

export interface INotification extends Document {
  userId: string
  title: string
  message: string
  type: string
  read: boolean
  date: Date
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["alert", "payment", "transaction", "system"],
      default: "system",
    },
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
