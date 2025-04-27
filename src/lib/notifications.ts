import { connectToDatabase } from "./mongodb"
import Notification from "./models/notification"

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
  relatedEntityId,
  relatedEntityType,
}: {
  userId: string
  title: string
  message: string
  type?: "info" | "warning" | "success" | "error"
  relatedEntityId?: string
  relatedEntityType?: string
}) {
  try {
    await connectToDatabase()

    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      relatedEntityId,
      relatedEntityType,
      isRead: false,
    })

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    await connectToDatabase()

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true },
    )

    return notification
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await connectToDatabase()

    const result = await Notification.updateMany({ userId, isRead: false }, { isRead: true })

    return result
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

export async function deleteNotification(notificationId: string, userId: string) {
  try {
    await connectToDatabase()

    const result = await Notification.findOneAndDelete({ _id: notificationId, userId })

    return result
  } catch (error) {
    console.error("Error deleting notification:", error)
    throw error
  }
}

export async function getUnreadNotificationsCount(userId: string) {
  try {
    await connectToDatabase()

    const count = await Notification.countDocuments({ userId, isRead: false })

    return count
  } catch (error) {
    console.error("Error getting unread notifications count:", error)
    throw error
  }
}
