"use client"

import { useEffect, useState } from "react"
import { Bell, Check, Trash2, AlertCircle, CreditCard, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface Notification {
  id: string
  title: string
  message: string
  type: "alert" | "payment" | "transaction" | "system"
  read: boolean
  date: string
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/finance/notifications")

      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today, " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday, " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-purple-400" />
      case "transaction":
        return <Wallet className="h-5 w-5 text-cyan-400" />
      case "system":
        return <Bell className="h-5 w-5 text-yellow-400" />
      default:
        return <Bell className="h-5 w-5 text-gray-400" />
    }
  }

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === activeTab)

  const unreadCount = notifications.filter((n) => !n.read).length

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

      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))

      toast.success("Notification marked as read")
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`/api/finance/notifications/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read")
      }

      setNotifications(notifications.map((n) => ({ ...n, read: true })))
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  const deleteNotification = (id: string) => {
    // In a real application, you would call an API to delete the notification
    setNotifications(notifications.filter((n) => n.id !== id))
    toast.success("Notification deleted")
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-white flex items-center">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-xs bg-cyan-600 text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>
          )}
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          className="text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
          onClick={markAllAsRead}
        >
          Mark all as read
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-800 w-full justify-start mb-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-white text-white data-[state=active]:text-white">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-white text-white data-[state=active]:text-white">
              Unread
            </TabsTrigger>
            <TabsTrigger value="alert" className="data-[state=active]:bg-white text-white data-[state=active]:text-white">
              Alerts
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-white text-white data-[state=active]:text-white">
              Payments
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-white text-white data-[state=active]:text-white">
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-800 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12 border border-gray-800 rounded-md">
                <p className="text-gray-400">No notifications to display</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-md transition-colors ${
                      notification.read ? "border-gray-800 bg-gray-900/30" : "border-cyan-900/50 bg-cyan-900/10"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-medium ${notification.read ? "text-gray-300" : "text-white"}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-400 ml-2">{formatDate(notification.date)}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                      </div>
                      <div className="flex ml-4 space-x-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-cyan-400 hover:bg-gray-800"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-gray-800"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
