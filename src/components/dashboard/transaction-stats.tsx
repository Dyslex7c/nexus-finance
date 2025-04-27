"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TransactionStatsProps {
  className?: string
}

interface StatsData {
  totalTransactions: number
  totalIncome: number
  totalExpenses: number
  averageTransaction: number
  loading: boolean
  error: string | null
}

export function TransactionStats({ className }: TransactionStatsProps) {
  const [stats, setStats] = useState<StatsData>({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    averageTransaction: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/finance/transaction/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch transaction stats")
        }

        const data = await response.json()
        setStats({
          ...data,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching transaction stats:", error)
        setStats({
          totalTransactions: 0,
          totalIncome: 0,
          totalExpenses: 0,
          averageTransaction: 0,
          loading: false,
          error: "Failed to load transaction statistics",
        })
      }
    }

    fetchStats()
  }, [])

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-900/50 border-gray-800 animate-pulse">
            <CardContent className="p-6 h-24"></CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      icon: <TrendingUp className="h-5 w-5 text-cyan-400" />,
      format: (val: number) => val.toString(),
    },
    {
      title: "Total Income",
      value: stats.totalIncome,
      icon: <ArrowUpRight className="h-5 w-5 text-green-400" />,
      format: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      title: "Total Expenses",
      value: stats.totalExpenses,
      icon: <ArrowDownRight className="h-5 w-5 text-red-400" />,
      format: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      title: "Average Transaction",
      value: stats.averageTransaction,
      icon: <TrendingUp className="h-5 w-5 text-purple-400" />,
      format: (val: number) => `$${val.toFixed(2)}`,
    },
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {statCards.map((card, index) => (
        <Card key={index} className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-400">{card.title}</p>
              {card.icon}
            </div>
            <p className="text-2xl font-bold mt-2 text-white">{card.format(card.value)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
