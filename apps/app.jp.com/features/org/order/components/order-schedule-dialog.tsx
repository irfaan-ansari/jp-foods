"use client"

import React from "react"

import { Loader2 } from "lucide-react"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { rescheduleOrder } from "../order.action"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { orderSchema } from "../order.schema"

import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

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

  const { deliveryDate, deliveryWindow } = defaultValues

  const form = useAppForm({
    defaultValues: {
      deliveryDate: deliveryDate ?? "",
      deliveryWindow: deliveryWindow ?? "",
    },
    validators: {
      onSubmit: orderSchema.omit({ status: true }),
    },
    onSubmit: async ({ value }) => {
      const { serverError, data, validationErrors } = await rescheduleOrder({
        id,
        data: { ...value },
      })

      if (serverError || validationErrors) {
        toast.error(serverError?.message ?? "Failed to update order.")
      }
      if (data) {
        setOpen(false)
        queryClient.invalidateQueries({ queryKey: ["orders"] })
        queryClient.invalidateQueries({
          queryKey: ["count", "/org/orders/count"],
        })
        toast.success("Order updated successfully.")
      }
    },
  })

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-bold">
            Edit Schedule
          </AppDialogTitle>
        </AppDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField
              name="deliveryDate"
              children={(field) => <field.DateField label="Delivery Date" />}
            />
            <form.AppField
              name="deliveryWindow"
              children={(field) => (
                <field.SelectField
                  label="Delivery Window"
                  options={[{ label: "3-6", value: "3-6" }]}
                />
              )}
            />
          </FieldGroup>

          <Field className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:[&>button]:w-28">
            <AppDialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </AppDialogClose>
            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting, canSubmit }) => (
                <Button type="submit" disabled={isSubmitting || !canSubmit}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
                </Button>
              )}
            />
          </Field>
        </form>
      </AppDialogContent>
    </AppDialog>
  )
}
