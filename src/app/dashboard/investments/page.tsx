import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardClientWrapper } from "../DashboardClientWrapper"
import { InvestmentPortfolio } from "@/components/dashboard/investment-portfolio"
import { InvestmentPerformance } from "@/components/dashboard/investment-performance"
import { InvestmentAllocation } from "@/components/dashboard/investment-allocation"

export const dynamic = "force-dynamic"

export default async function InvestmentsPage() {
  try {
    const user = await getAuthUser()

    if (!user) {
      redirect("/auth/login")
    }

    return (
      <DashboardClientWrapper>
        <div className="min-h-screen bg-[#050B18] text-white">
          <DashboardSidebar user={user} />
          <div className="pl-[240px] transition-all duration-300">
            <div className="max-w-7xl mx-auto p-8">
              <DashboardHeader user={user} />

              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-6">Investments</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <InvestmentPerformance />
                </div>
                <div>
                  <InvestmentAllocation />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <InvestmentPortfolio />
              </div>
            </div>
          </div>
        </div>
      </DashboardClientWrapper>
    )
  } catch (error) {
    console.error("Investments page error:", error)
    redirect("/auth/login")
  }
}
