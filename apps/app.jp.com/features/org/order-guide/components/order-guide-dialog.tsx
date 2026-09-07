"use client"

import React, { useState } from "react"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { useQueryClient } from "@tanstack/react-query"
import { OrderGuideFormSchema } from "../order-guide.schema"
import OrderGuideForm from "../forms/order-guide-form"
import { toast } from "sonner"

export const OrderGuideDialog = ({
  id,
  values,
  children,
}: {
  id?: number
  values?: OrderGuideFormSchema
  children: React.ReactNode
}) => {
  const { name = "", description = "", team = {}, products = [] } = values ?? {}

  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    toast.success("Order guide saved.")
    queryClient.invalidateQueries({ queryKey: ["order-guides"] })
    queryClient.invalidateQueries({
      queryKey: ["/api/v1/org/order-guides/count"],
    })
    setOpen(false)
  }

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="h-full max-h-[max(620px,80svh)] overflow-hidden md:max-w-2xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-lg font-bold">
            {id ? "Edit Order Guide" : "New Order Guide"}
          </AppDialogTitle>
        </AppDialogHeader>
        <OrderGuideForm
          id={id}
          // @ts-ignore
          values={{ name, description, team, products }}
          onCancel={() => setOpen(false)}
          onSuccess={handleSuccess}
        />
      </AppDialogContent>
    </AppDialog>
  )
}
