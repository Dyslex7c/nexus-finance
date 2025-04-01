import { LogoutButton } from "@/components/auth/logout-button"
import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  user: {
    email: string
    name?: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          SMART FINANCE
        </h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
          <LogoutButton />
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user.name || user.email}</h2>
        <p className="text-gray-400 mb-6">
          Track your finances, manage expenses, and plan your budget all in one place.
        </p>
      </div>
    </div>
  )
}

