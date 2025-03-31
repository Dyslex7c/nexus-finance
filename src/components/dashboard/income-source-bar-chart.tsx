"use client"

import { useFinance } from "./finance-context"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function IncomeSourceBarChart() {
  const { incomes, incomeSources } = useFinance()

  // Group incomes by source
  const incomeBySource = incomes.reduce(
    (acc, income) => {
      if (!acc[income.source]) {
        acc[income.source] = 0
      }
      acc[income.source] += income.amount
      return acc
    },
    {} as Record<string, number>,
  )

  // Format data for chart
  const data = Object.entries(incomeBySource).map(([source, amount]) => {
    const sourceLabel = incomeSources.find((s) => s.value === source)?.label || source
    return {
      name: sourceLabel,
      amount,
    }
  })

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No income data yet. Add your first income to see the chart.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
        <XAxis
          dataKey="name"
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
        <Bar dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

