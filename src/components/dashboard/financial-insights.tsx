"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonthlySpendingChart } from "./monthly-spending-chart"
import { BudgetOverview } from "./budget-overview"
import { SavingsGoalProgress } from "./savings-goal-progress"

export function FinancialInsights() {
  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-xl text-white">Financial Insights</CardTitle>
        <CardDescription className="text-gray-400">Track your spending patterns and financial goals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spending" className="w-full">
          <TabsList className="bg-gray-800/50 border border-gray-700/50 mb-6">
            <TabsTrigger value="spending">Spending Trends</TabsTrigger>
            <TabsTrigger value="budget">Budget Overview</TabsTrigger>
            <TabsTrigger value="savings">Savings Goals</TabsTrigger>
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

