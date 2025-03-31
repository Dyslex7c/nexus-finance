"use client"

import { useFinance } from "./finance-context"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function ExpenseCategoryPieChart() {
  const { expenses, expenseCategories } = useFinance()

  // Group expenses by category
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0
      }
      acc[expense.category] += expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

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
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No expense data yet. Add your first expense to see the chart.
      </div>
    )
  }

  return (
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
  )
}

