"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { SecuritySettings } from "@/components/dashboard/security-settings"
import { PreferenceSettings } from "@/components/dashboard/preference-settings"
import { AuthUser } from "@/lib/auth"

interface SettingsTabsProps {
  user: AuthUser
}

export function SettingsTabs({ user }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-800 w-full justify-start mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-900/50 data-[state=active]:text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-cyan-900/50 data-[state=active]:text-white">
              Security
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-cyan-900/50 data-[state=active]:text-white"
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            <ProfileSettings user={user} />
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="preferences" className="mt-0">
            <PreferenceSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
