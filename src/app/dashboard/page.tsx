import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { FinanceProvider } from "@/components/dashboard/finance-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { FinanceManager } from "@/components/dashboard/finance-manager"
import { TransactionHistory } from "@/components/dashboard/transaction-history"
import { FinancialInsights } from "@/components/dashboard/financial-insights"
import { DashboardClientWrapper } from "./DashboardClientWrapper"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { UpcomingPayments } from "@/components/dashboard/upcoming-payments"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  // Check if user
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
                <DashboardHeader user={user} />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                  <OverviewCards />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="lg:col-span-2">
                    <FinanceManager />
                  </div>
                  <div className="space-y-8">
                    <RecentActivities />
                    {/* <UpcomingPayments /> */}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 mb-8">
                  <FinancialInsights />
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <TransactionHistory />
                </div>
              </div>
            </div>
          </div>
        </DashboardClientWrapper>
      </FinanceProvider>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    redirect("/auth/login")
  }
}
