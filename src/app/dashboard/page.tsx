import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { LogoutButton } from "@/components/auth/logout-button"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Check if user is authenticated
  try {
    const user = await getAuthUser()

    if (!user) {
      redirect("/auth/login")
    }

    return (
      <div className="min-h-screen bg-[#050B18] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              NEXUS FINANCE
            </h1>
            <LogoutButton />
          </div>

          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
            <p className="text-gray-400">
              This is a placeholder dashboard. In a real application, you would see your financial data, portfolio, and
              analytics here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Portfolio Value", value: "$12,345.67", change: "+2.4%" },
              { title: "Active Assets", value: "12", change: "" },
              { title: "Total Transactions", value: "156", change: "+8 today" },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
              >
                <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{card.value}</p>
                  {card.change && <span className="text-green-400 text-sm">{card.change}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    redirect("/auth/login")
  }
}

