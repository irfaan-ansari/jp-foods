"use client"
import React from "react"
import { useAppForm } from "@/hooks/use-app-form"

import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Field } from "@jp/ui/components/field"
import { Button } from "@jp/ui/components/button"
import { authClient } from "@jp/auth/client"
import { InvitationFormSchema, invitationSchema } from "../invitation.schema"

export const InvitationForm = ({
  values,
  onSuccess,
  onCancel,
}: {
  values: InvitationFormSchema
  onSuccess?: () => void
  onCancel?: () => void
}) => {
  const form = useAppForm({
    defaultValues: { ...values },
    validators: { onChange: invitationSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.organization.inviteMember({
        role: "customer",
        resend: true,
        ...value,
      })
      if (error) {
        toast.error(error.message)
      } else {
        onSuccess?.()
        toast.success("Invitation sent successfully.")
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-6"
    >
      <form.AppField
        name="email"
        children={(field) => (
          <field.TextField label="Email" placeholder="name@email.com" />
        )}
      />

      <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-28">
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
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Invite"}
            </Button>
          )}
        />
      </Field>
    </form>
  )
}
