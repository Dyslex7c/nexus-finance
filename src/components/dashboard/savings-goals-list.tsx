"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CreateGoalDialog } from "@/components/dashboard/create-goal-dialog"
import { toast } from "sonner"

interface SavingsGoal {
  _id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
}

export function SavingsGoalsList() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/finance/savings-goal")

      if (!response.ok) {
        throw new Error("Failed to fetch savings goals")
      }

      const data = await response.json()
      setGoals(data.savingsGoals || [])
    } catch (error) {
      console.error("Error fetching savings goals:", error)
      toast.error("Failed to load savings goals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/finance/savings-goal/${goalId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete savings goal")
      }

      toast.success("Savings goal deleted successfully")
      fetchGoals() // Refresh the list
    } catch (error) {
      console.error("Error deleting savings goal:", error)
      toast.error("Failed to delete savings goal")
    }
  }

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal)
    setDialogOpen(true)
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDialogClose = (refreshData = false) => {
    setDialogOpen(false)
    setEditingGoal(null)
    if (refreshData) {
      fetchGoals()
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-white">Your Savings Goals</CardTitle>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus className="h-4 w-4 mr-1" /> New Goal
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-gray-700 rounded w-full mb-4"></div>
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 mb-4">You don't have any savings goals yet.</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-1" /> Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal._id} className="border border-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-white">{goal.name}</h4>
                    <p className="text-sm text-gray-400">Target: {formatDate(goal.targetDate)}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-white"
                      onClick={() => handleEditGoal(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteGoal(goal._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(goal.currentAmount, goal.targetAmount)}
                    className="h-2 bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-purple-500"
                    />
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">
                      {calculateProgress(goal.currentAmount, goal.targetAmount)}% Complete
                    </span>
                    <span className="text-gray-400">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)} to go
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CreateGoalDialog open={dialogOpen} onOpenChange={handleDialogClose} existingGoal={editingGoal} />
    </Card>
  )
}
