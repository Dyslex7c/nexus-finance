"use client"

import React, { Suspense } from "react"
import LoginPageForm from "./loginPage"
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageForm />
    </Suspense>
  )
}
