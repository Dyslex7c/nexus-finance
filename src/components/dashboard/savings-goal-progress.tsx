"use client"

import { useFinance } from "./finance-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function SavingsGoalProgress() {
  const { savings } = useFinance()

  // Sample data - in a real app, these would be user-defined and stored in a database
  const savingsGoals = [
    {
      id: 1,
      name: "Emergency Fund",
      target: 10000,
      current: savings > 0 ? savings * 0.5 : 0, // 50% of savings allocated to emergency fund
      targetDate: "2025-12-31",
    },
    {
      id: 2,
      name: "Vacation",
      target: 3000,
      current: savings > 0 ? savings * 0.3 : 0, // 30% of savings
      targetDate: "2025-07-15",
    },
    {
      id: 3,
      name: "New Laptop",
      target: 1500,
      current: savings > 0 ? savings * 0.2 : 0, // 20% of savings
      targetDate: "2025-05-01",
    },
  ]

  // Calculate percentages
  const goalsWithPercentages = savingsGoals.map((goal) => ({
    ...goal,
    percentage: Math.min(100, (goal.current / goal.target) * 100),
  }))

  // If no savings, show placeholder
  if (savings <= 0) {
    return (
      <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center text-gray-400">
        Add income and expenses to start tracking your savings goals.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goalsWithPercentages.map((goal) => (
          <Card key={goal.id} className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-white mb-2">{goal.name}</h3>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>${goal.current.toFixed(2)}</span>
                <span>${goal.target.toLocaleString()}</span>
              </div>
              <Progress value={goal.percentage} className="h-2 mb-4 bg-gray-700 [&>div]:bg-cyan-500" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{goal.percentage.toFixed(0)}% complete</span>
                <span className="text-xs text-gray-500">
                  Target:{" "}
                  {new Date(goal.targetDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full border-gray-700 hover:bg-gray-700 hover:text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Funds
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
        <PlusCircle className="mr-2 h-4 w-4" /> Create New Savings Goal
      </Button>
    </div>
  )
}

