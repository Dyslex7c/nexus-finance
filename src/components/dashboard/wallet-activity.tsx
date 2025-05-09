"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ActivityData {
  date: string
  income: number
  expense: number
}

export function WalletActivity() {
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("1W")

  useEffect(() => {
    async function fetchActivityData() {
      try {
        const response = await fetch(`/api/finance/wallets/activity?timeframe=${timeframe}`)

        if (!response.ok) {
          throw new Error("Failed to fetch wallet activity data")
        }

        const data = await response.json()
        setActivityData(data)
      } catch (error) {
        console.error("Error fetching wallet activity:", error)
        // Generate sample data if API fails
        const sampleData = generateSampleData(timeframe)
        setActivityData(sampleData)
      } finally {
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [timeframe])

  // Generate sample data for different timeframes
  const generateSampleData = (timeframe: string): ActivityData[] => {
    const data: ActivityData[] = []
    let days: number

    switch (timeframe) {
      case "1W":
        days = 7
        break
      case "1M":
        days = 30
        break
      case "3M":
        days = 90
        break
      default:
        days = 7
    }

    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Random income and expense values
      const income = Math.round(Math.random() * 500) + 100
      const expense = Math.round(Math.random() * 400) + 50

      data.push({
        date: date.toISOString().split("T")[0],
        income,
        expense,
      })
    }

    return data
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-md shadow-lg">
          <p className="text-gray-300 mb-1">{formatDate(label)}</p>
          <p className="text-green-400 font-medium">Income: {formatCurrency(payload[0].value)}</p>
          <p className="text-red-400 font-medium">Expense: {formatCurrency(payload[1].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-white">Wallet Activity</CardTitle>
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="1W" className="text-white data-[state=active]:bg-white">
                1W
              </TabsTrigger>
              <TabsTrigger value="1M" className="text-white data-[state=active]:bg-white">
                1M
              </TabsTrigger>
              <TabsTrigger value="3M" className="text-white data-[state=active]:bg-white">
                3M
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] bg-gray-800/50 animate-pulse rounded-md"></div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="date" tickFormatter={formatDate} stroke="#718096" tick={{ fill: "#A0AEC0" }} />
                <YAxis tickFormatter={formatCurrency} stroke="#718096" tick={{ fill: "#A0AEC0" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
