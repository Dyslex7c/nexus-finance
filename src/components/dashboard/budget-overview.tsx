"use client"

import { useEffect, useState } from "react"
import { useFinance } from "./finance-context"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function BudgetOverview() {
  const { monthlyIncome, expensesByCategory, expenseCategories } = useFinance()
  const [budgetAllocations, setBudgetAllocations] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBudgetAllocations = async () => {
      try {
        setIsLoading(true)
        // Get current month in YYYY-MM format
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        
        const response = await fetch(`/api/finance/budget-allocation?month=${currentMonth}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget allocations')
        }
        
        const data = await response.json()
        
        // Convert array of allocations to an object keyed by category
        const allocationsObject = data.budgetAllocations.reduce((acc: { [x: string]: number }, allocation: { category: string | number; percentage: number }) => {
          acc[allocation.category] = allocation.percentage / 100
          return acc
        }, {})
        
        setBudgetAllocations(allocationsObject)
      } catch (err: any) {
        setError(err.message)
        console.error("Error fetching budget allocations:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBudgetAllocations()
  }, []) // Empty dependency array means this runs once on mount

  // Calculate budget amounts based on income and allocations from API
  const budgetAmounts = Object.entries(budgetAllocations).reduce(
    (acc, [category, percentage]) => {
      acc[category] = monthlyIncome * (percentage as number)
      return acc
    },
    {} as Record<string, number>,
  )

  // Prepare data for display
  const budgetCategories = expenseCategories.map(({ value, label }) => {
    const budgeted = budgetAmounts[value] || 0
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

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center text-gray-400">
        Loading budget allocations...
      </div>
    )
  }

  // If error, show error state
  if (error) {
    return (
      <div className="p-6 bg-red-900/20 rounded-lg border border-red-900/50 text-center text-red-400">
        Error loading budget allocations: {error}
      </div>
    )
  }

  // If no income, show placeholder
  if (monthlyIncome === 0) {
    return (
      <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center text-gray-400">
        Add your monthly income to see budget allocations.
      </div>
    )
  }

  // If no allocations found, show message
  if (Object.keys(budgetAllocations).length === 0) {
    return (
      <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center text-gray-400">
        No budget allocations found. Please set up your budget allocations.
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