"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, ShieldCheck, LineChart, Hexagon, Lock, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please ensure both passwords match.",
      })
      return
    }

    if (!agreeTerms) {
      toast.error("Terms agreement required", {
        description: "You must agree to the terms and conditions to create an account.",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      toast.success("Account created!", {
        description: "Your account has been created successfully.",
      })

      // Redirect to dashboard after successful registration
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
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
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
              Join the Future
            </span>
            <span className="block mt-2">of Digital Finance</span>
          </h2>

          <div className="space-y-8 mt-10">
            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md p-3 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <Globe className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Decentralized Ecosystem
                </h3>
                <p className="text-purple-100/70">
                  Access DeFi protocols, NFT marketplaces, and Web3 applications in one platform.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md p-3 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <LineChart className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Advanced Trading Tools
                </h3>
                <p className="text-blue-100/70">
                  Execute trades with precision using our professional-grade trading interface.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md p-3 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <ShieldCheck className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Non-Custodial Security
                </h3>
                <p className="text-cyan-100/70">
                  Maintain full control of your assets with our secure non-custodial wallet technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="md:w-1/2 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md p-8 md:p-10 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-[0_0_25px_rgba(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-400 mt-2">Join the next generation of finance</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="h-12 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-white placeholder:text-gray-500"
                />
                <div className="absolute inset-0 rounded-md pointer-events-none border border-purple-500/20 opacity-0 focus-within:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-white"
                />
                <div className="absolute inset-0 rounded-md pointer-events-none border border-purple-500/20 opacity-0 focus-within:opacity-100 transition-opacity"></div>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters with a number and special character.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-white"
                />
                <div className="absolute inset-0 rounded-md pointer-events-none border border-purple-500/20 opacity-0 focus-within:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-1 border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-6 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
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
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-center space-x-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <p className="text-xs text-gray-500">Secured by blockchain technology</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

