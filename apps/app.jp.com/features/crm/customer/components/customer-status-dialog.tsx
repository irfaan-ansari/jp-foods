import React from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
} from "@jp/ui/components/jp/app-dialog"
import { Button } from "@jp/ui/components/button"
import { useAppForm } from "@/hooks/use-app-form"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { useQueryClient } from "@tanstack/react-query"
import { APPLICATION_REJECTION_REASONS } from "../customer.const"
import { CustomerApplication } from "../customer.type"
import { updateCustomerApplication } from "../customer.action"

export function CustomerApplicationStatusDialog({
  id,
  data,
  open,
  onOpenChange,
}: {
  id: number
  data: CustomerApplication
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      status: data.status,
      statusReason: "",
      statusDetails: "",
    },
    onSubmit: async ({ value }) => {
      const { serverError } = await updateCustomerApplication({
        id,
        data: { ...data, ...value, internalNotes: data.internalNotes ?? "" },
      })
      if (serverError) {
        toast.error(serverError.message)
      } else {
        onOpenChange(false)
        queryClient.invalidateQueries({
          queryKey: ["customer-application", id],
        })
        queryClient.invalidateQueries({
          queryKey: ["/crm/customers/count"],
        })
      }
    },
  })
  const title =
    data.status === "rejected" ? "Reject Application" : "Hold Application"

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-bold">
            {title}
          </AppDialogTitle>
        </AppDialogHeader>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField
              name="statusReason"
              children={(field) => (
                <field.SelectField
                  label="Reason"
                  placeholder="Select..."
                  options={APPLICATION_REJECTION_REASONS.map((reason) => ({
                    label: reason,
                    value: reason,
                  }))}
                />
              )}
            />
            <form.AppField
              name="statusDetails"
              children={(field) => (
                <field.TextAreaField
                  label="Additional Details"
                  placeholder="Type here..."
                />
              )}
            />
          </FieldGroup>
          <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-28">
            <AppDialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </AppDialogClose>

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
