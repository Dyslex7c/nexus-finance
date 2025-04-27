import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardClientWrapper } from "../DashboardClientWrapper"
import { TransactionHistory } from "@/components/dashboard/transaction-history"
import { TransactionStats } from "@/components/dashboard/transaction-stats"
import { FinanceProvider } from "@/components/dashboard/finance-context"

export const dynamic = "force-dynamic"

export default async function TransactionsPage() {
  try {
    const user = await getAuthUser()

    if (!user) {
      redirect("/auth/login")
    }

    return (
      <DashboardClientWrapper>
        <FinanceProvider>
            <div className="min-h-screen bg-[#050B18] text-white">
            <DashboardSidebar user={user} />
            <div className="pl-[240px] transition-all duration-300">
                <div className="max-w-7xl mx-auto p-8">
                <DashboardHeader user={user} />

                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-6">Transactions</h1>
                    <TransactionStats />
                </div>
                <div className="grid grid-cols-1 gap-8">
                    <TransactionHistory />
                </div>
                </div>
            </div>
            </div>
        </FinanceProvider>
      </DashboardClientWrapper>
    )
  } catch (error) {
    console.error("Transactions page error:", error)
    redirect("/auth/login")
  }
}
