"use client"

import { useState, useEffect } from "react"
import { useFinance } from "./finance-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function BudgetPlanner() {
  const { monthlyIncome, expenseCategories } = useFinance()

  // Initialize budget allocations with default values
  const [budgetAllocations, setBudgetAllocations] = useState(
    expenseCategories.reduce(
      (acc, category) => {
        acc[category.value] = {
          amount: 0,
          percentage: 0,
        }
        return acc
      },
      {} as Record<string, { amount: number; percentage: number }>,
    ),
  )

  const [totalAllocated, setTotalAllocated] = useState(0)
  const [remainingBudget, setRemainingBudget] = useState(monthlyIncome)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch existing budget allocations on component mount
  useEffect(() => {
    const fetchBudgetAllocations = async () => {
      try {
        setIsLoading(true)
        // Get current month in YYYY-MM format
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        
        const response = await fetch(`/api/finance/budget-allocation?month=${currentMonth}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget allocations')
        }
        
        const data = await response.json()
        
        if (data.budgetAllocations && data.budgetAllocations.length > 0) {
          // Convert API data to our local state format
          const allocations = {} as Record<string, { amount: number; percentage: number }>
          let total = 0
          
          data.budgetAllocations.forEach((allocation: { category: string | number; amount: number; percentage: any }) => {
            allocations[allocation.category] = {
              amount: allocation.amount,
              percentage: allocation.percentage,
            }
            total += allocation.amount
          })
          
          setBudgetAllocations(allocations)
          setTotalAllocated(total)
          setRemainingBudget(monthlyIncome - total)
        }
      } catch (error) {
        console.error("Error fetching budget allocations:", error)
        toast.error("Failed to load existing budget allocations")
      } finally {
        setIsLoading(false)
      }
    }

    if (monthlyIncome > 0) {
      fetchBudgetAllocations()
    } else {
      setIsLoading(false)
    }
  }, [monthlyIncome])

  // Update budget allocation for a category
  const updateBudgetAllocation = (category: string, amount: number) => {
    const newAllocations = { ...budgetAllocations }

    // Calculate the difference between new and old amount
    const difference = amount - (newAllocations[category]?.amount || 0)

    // Update the amount and percentage for this category
    newAllocations[category] = {
      amount,
      percentage: monthlyIncome > 0 ? (amount / monthlyIncome) * 100 : 0,
    }

    // Update total allocated and remaining budget
    const newTotalAllocated = totalAllocated + difference
    const newRemainingBudget = monthlyIncome - newTotalAllocated

    setBudgetAllocations(newAllocations)
    setTotalAllocated(newTotalAllocated)
    setRemainingBudget(newRemainingBudget)
  }

  // Handle slider change
  const handleSliderChange = (category: string, value: number[]) => {
    const percentage = value[0]
    const amount = (percentage / 100) * monthlyIncome

    updateBudgetAllocation(category, amount)
  }

  // Handle amount input change
  const handleAmountChange = (category: string, value: string) => {
    const amount = Number.parseFloat(value) || 0
    updateBudgetAllocation(category, amount)
  }

  // Save budget allocations
  const saveBudgetAllocations = async () => {
    try {
      setIsSaving(true)
      
      // Get current month in YYYY-MM format
      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      
      // Transform budget allocations for API
      const allocations = Object.entries(budgetAllocations).map(([category, values]) => ({
        category,
        amount: values.amount,
        percentage: values.percentage
      }))
      
      // Prepare API payload
      const payload = {
        month: currentMonth,
        totalIncome: monthlyIncome,
        allocations
      }
      
      // Call API
      const response = await fetch("/api/finance/budget-allocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save budget allocations")
      }
      
      toast.success("Budget allocations saved successfully")
    } catch (error) {
      console.error("Error saving budget allocations:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save budget allocations")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
        <CardContent className="p-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
          <span className="ml-2 text-gray-400">Loading budget allocations...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-xl text-white">Budget Planner</CardTitle>
        <CardDescription className="text-gray-400">
          Allocate your monthly income of ${monthlyIncome.toFixed(2)} across different categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between rounded-lg bg-gray-800/50 p-4">
          <div>
            <p className="text-sm text-gray-400">Total Allocated</p>
            <p className="text-lg font-medium text-white">${totalAllocated.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Remaining Budget</p>
            <p className={`text-lg font-medium ${remainingBudget >= 0 ? "text-green-400" : "text-red-400"}`}>
              ${remainingBudget.toFixed(2)}
            </p>
          </div>
          <Button
            onClick={saveBudgetAllocations}
            disabled={isSaving || monthlyIncome <= 0}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Budget
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {expenseCategories.map((category) => {
            const allocation = budgetAllocations[category.value] || { amount: 0, percentage: 0 }

            return (
              <div key={category.value} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`budget-${category.value}`} className="text-white">
                    {category.label}
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{allocation.percentage.toFixed(1)}%</span>
                    <div className="relative w-24">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <Input
                        id={`budget-${category.value}`}
                        type="number"
                        min="0"
                        step="1"
                        value={allocation.amount.toFixed(2)}
                        onChange={(e) => handleAmountChange(category.value, e.target.value)}
                        className="pl-8 bg-gray-800/50 border-gray-700 text-white"
                        disabled={monthlyIncome <= 0}
                      />
                    </div>
                  </div>
                </div>
                <Slider
                  value={[allocation.percentage]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={(value) => handleSliderChange(category.value, value)}
                  className="[&>span]:bg-gray-700 [&>span]:h-2 [&>span]:rounded-full [&>span>span]:bg-gradient-to-r [&>span>span]:from-cyan-500 [&>span>span]:to-purple-600"
                  disabled={monthlyIncome <= 0}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}