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

interface AddFundsDialogProps {
  isOpen: boolean
  onClose: () => void
  goalId: string
  goalName: string
  onAddFunds: (goalId: string, amount: number) => Promise<void>
}

export function AddFundsDialog({ isOpen, onClose, goalId, goalName, onAddFunds }: AddFundsDialogProps) {
  const [amount, setAmount] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const numAmount = Number.parseFloat(amount)

    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0")
      return
    }

    setIsSubmitting(true)
    try {
      await onAddFunds(goalId, numAmount)
      setAmount("")
      setError("")
      onClose()
    } catch (error) {
      console.error("Error adding funds:", error)
      setError("Failed to add funds. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Add Funds to {goalName}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the amount you want to add to this savings goal.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError("")
              }}
              placeholder="0.00"
              className="bg-gray-700 border-gray-600 text-white"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
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
            {isSubmitting ? "Adding..." : "Add Funds"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}