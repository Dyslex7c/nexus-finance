"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Edit, CreditCard, Wallet, Landmark, Coins, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddWalletDialog } from "./add-wallet-dialog"
import { EditWalletDialog } from "./edit-wallet-dialog"
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

export function WalletsList() {
  const [wallets, setWallets] = useState<WalletProps[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletProps | null>(null)

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/finance/wallets")

      if (!response.ok) {
        throw new Error("Failed to fetch wallets")
      }

      const data = await response.json()
      setWallets(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching wallets:", error)
      // If API fails, show sample data
      setWallets([
        {
          id: "1",
          name: "Main Account",
          balance: 5280.42,
          currency: "USD",
          type: "checking",
          color: "#06b6d4",
          isDefault: true,
        },
        {
          id: "2",
          name: "Savings",
          balance: 12750.0,
          currency: "USD",
          type: "savings",
          color: "#22c55e",
          isDefault: false,
        },
        {
          id: "3",
          name: "Credit Card",
          balance: -1240.3,
          currency: "USD",
          type: "credit",
          color: "#ef4444",
          isDefault: false,
        },
      ])
      toast.error("Failed to load wallets")
    } finally {
      setLoading(false)
    }
  }

  // Improve the handleEditWallet function to ensure the wallet data is properly passed
  const handleEditWallet = (wallet: WalletProps) => {
    // Create a deep copy to avoid reference issues
    setSelectedWallet({ ...wallet })
    setEditDialogOpen(true)
  }

  // Fix the deleteWallet function to properly handle API responses
  const deleteWallet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this wallet?")) {
      return
    }

    try {
      const response = await fetch(`/api/finance/wallets/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete wallet")
      }

      // Update local state immediately on success
      setWallets(wallets.filter((wallet) => wallet.id !== id))
      toast.success("Wallet deleted successfully")
    } catch (error) {
      console.error("Error deleting wallet:", error)
      toast.error("Failed to delete wallet")
    }
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getWalletIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <Landmark className="h-5 w-5" />
      case "savings":
        return <Wallet className="h-5 w-5" />
      case "credit":
        return <CreditCard className="h-5 w-5" />
      case "investment":
        return <Coins className="h-5 w-5" />
      case "cash":
        return <DollarSign className="h-5 w-5" />
      default:
        return <Wallet className="h-5 w-5" />
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-white">Your Wallets</CardTitle>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus className="h-4 w-4 mr-1" /> New Wallet
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-800 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 mb-4">You don't have any wallets yet.</p>
            <Button onClick={() => setAddDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-1" /> Create Your First Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full mr-3" style={{ backgroundColor: wallet.color + "33" }}>
                      <div className="text-white" style={{ color: wallet.color }}>
                        {getWalletIcon(wallet.type)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-white">{wallet.name}</h4>
                        {wallet.isDefault && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-cyan-900/50 text-cyan-300 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-white"
                      onClick={() => handleEditWallet(wallet)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-red-500"
                      onClick={() => deleteWallet(wallet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-bold text-white">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <AddWalletDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSuccess={fetchWallets} />
      {selectedWallet && (
        <EditWalletDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          wallet={selectedWallet}
          onSuccess={fetchWallets}
        />
      )}
    </Card>
  )
}
