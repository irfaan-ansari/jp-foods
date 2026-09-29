"use client"

import { toast } from "sonner"
import { useState, type ReactNode } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@jp/ui/components/button"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogDescription,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"

import {
  completeOrderSchema,
  type CompleteOrderFormSchema,
} from "../order.schema"
import { useAppForm } from "@/hooks/use-app-form"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { Loader2 } from "lucide-react"
import { completeOrder } from "../order.action"

export function OrderCompleteDialog({
  id,
  children,
  lineItems = [],
}: {
  id: number
  lineItems: CompleteOrderFormSchema["lineItems"]
  children: ReactNode
}) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    defaultValues: { lineItems },

    validators: { onSubmit: completeOrderSchema },
    onSubmit: async ({ value }) => {
      const result = await completeOrder({ id, data: value.lineItems })
      if (result?.serverError || result?.validationErrors || !result?.data) {
        toast.error(
          result?.serverError?.message ??
            "Check the actual weights and try again."
        )
        return
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      setOpen(false)
    },
  })

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent
        className={lineItems.length > 0 ? "sm:max-w-2xl" : "sm:max-w-xl"}
      >
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-bold">
            Complete order #{id}
          </AppDialogTitle>
          <AppDialogDescription>
            Confirm the actual weights before completing this order. Final
            totals will be recalculated using the saved prices and tax rates.
          </AppDialogDescription>
        </AppDialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
          className="max-h-[80vh] min-h-0 space-y-6 overflow-y-auto"
        >
          <FieldGroup>
            {lineItems.map((item, index) => (
              <form.AppField
                key={item.lineItemId}
                name={`lineItems[${index}].unitQuantity`}
              >
                {(field) => (
                  <field.TextField
                    label={item.title}
                    inputMode="number"
                    placeholder="0"
                  />
                )}
              </form.AppField>
            ))}
          </FieldGroup>
          <Field className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:[&>button]:w-28">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting, canSubmit }) => (
                <Button type="submit" disabled={isSubmitting || !canSubmit}>
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Complete"
                  )}
                </Button>
              )}
            />
          </Field>
        </form>
      </AppDialogContent>
    </AppDialog>
  )
}
