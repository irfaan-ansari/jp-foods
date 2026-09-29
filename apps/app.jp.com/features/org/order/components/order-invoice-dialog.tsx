"use client"

import { useState, type ReactNode } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogDescription,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { generateInvoice } from "../order.action"

export function OrderInvoiceDialog({
  id,
  children,
}: {
  id: number
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const queryClient = useQueryClient()
  const generate = async () => {
    setPending(true)
    try {
      const result = await generateInvoice({ id })
      if (result?.serverError || result?.validationErrors || !result?.data) {
        toast.error(
          result?.serverError?.message ?? "Unable to generate the invoice."
        )
        return
      }
      setOpen(false)
      void queryClient.invalidateQueries({ queryKey: ["orders"] })
      void queryClient.invalidateQueries({ queryKey: ["invoices"] })
      toast.success("Invoice generated. Use Download Invoice to view it.")
    } catch {
      toast.error("Unable to generate the invoice. Please try again.")
    } finally {
      setPending(false)
    }
  }
  return (
    <AppDialog
      open={open}
      onOpenChange={(value) => {
        if (!pending) setOpen(value)
      }}
    >
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-lg">
        <AppDialogHeader>
          <AppDialogTitle>Generate invoice for order #{id}?</AppDialogTitle>
          <AppDialogDescription>
            The invoice will use the completed order's actual weights, saved
            prices, taxes and charges. Issued invoice details are saved
            permanently.
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button disabled={pending} onClick={generate}>
            {pending && <Loader2 className="animate-spin" />}Generate Invoice
          </Button>
        </div>
      </AppDialogContent>
    </AppDialog>
  )
}
