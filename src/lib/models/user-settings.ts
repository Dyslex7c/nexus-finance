import mongoose, { Schema, type Document } from "mongoose"

export interface IUserSettings extends Document {
  userId: string
  theme: string
  currency: string
  language: string
  notificationPreferences: {
    email: boolean
    push: boolean
    budgetAlerts: boolean
    goalAlerts: boolean
    billReminders: boolean
    weeklyReports: boolean
  }
  createdAt: Date
  updatedAt: Date
}

const UserSettingsSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    theme: { type: String, default: "dark", enum: ["light", "dark", "system"] },
    currency: { type: String, default: "USD" },
    language: { type: String, default: "en" },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true },
      goalAlerts: { type: Boolean, default: true },
      billReminders: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
)

export default mongoose.models.UserSettings || mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema)
