"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { AddCalendarEventDialog } from "./add-calendar-event-dialog"
import { toast } from "sonner"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  amount: number
  type: "income" | "expense" | "bill" | "reminder"
  category: string
  description?: string
}

export function FinancialCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchCalendarEvents()
  }, [])

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/finance/calendar")

      if (!response.ok) {
        throw new Error("Failed to fetch calendar events")
      }

      const data = await response.json()

      // Convert string dates to Date objects
      const eventsWithDates = data.map((event: any) => ({
        ...event,
        id: event._id || event.id,
        date: new Date(event.date),
      }))

      setEvents(eventsWithDates)
    } catch (error) {
      console.error("Error fetching calendar events:", error)
      toast.error("Failed to load calendar events")

      // Set sample data if API fails
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)

      setEvents([
        {
          id: "1",
          title: "Rent Payment",
          date: tomorrow,
          amount: 1200,
          type: "expense",
          category: "Housing",
          description: "Monthly rent payment",
        },
        {
          id: "2",
          title: "Salary Deposit",
          date: nextWeek,
          amount: 3500,
          type: "income",
          category: "Salary",
          description: "Monthly salary payment",
        },
        {
          id: "3",
          title: "Electricity Bill",
          date: today,
          amount: 85,
          type: "bill",
          category: "Utilities",
          description: "Monthly electricity bill",
        },
        {
          id: "4",
          title: "Car Insurance",
          date: lastWeek,
          amount: 150,
          type: "expense",
          category: "Insurance",
          description: "Monthly car insurance payment",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate && events.length > 0) {
      const filteredEvents = events.filter(
        (event) =>
          event.date.getDate() === selectedDate.getDate() &&
          event.date.getMonth() === selectedDate.getMonth() &&
          event.date.getFullYear() === selectedDate.getFullYear(),
      )
      setSelectedEvents(filteredEvents)
    } else {
      setSelectedEvents([])
    }
  }, [selectedDate, events])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-green-500"
      case "expense":
        return "bg-red-500"
      case "bill":
        return "bg-yellow-500"
      case "reminder":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Function to highlight dates with events
  const getDayClassNames = (date: Date) => {
    const hasEvent = events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )

    return hasEvent ? "bg-cyan-900/30 text-cyan-400 font-medium" : ""
  }

  const handleAddEvent = () => {
    setDialogOpen(true)
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-white">Financial Calendar</CardTitle>
        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-1" /> Add Event
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-[350px] bg-gray-800 rounded-md"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="bg-gray-800/50 border border-gray-700 rounded-md p-3"
                classNames={{
                    day_selected:
                    "bg-cyan-600 text-white hover:bg-cyan-600 hover:text-white focus:bg-cyan-600 focus:text-white",
                }}
            />
            </div>

            <div>
              <h3 className="text-md font-medium text-white mb-4 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-cyan-400" />
                {selectedDate ? (
                  <span>
                    Events for{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ) : (
                  <span>Select a date to view events</span>
                )}
              </h3>

              {selectedEvents.length === 0 ? (
                <div className="text-center py-12 border border-gray-800 rounded-md">
                  <p className="text-gray-400">No events scheduled for this date</p>
                  <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white" onClick={handleAddEvent}>
                    <Plus className="h-4 w-4 mr-1" /> Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border border-gray-800 rounded-md hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${getEventTypeColor(event.type)}`}></div>
                          <h4 className="font-medium text-white">{event.title}</h4>
                        </div>
                        {(event.type === "income" || event.type === "expense" || event.type === "bill") && (
                          <span className={`text-sm ${event.type === "income" ? "text-green-400" : "text-red-400"}`}>
                            {event.type === "income" ? "+" : "-"}
                            {formatCurrency(event.amount)}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{event.category}</span>
                        <span>{event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      {event.description && <p className="text-sm text-gray-300 mt-2">{event.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <AddCalendarEventDialog open={dialogOpen} onOpenChange={setDialogOpen} selectedDate={selectedDate} />
    </Card>
  )
}
