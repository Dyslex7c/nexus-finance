"use client"

import type React from "react"

import { useState } from "react"
import { useFinance } from "./finance-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { IncomeSourceBarChart } from "./income-source-bar-chart"

interface IncomeFormProps {
  onSuccess?: () => void
}

export function IncomeForm({ onSuccess }: IncomeFormProps) {
  const { addIncome, incomeSources, frequencies } = useFinance()

  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [source, setSource] = useState("")
  const [frequency, setFrequency] = useState("monthly") // Default to monthly

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !source || !frequency) return

    // Add income
    addIncome({
      amount: Number.parseFloat(amount),
      description: description || `${source} income`,
      source: source as any,
      frequency: frequency as any,
    })

    // Reset form
    setAmount("")
    setDescription("")

    // Call success callback if provided
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <form onSubmit={handleAddIncome} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income-amount">Monthly Income Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="income-amount"
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
            <Label htmlFor="income-source">Income Source</Label>
            <Select value={source} onValueChange={setSource} required>
              <SelectTrigger id="income-source" className="bg-gray-800/50 border-gray-700">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {incomeSources.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-description">Description (Optional)</Label>
            <Input
              id="income-description"
              placeholder="E.g., March Salary"
              className="bg-gray-800/50 border-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency} required>
              <SelectTrigger id="income-frequency" className="bg-gray-800/50 border-gray-700">
                <SelectValue placeholder="How often?" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {frequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Income
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Income Breakdown</h3>
        <div className="h-[300px] bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
          <IncomeSourceBarChart />
        </div>
      </div>
    </div>
  )
}

