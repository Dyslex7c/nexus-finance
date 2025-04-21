"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types for our financial data
type ExpenseCategory =
  | "housing"
  | "transportation"
  | "food"
  | "utilities"
  | "entertainment"
  | "healthcare"
  | "shopping"
  | "personal"
  | "debt"
  | "other"

type IncomeSource = "salary" | "freelance" | "investments" | "rental" | "side-business" | "other"

type Frequency = "one-time" | "weekly" | "bi-weekly" | "monthly" | "quarterly" | "annually"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

interface Income {
  id: string
  amount: number
  source: IncomeSource
  description: string
  frequency: Frequency
  date: string
}

interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  description: string
  date: string
}

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
}

interface FinanceContextType {
  // Financial data
  monthlyIncome: number
  totalBalance: number
  monthlyExpenses: number
  savings: number

  // Income tracking
  incomes: Income[]
  addIncome: (income: Omit<Income, "id" | "date">) => Promise<void>

  // Expense tracking
  expenses: Expense[]
  expensesByCategory: Record<ExpenseCategory, number>
  addExpense: (expense: Omit<Expense, "id" | "date">) => Promise<void>

  // Transactions
  transactions: Transaction[]

  // Savings goals
  savingsGoals: SavingsGoal[]

  // Loading states
  isLoading: boolean

  // Category data for UI
  expenseCategories: { value: ExpenseCategory; label: string }[]
  incomeSources: { value: IncomeSource; label: string }[]
  frequencies: { value: Frequency; label: string }[]
}

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// Custom hook to use the finance context
export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}

