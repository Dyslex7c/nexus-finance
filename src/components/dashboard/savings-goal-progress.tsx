"use client"

import { useState } from "react"
import { useFinance } from "./finance-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddFundsDialog } from "./add-funds-dialog"
import { CreateGoalDialog } from "./create-goal-dialog"

export function SavingsGoalProgress() {
  const { savings, savingsGoals, addFundsToGoal, createSavingsGoal, isLoading } = useFinance()

  // State for managing dialogs
  const [addFundsDialogOpen, setAddFundsDialogOpen] = useState(false)
  const [createGoalDialogOpen, setCreateGoalDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<{ id: string; name: string } | null>(null)
  console.log(selectedGoal?.id);
  
  // Handler for opening the add funds dialog
  const handleOpenAddFundsDialog = (goalId: string, goalName: string) => {
    setSelectedGoal({ id: goalId, name: goalName })
    setAddFundsDialogOpen(true)
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center text-gray-400">
        Loading savings goals...
      </div>
    )
  }

  // If no savings goals, show placeholder
  if (savingsGoals.length === 0) {
    return (
      <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center text-gray-400">
        <p className="mb-4">You haven't created any savings goals yet.</p>
        <Button
          onClick={() => setCreateGoalDialogOpen(true)}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Savings Goal
        </Button>
        <CreateGoalDialog
          isOpen={createGoalDialogOpen}
          onClose={() => setCreateGoalDialogOpen(false)}
          onCreateGoal={createSavingsGoal}
        />
      </div>
    )
  }

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
        {savingsGoals.map((goal) => {
          // Calculate percentage
          const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)

          return (
            <Card key={goal.id} className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-white mb-2">{goal.name}</h3>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>${goal.currentAmount.toFixed(2)}</span>
                  <span>${goal.targetAmount.toLocaleString()}</span>
                </div>
                <Progress value={percentage} className="h-2 mb-4 bg-gray-700 [&>div]:bg-cyan-500" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{percentage.toFixed(0)}% complete</span>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 hover:bg-gray-700 hover:text-white"
                  onClick={() => handleOpenAddFundsDialog(goal.id, goal.name)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Funds
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Button
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
        onClick={() => setCreateGoalDialogOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Create New Savings Goal
      </Button>

      {/* Add Funds Dialog */}
      {selectedGoal && (
        <AddFundsDialog
          isOpen={addFundsDialogOpen}
          onClose={() => {
            setAddFundsDialogOpen(false)
            setSelectedGoal(null)
          }}
          goalId={selectedGoal.id}
          goalName={selectedGoal.name}
          onAddFunds={addFundsToGoal}
        />
      )}

      {/* Create Goal Dialog */}
      <CreateGoalDialog
        isOpen={createGoalDialogOpen}
        onClose={() => setCreateGoalDialogOpen(false)}
        onCreateGoal={createSavingsGoal}
      />
    </div>
  )
}
