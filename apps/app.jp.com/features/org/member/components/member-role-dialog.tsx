"use client"

import { toast } from "sonner"
import React, { useState } from "react"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"

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
import { MemberRoleBadge } from "./member-card"
import { useQueryClient } from "@tanstack/react-query"

export const MemberRoleDialog = ({
  values,
  children,
}: {
  values: {
    memberId: string
    role: string
  }
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: {
      memberId: values.memberId,
      role: values.role,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.organization.updateMemberRole({
        memberId: value.memberId,
        role: value.role,
      })

      if (error) {
        toast.error(error?.message)
        return
      }
      toast.success("Role updated.")
      setOpen(false)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["members"] })
    },
  })

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            Change Role
          </AppDialogTitle>
        </AppDialogHeader>
        <div className="-mx-px no-scrollbar flex-1 overflow-auto px-px">
          <FieldGroup className="">
            <form.Field
              name="role"

              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <MemberRoleSelector
                      selected={field.state.value}
                      onChange={(value) => {
                        field.setValue(value)
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
                          <MemberRoleBadge status={field.state.value} />
                        ) : (
                          <span className="text-muted-foreground">
                            Select role
                          </span>
                        )}
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
