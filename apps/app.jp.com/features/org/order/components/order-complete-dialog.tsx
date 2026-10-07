"use client"

import { toast } from "sonner"
import { useState, type ReactNode } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
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
import { useAppForm } from "@jp/ui/forms"
import { completeOrder } from "../order.action"
import { Field } from "@jp/ui/components/field"
import { formatUSD } from "@jp/utils"

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
  const hasItems = lineItems.length > 0

  const form = useAppForm({
    defaultValues: { lineItems },
    validators: { onSubmit: completeOrderSchema },
    onSubmit: async ({ value }) => {
      const result = await completeOrder({ id, data: value.lineItems })

      if (result?.serverError || result?.validationErrors || !result?.data) {
        toast.error(
          result?.serverError?.message ??
            (hasItems
              ? "Check the weights and try again."
              : "Couldn't complete the order. Try again.")
        )
        return
      }
      toast.success(`Order #${id} completed.`)
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["order", id] })
      setOpen(false)
    },
  })

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) form.reset()
  }
  console.log(lineItems)
  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>

      <AppDialogContent className={hasItems ? "sm:max-w-2xl" : "sm:max-w-xl"}>
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-semibold">
            {`Complete order #${id}`}
          </AppDialogTitle>
          <AppDialogDescription>
            {hasItems
              ? "Enter the actual weight for each item."
              : "This will mark the order as completed."}
          </AppDialogDescription>
        </AppDialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="flex min-h-0 flex-col"
        >
          {hasItems && (
            <>
              <div className="grid grid-cols-[1fr_6rem_5rem] gap-3 text-xs text-muted-foreground">
                <span>Item</span>
                <span>Actual weight</span>
                <span className="text-right">Total</span>
              </div>

              <div className="max-h-[50vh] divide-y overflow-y-auto">
                {lineItems.map((item, index) => (
                  <div
                    key={item.lineItemId}
                    className="grid grid-cols-[1fr_6rem_5rem] items-center gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.quantity} {item.unit} @{formatUSD(item.price)} /
                        {item.stockUOM}
                      </p>
                    </div>

                    <form.AppField name={`lineItems[${index}].unitQuantity`}>
                      {(field) => (
                        <field.TextField
                          label=""
                          inputMode="decimal"
                          placeholder="0"
                          className="h-8 text-right"
                          suffix={item.stockUOM ? item.stockUOM : ""}
                        />
                      )}
                    </form.AppField>

                    <form.Subscribe
                      selector={(s) => s.values.lineItems[index]?.unitQuantity}
                    >
                      {(qty) => (
                        <span className="text-right font-semibold tabular-nums">
                          {formatUSD(Number(item.price) * Number(qty))}
                        </span>
                      )}
                    </form.Subscribe>
                  </div>
                ))}
              </div>
            </>
          )}
          <Field className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:[&>button]:w-32">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
            >
              {({ isSubmitting, canSubmit }) => (
                <Button
                  type="submit"
                  className="w-24"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Complete Order"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </Field>
        </form>
      </AppDialogContent>
    </AppDialog>
  )
}
