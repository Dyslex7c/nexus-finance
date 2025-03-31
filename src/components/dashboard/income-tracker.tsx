"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { IncomeSourceBarChart } from "./income-source-bar-chart"

export function IncomeTracker() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [source, setSource] = useState("")
  const [frequency, setFrequency] = useState("")

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the income to a database
    console.log({ amount, description, source, frequency })
    // Reset form
    setAmount("")
    setDescription("")
    setSource("")
    setFrequency("")
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-xl text-white">Income Tracker</CardTitle>
        <CardDescription className="text-gray-400">Track your income sources and recurring payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[200px]">
          <IncomeSourceBarChart />
        </div>

        <form onSubmit={handleAddIncome} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income-amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <Input
                  id="income-amount"
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
              <Label htmlFor="income-source">Source</Label>
              <Select value={source} onValueChange={setSource} required>
                <SelectTrigger id="income-source" className="bg-gray-800/50 border-gray-700">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="investments">Investments</SelectItem>
                  <SelectItem value="rental">Rental Income</SelectItem>
                  <SelectItem value="side-business">Side Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income-description">Description</Label>
              <Input
                id="income-description"
                placeholder="Income description"
                className="bg-gray-800/50 border-gray-700"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="income-frequency">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency} required>
                <SelectTrigger id="income-frequency" className="bg-gray-800/50 border-gray-700">
                  <SelectValue placeholder="How often?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAddIncome}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Income
        </Button>
      </CardFooter>
    </Card>
  )
}

