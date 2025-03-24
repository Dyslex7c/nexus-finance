import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SonnerProvider } from "@/components/sonner-provider"
import "./globals.css"
//import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fast Budget - Financial Management App",
  description: "Track your finances, manage budgets, and plan your financial future.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SonnerProvider />
          {children}
      </body>
    </html>
  )
}

