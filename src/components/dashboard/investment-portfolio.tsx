"use client"

import { useEffect, useState } from "react"
import { Plus, ArrowUp, ArrowDown, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddInvestmentDialog } from "./add-investment-dialog"
import { EditInvestmentDialog } from "./edit-investment-dialog"
import { toast } from "sonner"

interface Investment {
  id: string
  name: string
  symbol: string
  shares: number
  purchasePrice: number
  currentPrice: number
  change: number
  changePercent: number
  type?: string
  purchaseDate?: string
}

export function InvestmentPortfolio() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null)

  useEffect(() => {
    fetchInvestments()
  }, [])

  const fetchInvestments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/finance/investments")

      if (!response.ok) {
        throw new Error("Failed to fetch investments")
      }

      const data = await response.json()
      setInvestments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching investments:", error)
      toast.error("Failed to load investments")
    } finally {
      setLoading(false)
    }
  }

  const handleEditInvestment = (id: string) => {
    setSelectedInvestmentId(id)
    setEditDialogOpen(true)
  }

  const deleteInvestment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this investment?")) {
      return
    }

    try {
      const response = await fetch(`/api/finance/investments/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete investment")
      }

      toast.success("Investment deleted successfully")
      fetchInvestments()
    } catch (error) {
      console.error("Error deleting investment:", error)
      toast.error("Failed to delete investment")
    }
  }

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === undefined) return "$0.00"

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const calculateTotalValue = () => {
    if (!investments.length) return 0

    return investments.reduce((total, investment) => {
      const value = investment.shares * investment.currentPrice
      return total + (isNaN(value) ? 0 : value)
    }, 0)
  }

  const calculateTotalGainLoss = () => {
    if (!investments.length) return 0

    return investments.reduce((total, investment) => {
      const gainLoss = investment.shares * (investment.currentPrice - investment.purchasePrice)
      return total + (isNaN(gainLoss) ? 0 : gainLoss)
    }, 0)
  }

  const calculateTotalGainLossPercent = () => {
    if (!investments.length) return 0

    const totalInvested = investments.reduce((total, investment) => {
      const invested = investment.shares * investment.purchasePrice
      return total + (isNaN(invested) ? 0 : invested)
    }, 0)

    const totalCurrent = calculateTotalValue()

    if (totalInvested === 0) return 0
    return ((totalCurrent - totalInvested) / totalInvested) * 100
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-white">Investment Portfolio</CardTitle>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus className="h-4 w-4 mr-1" /> Add Investment
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-800 rounded-md"></div>
            <div className="h-64 bg-gray-800 rounded-md"></div>
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-12 border border-gray-800 rounded-md">
            <p className="text-gray-400 mb-4">You don't have any investments yet.</p>
            <Button onClick={() => setAddDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-1" /> Add Your First Investment
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(calculateTotalValue())}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Total Gain/Loss</p>
                <p
                  className={`text-2xl font-bold ${calculateTotalGainLoss() >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {formatCurrency(calculateTotalGainLoss())}
                </p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Return</p>
                <p
                  className={`text-2xl font-bold ${calculateTotalGainLossPercent() >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {calculateTotalGainLossPercent().toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Symbol</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Shares</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Value</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Gain/Loss</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={investment.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-3 px-4 text-white">{investment.name}</td>
                      <td className="py-3 px-4 text-gray-300">{investment.symbol}</td>
                      <td className="py-3 px-4 text-right text-gray-300">{investment.shares.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-gray-300">{formatCurrency(investment.currentPrice)}</td>
                      <td className="py-3 px-4 text-right text-white font-medium">
                        {formatCurrency(investment.shares * investment.currentPrice)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className={`font-medium ${investment.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {investment.change >= 0 ? "+" : ""}
                            {formatCurrency(investment.change * investment.shares)}
                          </span>
                          <span
                            className={`text-xs ${investment.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {investment.changePercent >= 0 ? (
                              <ArrowUp className="inline h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDown className="inline h-3 w-3 mr-1" />
                            )}
                            {Math.abs(investment.changePercent).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-white"
                            onClick={() => handleEditInvestment(investment.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-red-500"
                            onClick={() => deleteInvestment(investment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
      <AddInvestmentDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <EditInvestmentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        investmentId={selectedInvestmentId}
      />
    </Card>
  )
}
