"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowUp, DollarSign, PiggyBank, Target, Wallet } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type FinancialSummary = {
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  avgMonthlySavings: number
  savingsGoalPercentage: number
  budgetUtilization: number
}

export function FinancialSummaryCards() {
  const [timeRange, setTimeRange] = useState<"3months" | "6months" | "12months">("6months")
  const [data, setData] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/finance/analytics?period=${timeRange}`)

        if (!response.ok) {
          throw new Error("Failed to fetch financial summary data")
        }

        const result = await response.json()
        setData(result.financialSummary)
        setError(null)
      } catch (err) {
        console.error("Error fetching financial summary:", err)
        setError("Failed to load summary data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  // Prepare cards data
  const cards = data
    ? [
        {
          title: "Total Income",
          value: data.totalIncome.toFixed(2),
          change: `+$${data.totalIncome.toFixed(2)}`,
          changeType: "positive",
          icon: DollarSign,
        },
        {
          title: "Total Expenses",
          value: data.totalExpenses.toFixed(2),
          change: `-$${data.totalExpenses.toFixed(2)}`,
          changeType: "negative",
          icon: Wallet,
        },
        {
          title: "Total Savings",
          value: data.totalSavings.toFixed(2),
          change: `${data.avgMonthlySavings > 0 ? "+" : ""}$${data.avgMonthlySavings.toFixed(2)}/mo`,
          changeType: data.avgMonthlySavings >= 0 ? "positive" : "negative",
          icon: PiggyBank,
        },
        {
          title: "Goals & Budget",
          value: `${data.savingsGoalPercentage.toFixed(0)}%`,
          change: `${data.budgetUtilization.toFixed(0)}% of budget used`,
          changeType: data.budgetUtilization <= 100 ? "positive" : "negative",
          icon: Target,
        },
      ]
    : []

  return (
    <>
      <div className="col-span-1 lg:col-span-4 flex justify-end mb-2">
        <Select value={timeRange} onValueChange={(value: "3months" | "6months" | "12months") => setTimeRange(value)}>
          <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        // Loading skeletons
        Array(4)
          .fill(0)
          .map((_, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-4 w-24 bg-gray-700/50" />
                  <Skeleton className="h-8 w-8 rounded-full bg-gray-700/50" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32 bg-gray-700/50" />
                  <Skeleton className="h-4 w-20 bg-gray-700/50" />
                </div>
              </CardContent>
            </Card>
          ))
      ) : error ? (
        <div className="col-span-4 text-center py-8 text-red-400">{error}</div>
      ) : (
        // Actual cards
        cards.map((card, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-400 text-sm">{card.title}</h3>
                <div className="p-2 rounded-full bg-gray-800/50">
                  <card.icon className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-white">
                  {card.title === "Total Savings" || card.title === "Goals & Budget" ? "" : "$"}
                  {card.value}
                </p>
                <span
                  className={`text-sm flex items-center ${
                    card.changeType === "positive" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {card.changeType === "positive" ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {card.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </>
  )
}
