"use client"

import { useState } from "react"
import { Globe, DollarSign, Moon, Sun } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PreferenceSettings() {
  const [preferences, setPreferences] = useState({
    darkMode: true,
    language: "en",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    weekStartsOn: "sunday",
  })

  const updatePreference = (key: keyof typeof preferences, value: string | boolean) => {
    setPreferences({
      ...preferences,
      [key]: value,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium flex items-center mb-4">
          <Globe className="mr-2 h-5 w-5 text-cyan-400" />
          Regional Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={preferences.language} onValueChange={(value) => updatePreference("language", value)}>
              <SelectTrigger id="language" className="bg-[#050B18] border-gray-800 focus:ring-cyan-600">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-[#0B1120] border-gray-800">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={preferences.currency} onValueChange={(value) => updatePreference("currency", value)}>
              <SelectTrigger id="currency" className="bg-[#050B18] border-gray-800 focus:ring-cyan-600">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-[#0B1120] border-gray-800">
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="GBP">British Pound (£)</SelectItem>
                <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select value={preferences.dateFormat} onValueChange={(value) => updatePreference("dateFormat", value)}>
              <SelectTrigger id="dateFormat" className="bg-[#050B18] border-gray-800 focus:ring-cyan-600">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent className="bg-[#0B1120] border-gray-800">
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekStartsOn">Week Starts On</Label>
            <Select value={preferences.weekStartsOn} onValueChange={(value) => updatePreference("weekStartsOn", value)}>
              <SelectTrigger id="weekStartsOn" className="bg-[#050B18] border-gray-800 focus:ring-cyan-600">
                <SelectValue placeholder="Select first day of week" />
              </SelectTrigger>
              <SelectContent className="bg-[#0B1120] border-gray-800">
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      <div>
        <h3 className="text-lg font-medium flex items-center mb-4">
          <DollarSign className="mr-2 h-5 w-5 text-cyan-400" />
          Financial Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="round-up-savings" className="flex flex-col space-y-1">
              <span>Round-up Savings</span>
              <span className="font-normal text-xs text-gray-400">
                Round up transactions to the nearest dollar and save the difference
              </span>
            </Label>
            <Switch id="round-up-savings" checked={false} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-categorize" className="flex flex-col space-y-1">
              <span>Auto-categorize Transactions</span>
              <span className="font-normal text-xs text-gray-400">
                Automatically categorize transactions based on merchant
              </span>
            </Label>
            <Switch id="auto-categorize" checked={true} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="budget-alerts" className="flex flex-col space-y-1">
              <span>Budget Alerts</span>
              <span className="font-normal text-xs text-gray-400">
                Receive alerts when you're approaching budget limits
              </span>
            </Label>
            <Switch id="budget-alerts" checked={true} />
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      <div>
        <h3 className="text-lg font-medium flex items-center mb-4">
          <Sun className="mr-2 h-5 w-5 text-cyan-400" />
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Dark Mode</p>
            <p className="text-xs text-gray-400 mt-1">Switch between light and dark themes</p>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-gray-400" />
            <Switch
              checked={preferences.darkMode}
              onCheckedChange={(checked) => updatePreference("darkMode", checked)}
            />
            <Moon className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button className="bg-cyan-600 hover:bg-cyan-700">Save Preferences</Button>
      </div>
    </div>
  )
}
