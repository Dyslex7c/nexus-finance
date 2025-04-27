"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

type CategoryData = {
  category: string
  amount: number
}

export function CategoryComparisonChart() {
  const [timeRange, setTimeRange] = useState<"3months" | "6months" | "12months">("3months")
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Colors for different categories
  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#ef4444",
    "#84cc16",
    "#6366f1",
    "#14b8a6",
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/finance/analytics?period=${timeRange}`)

        if (!response.ok) {
          throw new Error("Failed to fetch category comparison data")
        }

        const result = await response.json()
        setData(result.categoryComparison)
        setError(null)
      } catch (err) {
        console.error("Error fetching category comparison data:", err)
        setError("Failed to load category data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.amount, 0)

  // Format data for chart with colors
  const chartData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
    percentage: total > 0 ? ((item.amount / total) * 100).toFixed(1) : 0,
  }))

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-white">Expense Categories</CardTitle>
          <CardDescription className="text-gray-400">Breakdown of expenses by category</CardDescription>
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
              No category data available for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="amount"
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value}`, "Amount"]}
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "#f3f4f6" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: "10px" }}
                  formatter={(value) => <span style={{ color: "#f3f4f6" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
