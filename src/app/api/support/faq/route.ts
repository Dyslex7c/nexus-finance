import { type NextRequest, NextResponse } from "next/server"

// Static FAQ data
const faqData = [
  {
    id: "1",
    question: "How do I create a budget?",
    answer:
      'To create a budget, navigate to the Budget section from the dashboard sidebar. Click on "Create Budget" and follow the steps to set up your budget categories and allocations.',
    category: "budgeting",
  },
  {
    id: "2",
    question: "How do I add a new transaction?",
    answer:
      'You can add a new transaction by going to the Transactions page and clicking on the "Add Transaction" button. Fill in the required details such as amount, category, and date.',
    category: "transactions",
  },
  {
    id: "3",
    question: "How do I set up a savings goal?",
    answer:
      'Navigate to the Savings Goals page from the dashboard sidebar. Click on "Create Goal" and specify your target amount, deadline, and other details to track your progress.',
    category: "savings",
  },
  {
    id: "4",
    question: "How do I connect my bank account?",
    answer:
      'Go to the Wallets page and click on "Add Wallet". Select "Bank Account" as the wallet type and follow the secure connection process to link your bank account.',
    category: "wallets",
  },
  {
    id: "5",
    question: "How do I track my investments?",
    answer:
      'Use the Investments page to add and monitor your investments. Click on "Add Investment" to input details about your stocks, bonds, or other investment vehicles.',
    category: "investments",
  },
  {
    id: "6",
    question: "How do I change my password?",
    answer:
      'Go to the Settings page, select the Security tab, and click on "Change Password". You\'ll need to enter your current password and then set a new one.',
    category: "account",
  },
  {
    id: "7",
    question: "How do I export my financial data?",
    answer:
      "In the Settings page under the Data tab, you'll find options to export your financial data in various formats such as CSV or PDF.",
    category: "data",
  },
  {
    id: "8",
    question: "How do I set up recurring transactions?",
    answer:
      'When adding a new transaction, toggle the "Recurring" option and set the frequency (weekly, monthly, etc.) to automatically track regular income or expenses.',
    category: "transactions",
  },
  {
    id: "9",
    question: "How do I get notifications for bill payments?",
    answer:
      'Go to Settings, select the Notifications tab, and enable "Bill Reminders". You can customize when you want to be notified before due dates.',
    category: "notifications",
  },
  {
    id: "10",
    question: "How do I contact customer support?",
    answer:
      'Visit the Support page and click on "Contact Support" to submit a ticket. Our team will respond to your inquiry as soon as possible.',
    category: "support",
  },
]

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const category = url.searchParams.get("category")

    let faqs = faqData

    if (category) {
      faqs = faqData.filter((faq) => faq.category === category)
    }

    return NextResponse.json(faqs)
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
  }
}
