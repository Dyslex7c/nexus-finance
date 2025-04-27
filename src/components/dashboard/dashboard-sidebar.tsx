"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LineChart,
  Settings,
  Target,
  Wallet,
  Bell,
  Calendar,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Hexagon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/auth/logout-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  user: {
    email: string
    name?: string
    id: string
  }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Transactions",
      href: "/dashboard/transactions",
      icon: CreditCard,
    },
    {
      title: "Budget",
      href: "/dashboard/budget",
      icon: DollarSign,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Savings Goals",
      href: "/dashboard/goals",
      icon: Target,
    },
    {
      title: "Investments",
      href: "/dashboard/investments",
      icon: LineChart,
    },
    {
      title: "Wallets",
      href: "/dashboard/wallets",
      icon: Wallet,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
  ]

  const bottomNavItems = [
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Help & Support",
      href: "/dashboard/support",
      icon: HelpCircle,
    },
  ]

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-gray-800/40 bg-[#050B18]/95 backdrop-blur-md transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      {/* Logo and collapse button */}
      <div className="flex h-16 items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <div className="relative">
              <Hexagon className="h-7 w-7 text-cyan-400 fill-cyan-900/30" />
              <Wallet className="h-3.5 w-3.5 text-cyan-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              SMART FINANCE
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>

      {/* User profile */}
      <div
        className={cn(
          "flex items-center gap-3 border-b border-gray-800/40 px-4 py-3",
          collapsed ? "justify-center" : "px-4",
        )}
      >
        <Avatar className="h-9 w-9 border border-gray-700/50">
          <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
          <AvatarFallback className="bg-gray-800 text-cyan-400">
            {user.name ? user.name[0] : user.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white truncate max-w-[140px]">
              {user.name || user.email.split("@")[0]}
            </span>
            <span className="text-xs text-gray-400 truncate max-w-[140px]">{user.email}</span>
          </div>
        )}
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          <TooltipProvider delayDuration={0}>
            {mainNavItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                      pathname === item.href
                        ? "bg-gradient-to-r from-cyan-900/40 to-purple-900/40 text-white"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-white",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        pathname === item.href ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300",
                      )}
                    />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </div>

      {/* Bottom navigation */}
      <div className="border-t border-gray-800/40 py-4">
        <nav className="grid gap-1 px-2">
          <TooltipProvider delayDuration={0}>
            {bottomNavItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                      pathname === item.href
                        ? "bg-gradient-to-r from-cyan-900/40 to-purple-900/40 text-white"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-white",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        pathname === item.href ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300",
                      )}
                    />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
              </Tooltip>
            ))}

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-2">
                <div className="w-full justify-start rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all">
                  <LogoutButton />
                </div>
                    <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-300" />
                    {!collapsed && "Logout"}
                </div>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </nav>
      </div>
    </aside>
  )
}
