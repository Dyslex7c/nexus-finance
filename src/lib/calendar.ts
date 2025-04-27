import { connectToDatabase } from "./mongodb"
import calendarEvent from "./models/calendar-event"

export async function createcalendarEvent({
  userId,
  title,
  description,
  startDate,
  endDate,
  allDay = false,
  type,
  relatedEntityId,
  relatedEntityType,
}: {
  userId: string
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  allDay?: boolean
  type: "bill" | "income" | "budget" | "goal" | "reminder"
  relatedEntityId?: string
  relatedEntityType?: string
}) {
  try {
    await connectToDatabase()

    const event = await calendarEvent.create({
      userId,
      title,
      description,
      startDate,
      endDate,
      allDay,
      type,
      relatedEntityId,
      relatedEntityType,
    })

    return event
  } catch (error) {
    console.error("Error creating calendar event:", error)
    throw error
  }
}

export async function updatecalendarEvent(
  eventId: string,
  userId: string,
  updateData: Partial<{
    title: string
    description: string
    startDate: Date
    endDate: Date
    allDay: boolean
  }>,
) {
  try {
    await connectToDatabase()

    const event = await calendarEvent.findOneAndUpdate({ _id: eventId, userId }, updateData, { new: true })

    return event
  } catch (error) {
    console.error("Error updating calendar event:", error)
    throw error
  }
}

export async function deletecalendarEvent(eventId: string, userId: string) {
  try {
    await connectToDatabase()

    const result = await calendarEvent.findOneAndDelete({ _id: eventId, userId })

    return result
  } catch (error) {
    console.error("Error deleting calendar event:", error)
    throw error
  }
}

export async function getcalendarEventsByDateRange(userId: string, startDate: Date, endDate: Date) {
  try {
    await connectToDatabase()

    const events = await calendarEvent.find({
      userId,
      $or: [
        // Events that start within the range
        { startDate: { $gte: startDate, $lte: endDate } },
        // Events that end within the range
        { endDate: { $gte: startDate, $lte: endDate } },
        // Events that span the entire range
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
      ],
    }).sort({ startDate: 1 })

    return events
  } catch (error) {
    console.error("Error getting calendar events by date range:", error)
    throw error
  }
}
