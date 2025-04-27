"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqData = [
  {
    question: "How do I add a new transaction?",
    answer:
      "To add a new transaction, navigate to the Transactions page and click on the 'Add Transaction' button. Fill in the required details such as amount, date, category, and description, then click 'Save'.",
  },
  {
    question: "How do I create a savings goal?",
    answer:
      "To create a savings goal, go to the Savings Goals page and click on 'Add Goal'. Enter your target amount, target date, and other details. You can track your progress and make contributions to your goal from the same page.",
  },
  {
    question: "How do I set up a budget?",
    answer:
      "To set up a budget, navigate to the Budget page and click 'Create Budget'. You can set spending limits for different categories, choose a time period (monthly, weekly, etc.), and the system will track your spending against these limits.",
  },
  {
    question: "How do I connect my bank account?",
    answer:
      "To connect your bank account, go to Settings > Linked Accounts and click 'Add Account'. Follow the secure authentication process to link your bank. Once connected, your transactions will be automatically imported.",
  },
  {
    question: "How do I export my financial data?",
    answer:
      "To export your financial data, go to Settings > Data Management and click 'Export Data'. You can choose the date range and format (CSV, PDF, etc.) for your export. The file will be generated and available for download.",
  },
  {
    question: "How do I change my password?",
    answer:
      "To change your password, go to Settings > Security and find the 'Change Password' section. Enter your current password and your new password twice to confirm. Click 'Update Password' to save your changes.",
  },
  {
    question: "How do I set up notifications?",
    answer:
      "To set up notifications, go to the Notifications page and click on 'Notification Settings'. You can choose which types of alerts you want to receive (low balance, bill reminders, etc.) and how you want to receive them (email, push notifications).",
  },
  {
    question: "How do I categorize my transactions?",
    answer:
      "You can categorize transactions manually by editing a transaction and selecting a category from the dropdown menu. The system also automatically categorizes transactions based on the merchant. You can set up rules for automatic categorization in Settings > Financial Settings.",
  },
]

export function SupportFAQ() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="bg-[#0B1120] border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for help..."
            className="pl-9 bg-[#050B18] border-gray-800 focus-visible:ring-cyan-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredFAQs.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400">No results found for "{searchQuery}"</p>
            <p className="text-sm text-gray-500 mt-2">Try a different search term or contact support</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-800">
                <AccordionTrigger className="text-left hover:text-cyan-400">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
