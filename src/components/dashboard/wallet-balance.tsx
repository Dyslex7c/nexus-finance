"use client"

import { useEffect, useState } from "react"
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BalanceData {
  totalBalance: number
  change: number
  changePercentage: number
  lastUpdated: string
  loading: boolean
}

export function WalletBalance() {
  const [balanceData, setBalanceData] = useState<BalanceData>({
    totalBalance: 0,
    change: 0,
    changePercentage: 0,
    lastUpdated: "",
    loading: true,
  })

  useEffect(() => {
    async function fetchBalanceData() {
      try {
        const response = await fetch("/api/finance/wallets/balance")

        if (!response.ok) {
          throw new Error("Failed to fetch wallet balance data")
        }

        const data = await response.json()
            setBalanceData({
            totalBalance: data.totalBalance ?? 0,
            change: data.change ?? 0,
            changePercentage: data.changePercentage ?? 0,
            lastUpdated: data.lastUpdated ?? "",
            loading: false,
        })

      } catch (error) {
        console.error("Error fetching wallet balance:", error)
        // Set fallback data
        setBalanceData({
          totalBalance: 15300.5,
          change: 250.75,
          changePercentage: 1.67,
          lastUpdated: new Date().toISOString(),
          loading: false,
        })
      }
    }

    fetchBalanceData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardContent className="p-6">
        {balanceData.loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="h-12 bg-gray-800 rounded w-1/2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-400 flex items-center">
                <Wallet className="h-4 w-4 mr-1" /> Total Balance
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-gray-400 hover:text-white">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </p>
              <p className="text-3xl font-bold text-white mt-1">{formatCurrency(balanceData.totalBalance)}</p>
              <p className="text-xs text-gray-400 mt-1">Last updated: {formatDate(balanceData.lastUpdated)}</p>
            </div>

            <div
              className={`mt-4 md:mt-0 flex items-center ${balanceData.change >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {balanceData.change >= 0 ? (
                <ArrowUpRight className="h-5 w-5 mr-2" />
              ) : (
                <ArrowDownRight className="h-5 w-5 mr-2" />
              )}
              <div>
                <p className="font-medium">{formatCurrency(balanceData.change)}</p>
                <p className="text-xs">{balanceData.changePercentage.toFixed(2)}% from last month</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
