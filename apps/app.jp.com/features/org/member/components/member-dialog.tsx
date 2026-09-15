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
import { UserSelector } from "@/features/user/components/user-selector"

export const MemberDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  const form = useAppForm({
    defaultValues: {
      user: {
        id: "",
        name: "",
      },
      role: "",
    },
    onSubmit: async ({ value }) => {
      //  add member server action
    },
  })
  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-2xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-base font-bold">
            New Member
          </AppDialogTitle>
        </AppDialogHeader>
        <FieldGroup>
          <form.AppField
            name="user"
            children={(field) => {
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>User</FieldLabel>
                  <UserSelector
                    selected={field.state.value?.id}
                    setSelectedChange={(value) => {
                      field.handleChange(value)
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
                        field.state.value?.name
                      ) : (
                        <span className="text-muted-foreground">Select...</span>
                      )}
                      <ChevronDown className="ml-auto" />
                    </Button>
                  </UserSelector>
                </Field>
              )
            }}
          />
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
                    onChange={(value) => field.handleChange(value)}
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>

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
