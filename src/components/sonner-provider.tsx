"use client"

import { Toaster as SonnerToaster } from "sonner"

export function SonnerProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(15, 23, 42, 0.9)",
          color: "white",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          backdropFilter: "blur(8px)",
        },
        className: "sonner-toast",
        descriptionClassName: "text-gray-400 text-sm",
      }}
      closeButton
      richColors
    />
  )
}

