"use client"

import React from "react"

import { useState, useEffect, type ReactNode } from "react"
import Loading from "@/components/loading"

interface DashboardClientWrapperProps {
  children: ReactNode
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Check if sidebar state is stored in localStorage
    const storedSidebarState = localStorage.getItem("sidebarCollapsed")
    if (storedSidebarState) {
      setSidebarCollapsed(storedSidebarState === "true")
    }

    return () => clearTimeout(timer)
  }, [])

  // Function to toggle sidebar state
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  // Clone children and pass the sidebar state and toggle function
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        sidebarCollapsed,
        toggleSidebar,
      } as any)
    }
    return child
  })

  return <>{childrenWithProps}</>
}
