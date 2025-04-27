"use client"

import type React from "react"

import { useState } from "react"
import { Send, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ContactSupport() {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        subject: "",
        category: "",
        message: "",
      })
    }, 1500)
  }

  return (
    <Card className="bg-[#0B1120] border-gray-800 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Contact Support</CardTitle>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center py-6">
            <MessageSquare className="h-12 w-12 mx-auto text-cyan-400 mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">Message Sent</h3>
            <p className="text-sm text-gray-400 mb-4">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's your question about?"
                required
                className="bg-[#050B18] border-gray-800 focus-visible:ring-cyan-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger id="category" className="bg-[#050B18] border-gray-800 focus:ring-cyan-600">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B1120] border-gray-800">
                  <SelectItem value="account">Account Issues</SelectItem>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your issue in detail"
                required
                className="min-h-[150px] bg-[#050B18] border-gray-800 focus-visible:ring-cyan-600"
              />
            </div>

            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
