"use client"

import type { ReactNode } from "react"
import { Toaster } from "sonner"
import { TooltipProvider } from "@jp/ui/components/tooltip"
import { ConfirmDialogProvider } from "@jp/ui/components/jp/confirm-dialog"

export function SiteProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
      <Toaster position="bottom-center" />
    </TooltipProvider>
  )
}
