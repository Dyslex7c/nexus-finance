"use client"

import { useEffect, useState } from "react"
import { Target, TrendingUp, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface SummaryData {
  totalSaved: number
  totalGoals: number
  totalTarget: number
  nearestGoal: {
    name: string
    daysLeft: number
    percentComplete: number
  } | null
  loading: boolean
}

export function SavingsGoalsSummary() {
  const [summary, setSummary] = useState<SummaryData>({
    totalSaved: 0,
    totalGoals: 0,
    totalTarget: 0,
    nearestGoal: null,
    loading: true,
  })

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch("/api/finance/savings-goal/summary")

        if (!response.ok) {
          throw new Error("Failed to fetch savings summary")
        }

        const data = await response.json()
        setSummary({
          ...data,
          loading: false,
        })
      } catch (error) {
        console.error("Error fetching savings summary:", error)
        toast.error("Failed to load savings summary")
        setSummary((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchSummary()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate average completion
  const averageCompletion = summary.totalTarget > 0 ? Math.round((summary.totalSaved / summary.totalTarget) * 100) : 0

  const summaryCards = [
    {
      title: "Total Saved",
      value: formatCurrency(summary.totalSaved),
      icon: <Wallet className="h-5 w-5 text-cyan-400" />,
    },
    {
      title: "Active Goals",
      value: summary.totalGoals.toString(),
      icon: <Target className="h-5 w-5 text-purple-400" />,
    },
    {
      title: "Average Completion",
      value: `${averageCompletion}%`,
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
    },
    {
      title: "Next Milestone",
      value: summary.nearestGoal?.name || "N/A",
      subtext: summary.nearestGoal
        ? `${formatCurrency(summary.nearestGoal.percentComplete)}% complete, ${summary.nearestGoal.daysLeft} days left`
        : "No upcoming milestone",
      icon: <Target className="h-5 w-5 text-yellow-400" />,
    },
  ]

  if (summary.loading) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => (
        <Card key={index} className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-400">{card.title}</p>
              {card.icon}
            </div>
            <p className="text-2xl font-bold mt-2 text-white">{card.value}</p>
            {card.subtext && <p className="text-xs text-gray-400 mt-1">{card.subtext}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
