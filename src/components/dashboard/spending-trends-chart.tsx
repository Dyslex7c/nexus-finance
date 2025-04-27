"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

type SpendingTrendsData = {
  date: string
  amount: number
}

export function SpendingTrendsChart() {
  const [timeRange, setTimeRange] = useState<"3months" | "6months" | "12months">("3months")
  const [data, setData] = useState<SpendingTrendsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/finance/analytics?period=${timeRange}`)

        if (!response.ok) {
          throw new Error("Failed to fetch spending trends data")
        }

        const result = await response.json()
        setData(result.spendingTrends)
        setError(null)
      } catch (err) {
        console.error("Error fetching spending trends:", err)
        setError("Failed to load spending data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Process data for chart
  const chartData = data.map((item) => ({
    ...item,
    formattedDate: formatDate(item.date),
  }))

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-white">Spending Trends</CardTitle>
          <CardDescription className="text-gray-400">Track your spending patterns over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(value: "3months" | "6months" | "12months") => setTimeRange(value)}>
          <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem className="text-gray-400" value="3months">Last 3 Months</SelectItem>
            <SelectItem className="text-gray-400" value="6months">Last 6 Months</SelectItem>
            <SelectItem className="text-gray-400" value="12months">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {loading ? (
            <div className="flex flex-col gap-4 h-full justify-center">
              <Skeleton className="h-4 w-full bg-gray-700/50" />
              <Skeleton className="h-4 w-3/4 bg-gray-700/50" />
              <Skeleton className="h-4 w-4/5 bg-gray-700/50" />
              <Skeleton className="h-4 w-2/3 bg-gray-700/50" />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-red-400">{error}</div>
          ) : data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-400">
              No spending data available for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fill: "#9ca3af" }}
                  axisLine={{ stroke: "#4b5563" }}
                  tickLine={{ stroke: "#4b5563" }}
                />
                <YAxis
                  tick={{ fill: "#9ca3af" }}
                  axisLine={{ stroke: "#4b5563" }}
                  tickLine={{ stroke: "#4b5563" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Amount"]}
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "#f3f4f6" }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => <span style={{ color: "#f3f4f6" }}>{value}</span>}
                />
                <Line
                  name="Spending"
                  type="monotone"
                  dataKey="amount"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
