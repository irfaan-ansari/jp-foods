"use client"
import React from "react"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp"
import { OrderCancelForm } from "../forms/order-cancel-form"

export const OrderCancelDialog = ({
  id,
  children,
}: {
  children: React.ReactNode
  id: number
}) => {
  const [open, setOpen] = React.useState(false)
  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            Cancel order?
          </AppDialogTitle>
        </AppDialogHeader>
        <OrderCancelForm
          id={id}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </AppDialogContent>
    </AppDialog>
  )
}
