"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface PerformanceData {
  date: string
  value: number
  benchmark: number
}

export function InvestmentPerformance() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("1m")

  useEffect(() => {
    async function fetchPerformanceData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/finance/investments/performance?timeframe=${timeframe.toLowerCase()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch investment performance data")
        }

        const data = await response.json()

        if (Array.isArray(data) && data.length > 0) {
          setPerformanceData(data)
        } else {
          setPerformanceData([])
        }
      } catch (error) {
        console.error("Error fetching investment performance:", error)
        setPerformanceData([])
      } finally {
        setLoading(false)
      }
    }

    fetchPerformanceData()
  }, [timeframe])

  // Generate sample data for different timeframes
  const generateSampleData = (timeframe: string): PerformanceData[] => {
    const data: PerformanceData[] = []
    let days: number
    let startValue = 10000
    let benchmarkStartValue = 10000

    switch (timeframe) {
      case "1W":
        days = 7
        break
      case "1M":
        days = 30
        break
      case "3M":
        days = 90
        break
      case "1Y":
        days = 365
        break
      case "ALL":
        days = 730
        break
      default:
        days = 30
    }

    const today = new Date()

    for (let i = days; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Random fluctuation between -3% and +3%
      const fluctuation = (Math.random() * 6 - 3) / 100
      const benchmarkFluctuation = (Math.random() * 4 - 2) / 100

      startValue = startValue * (1 + fluctuation)
      benchmarkStartValue = benchmarkStartValue * (1 + benchmarkFluctuation)

      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.round(startValue),
        benchmark: Math.round(benchmarkStartValue),
      })
    }

    return data
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-md shadow-lg">
          <p className="text-gray-300 mb-1">{formatDate(label)}</p>
          <p className="text-cyan-400 font-medium">Portfolio: {formatCurrency(payload[0].value)}</p>
          <p className="text-purple-400 font-medium">Benchmark: {formatCurrency(payload[1].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-white">Investment Performance</CardTitle>
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
            <TabsList className="bg-gray-800">
              <TabsTrigger
                value="1w"
                className="data-[state=active]:bg-white text-white data-[state=active]:text-white"
              >
                1W
              </TabsTrigger>
              <TabsTrigger
                value="1m"
                className="data-[state=active]:bg-white text-white data-[state=active]:text-white"
              >
                1M
              </TabsTrigger>
              <TabsTrigger
                value="3m"
                className="data-[state=active]:bg-white text-white data-[state=active]:text-white"
              >
                3M
              </TabsTrigger>
              <TabsTrigger
                value="1y"
                className="data-[state=active]:bg-white text-white data-[state=active]:text-white"
              >
                1Y
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white text-white data-[state=active]:text-white"
              >
                ALL
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] bg-gray-800/50 animate-pulse rounded-md"></div>
        ) : performanceData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-400 text-center">
              No investment performance data available. Add investments to track performance over time.
            </p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="date" tickFormatter={formatDate} stroke="#718096" tick={{ fill: "#A0AEC0" }} />
                <YAxis tickFormatter={formatCurrency} stroke="#718096" tick={{ fill: "#A0AEC0" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Portfolio"
                  stroke="#00b050"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#00b050" }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Benchmark"
                  stroke="#ff0000"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#ff0000" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
