"use client"

import { useFinance } from "./finance-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentActivities() {
  const { transactions } = useFinance()

  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          Recent Activities
        </CardTitle>
        <CardDescription className="text-gray-400">Your latest financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[220px] pr-4">
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg bg-gray-800/30 p-3 transition-colors hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        transaction.type === "income" ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{transaction.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      transaction.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-400">No recent activities</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
