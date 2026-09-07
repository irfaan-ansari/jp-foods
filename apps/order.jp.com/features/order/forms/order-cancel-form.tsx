"use client"

import React from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { cancelOrder } from "../order.action"
import { Button } from "@jp/ui/components/button"
import { useAppForm } from "@/hooks/use-app-form"
import { orderCancelSchema } from "../order.schema"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { ORDER_CANCEL_REASONS } from "../order.data"
import { useQueryClient } from "@tanstack/react-query"

export const OrderCancelForm = ({
  id,
  onSuccess,
  onError,
  onCancel,
}: {
  id: number
  onSuccess?: () => void
  onError?: () => void
  onCancel?: () => void
}) => {
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: {
      cancelReason: "",
    },
    validators: {
      onChange: orderCancelSchema,
    },

    onSubmit: async ({ value }) => {
      const { serverError } = await cancelOrder({ id, data: value })
      if (serverError) {
        toast.error(serverError?.message)
        onError?.()
      } else {
        toast.success("Order cancelled successfully.")
        onSuccess?.()
        queryClient.invalidateQueries({ queryKey: ["orders"] })
      }
    },
  })
  return (
    <>
      <div className="-mx-px no-scrollbar flex-1 overflow-auto px-px">
        <FieldGroup className="">
          <form.AppField
            name="cancelReason"
            children={(field) => (
              <field.SelectField
                label="Cancel Reason"
                placeholder="Select..."
                options={ORDER_CANCEL_REASONS}
              />
            )}
          />
        </FieldGroup>
      </div>
      <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-34">
        <Button variant="outline" onClick={() => onCancel?.()}>
          Cancel
        </Button>

        <form.Subscribe
          selector={({ isSubmitting, canSubmit }) => ({
            isSubmitting,
            canSubmit,
          })}
          children={({ isSubmitting }) => (
            <Button disabled={isSubmitting} onClick={() => form.handleSubmit()}>
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Cancel Order"
              )}
            </Button>
          )}
        />
      </Field>
    </>
  )
}
