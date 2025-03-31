"use client"

import { useFinance } from "./finance-context"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function BudgetOverview() {
  const { monthlyIncome, expensesByCategory, expenseCategories } = useFinance()

  // Define budget allocations as percentages of income
  // In a real app, these would be user-defined
  const budgetAllocations = {
    housing: 0.3, // 30% of income
    transportation: 0.15,
    food: 0.15,
    utilities: 0.1,
    entertainment: 0.05,
    healthcare: 0.05,
    shopping: 0.05,
    personal: 0.05,
    debt: 0.05,
    other: 0.05,
  }

  // Calculate budget amounts based on income
  const budgetAmounts = Object.entries(budgetAllocations).reduce(
    (acc, [category, percentage]) => {
      acc[category as keyof typeof budgetAllocations] = monthlyIncome * percentage
      return acc
    },
    {} as Record<keyof typeof budgetAllocations, number>,
  )

  // Prepare data for display
  const budgetCategories = expenseCategories.map(({ value, label }) => {
    const budgeted = budgetAmounts[value as keyof typeof budgetAllocations] || 0
    const spent = expensesByCategory[value as keyof typeof expensesByCategory] || 0
    const remaining = budgeted - spent
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0

    return {
      category: label,
      budgeted,
      spent,
      remaining,
      percentage,
    }
  })

  // If no income, show placeholder
  if (monthlyIncome === 0) {
    return (
      <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center text-gray-400">
        Add your monthly income to see budget allocations.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {budgetCategories.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white">{item.category}</span>
            <span className="text-sm text-gray-400">
              ${item.spent.toFixed(2)} / ${item.budgeted.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Progress
              value={item.percentage > 100 ? 100 : item.percentage}
              className={`h-2 ${
                item.percentage >= 100
                  ? "bg-gray-800 [&>div]:bg-red-500"
                  : item.percentage >= 80
                    ? "bg-gray-800 [&>div]:bg-yellow-500"
                    : "bg-gray-800 [&>div]:bg-green-500"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                item.percentage >= 100 ? "text-red-400" : item.percentage >= 80 ? "text-yellow-400" : "text-green-400"
              }`}
            >
              {item.percentage.toFixed(0)}%
            </span>
          </div>
          {item.percentage > 100 && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-400 py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Over budget by ${Math.abs(item.remaining).toFixed(2)}</AlertDescription>
            </Alert>
          )}
        </div>
      ))}
    </div>
  )
}

