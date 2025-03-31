"use client"

import { useFinance } from "./finance-context"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export function MonthlySpendingChart() {
  const { monthlyIncome, monthlyExpenses } = useFinance()

  // In a real app, this would come from historical data in your database
  // For now, we'll create sample data with the current month's actual values
  const currentMonth = new Date().toLocaleString("default", { month: "short" })

  const data = [
    { month: "Jan", expenses: 2850, income: 4500 },
    { month: "Feb", expenses: 3100, income: 4500 },
    { month: currentMonth, expenses: monthlyExpenses, income: monthlyIncome },
    // Future months would be projections in a real app
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
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
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

