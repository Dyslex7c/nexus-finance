"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

type IncomeExpenseData = {
  month: string
  income: number
  expense: number
  savings: number
}

export function IncomeVsExpenseChart() {
  const [timeRange, setTimeRange] = useState<"3months" | "6months" | "12months">("6months")
  const [data, setData] = useState<IncomeExpenseData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/finance/analytics?period=${timeRange}`)

        if (!response.ok) {
          throw new Error("Failed to fetch income vs expense data")
        }

        const result = await response.json()
        setData(result.incomeVsExpense)
        setError(null)
      } catch (err) {
        console.error("Error fetching income vs expense data:", err)
        setError("Failed to load comparison data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-white">Income vs Expenses</CardTitle>
          <CardDescription className="text-gray-400">Monthly comparison of income and expenses</CardDescription>
        </div>
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
              No income and expense data available for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="month"
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
                  formatter={(value) => [`$${value}`, ""]}
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "#f3f4f6" }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => <span style={{ color: "#f3f4f6" }}>{value}</span>}
                />
                <Bar name="Income" dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="Expenses" dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
