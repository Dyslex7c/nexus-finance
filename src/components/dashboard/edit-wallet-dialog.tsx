"use client"

import { useState, useEffect } from "react"
import type { FormEvent, ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

interface WalletProps {
  id: string
  name: string
  balance: number
  currency: string
  type: string
  color: string
  isDefault: boolean
}

interface EditWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: WalletProps
  onSuccess?: () => void
}

interface FormData {
  name: string
  balance: number | string
  currency: string
  type: string
  color: string
  isDefault: boolean
}

// Ensure the EditWalletDialog properly handles the wallet data
export function EditWalletDialog({ open, onOpenChange, wallet, onSuccess }: EditWalletDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    balance: 0,
    currency: "USD",
    type: "checking",
    color: "#06b6d4",
    isDefault: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when wallet changes
  useEffect(() => {
    if (wallet) {
      setFormData({
        name: wallet.name || "",
        balance: wallet.balance || 0,
        currency: wallet.currency || "USD",
        type: wallet.type || "checking",
        color: wallet.color || "#06b6d4",
        isDefault: wallet.isDefault || false,
      })
    }
  }, [wallet])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isDefault: checked }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/finance/wallets/${wallet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          balance: typeof formData.balance === "string" ? Number.parseFloat(formData.balance) : formData.balance,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update wallet")
      }

      toast.success("Wallet updated successfully")
      onOpenChange(false)

      // Call the onSuccess callback to refresh the wallets list
      if (typeof onSuccess === "function") {
        onSuccess()
      }
    } catch (error) {
      console.error("Error updating wallet:", error)
      toast.error("Failed to update wallet")
    } finally {
      setIsSubmitting(false)
    }
  }

  const colorOptions = [
    { name: "Cyan", value: "#06b6d4" },
    { name: "Purple", value: "#a855f7" },
    { name: "Green", value: "#22c55e" },
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Orange", value: "#f97316" },
    { name: "Pink", value: "#ec4899" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Edit Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Wallet Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-gray-800 border-gray-700"
              placeholder="e.g., Main Account, Savings"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                name="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="AUD">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Wallet Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select value={formData.color} onValueChange={(value) => handleSelectChange("color", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select color">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: formData.color }}></div>
                      {colorOptions.find((c) => c.value === formData.color)?.name}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></div>
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isDefault" checked={formData.isDefault} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="isDefault" className="text-sm font-normal">
              Set as default wallet
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {isSubmitting ? "Updating..." : "Update Wallet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
