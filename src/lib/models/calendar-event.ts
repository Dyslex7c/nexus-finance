import mongoose, { Schema, type Document } from "mongoose"

export interface ICalendarEvent extends Document {
  userId: string
  title: string
  date: Date
  amount: number
  type: string
  category: string
  description: string
  createdAt: Date
  updatedAt: Date
}

const CalendarEventSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    amount: { type: Number, default: 0 },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense", "bill", "reminder"],
      default: "reminder",
    },
    category: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.CalendarEvent || mongoose.model<ICalendarEvent>("CalendarEvent", CalendarEventSchema)
