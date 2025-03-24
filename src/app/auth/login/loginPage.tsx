"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, BarChart3, PieChart, Layers, Hexagon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function LoginPageForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("from") || "/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      toast.success("Login successful", {
        description: "Welcome back to Nexus Finance!",
      })

      // Redirect to dashboard or the original requested page
      router.push(redirectPath)
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Invalid email or password",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#050B18] text-white overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5 bg-cover"></div>
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px]"></div>
      </div>

      {/* Left side - Feature section */}
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Hexagon className="h-10 w-10 text-cyan-400 fill-cyan-900/30" />
              <Wallet className="h-5 w-5 text-cyan-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              NEXUS FINANCE
            </h1>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Decentralized Finance
            </span>
            <span className="block mt-2">for the Digital Age</span>
          </h2>

          <div className="space-y-8 mt-10">
            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md p-3 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <BarChart3 className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Expense Tracking:
                </h3>
                <p className="text-cyan-100/70">
                  Auto-sync with UPI, wallets, and bank accounts
                </p>
                <p className="text-cyan-100/70">
                  Manual entry for cash expenses
                </p>
                <p className="text-cyan-100/70">
                  Decentralized transaction records for security
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md p-3 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <PieChart className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Monthly Predictions & Reports
                </h3>
                <p className="text-purple-100/70">
                  ML-based predictions for future savings
                </p>
                <p className="text-purple-100/70">
                  Visual spending reports (bar, pie charts)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md p-3 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Layers className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Saving Tips & Advice
                </h3>
                <p className="text-blue-100/70">
                  AI-powered recommendations
                </p>
                <p className="text-blue-100/70">
                  Daily saving challenges or tips
                </p>
                <p className="text-blue-100/70">
                  Goal Tracking with Smart Contracts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="md:w-1/2 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md p-8 md:p-10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-[0_0_25px_rgba(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-400 mt-2">Access your decentralized portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="h-12 bg-gray-800/50 border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20 text-white placeholder:text-gray-500"
                />
                <div className="absolute inset-0 rounded-md pointer-events-none border border-cyan-500/20 opacity-0 focus-within:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-gray-800/50 border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20 text-white"
                />
                <div className="absolute inset-0 rounded-md pointer-events-none border border-cyan-500/20 opacity-0 focus-within:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-gray-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs text-center text-gray-500 mb-4">Or continue with</p>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex justify-center items-center py-2.5 px-4 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg border border-gray-700 transition-colors">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.66 19.975v-7.377H7.277V9.42h3.063V6.257c0-1.347.387-2.36 1.16-3.037.773-.677 1.793-1.016 3.06-1.016.8 0 1.47.05 2.013.15v2.97h-1.38c-.5 0-.85.107-1.053.32-.2.214-.3.536-.3.968v2.808h2.667l-.35 3.178h-2.317v7.377h-4.84z" />
                </svg>
              </button>
              <button className="flex justify-center items-center py-2.5 px-4 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg border border-gray-700 transition-colors">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>
              <button className="flex justify-center items-center py-2.5 px-4 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg border border-gray-700 transition-colors">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.018 18.7E-13C16.779 5.247 15.542 5.89 14.229 5.89c-1.339 0-2.321.89-3.532.89-1.211 0-2.193-.89-3.532-.89-1.313 0-2.55.643-3.532 1.79C2.469 9.122 1.89 11.538 1.89 14c0 2.462.579 4.878 1.743 6.32.982 1.147 2.219 1.79 3.532 1.79 1.339 0 2.321-.89 3.532-.89 1.211 0 2.193.89 3.532.89 1.313 0 2.55-.643 3.532-1.79 1.164-1.442 1.743-3.858 1.743-6.32 0-2.462-.579-4.878-1.743-6.32z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

