import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wallet, BarChart3, ShieldCheck, Hexagon, ChevronRight, CheckCircle, PieChart, Layers, Zap } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050B18] text-white overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5 bg-cover"></div>
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px]"></div>
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050B18]/80 border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Hexagon className="h-10 w-10 text-cyan-400 fill-cyan-900/30" />
              <Wallet className="h-5 w-5 text-cyan-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              SMART FINANCE
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition duration-200 font-medium">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition duration-200 font-medium">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition duration-200 font-medium">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ConnectButton />
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800/70 font-medium">
                Connect
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-32 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Decentralized Finance
                  </span>
                  <span className="block mt-2">for the Digital Age</span>
                </h1>
                <p className="text-xl mb-8 text-gray-400 max-w-lg">
                  Tracks expenses, predicts savings, offers AI tips, and uses smart contracts for goal tracking.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white w-full sm:w-auto font-medium shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    >
                      Create Wallet
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white w-full sm:w-auto font-medium"
                    >
                      View Demo
                    </Button>
                  </Link>
                </div>

                <div className="mt-10 flex items-center space-x-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mr-2" />
                    <span className="text-gray-400">Non-Custodial</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mr-2" />
                    <span className="text-gray-400">Multi-Chain</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mr-2" />
                    <span className="text-gray-400">Zero Fees</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_25px_rgba(0,0,0,0.3)] transform transition-all duration-500 hover:scale-105">
                  <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-t-lg p-4 border-b border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-bold">Portfolio Overview</h3>
                      <span className="text-sm text-gray-400">March 2025</span>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-b-lg p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <div className="flex items-center">
                          <div className="bg-cyan-900/30 p-2 rounded-full mr-3">
                            <svg
                              className="h-4 w-4 text-cyan-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM9.5 9.5L7.5 7.5L12 3L16.5 7.5L14.5 9.5L12 7L9.5 9.5ZM9.5 14.5L7.5 16.5L12 21L16.5 16.5L14.5 14.5L12 17L9.5 14.5Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-300">Ethereum</span>
                        </div>
                        <span className="text-cyan-400 font-semibold">2.45 ETH</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <div className="flex items-center">
                          <div className="bg-purple-900/30 p-2 rounded-full mr-3">
                            <svg
                              className="h-4 w-4 text-purple-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 2L3 7L12 12L21 7L12 2Z" fill="currentColor" />
                              <path d="M3 17L12 22L21 17L12 12L3 17Z" fill="currentColor" />
                            </svg>
                          </div>
                          <span className="text-gray-300">Solana</span>
                        </div>
                        <span className="text-purple-400 font-semibold">45.8 SOL</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-300 font-bold">Total Value</span>
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-bold">
                          $12,450.75
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-12 -right-4 bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.3)] p-4 w-60 transform rotate-6 transition-transform duration-500 hover:rotate-0">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-900/30 p-1.5 rounded-full mr-2">
                      <BarChart3 className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-300">Asset Allocation</span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full w-[65%]"></div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full w-[40%]"></div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full w-[25%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-900/50 backdrop-blur-md border-y border-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 text-center border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  $2.5B+
                </div>
                <p className="text-gray-400">Assets Managed</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 text-center border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  250K+
                </div>
                <p className="text-gray-400">Active Wallets</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 text-center border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                  15+
                </div>
                <p className="text-gray-400">Blockchain Networks</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Advanced Web3 Tools
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Everything you need to navigate the decentralized finance landscape, all in one platform.
              </p>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:border-cyan-900/50">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <BarChart3 className="h-7 w-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Scheduled Transactions
              </h3>
              <p className="text-gray-400">
                Automate recurring payments and expenses for convenience.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:border-purple-900/50">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <Zap className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Budgets
              </h3>
              <p className="text-gray-400">
                Set, track, and adjust your monthly or weekly spending plans.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-blue-900/50">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Layers className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Charts
              </h3>
              <p className="text-gray-400">
                Visualize your financial data with insightful graphs and reports.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:border-red-900/50">
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <ShieldCheck className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Calendar
              </h3>
              <p className="text-gray-400">
                Organize and schedule your financial events and reminders.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:border-yellow-900/50">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                <Wallet className="h-7 w-7 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Import/Export
              </h3>
              <p className="text-gray-400">
                Easily upload or download financial data for backup or analysis.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:border-teal-900/50">
              <div className="bg-gradient-to-br from-teal-500/20 to-green-500/20 backdrop-blur-md w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                <PieChart className="h-7 w-7 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
                Preferences
              </h3>
              <p className="text-gray-400">
                Customize settings for personalized financial management.
              </p>
            </div>
          </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-900/50 backdrop-blur-md border-y border-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                How Smart Finance Works
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Get started in minutes and take control of your digital assets
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] relative">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  1
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Create Your Wallet
                  </h3>
                  <p className="text-gray-400">
                    Set up your non-custodial wallet in less than 2 minutes with enhanced security.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] relative">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  2
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Connect Your Assets
                  </h3>
                  <p className="text-gray-400">
                    Import existing wallets or transfer assets to your new secure Smart wallet.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] relative">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-500 to-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  3
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Explore DeFi
                  </h3>
                  <p className="text-gray-400">
                    Access the full range of decentralized finance tools and start growing your portfolio.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Transparent Pricing
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Choose the plan that works best for your crypto journey.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Basic
                  </h3>
                  <p className="text-gray-400 mb-4">Essential crypto tools</p>
                  <span className="text-4xl font-bold text-white">Free</span>
                  <span className="text-gray-500">/forever</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Up to 3 wallets</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Basic portfolio tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Transaction history (30 days)</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  Get Started
                </Button>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-purple-700/30 shadow-[0_0_25px_rgba(168,85,247,0.2)] transform scale-105 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  POPULAR
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Pro
                  </h3>
                  <p className="text-gray-400 mb-4">Advanced crypto management</p>
                  <span className="text-4xl font-bold text-white">$9.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Unlimited wallets</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Advanced portfolio analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Full transaction history</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">DeFi protocol integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  Subscribe Now
                </Button>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Enterprise
                  </h3>
                  <p className="text-gray-400 mb-4">Institutional-grade solution</p>
                  <span className="text-4xl font-bold text-white">$49.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">All Pro features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">API access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Advanced security features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Custom reporting</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900/80 backdrop-blur-xl text-white py-12 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Hexagon className="h-8 w-8 text-cyan-400 fill-cyan-900/30" />
                  <Wallet className="h-4 w-4 text-cyan-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Smart FINANCE
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                The next generation platform for decentralized finance and digital asset management.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Smart Finance. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

