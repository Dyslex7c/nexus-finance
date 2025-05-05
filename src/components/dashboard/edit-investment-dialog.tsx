"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Investment {
  id: string
  name: string
  symbol: string
  shares: number
  purchasePrice: number
  currentPrice: number
  type: string
  purchaseDate: string
  notes?: string
}

interface EditInvestmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  investmentId: string | null
  onSuccess?: () => void
}

// Add onSuccess callback to refresh the investments list after editing an investment
export function EditInvestmentDialog({ open, onOpenChange, investmentId, onSuccess }: EditInvestmentDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    shares: "",
    purchasePrice: "",
    currentPrice: "",
    type: "stock",
    purchaseDate: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && investmentId) {
      fetchInvestment(investmentId)
    }
  }, [open, investmentId])

  const fetchInvestment = async (id: string) => {
    try {
      setFetchLoading(true)
      const response = await fetch(`/api/finance/investments/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch investment")
      }

      const data = await response.json()

      // Format the date to YYYY-MM-DD for the input field
      const purchaseDate = data.purchaseDate ? new Date(data.purchaseDate).toISOString().split("T")[0] : ""

      setFormData({
        name: data.name || "",
        symbol: data.symbol || "",
        shares: data.amount?.toString() || "",
        purchasePrice: data.purchasePrice?.toString() || "",
        currentPrice: data.currentValue?.toString() || "",
        type: data.type || "stock",
        purchaseDate: purchaseDate,
        notes: data.notes || "",
      })
    } catch (error) {
      console.error("Error fetching investment:", error)
      toast.error("Failed to load investment details")
      onOpenChange(false)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/finance/investments/${investmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          symbol: formData.symbol,
          shares: Number.parseFloat(formData.shares),
          purchasePrice: Number.parseFloat(formData.purchasePrice),
          currentValue: Number.parseFloat(formData.currentPrice),
          type: formData.type,
          purchaseDate: formData.purchaseDate,
          notes: formData.notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update investment")
      }

      toast.success("Investment updated successfully")
      onOpenChange(false)

      // Call the onSuccess callback to refresh the investments list
      if (typeof onSuccess === "function") {
        onSuccess()
      }
    } catch (error) {
      console.error("Error updating investment:", error)
      toast.error("Failed to update investment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Edit Investment</DialogTitle>
        </DialogHeader>
        {fetchLoading ? (
          <div className="space-y-4 py-4">
            <div className="h-8 bg-gray-800 rounded-md animate-pulse"></div>
            <div className="h-8 bg-gray-800 rounded-md animate-pulse"></div>
            <div className="h-8 bg-gray-800 rounded-md animate-pulse"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Investment Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shares">Shares/Units</Label>
                <Input
                  id="shares"
                  name="shares"
                  type="number"
                  step="0.01"
                  value={formData.shares}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Investment Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem className="text-gray-400" value="stock">
                      Stock
                    </SelectItem>
                    <SelectItem className="text-gray-400" value="etf">
                      ETF
                    </SelectItem>
                    <SelectItem className="text-gray-400" value="mutual_fund">
                      Mutual Fund
                    </SelectItem>
                    <SelectItem className="text-gray-400" value="bond">
                      Bond
                    </SelectItem>
                    <SelectItem className="text-gray-400" value="crypto">
                      Cryptocurrency
                    </SelectItem>
                    <SelectItem className="text-gray-400" value="real_estate">
                      Real Estate
                    </SelectItem>
                    <SelectItem className="text-gray-400" value="other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPrice">Current Price ($)</Label>
                <Input
                  id="currentPrice"
                  name="currentPrice"
                  type="number"
                  step="0.01"
                  value={formData.currentPrice}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700"
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
              <Button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                {isSubmitting ? "Updating..." : "Update Investment"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
