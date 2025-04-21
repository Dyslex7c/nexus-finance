"use client"

import { useState, useEffect, ReactNode } from "react"
import { CryptoLoader } from "@/components/crypto-loader"
import Loading from "@/components/loading";

interface DashboardClientWrapperProps {
    children: ReactNode;
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return <>{children}</>
}