"use client"

import React from "react"
import { Toaster } from "@jp/ui/components/sonner"
import { TooltipProvider } from "@jp/ui/components/tooltip"
import { ConfirmDialogProvider } from "@jp/ui/components/jp/confirm-dialog"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        const status = error?.status ?? error?.response?.status
        if (status === 403 || status === 404) {
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: false,
    },
  },
})
export const Provider = ({
  children,
}: {
  children: Readonly<React.ReactNode>
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
      </TooltipProvider>
      <Toaster position="top-center" />
    </QueryClientProvider>
  )
}
