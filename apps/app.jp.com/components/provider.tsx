"use client"

import React from "react"
import { Toaster } from "@jp/ui/components/sonner"
import { TooltipProvider } from "@jp/ui/components/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfirmDialogProvider } from "@jp/ui/components/jp/confirm-dialog"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
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
