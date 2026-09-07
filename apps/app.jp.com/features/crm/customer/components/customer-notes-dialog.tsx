"use client"

import React from "react"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Field } from "@jp/ui/components/field"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { useQueryClient } from "@tanstack/react-query"
import { updateCustomerApplication } from "../customer.action"

export const CustomerApplicationNotesDialog = ({
  id,
  values,
  children,
}: {
  children: React.ReactNode
  id: number
  values: {
    internalNotes: string
  }
}) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)

  const form = useAppForm({
    defaultValues: {
      internalNotes: values.internalNotes ?? "",
    },
    onSubmit: async ({ value }) => {
      const { serverError } = await updateCustomerApplication({
        id,
        data: { internalNotes: value.internalNotes },
      })
      if (serverError) {
        toast.error(serverError.message)
      } else {
        setOpen(false)
        queryClient.invalidateQueries({
          queryKey: ["customer-application"],
        })
        queryClient.invalidateQueries({
          queryKey: ["/crm/customers/count"],
        })
      }
    },
  })

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            {values.internalNotes ? "Edit" : "Add"} Notes
          </AppDialogTitle>
        </AppDialogHeader>
        <form onSubmit={() => form.handleSubmit()} className="space-y-6">
          <form.AppField
            name="internalNotes"
            children={(field) => (
              <field.TextAreaField label="Notes" placeholder="Notes..." />
            )}
          />

          <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-28">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting }) => (
                <Button
                  disabled={isSubmitting}
                  onClick={() => form.handleSubmit()}
                >
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
