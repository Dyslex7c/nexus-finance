"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeForm } from "./income-form"
import { ExpenseForm } from "./expense-form"

export function FinanceManager() {
  const [activeTab, setActiveTab] = useState("income")

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardContent className="p-6">
        <Tabs defaultValue="income" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-800/50 border border-gray-700/50 mb-6 grid grid-cols-2">
            <TabsTrigger value="income">Add Monthly Income</TabsTrigger>
            <TabsTrigger value="expense">Add Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="mt-0 space-y-4">
            <div className="p-4 bg-cyan-900/20 border border-cyan-900/30 rounded-lg mb-4">
              <p className="text-cyan-400 text-sm">
                <strong>Step 1:</strong> Start by adding your monthly income. This will be used to calculate your
                savings and budget.
              </p>
            </div>
            <IncomeForm onSuccess={() => setActiveTab("expense")} />
          </TabsContent>

          <TabsContent value="expense" className="mt-0 space-y-4">
            <div className="p-4 bg-purple-900/20 border border-purple-900/30 rounded-lg mb-4">
              <p className="text-purple-400 text-sm">
                <strong>Step 2:</strong> Now add your expenses by category. Your savings will be automatically
                calculated.
              </p>
            </div>
            <ExpenseForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

