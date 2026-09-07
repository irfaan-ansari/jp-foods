"use client"
import React from "react"
import { useAppForm } from "@/hooks/use-app-form"
import { passwordSchema } from "../profile.schema"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"

import { Button } from "@jp/ui/components/button"
import { Loader2 } from "lucide-react"

export const ChangePasswordForm = () => {
  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: { onChange: passwordSchema },
    onSubmit: async (values) => {
      console.log(values)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="rounded-2xl border"
    >
      <Field className="gap-0 p-6">
        <FieldLabel className="text-base font-semibold">
          Change Password
        </FieldLabel>
        <FieldDescription>
          Update your password to keep your account secure.
        </FieldDescription>
      </Field>
      <FieldGroup className="max-w-xl p-6">
        <form.AppField
          name="currentPassword"
          children={(field) => (
            <field.PasswordField
              label="Current Password"
              description="Enter your current password."
            />
          )}
        />
        <form.AppField
          name="newPassword"
          children={(field) => (
            <field.PasswordField
              label="New Password"
              description="Use at least 8 characters with a mix of letteres, numbers & symbold."
            />
          )}
        />
        <form.AppField
          name="confirmPassword"
          children={(field) => (
            <field.PasswordField
              label="Confirm Password"
              description="Enter your new password."
            />
          )}
        />
      </FieldGroup>
      <div className="border-t bg-secondary/50 p-6 text-right">
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
                "Change Password"
              )}
            </Button>
          )}
        />
      </div>
    </form>
  )
}
