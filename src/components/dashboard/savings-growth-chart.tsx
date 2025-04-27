"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

type SavingsGrowthData = {
  month: string
  savings: number
}

export function SavingsGrowthChart() {
  const [timeRange, setTimeRange] = useState<"3months" | "6months" | "12months">("6months")
  const [data, setData] = useState<SavingsGrowthData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/finance/analytics?period=${timeRange}&type=savings`)

        if (!response.ok) {
          throw new Error("Failed to fetch savings growth data")
        }

        const result = await response.json()

        if (result.savingsGrowth && Array.isArray(result.savingsGrowth)) {
          setData(result.savingsGrowth)
        } else {
          // If the API doesn't return the expected format, create some placeholder data
          const months = timeRange === "3months" ? 3 : timeRange === "6months" ? 6 : 12
          const currentDate = new Date()
          const placeholderData: SavingsGrowthData[] = []

          for (let i = 0; i < months; i++) {
            const date = new Date(currentDate)
            date.setMonth(currentDate.getMonth() - (months - i - 1))
            const month = date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear()
            placeholderData.push({
              month,
              savings: 0,
            })
          }

          setData(placeholderData)
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching savings growth data:", err)
        setError("Failed to load savings data. Please try again later.")
        toast.error("Failed to load savings growth data")
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
          <CardTitle className="text-xl text-white">Savings Growth</CardTitle>
          <CardDescription className="text-gray-400">Track your cumulative savings over time</CardDescription>
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
              No savings data available for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                  formatter={(value) => [`$${value}`, "Cumulative Savings"]}
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "#f3f4f6" }}
                />
                <Area type="monotone" dataKey="savings" stroke="#8b5cf6" fill="url(#colorSavings)" strokeWidth={2} />
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
