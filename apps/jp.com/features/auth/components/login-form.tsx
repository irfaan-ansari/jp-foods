"use client"

import React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@jp/auth/client"

import { useAppForm } from "@jp/ui/forms/public"
import { Button } from "@jp/ui/components/button"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { Loader2 } from "lucide-react"

import { loginFormSchema } from "../auth.schema"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: loginFormSchema,
      onSubmitAsync: async ({ value }) => {
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
          const message =
            response.error.message ?? "Unable to sign in. Please try again."
          toast.error(message, { id: toastId })
          return { fields: { password: { message } } }
        }

        toast.success("Signed in successfully. Redirecting...", {
          id: toastId,
        })
      },
    },

    onSubmit: async ({ value }) => {},
  })

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
          <h2 className="font-heading text-xl font-bold">
            Sign in with password
          </h2>
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
              className="*:data-[slot=input]:h-12"
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
                className="*:data-[slot=input-group]:h-12"
              />
            )}
          />
          <Link
            href="/auth/forgot-password"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

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
                className="bg-sidebar-accent hover:bg-sidebar-accent/80"
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Sign in"
                )}
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
          <Button type="button" size="xl" asChild>
            <Link href="/auth/signin">Sign in with OTP</Link>
          </Button>
        </Field>
        <div className="flex items-center justify-start gap-2">
          <span className="text-muted-foreground">Dont have an account?</span>
          <Button
            asChild
            variant="link"
            size="sm"
            type="button"
            className="h-auto p-0 text-sm text-foreground tabular-nums disabled:text-muted-foreground disabled:opacity-100"
          >
            <Link href="/apply" className="hover:underline">
              Request an account
            </Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
