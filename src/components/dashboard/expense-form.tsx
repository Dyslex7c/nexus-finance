"use client"

import type React from "react"

import { useState } from "react"
import { useFinance } from "./finance-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { ExpenseCategoryPieChart } from "./expense-category-pie-chart"

export function ExpenseForm() {
  const { addExpense, expenseCategories } = useFinance()

  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !category) return

    // Add expense
    addExpense({
      amount: Number.parseFloat(amount),
      description: description || `${category} expense`,
      category: category as any,
    })

    // Reset form
    setAmount("")
    setDescription("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense-amount">Expense Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-8 bg-gray-800/50 border-gray-700"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-category">Expense Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="expense-category" className="bg-gray-800/50 border-gray-700">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {expenseCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-description">Description (Optional)</Label>
            <Input
              id="expense-description"
              placeholder="What was this expense for?"
              className="bg-gray-800/50 border-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Expense Breakdown</h3>
        <div className="h-[300px] bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
          <ExpenseCategoryPieChart />
        </div>
      </div>
    </div>
  )
}