// Provider component
export function FinanceProvider({ children }: { children: ReactNode }) {
  // State for financial data
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)
  const [savings, setSavings] = useState(0)

  // State for income and expenses
  const [incomes, setIncomes] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  // Expense categories with labels
  const expenseCategories = [
    { value: "housing" as ExpenseCategory, label: "Housing" },
    { value: "transportation" as ExpenseCategory, label: "Transportation" },
    { value: "food" as ExpenseCategory, label: "Food & Dining" },
    { value: "utilities" as ExpenseCategory, label: "Utilities" },
    { value: "entertainment" as ExpenseCategory, label: "Entertainment" },
    { value: "healthcare" as ExpenseCategory, label: "Healthcare" },
    { value: "shopping" as ExpenseCategory, label: "Shopping" },
    { value: "personal" as ExpenseCategory, label: "Personal" },
    { value: "debt" as ExpenseCategory, label: "Debt Payments" },
    { value: "other" as ExpenseCategory, label: "Other" },
  ]

  // Income sources with labels
  const incomeSources = [
    { value: "salary" as IncomeSource, label: "Salary" },
    { value: "freelance" as IncomeSource, label: "Freelance" },
    { value: "investments" as IncomeSource, label: "Investments" },
    { value: "rental" as IncomeSource, label: "Rental Income" },
    { value: "side-business" as IncomeSource, label: "Side Business" },
    { value: "other" as IncomeSource, label: "Other" },
  ]

  // Frequency options with labels
  const frequencies = [
    { value: "one-time" as Frequency, label: "One-time" },
    { value: "weekly" as Frequency, label: "Weekly" },
    { value: "bi-weekly" as Frequency, label: "Bi-weekly" },
    { value: "monthly" as Frequency, label: "Monthly" },
    { value: "quarterly" as Frequency, label: "Quarterly" },
    { value: "annually" as Frequency, label: "Annually" },
  ]

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      const category = expense.category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += expense.amount
      return acc
    },
    {} as Record<ExpenseCategory, number>,
  )

  // Fetch all financial data on component mount
  useEffect(() => {
    async function fetchFinancialData() {
      setIsLoading(true)
      try {
        // Fetch summary data
        const summaryRes = await fetch("/api/finance/summary?period=month")
        const summaryData = await summaryRes.json()

        if (summaryData) {
          setMonthlyIncome(summaryData.totalIncome || 0)
          setMonthlyExpenses(summaryData.totalExpenses || 0)
          setSavings(summaryData.savings || 0)
          setTotalBalance(summaryData.savings > 0 ? summaryData.savings : 0)
        }

        // Fetch income data
        const incomeRes = await fetch("/api/finance/income")
        const incomeData = await incomeRes.json()

        if (incomeData && incomeData.income) {
          setIncomes(
            incomeData.income.map((income: any) => ({
              id: income._id,
              amount: income.amount,
              source: income.source,
              description: income.description,
              frequency: income.frequency,
              date: income.date,
            })),
          )
        }

        // Fetch expense data
        const expenseRes = await fetch("/api/finance/expense")
        const expenseData = await expenseRes.json()

        if (expenseData && expenseData.expenses) {
          setExpenses(
            expenseData.expenses.map((expense: any) => ({
              id: expense._id,
              amount: expense.amount,
              category: expense.category,
              description: expense.description,
              date: expense.date,
            })),
          )
        }

        // Fetch transaction data
        const transactionRes = await fetch("/api/finance/transaction")
        const transactionData = await transactionRes.json()

        if (transactionData && transactionData.transactions) {
          setTransactions(
            transactionData.transactions.map((transaction: any) => ({
              id: transaction._id,
              type: transaction.type,
              amount: transaction.amount,
              description: transaction.description,
              category: transaction.category,
              date: transaction.date,
            })),
          )
        }

        // Fetch savings goals
        const savingsGoalRes = await fetch("/api/finance/savings-goal")
        const savingsGoalData = await savingsGoalRes.json()

        if (savingsGoalData && savingsGoalData.savingsGoals) {
          setSavingsGoals(
            savingsGoalData.savingsGoals.map((goal: any) => ({
              id: goal._id,
              name: goal.name,
              targetAmount: goal.targetAmount,
              currentAmount: goal.currentAmount,
              targetDate: goal.targetDate,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching financial data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFinancialData()
  }, [])

  // Add a new income
  const addIncome = async (income: Omit<Income, "id" | "date">) => {
    try {
      const response = await fetch("/api/finance/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(income),
      })

      if (!response.ok) {
        throw new Error("Failed to add income")
      }

      const data = await response.json()

      // Refresh financial data after adding income
      const summaryRes = await fetch("/api/finance/summary?period=month")
      const summaryData = await summaryRes.json()

      if (summaryData) {
        setMonthlyIncome(summaryData.totalIncome || 0)
        setSavings(summaryData.savings || 0)
        setTotalBalance(summaryData.savings > 0 ? summaryData.savings : 0)
      }

      // Refresh income list
      const incomeRes = await fetch("/api/finance/income")
      const incomeData = await incomeRes.json()

      if (incomeData && incomeData.income) {
        setIncomes(
          incomeData.income.map((income: any) => ({
            id: income._id,
            amount: income.amount,
            source: income.source,
            description: income.description,
            frequency: income.frequency,
            date: income.date,
          })),
        )
      }

      // Refresh transactions
      const transactionRes = await fetch("/api/finance/transaction")
      const transactionData = await transactionRes.json()

      if (transactionData && transactionData.transactions) {
        setTransactions(
          transactionData.transactions.map((transaction: any) => ({
            id: transaction._id,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            category: transaction.category,
            date: transaction.date,
          })),
        )
      }
    } catch (error) {
      console.error("Error adding income:", error)
      throw error
    }
  }

  // Add a new expense
  const addExpense = async (expense: Omit<Expense, "id" | "date">) => {
    try {
      const response = await fetch("/api/finance/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      })

      if (!response.ok) {
        throw new Error("Failed to add expense")
      }

      const data = await response.json()

      // Refresh financial data after adding expense
      const summaryRes = await fetch("/api/finance/summary?period=month")
      const summaryData = await summaryRes.json()

      if (summaryData) {
        setMonthlyExpenses(summaryData.totalExpenses || 0)
        setSavings(summaryData.savings || 0)
        setTotalBalance(summaryData.savings > 0 ? summaryData.savings : 0)
      }

      // Refresh expense list
      const expenseRes = await fetch("/api/finance/expense")
      const expenseData = await expenseRes.json()

      if (expenseData && expenseData.expenses) {
        setExpenses(
          expenseData.expenses.map((expense: any) => ({
            id: expense._id,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: expense.date,
          })),
        )
      }

      // Refresh transactions
      const transactionRes = await fetch("/api/finance/transaction")
      const transactionData = await transactionRes.json()

      if (transactionData && transactionData.transactions) {
        setTransactions(
          transactionData.transactions.map((transaction: any) => ({
            id: transaction._id,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            category: transaction.category,
            date: transaction.date,
          })),
        )
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      throw error
    }
  }

    // Add funds to a savings goal
    // In your finance-context.tsx file
const addFundsToGoal = async (goalId: string, amount: number) => {
  try {
    // First, get the current amount of the goal
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) {
      throw new Error("Savings goal not found");
    }
    
    // Calculate the new total amount
    const newTotalAmount = goal.currentAmount + amount;
    
    // Make the PATCH request to update the goal
    const response = await fetch(`/api/finance/savings-goal/${goalId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentAmount: newTotalAmount
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update savings goal');
    }
    
    const data = await response.json();
    
    // Update the local state
    setSavingsGoals(prevGoals => 
      prevGoals.map(g => g.id === goalId ? data.savingsGoal : g)
    );
    
    return data.savingsGoal;
  } catch (error) {
    console.error('Error adding funds to goal:', error);
    throw error;
  }
};
  
    // Create a new savings goal
    const createSavingsGoal = async (name: string, targetAmount: number, targetDate: string) => {
      try {
        const newGoal = {
          name,
          targetAmount,
          currentAmount: 0,
          targetDate,
        }
  
        // Send to API
        const response = await fetch("/api/finance/savings-goal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newGoal),
        })
  
        if (!response.ok) {
          throw new Error("Failed to create savings goal")
        }
  
        const data = await response.json()
  
        // Add to local state with the ID from the response
        setSavingsGoals((prevGoals) => [
          ...prevGoals,
          {
            id: data.savingsGoal._id,
            name,
            targetAmount,
            currentAmount: 0,
            targetDate,
          },
        ])
      } catch (error) {
        console.error("Error creating savings goal:", error)
        throw error
      }
    }

  const value = {
    monthlyIncome,
    totalBalance,
    monthlyExpenses,
    savings,
    incomes,
    addIncome,
    expenses,
    expensesByCategory,
    addExpense,
    transactions,
    savingsGoals,
    isLoading,
    expenseCategories,
    incomeSources,
    frequencies,
    addFundsToGoal,
    createSavingsGoal
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

