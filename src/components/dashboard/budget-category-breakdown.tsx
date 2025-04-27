"use client"

import { useFinance } from "./finance-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function BudgetCategoryBreakdown() {
  const { expensesByCategory, expenseCategories } = useFinance()

  // Colors for different categories
  const COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#ef4444", // red
    "#84cc16", // lime
    "#6366f1", // indigo
    "#14b8a6", // teal
  ]

  // Format data for chart
  const data = Object.entries(expensesByCategory).map(([category, value], index) => {
    const categoryLabel = expenseCategories.find((c) => c.value === category)?.label || category
    return {
      name: categoryLabel,
      value,
      color: COLORS[index % COLORS.length],
    }
  })

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50 h-full">
        <CardHeader>
          <CardTitle className="text-xl text-white">Budget Breakdown</CardTitle>
          <CardDescription className="text-gray-400">How your budget is distributed</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-gray-400">
            No budget data available. Set up your budget allocations to see the breakdown.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50 h-full">
      <CardHeader>
        <CardTitle className="text-xl text-white">Budget Breakdown</CardTitle>
        <CardDescription className="text-gray-400">How your budget is distributed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
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
        </div>
      </CardContent>
    </Card>
  )
}
