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
import { Badge } from "@jp/ui/components/badge"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { ChevronDown, Loader2, Plus } from "lucide-react"
import { type UserFormSchema, userSchema } from "../user.schema"
import { UserRoleSelector } from "../components/user-role-selector"
import { OrganizationSelector } from "@/features/org/components/organization-selector"

export const UserForm = ({
  id,
  values,
  onSuccess,
  onError,
  onCancel,
}: {
  id?: string
  values?: UserFormSchema
  onSuccess?: () => void
  onError?: () => void
  onCancel?: () => void
}) => {
  const { name = "", phoneNumber = "", email = "", role = [] } = values || {}

  const form = useAppForm({
    defaultValues: {
      name,
      phoneNumber,
      email,
      role,
      organizations: [] as UserFormSchema["organizations"],
      teams: [] as UserFormSchema["teams"],
    },
    validators: {
      onChange: userSchema,
    },

    onSubmit: async ({ value }) => {
      const { name, phoneNumber, email, role } = value
      const roles = role.map((r) => r.value)
      if (id) {
        const { error } = await authClient.admin.updateUser({
          userId: id,
          data: { name, phoneNumber, email, role: roles as UserRole[] },
        })
        if (error) {
          toast.error(error.message ?? "Failed to update user.")
          onError?.()
        } else {
          toast.success("User update.")
          onSuccess?.()
        }
      } else {
        const { error } = await authClient.admin.createUser({
          name,
          email,
          role: roles as UserRole[],
          password: "",
          data: { phoneNumber, image: "" },
        })
        if (error) {
          toast.error(error.message ?? "Failed to create user.")
          onError?.()
        } else {
          toast.success("User created.")
          onSuccess?.()
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
              <field.TextField label="Name" placeholder="Weekly essentials" />
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
                      size="lg"
                      type="button"
                      id={field.name}
                      className="w-full justify-start text-muted-foreground"
                    >
                      <Plus />
                      {field.state.value ? (
                        <Badge variant="warning-light">
                          {field.state.value}
                        </Badge>
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

          <form.Field
            name="teams"
            mode="array"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              const items = field.state.value
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Organization</FieldLabel>
                  <OrganizationSelector
                    selected={items.map((item) => item.id as string)}
                    setSelectedChange={(value) => {
                      const index = items.findIndex(
                        (item) => item.id === value.id
                      )
                      if (index >= 0) {
                        field.removeValue(index)
                      } else {
                        field.pushValue({ ...value })
                      }
                    }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      type="button"
                      id={field.name}
                      className="w-full justify-start text-muted-foreground"
                    >
                      <Plus />
                      {field.state.value.length > 0
                        ? field.state.value.map((value) => (
                            <Badge variant="warning-light">{value.name}</Badge>
                          ))
                        : "Select organization..."}
                      <ChevronDown className="ml-auto" />
                    </Button>
                  </OrganizationSelector>
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
