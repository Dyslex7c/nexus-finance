"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')
    
    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords don't match")
      setIsSubmitting(false)
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters")
      setIsSubmitting(false)
      return
    }
    
    try {
      // Here you would typically send the data to your API
      // const response = await fetch('/api/user/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage('Password changed successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error changing password:', error)
      setErrorMessage('Failed to change password')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTwoFactorToggle = async () => {
    try {
      // Here you would typically send the data to your API
      // const response = await fetch('/api/user/two-factor', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ enabled: !twoFactorEnabled })
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTwoFactorEnabled(!twoFactorEnabled)
    } catch (error) {
      console.error('Error toggling two-factor auth:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          
          <div className="flex justify-end items-center space-x-4">
            {errorMessage && (
              <span className="text-red-400 text-sm">{errorMessage}</span>
            )}
            {successMessage && (
              <span className="text-green-400 text-sm">{successMessage}</span>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )};
