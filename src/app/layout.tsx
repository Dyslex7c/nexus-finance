import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SonnerProvider } from "@/components/sonner-provider"
import "./globals.css"
import { Providers } from "./providers"
import { cookieToInitialState } from "wagmi"
import { getConfig } from "./config"
import { headers } from "next/headers"
//import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fast Budget - Financial Management App",
  description: "Track your finances, manage budgets, and plan your financial future.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <Providers initialState={initialState}>
        <SonnerProvider />
          {children}
      </Providers>
      </body>
    </html>
  )
}

