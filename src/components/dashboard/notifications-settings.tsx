"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: {
      lowBalance: true,
      billReminders: true,
      largeTransactions: true,
      budgetAlerts: false,
      weeklyReports: true,
      newFeatures: false,
    },
    push: {
      lowBalance: true,
      billReminders: true,
      largeTransactions: true,
      budgetAlerts: true,
      weeklyReports: false,
      newFeatures: true,
    },
  })

  const handleToggle = (channel: "email" | "push", setting: string) => {
    setSettings({
      ...settings,
      [channel]: {
        ...settings[channel],
        [setting]: !settings[channel][setting as keyof typeof settings.email],
      },
    })
  }

  const saveSettings = () => {
    // Here you would typically save the settings to your API
    console.log("Saving notification settings:", settings)
  }

  const notificationTypes = [
    { id: "lowBalance", label: "Low Balance Alerts" },
    { id: "billReminders", label: "Bill Payment Reminders" },
    { id: "largeTransactions", label: "Large Transaction Alerts" },
    { id: "budgetAlerts", label: "Budget Threshold Alerts" },
    { id: "weeklyReports", label: "Weekly Financial Reports" },
    { id: "newFeatures", label: "New Features & Updates" },
  ]

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-white">Notification Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Email Notifications</h3>
            <div className="space-y-3">
              {notificationTypes.map((type) => (
                <div key={`email-${type.id}`} className="flex items-center justify-between">
                  <Label htmlFor={`email-${type.id}`} className="text-sm text-gray-300 cursor-pointer">
                    {type.label}
                  </Label>
                  <Switch
                    id={`email-${type.id}`}
                    checked={settings.email[type.id as keyof typeof settings.email]}
                    onCheckedChange={() => handleToggle("email", type.id)}
                    className="data-[state=checked]:bg-cyan-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-3">Push Notifications</h3>
            <div className="space-y-3">
              {notificationTypes.map((type) => (
                <div key={`push-${type.id}`} className="flex items-center justify-between">
                  <Label htmlFor={`push-${type.id}`} className="text-sm text-gray-300 cursor-pointer">
                    {type.label}
                  </Label>
                  <Switch
                    id={`push-${type.id}`}
                    checked={settings.push[type.id as keyof typeof settings.push]}
                    onCheckedChange={() => handleToggle("push", type.id)}
                    className="data-[state=checked]:bg-cyan-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button onClick={saveSettings} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
            Save Notification Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
