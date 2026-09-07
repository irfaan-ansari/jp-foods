"use client"

import z from "zod"
import React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@jp/auth/client"
import { useStore } from "@tanstack/react-form"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { AlertCircleIcon, Loader2, X } from "lucide-react"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@jp/ui/components/alert"
import { loginFormSchema } from "../auth.schema"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
      error: "",
    },
    validators: {
      onChange: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { username, password } = value

      const toastId = toast.loading("Logging in...")

      let response
      if (username.includes("@")) {
        response = await authClient.signIn.email({
          email: username,
          password,
        })
      } else {
        response = await authClient.signIn.phoneNumber({
          phoneNumber: username,
          password,
        })
      }

      if (response?.error) {
        toast.error(response?.error?.message, { id: toastId })
        form.setFieldValue("error", response?.error?.message ?? "Login failed!")
      } else {
        toast.success("Login successfull, redirecting...", { id: toastId })
      }
    },
  })

  const loginError = useStore(form.store, (state) => state.values.error)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-1 flex-col items-start justify-center gap-6 px-6 py-20 lg:px-16"
    >
      <FieldGroup>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Login with password</h2>
          <p className="text-sm text-muted-foreground">
            Use your email address or phone number to access your account.
          </p>
        </div>
        <form.AppField
          name="username"
          children={(field) => (
            <field.TextField
              label="Email or phone"
              placeholder="email or phone"
              className="*:data-[slot=input]:bg-background"
            />
          )}
        />

        <div className="space-y-3">
          <form.AppField
            name="password"
            children={(field) => (
              <field.PasswordField
                label="Password"
                placeholder="••••••"
                className="*:data-[slot=input-group]:bg-background"
              />
            )}
          />
          <Link
            href="/forgot-password"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        {/* alert */}
        {loginError && (
          <Alert
            variant="destructive"
            className="rounded-xl border-destructive/5 bg-destructive/5 has-data-[slot=alert-action]:pr-8"
          >
            <AlertCircleIcon />
            <AlertTitle>Login Failed!</AlertTitle>
            <AlertDescription>{loginError}</AlertDescription>
            <AlertAction>
              <Button
                type="button"
                size="icon-xs"
                variant="outline"
                className="rounded-xl"
                onClick={() => form.setFieldValue("error", "")}
              >
                <X />
              </Button>
            </AlertAction>
          </Alert>
        )}

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
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            )}
          />
        </Field>

        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex-[1_1_0] border-b"></div>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            OR
          </span>
          <span className="flex-[1_1_0] border-b"></span>
        </div>

        <Field className="text-center">
          <Button
            type="button"
            size="xl"
            variant="secondary"
            className="bg-primary/20 hover:bg-primary/30"
            asChild
          >
            <Link href="/auth/signin">Login with OTP</Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
