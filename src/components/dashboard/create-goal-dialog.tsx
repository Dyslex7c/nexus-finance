"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateGoalDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateGoal: (name: string, targetAmount: number, targetDate: string) => Promise<void>
}

export function CreateGoalDialog({ isOpen, onClose, onCreateGoal }: CreateGoalDialogProps) {
  const [name, setName] = useState<string>("")
  const [targetAmount, setTargetAmount] = useState<string>("")
  const [targetDate, setTargetDate] = useState<string>("")
  const [errors, setErrors] = useState<{
    name?: string
    targetAmount?: string
    targetDate?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: {
      name?: string
      targetAmount?: string
      targetDate?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Goal name is required"
    }

    const numTarget = Number.parseFloat(targetAmount)
    if (isNaN(numTarget) || numTarget <= 0) {
      newErrors.targetAmount = "Please enter a valid target amount greater than 0"
    }

    if (!targetDate) {
      newErrors.targetDate = "Target date is required"
    } else {
      const selectedDate = new Date(targetDate)
      const today = new Date()
      if (selectedDate <= today) {
        newErrors.targetDate = "Target date must be in the future"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        await onCreateGoal(name, Number.parseFloat(targetAmount), targetDate)
        resetForm()
        onClose()
      } catch (error) {
        console.error("Error creating goal:", error)
        setErrors({ ...errors, name: "Failed to create goal. Please try again." })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const resetForm = () => {
    setName("")
    setTargetAmount("")
    setTargetDate("")
    setErrors({})
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Create New Savings Goal</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set up a new savings goal to track your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors({ ...errors, name: undefined })
              }}
              placeholder="e.g., Vacation, New Car"
              className="bg-gray-700 border-gray-600 text-white"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount ($)</Label>
            <Input
              id="targetAmount"
              type="number"
              min="0.01"
              step="0.01"
              value={targetAmount}
              onChange={(e) => {
                setTargetAmount(e.target.value)
                setErrors({ ...errors, targetAmount: undefined })
              }}
              placeholder="0.00"
              className="bg-gray-700 border-gray-600 text-white"
            />
            {errors.targetAmount && <p className="text-red-500 text-sm">{errors.targetAmount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => {
                setTargetDate(e.target.value)
                setErrors({ ...errors, targetDate: undefined })
              }}
              className="bg-gray-700 border-gray-600 text-white"
            />
            {errors.targetDate && <p className="text-red-500 text-sm">{errors.targetDate}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 hover:bg-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
