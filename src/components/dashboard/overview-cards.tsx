"use client"

import { useFinance } from "./finance-context"
import { ArrowDown, ArrowUp, CreditCard, DollarSign, PiggyBank, Wallet } from "lucide-react"

export function OverviewCards() {
  const { monthlyIncome, totalBalance, monthlyExpenses, savings } = useFinance()

  const cards = [
    {
      title: "Total Balance",
      value: totalBalance.toFixed(2),
      change: savings > 0 ? "+$" + savings.toFixed(2) : "-$" + Math.abs(savings).toFixed(2),
      changeType: savings >= 0 ? "positive" : "negative",
      icon: Wallet,
    },
    {
      title: "Monthly Income",
      value: monthlyIncome.toFixed(2),
      change: monthlyIncome > 0 ? "+$" + monthlyIncome.toFixed(2) : "$0.00",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      title: "Monthly Expenses",
      value: monthlyExpenses.toFixed(2),
      change: monthlyExpenses > 0 ? "-$" + monthlyExpenses.toFixed(2) : "$0.00",
      changeType: "negative",
      icon: CreditCard,
    },
    {
      title: "Savings",
      value: savings > 0 ? savings.toFixed(2) : "0.00",
      change: savings > 0 ? ((savings / monthlyIncome) * 100).toFixed(0) + "%" : "0%",
      changeType: savings >= 0 ? "positive" : "negative",
      icon: PiggyBank,
    },
  ]

  return (
    <>
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 text-sm">{card.title}</h3>
            <div className="p-2 rounded-full bg-gray-800/50">
              <card.icon className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold">${card.value}</p>
            <span
              className={`text-sm flex items-center ${card.changeType === "positive" ? "text-green-400" : "text-red-400"}`}
            >
              {card.changeType === "positive" ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {card.change}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

