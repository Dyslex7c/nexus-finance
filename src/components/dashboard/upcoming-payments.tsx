"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Payment {
  _id: string;
  title: string;
  date: string;
  amount: number;
  category?: string;
  type: string;
  description?: string;
}

interface PaymentFormData {
  title: string;
  amount: string;
  date: string;
  category: string;
  type: string;
  description: string;
}

export function UpcomingPayments() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([])
  const [newPayment, setNewPayment] = useState<PaymentFormData>({
    title: "",
    amount: "",
    date: "",
    category: "",
    type: "bill",
    description: "",
  })

  // Fetch upcoming payments when component mounts
  useEffect(() => {
    const fetchUpcomingPayments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/finance/calendar")
        
        if (!response.ok) {
          throw new Error("Failed to fetch payments")
        }
        
        const data = await response.json()
        setUpcomingPayments(data)
      } catch (error) {
        console.error("Error fetching upcoming payments:", error)
        toast.error("Failed to load upcoming payments. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUpcomingPayments()
  }, [])

  const handleAddPayment = async () => {
    try {
      // Validate required fields
      if (!newPayment.title || !newPayment.date) {
        toast.error("Please provide at least a title and date.")
        return
      }

      // Format the payment data
      const paymentData = {
        title: newPayment.title,
        date: newPayment.date,
        amount: parseFloat(newPayment.amount) || 0,
        category: newPayment.category || "Other",
        type: "bill" as const,
        description: newPayment.description || "",
      }

      // Send the payment data to the API
      const response = await fetch("/api/finance/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error("Failed to add payment")
      }

      // Get the newly created payment from the response
      const newPaymentData = await response.json()

      // Add the new payment to the state
      setUpcomingPayments([...upcomingPayments, newPaymentData])

      // Close the dialog and reset the form
      setOpen(false)
      setNewPayment({
        title: "",
        amount: "",
        date: "",
        category: "",
        type: "bill",
        description: "",
      })

      toast.success("Payment added successfully.")
    } catch (error) {
      console.error("Error adding payment:", error)
      toast.error("Failed to add payment. Please try again.")
    }
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              Upcoming Payments
            </CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 hover:text-purple-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add Upcoming Payment</DialogTitle>
                  <DialogDescription className="text-gray-400">Schedule a new payment or bill to track</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Payment Title</Label>
                    <Input
                      id="title"
                      value={newPayment.title}
                      onChange={(e) => setNewPayment({ ...newPayment, title: e.target.value })}
                      placeholder="e.g., Rent, Utilities, etc."
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      placeholder="0.00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Due Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newPayment.date}
                      onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newPayment.category}
                      onValueChange={(value) => setNewPayment({ ...newPayment, category: value })}
                    >
                      <SelectTrigger id="category" className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Food">Food & Dining</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Debt">Debt Payments</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={newPayment.description}
                      onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                      placeholder="Additional details..."
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-700 hover:bg-gray-700">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddPayment}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  >
                    Add Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription className="text-gray-400">Scheduled bills and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[220px] pr-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-400">Loading payments...</p>
              </div>
            ) : upcomingPayments.length > 0 ? (
              <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between rounded-lg bg-gray-800/30 p-3 transition-colors hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-900/20 text-purple-400">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{payment.title}</p>
                        <p className="text-xs text-gray-400">
                          Due {formatDate(payment.date)}
                          {payment.category && ` · ${payment.category}`}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-red-400">-${parseFloat(payment.amount.toString()).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-400">No upcoming payments</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}