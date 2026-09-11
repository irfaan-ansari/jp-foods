"use client"

import React from "react"

import { OrderScheduleForm } from "../forms/order-schedule-form"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AppError } from "@jp/utils"

interface Props {
  children: React.ReactNode
  id: number
  defaultValues: {
    deliveryDate: string
    deliveryWindow: string
  }
}

export const OrderScheduleDialog = ({ children, defaultValues, id }: Props) => {
  const [open, setOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const handleSuccess = () => {
    setOpen(false)
    queryClient.invalidateQueries({ queryKey: ["orders"] })
    queryClient.invalidateQueries({
      queryKey: ["count", "/org/orders/count"],
    })
    toast.success("Order updated successfully.")
  }

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-bold">
            Edit Schedule
          </AppDialogTitle>
        </AppDialogHeader>
        <OrderScheduleForm
          onCancel={() => setOpen(false)}
          onSuccess={handleSuccess}
          id={id}
          defaultValues={defaultValues}
        />
      </AppDialogContent>
    </AppDialog>
  )
}
