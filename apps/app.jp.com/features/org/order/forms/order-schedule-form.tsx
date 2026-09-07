import React from "react"
import { Loader2 } from "lucide-react"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { rescheduleOrder } from "../order.action"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { UpdateOrderFormSchema, orderSchema } from "../order.schema"
import { toast } from "sonner"

export const OrderScheduleForm = ({
  id,
  defaultValues,
  onSuccess,
  onCancel,
  onError,
}: {
  onSuccess?: () => void
  onError?: <T>(err: T) => void
  onCancel?: () => void
  id: number
  defaultValues: Omit<UpdateOrderFormSchema, "status">
}) => {
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
        onError?.({ serverError, validationErrors })
      }
      if (data) {
        onSuccess?.()
      }
    },
  })

  return (
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
        <Button variant="outline" type="button" onClick={() => onCancel?.()}>
          Cancel
        </Button>
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
  )
}
