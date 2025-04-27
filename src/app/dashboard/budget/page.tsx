import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { FinanceProvider } from "@/components/dashboard/finance-context"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardClientWrapper } from "../DashboardClientWrapper"
import { BudgetPlanner } from "@/components/dashboard/budget-planner"
import { BudgetOverview } from "@/components/dashboard/budget-overview"
import { BudgetCategoryBreakdown } from "@/components/dashboard/budget-category-breakdown"
import { BudgetHistory } from "@/components/dashboard/budget-history"

export const dynamic = "force-dynamic"

export default async function BudgetPage() {
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
                  Budget Management
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="lg:col-span-2">
                    <BudgetPlanner />
                  </div>
                  <div>
                    <BudgetCategoryBreakdown />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 mb-8">
                  <BudgetOverview />
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <BudgetHistory />
                </div>
              </div>
            </div>
          </div>
        </DashboardClientWrapper>
      </FinanceProvider>
    )
  } catch (error) {
    console.error("Budget page error:", error)
    redirect("/auth/login")
  }
}
