"use client"

import { useState } from "react"
import { useFinance } from "./finance-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react"

export function TransactionHistory() {
  const { transactions, expenseCategories, incomeSources } = useFinance()
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Get category/source label
  const getCategoryLabel = (type: string, category: string) => {
    if (type === "income") {
      return incomeSources.find((s) => s.value === category)?.label || category
    } else {
      return expenseCategories.find((c) => c.value === category)?.label || category
    }
  }

  // Filter and search transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      if (filter === "all") return true
      return transaction.type === filter
    })
    .filter((transaction) => {
      if (!searchTerm) return true
      return (
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryLabel(transaction.type, transaction.category).toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-xl text-white">Transaction History</CardTitle>
        <CardDescription className="text-gray-400">View and search your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-10 bg-gray-800/50 border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="income">Income Only</SelectItem>
              <SelectItem value="expense">Expenses Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800/50">
              <TableRow className="hover:bg-gray-800/80 border-gray-700">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-800/50 border-gray-700">
                    <TableCell className="text-gray-400">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-400" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-red-400" />
                        )}
                        {transaction.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          transaction.type === "income"
                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                            : "border-gray-600 bg-gray-800/50 text-gray-300"
                        }`}
                      >
                        {getCategoryLabel(transaction.type, transaction.category)}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.type === "income" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-400">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

