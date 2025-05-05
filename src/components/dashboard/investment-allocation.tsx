"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface AllocationData {
  name: string
  value: number
  color: string
}

export function InvestmentAllocation() {
  const [allocationData, setAllocationData] = useState<AllocationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllocationData() {
      try {
        setLoading(true)
        const response = await fetch("/api/finance/investments/allocations")

        if (!response.ok) {
          throw new Error("Failed to fetch investment allocation data")
        }

        const data = await response.json()

        if (Array.isArray(data) && data.length > 0) {
          setAllocationData(data)
        } else {
          // Empty or no investments - set an empty array
          setAllocationData([])
        }
      } catch (error) {
        console.error("Error fetching investment allocation:", error)
        setAllocationData([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllocationData()
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-md shadow-lg">
          <p className="text-gray-300 font-medium">{payload[0].name}</p>
          <p className="text-white">{`${payload[0].value}%`}</p>
        </div>
      )
    }
    return null
  }

  const renderLegend = (props: any) => {
    const { payload } = props

    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
            <span className="text-sm text-gray-300">
              {entry.value}: {entry.payload.value}%
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-white">Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[250px] bg-gray-800/50 animate-pulse rounded-md"></div>
        ) : allocationData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-gray-400 text-center">
              No investment data available. Add investments to see your allocation.
            </p>
          </div>
        ) : (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
