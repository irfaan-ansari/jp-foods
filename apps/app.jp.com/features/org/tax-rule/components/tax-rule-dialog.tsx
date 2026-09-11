"use client"
import React from "react"
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { toast } from "sonner"
import { useAppForm } from "@/hooks/use-app-form"
import { type TaxRuleFormValues, taxRuleSchema } from "../tax-rule.schema"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { Button } from "@jp/ui/components/button"
import { Loader2 } from "lucide-react"
import { createTaxRule, updateTaxRule } from "../tax-rule.action"
import { useQueryClient } from "@tanstack/react-query"

export const TaxRuleDialog = ({
  id,
  values,
  children,
}: {
  id?: number
  values?: TaxRuleFormValues
  children?: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const form = useAppForm({
    validators: {
      onBlur: taxRuleSchema,
    },
    defaultValues: values ?? {
      name: "",
      rate: "",
    },
    onSubmit: async ({ value }) => {
      if (id) {
        const { serverError } = await updateTaxRule({ id, data: value })
        if (serverError) {
          toast.error(serverError.message)
          return
        }
        toast.success("Updated successfully")
        setOpen(false)
        queryClient.invalidateQueries({ queryKey: ["tax-rules"] })
      } else {
        const { serverError, validationErrors } = await createTaxRule({
          data: value,
        })

        console.log({ serverError, validationErrors })
        if (serverError) {
          toast.error(serverError.message)
          return
        }
        if (validationErrors) {
          toast.error("Validation failed")
          return
        }
        toast.success("Created successfully")
        setOpen(false)
        queryClient.invalidateQueries({ queryKey: ["tax-rules"] })
        queryClient.invalidateQueries({ queryKey: ["/org/tax-rules/count"] })
      }
    },
  })

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="sm:max-w-xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-bold">
            {id ? "Edit Tax Rule" : "New Tax Rule"}
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
              name="name"
              children={(field) => (
                <field.TextField
                  label="Tax Rule Name"
                  placeholder="e.g. Standard Sales Tax"
                />
              )}
            />
            <form.AppField
              name="rate"
              children={(field) => (
                <field.TextField
                  label="Tax Rate"
                  placeholder="0.00"
                  inputMode="decimal"
                  suffix="%"
                />
              )}
            />
            <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:**:w-28">
              <AppDialogClose asChild>
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </AppDialogClose>

              <form.Subscribe
                selector={({ isSubmitting, canSubmit }) => ({
                  isSubmitting,
                  canSubmit,
                })}
                children={({ isSubmitting }) => (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                )}
              />
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </AppDialog>
  )
}
