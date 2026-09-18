"use client"

import z from "zod"
import React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@jp/auth/client"
import { useStore } from "@tanstack/react-form"
import { AlertCircleIcon, CircleCheck, Loader2, X } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@jp/ui/components/alert"
import { Button } from "@jp/ui/components/button"
import { useAppForm } from "@/hooks/use-app-form"
import { Field, FieldGroup } from "@jp/ui/components/field"

const schema = z.object({
  username: z.union(
    [
      z.string().regex(/^[6-9]\d{9}$/, "Enter a valid phone number"),
      z.email("Enter valid email"),
    ],
    "Enter valid email or phone number"
  ),
  error: z.string(),
  success: z.boolean(),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      username: "",
      error: "",
      success: false,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      form.setFieldValue("error", "")
      form.setFieldValue("success", false)
      await authClient.requestPasswordReset(
        {
          email: value.username,
          redirectTo:
            process.env.NEXT_PUBLIC_SITE_URL + "/auth/create-password",
        },
        {
          onError: (error) => {
            form.setFieldValue(
              "error",
              error?.error?.message ?? "Something went wrong"
            )
          },
          onSuccess: () => {
            form.setFieldValue("success", true)
            toast.success("Password reset email sent!")
          },
        }
      )
    },
  })

  const error = useStore(form.store, (state) => state.values.error)
  const success = useStore(form.store, (state) => state.values.success)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex w-full flex-1 flex-col items-start justify-center gap-4 px-6 py-20 lg:max-w-xl lg:px-16"
    >
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-bold">Forgot Password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email or phone number to reset your password.
        </p>
      </div>
      <FieldGroup>
        <form.AppField
          name="username"
          children={(field) => (
            <field.TextField
              label="Email or Phone"
              placeholder="email or phone number"
              className="*:data-[slot=input]:h-12"
            />
          )}
        />

        {/* success */}
        <form.Subscribe
          selector={(state) => state.values.success}
          children={(success) => (
            <Alert variant="success" className={!success ? "hidden" : ""}>
              <CircleCheck />
              <AlertTitle>Check your email or phone</AlertTitle>
              <AlertDescription>
                If an account exists with the provided details, you will receive
                password reset instructions via email and phone.
              </AlertDescription>
            </Alert>
          )}
        />

        {/* alert */}
        <form.Subscribe
          selector={(state) => state.values.error}
          children={(error) => (
            <Alert
              variant="destructive"
              className={`border-destructive/10 bg-destructive/5 ${!error ? "hidden" : ""}`}
            >
              <AlertCircleIcon />
              <AlertDescription>{error}</AlertDescription>
              <AlertAction>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="outline"
                  className="rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80"
                  onClick={() => {
                    form.setFieldValue("error", "")
                  }}
                >
                  <X />
                </Button>
              </AlertAction>
            </Alert>
          )}
        />

        <Field>
          <form.Subscribe
            selector={({ isSubmitting, canSubmit }) => ({
              isSubmitting,
              canSubmit,
            })}
            children={({ isSubmitting, canSubmit }) => (
              <Button
                type="submit"
                size="xl"
                className="rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            )}
          />
        </Field>

        <Field className="text-center">
          <Link
            href="/auth/signin"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </Field>
      </FieldGroup>
    </form>
  )
}
