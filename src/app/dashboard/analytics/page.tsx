import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { FinanceProvider } from "@/components/dashboard/finance-context"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardClientWrapper } from "../DashboardClientWrapper"
import { SpendingTrendsChart } from "@/components/dashboard/spending-trends-chart"
import { IncomeVsExpenseChart } from "@/components/dashboard/income-vs-expense-chart"
import { SavingsGrowthChart } from "@/components/dashboard/savings-growth-chart"
import { CategoryComparisonChart } from "@/components/dashboard/category-comparison-chart"
import { FinancialSummaryCards } from "@/components/dashboard/financial-summary-cards"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  try {
    const user = await getAuthUser()

    if (!user) {
      redirect("/auth/login")
    }

    return (
      <FinanceProvider>
        <DashboardClientWrapper>
          <div className="min-h-screen bg-[#050B18] text-white">
            <DashboardSidebar user={user} />
            <div className="pl-[240px] transition-all duration-300">
              <div className="max-w-7xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Financial Analytics
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                  <FinancialSummaryCards />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <SpendingTrendsChart />
                  <IncomeVsExpenseChart />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <SavingsGrowthChart />
                  <CategoryComparisonChart />
                </div>
              </div>
            </div>
          </div>
        </DashboardClientWrapper>
      </FinanceProvider>
    )
  } catch (error) {
    console.error("Analytics page error:", error)
    redirect("/auth/login")
  }
}
