"use client"

import { useState, useEffect } from "react"
import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Notification {
  id: string
  message: string
  time: string
  read: boolean
}

interface DashboardHeaderProps {
  user: {
    email: string
    name?: string
    id: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/finance/notifications")

        if (!response.ok) {
          throw new Error("Failed to fetch notifications")
        }

        const data = await response.json()

        // Transform the data to match our notification format
        const formattedNotifications = data.map((notification: any) => ({
          id: notification.id,
          message: notification.message || notification.title,
          time: formatTime(notification.date),
          read: notification.read,
        }))

        setNotifications(formattedNotifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        // Fallback to expense notification if main notification API fails
        try {
          const response = await fetch(`https://smart-finance-3zxn.onrender.com/check-expense/${user.id}`)
          const data = await response.json()

          if (data) {
            // Create a notification based on the API response
            const newNotification = {
              id: Date.now().toString(),
              message: data.alert,
              time: "Just now",
              read: false,
            }

            // Add this new notification to our existing ones
            setNotifications([newNotification])
          }
        } catch (error) {
          console.error("Error fetching expense notification:", error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user.id])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/finance/notifications/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark notification as read")
      }

      setNotifications(
        notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const navigateToSettings = () => {
    router.push("/dashboard/settings")
  }

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white relative"
              onClick={toggleNotifications}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {unreadCount}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white text-xs"
                    onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                  >
                    Mark all as read
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-400 text-sm">Loading notifications...</div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 ${!notification.read ? "bg-gray-700/30" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm">{notification.message}</p>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-sm">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user.name || user.email.split("@")[0]}</h2>
        <p className="text-gray-400 mb-6">
          Track your finances, manage expenses, and plan your budget all in one place.
        </p>
      </div>
    </div>
  )
}
