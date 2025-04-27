"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Sample budget history data
const budgetHistoryData = {
  "3months": [
    { month: "Jan", budgeted: 4000, spent: 3800 },
    { month: "Feb", budgeted: 4200, spent: 4100 },
    { month: "Mar", budgeted: 4000, spent: 3950 },
  ],
  "6months": [
    { month: "Oct", budgeted: 3800, spent: 3700 },
    { month: "Nov", budgeted: 3900, spent: 4000 },
    { month: "Dec", budgeted: 4100, spent: 4300 },
    { month: "Jan", budgeted: 4000, spent: 3800 },
    { month: "Feb", budgeted: 4200, spent: 4100 },
    { month: "Mar", budgeted: 4000, spent: 3950 },
  ],
  "12months": [
    { month: "Apr", budgeted: 3700, spent: 3600 },
    { month: "May", budgeted: 3750, spent: 3700 },
    { month: "Jun", budgeted: 3800, spent: 3750 },
    { month: "Jul", budgeted: 3850, spent: 3900 },
    { month: "Aug", budgeted: 3900, spent: 3800 },
    { month: "Sep", budgeted: 3950, spent: 3850 },
    { month: "Oct", budgeted: 3800, spent: 3700 },
    { month: "Nov", budgeted: 3900, spent: 4000 },
    { month: "Dec", budgeted: 4100, spent: 4300 },
    { month: "Jan", budgeted: 4000, spent: 3800 },
    { month: "Feb", budgeted: 4200, spent: 4100 },
    { month: "Mar", budgeted: 4000, spent: 3950 },
  ],
}

export function BudgetHistory() {
  const [timeRange, setTimeRange] = useState<"3months" | "6months" | "12months">("3months")

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-white">Budget History</CardTitle>
          <CardDescription className="text-gray-400">
            Compare your budgeted amounts with actual spending over time
          </CardDescription>
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
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetHistoryData[timeRange]} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                formatter={(value) => [`$${value}`, "Amount"]}
                contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                itemStyle={{ color: "#f3f4f6" }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => <span style={{ color: "#f3f4f6" }}>{value}</span>}
              />
              <Bar name="Budgeted" dataKey="budgeted" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar name="Spent" dataKey="spent" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
