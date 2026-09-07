"use client"
import React from "react"
import { toast } from "sonner"
import { ChevronDown, Loader2, Plus } from "lucide-react"
import { authClient } from "@jp/auth/client"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import { MemberRoleSelector } from "../components/member-role-selector"
import Link from "next/link"

export const MemberForm = ({
  onSuccess,
  onError,
  onCancel,
}: {
  onSuccess?: () => void
  onError?: () => void
  onCancel?: () => void
}) => {
  const form = useAppForm({
    defaultValues: {
      user: {},
      role: "",
      email: "",
      team: {},
    },
    onSubmit: async ({ value }) => {
      //   const { data, error } = await authClient.admin.setUserPassword({
      //     userId: id,
      //     newPassword: value.newPassword,
      //   })
      //   if (error) {
      //     toast.error(error?.message ?? "Failed to create password.")
      //     onError?.()
      //   } else {
      //     toast.success("Password created.")
      //     onSuccess?.()
      //   }
    },
  })
  return (
    <>
      <div className="-mx-px no-scrollbar flex-1 overflow-auto px-px">
        <FieldGroup className="">
          <form.Field
            name="role"
            mode="array"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                  <MemberRoleSelector
                  // selected={items.map((item) => item.value as string)}
                  // onChange={(value) => {
                  //   const index = items.findIndex(
                  //     (item) => item.value === value.value
                  //   )
                  //   if (index >= 0) {
                  //     field.removeValue(index)
                  //   } else {
                  //     field.pushValue({ ...value })
                  //   }
                  // }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      type="button"
                      id={field.name}
                      className="w-full justify-start text-muted-foreground"
                    >
                      <Plus />

                      <ChevronDown className="ml-auto" />
                    </Button>
                  </MemberRoleSelector>
                  <FieldDescription className="text-sm">
                    Not sure which role to assign? View role permissions{" "}
                    <Link
                      href="/docs/member-roles"
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
          <form.AppField
            name="user"
            children={(field) => (
              <field.TextField
                label="Customer Account"
                placeholder="Select..."
              />
            )}
          />
          <div className="relative border-b">
            <span className="absolute top-1/2 left-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform bg-background px-2 font-medium text-muted-foreground uppercase">
              Select User
            </span>
          </div>
          <form.AppField
            name="user"
            children={(field) => (
              <field.TextField label="User" placeholder="Select..." />
            )}
          />

          <div className="relative border-b">
            <span className="absolute top-1/2 left-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform bg-background px-2 font-medium text-muted-foreground uppercase">
              OR
            </span>
          </div>
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField label="Email" placeholder="name@email.com" />
            )}
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
