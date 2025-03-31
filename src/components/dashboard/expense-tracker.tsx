"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { ExpenseCategoryPieChart } from "./expense-category-pie-chart"

export function ExpenseTracker() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the expense to a database
    console.log({ amount, description, category })
    // Reset form
    setAmount("")
    setDescription("")
    setCategory("")
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-xl text-white">Expense Tracker</CardTitle>
        <CardDescription className="text-gray-400">Add and categorize your expenses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[200px]">
          <ExpenseCategoryPieChart />
        </div>

        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8 bg-gray-800/50 border-gray-700"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-gray-800/50 border-gray-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="debt">Debt Payments</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this expense for?"
              className="bg-gray-800/50 border-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAddExpense}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </CardFooter>
    </Card>
  )
}

