import React from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
} from "@jp/ui/components/jp/app-dialog"
import { Button } from "@jp/ui/components/button"
import { useAppForm } from "@/hooks/use-app-form"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { updateCustomerApplicationStatus } from "../customer.action"
import { useQueryClient } from "@tanstack/react-query"
import { APPLICATION_REJECTION_REASONS } from "../customer.const"

export function CustomerApplicationStatusDialog({
  id,
  action,
  open,
  onOpenChange,
}: {
  id: number
  action: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: {
      status: action === "hold" ? "on_hold" : "rejected",
      statusReason: "",
      statusDetails: "",
    },
    onSubmit: async ({ value }) => {
      const { serverError } = await updateCustomerApplicationStatus({
        id: 1,
        data: value,
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
  const title = action === "reject" ? "Reject Application" : "Hold Application"

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-lg font-bold">{title}</AppDialogTitle>
        </AppDialogHeader>
        <form className="space-y-6">
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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
