"use client"

import React from "react"
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
import { User } from "../user.type"

export const UserForm = ({
  id,
  values,
  onSuccess,
  onError,
  onCancel,
}: {
  id?: string
  values?: UserFormSchema
  onSuccess?: (user: User) => void
  onError?: () => void
  onCancel?: () => void
}) => {
  const { name = "", phoneNumber = "", email = "", role = "" } = values || {}

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
          toast.error(error.message ?? "Failed to update user details.")
          onError?.()
        } else {
          toast.success("User update.")
          onSuccess?.(data as User)
        }
      } else {
        const { error, data } = await authClient.admin.createUser({
          name,
          email,
          role: role as UserRole,
          password: "",
          data: { phoneNumber, image: "" },
        })
        if (error) {
          toast.error(error.message ?? "Failed to create user.")
          onError?.()
        } else {
          toast.success("User account created.")
          onSuccess?.(data.user as User)
        }
      }
    },
  })
  return (
    <>
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
                    <Button
                      variant="outline"
                      type="button"
                      id={field.name}
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
      </div>
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
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          )}
        />
      </Field>
    </>
  )
}
