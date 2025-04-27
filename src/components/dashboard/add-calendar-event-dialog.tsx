"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type EventType = "income" | "expense" | "bill" | "reminder"

interface FormData {
  title: string
  date: string
  time: string
  amount: string
  type: EventType
  category: string
  description: string
}


interface AddCalendarEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
}

export function AddCalendarEventDialog({ open, onOpenChange, selectedDate }: AddCalendarEventDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    date: selectedDate ? formatDateForInput(selectedDate) : formatDateForInput(new Date()),
    time: "12:00",
    amount: "",
    type: "reminder",
    category: "Other",
    description: "",
  })

  function formatDateForInput(date: Date) {
    return date.toISOString().split("T")[0]
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}:00`)

      const response = await fetch("/api/finance/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          date: dateTime.toISOString(),
          amount: formData.amount ? Number.parseFloat(formData.amount) : 0,
          type: formData.type,
          category: formData.category,
          description: formData.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add event")
      }

      toast.success("Event added successfully")
      onOpenChange(false)
      router.refresh()

      // Reset form
      setFormData({
        title: "",
        date: formatDateForInput(new Date()),
        time: "12:00",
        amount: "",
        type: "reminder",
        category: "Other",
        description: "",
      })
    } catch (error) {
      console.error("Error adding event:", error)
      toast.error("Failed to add event")
    } finally {
      setLoading(false)
    }
  }

  const isFinanceType = (type: EventType): type is "income" | "expense" | "bill" => {
    return type === "income" || type === "expense" || type === "bill"
  }
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-gray-800 border-gray-700"
              placeholder="e.g., Rent Payment, Salary Deposit"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem className="text-gray-400" value="income">Income</SelectItem>
                  <SelectItem className="text-gray-400" value="expense">Expense</SelectItem>
                  <SelectItem className="text-gray-400" value="bill">Bill</SelectItem>
                  <SelectItem className="text-gray-400" value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem className="text-gray-400" value="Housing">Housing</SelectItem>
                  <SelectItem className="text-gray-400" value="Utilities">Utilities</SelectItem>
                  <SelectItem className="text-gray-400" value="Food">Food</SelectItem>
                  <SelectItem className="text-gray-400" value="Transportation">Transportation</SelectItem>
                  <SelectItem className="text-gray-400" value="Healthcare">Healthcare</SelectItem>
                  <SelectItem className="text-gray-400" value="Insurance">Insurance</SelectItem>
                  <SelectItem className="text-gray-400" value="Salary">Salary</SelectItem>
                  <SelectItem className="text-gray-400" value="Investment">Investment</SelectItem>
                  <SelectItem className="text-gray-400" value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isFinanceType(formData.type) && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 min-h-[80px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-red-600 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {loading ? "Adding..." : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
