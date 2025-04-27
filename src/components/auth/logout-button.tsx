"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface LogoutButtonProps {
  redirectTo?: string
  children?: React.ReactNode
  className?: string
}

export function LogoutButton({ children = "Logout", redirectTo = "/auth/login", ...props }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      toast.success("Logged out", {
        description: "You have been successfully logged out.",
      })

      router.push(redirectTo)
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Logout failed", {
        description: "An error occurred while logging out.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} disabled={isLoading} {...props}>
      {isLoading ? "Logging out..." : children}
    </Button>
  )
}

