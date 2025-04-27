"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonthlySpendingChart } from "./monthly-spending-chart"
import { BudgetOverview } from "./budget-overview"
import { SavingsGoalProgress } from "./savings-goal-progress"
import { cn } from "@/lib/utils"

export function FinancialInsights() {
  const [activeTab, setActiveTab] = useState("spending")
  
  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-xl text-white">Financial Insights</CardTitle>
        <CardDescription className="text-gray-400">Track your spending patterns and financial goals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spending" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-800/50 border border-gray-700/50 mb-6">
            <TabsTrigger 
              value="spending"
              className={cn(
                activeTab === "spending" ? "text-cyan-400" : "text-gray-400"
              )}
            >
              Spending Trends
            </TabsTrigger>
            <TabsTrigger 
              value="budget"
              className={cn(
                activeTab === "budget" ? "text-purple-400" : "text-gray-400"
              )}
            >
              Budget Overview
            </TabsTrigger>
            <TabsTrigger 
              value="savings"
              className={cn(
                activeTab === "savings" ? "text-green-400" : "text-gray-400"
              )}
            >
              Savings Goals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spending" className="mt-0">
            <div className="h-[350px]">
              <MonthlySpendingChart />
            </div>
          </TabsContent>
          
          <TabsContent value="budget" className="mt-0">
            <BudgetOverview />
          </TabsContent>
          
          <TabsContent value="savings" className="mt-0">
            <SavingsGoalProgress />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}