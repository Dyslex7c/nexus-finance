"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface SavingsGoal {
  _id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
}

interface CreateGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean, refresh?: boolean) => void
  existingGoal?: SavingsGoal | null
}

export function CreateGoalDialog({ open, onOpenChange, existingGoal = null }: CreateGoalDialogProps) {
  const [name, setName] = useState(existingGoal?.name || "")
  const [targetAmount, setTargetAmount] = useState(existingGoal?.targetAmount?.toString() || "")
  const [currentAmount, setCurrentAmount] = useState(existingGoal?.currentAmount?.toString() || "0")
  const [targetDate, setTargetDate] = useState(
    existingGoal?.targetDate ? new Date(existingGoal.targetDate).toISOString().split("T")[0] : "",
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !targetAmount || !targetDate) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)

      const goalData = {
        name,
        targetAmount: Number.parseFloat(targetAmount),
        currentAmount: Number.parseFloat(currentAmount || "0"),
        targetDate,
      }

      const url = existingGoal ? `/api/finance/savings-goal/${existingGoal._id}` : "/api/finance/savings-goal"

      const method = existingGoal ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${existingGoal ? "update" : "create"} savings goal`)
      }

      toast.success(`Savings goal ${existingGoal ? "updated" : "created"} successfully`)
      onOpenChange(false, true) // Close dialog and refresh data

      // Reset form
      if (!existingGoal) {
        setName("")
        setTargetAmount("")
        setCurrentAmount("0")
        setTargetDate("")
      }
    } catch (error) {
      console.error(`Error ${existingGoal ? "updating" : "creating"} savings goal:`, error)
      toast.error(`Failed to ${existingGoal ? "update" : "create"} savings goal`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingGoal ? "Edit Savings Goal" : "Create New Savings Goal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emergency Fund"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount ($)</Label>
            <Input
              id="targetAmount"
              type="number"
              min="0"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="e.g., 10000"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          {existingGoal && (
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Current Amount ($)</Label>
              <Input
                id="currentAmount"
                type="number"
                min="0"
                step="0.01"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="e.g., 2500"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-red-600 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : existingGoal ? "Update Goal" : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
