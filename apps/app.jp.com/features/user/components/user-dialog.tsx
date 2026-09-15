"use client"

import React, { useState } from "react"

import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { useQueryClient } from "@tanstack/react-query"

import type { User } from "../user.type"

import Link from "next/link"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import { UserRole } from "@jp/auth"
import { authClient } from "@jp/auth/client"

import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { ChevronDown, Loader2, Plus } from "lucide-react"
import { type UserFormSchema, userSchema } from "../user.schema"
import { UserRoleSelector } from "../components/user-role-selector"
import { UserRoleBadge } from "../components/user-card"
import { UserAccess } from "@/features/auth/components/user-permission"

export const UserDialog = ({
  id,
  values,
  callback,
  children,
}: {
  values?: UserFormSchema
  id?: string
  callback?: (user: Partial<User>) => void
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    name = "",
    phoneNumber = "",
    email = "",
    role = "user",
  } = values || {}

  const form = useAppForm({
    defaultValues: {
      name,
      phoneNumber,
      email,
      role,
    },
    validators: {
      onChange: userSchema,
    },

    onSubmit: async ({ value }) => {
      const { name, phoneNumber, email, role } = value

      if (id) {
        const { error, data } = await authClient.admin.updateUser({
          userId: id,
          data: { name, phoneNumber, email, role: role as UserRole },
        })
        if (error) {
          toast.error(error.message)
          return
        }
        toast.success("User account update.")

        form.reset()
        setOpen(false)
        callback?.(data!)
        queryClient.invalidateQueries({ queryKey: ["users"] })
        queryClient.invalidateQueries({
          queryKey: ["count", "/users/count"],
        })
      } else {
        const { error, data } = await authClient.admin.createUser({
          name,
          email,
          role: role as UserRole,
          password: `${Date.now()}`,
          data: { phoneNumber, image: "" },
        })
        if (error) {
          toast.error(error.message)
          return
        }

        toast.success("User account created.")

        form.reset()
        setOpen(false)
        callback?.(data?.user!)
        queryClient.invalidateQueries({ queryKey: ["users"] })
        queryClient.invalidateQueries({
          queryKey: ["count", "/users/count"],
        })
      }
    },
  })

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-2xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-base font-bold">
            {id ? "Edit User" : "New User"}
          </AppDialogTitle>
        </AppDialogHeader>
        <div className="flex flex-col md:h-[max(60svh,320)]">
          <FieldGroup className="-mx-px no-scrollbar flex-1 overflow-auto px-px">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Name" placeholder="John" />
              )}
            />

            <form.AppField
              name="phoneNumber"
              children={(field) => (
                <field.PhoneField
                  label="Phone Number"
                  placeholder="123-123-1234"
                />
              )}
            />

            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField label="Email" placeholder="name@email.com" />
              )}
            />
            <form.Field
              name="role"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <UserRoleSelector
                      selected={field.state.value}
                      onChange={(value) => {
                        field.handleChange(value.value)
                      }}
                    >
                      <UserAccess permission={{ user: ["set-role"] }}>
                        {(disabled) => (
                          <Button
                            variant="outline"
                            type="button"
                            id={field.name}
                            disabled={disabled}
                            className="w-full justify-start text-muted-foreground"
                          >
                            <Plus />
                            {field.state.value ? (
                              <UserRoleBadge status={field.state.value} />
                            ) : (
                              "Select role..."
                            )}
                            <ChevronDown className="ml-auto" />
                          </Button>
                        )}
                      </UserAccess>
                    </UserRoleSelector>
                    <FieldDescription className="text-sm">
                      Not sure which role to assign? View role permissions{" "}
                      <Link
                        href="/docs/user-roles"
                        className="text-primary underline underline-offset-4 hover:no-underline"
                      >
                        here
                      </Link>
                      .
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </div>
        <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-28">
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
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            )}
          />
        </Field>
      </AppDialogContent>
    </AppDialog>
  )
}
