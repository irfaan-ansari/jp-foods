"use client"

import React, { useState } from "react"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { authClient } from "@jp/auth/client"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { Field, FieldGroup } from "@jp/ui/components/field"

import { userPasswordSchema } from "../user.schema"

export const UserPasswordDialog = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const form = useAppForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    validators: {
      onChange: userPasswordSchema,
    },

    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.admin.setUserPassword({
        userId: id,
        newPassword: value.newPassword,
      })
      if (error) {
        toast.error(error?.message ?? "Failed to create password.")
      } else {
        toast.success("Password created.")
        setOpen(false)
      }
    },
  })

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            New Password
          </AppDialogTitle>
        </AppDialogHeader>
        <div className="-mx-px no-scrollbar flex-1 overflow-auto px-px">
          <FieldGroup className="">
            <form.AppField
              name="password"
              children={(field) => (
                <field.PasswordField label="Passowrd" placeholder="" />
              )}
            />

            <form.AppField
              name="newPassword"
              children={(field) => (
                <field.PasswordField label="Confirm Password" />
              )}
            />
          </FieldGroup>
        </div>
        <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-34">
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
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Password"
                )}
              </Button>
            )}
          />
        </Field>
      </AppDialogContent>
    </AppDialog>
  )
}
