"use client"

import React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Field, FieldError, FieldGroup } from "@jp/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@jp/ui/components/input-otp"

import { Button } from "@jp/ui/components/button"
import { useAppForm } from "@jp/ui/forms/public"
import { AlertCircleIcon, Loader2, X } from "lucide-react"

import { Alert, AlertAction, AlertTitle } from "@jp/ui/components/alert"

import { otpLoginSchema } from "../auth.schema"
import { formatPhone } from "@jp/utils"
import { cn } from "@jp/ui/lib/utils"
import { authClient } from "@jp/auth/client"

export function OTPLoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [seconds, setSeconds] = React.useState(0)
  const canResend = seconds === 0
  const otpRef = React.useRef<HTMLInputElement>(null)

  // resend countdown
  React.useEffect(() => {
    if (seconds <= 0) return
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds])

  const form = useAppForm({
    defaultValues: {
      phoneNumber: "",
      code: "",
      step: "send",
    },
    validators: {
      onBlur: ({ value, formApi }) => {
        const schema =
          formApi.state.values.step === "send"
            ? otpLoginSchema.pick({ phoneNumber: true })
            : otpLoginSchema

        // @ts-expect-error
        return formApi.parseValuesWithSchema(schema)
      },
      onSubmitAsync: async ({ value }) => {
        const { phoneNumber, code } = value
        if (value.step !== "verify") return undefined

        const toastId = toast.loading("Please wait...")

        const { error } = await authClient.phoneNumber.verify({
          phoneNumber,
          code,
        })

        if (error) {
          const message =
            error.message ?? "Unable to verify the code. Please try again."
          toast.error(message, { id: toastId })

          return { fields: { code: { message } } }
        }

        toast.success("Login successful, redirecting...", { id: toastId })
      },
    },
    onSubmit: async ({ value }) => {
      if (value.step !== "send") return

      await handleSendOtp()
    },
  })

  /**
   * @description handle send otp
   */
  const handleSendOtp = async () => {
    const toastId = toast.loading("Sending code...")

    const { error } = await authClient.phoneNumber.sendOtp({
      phoneNumber: form.state.values.phoneNumber,
    })

    if (error) {
      const message = error?.message ?? "Unable to send the code."
      toast.error(message, { id: toastId })

      return
    }

    form.setFieldValue("code", "")
    form.setFieldValue("step", "verify")
    otpRef.current?.focus()
    setSeconds(60)
    toast.success("OTP sent successfully!", { id: toastId })
  }

  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className={cn(
        "flex h-full flex-1 flex-col items-start justify-start gap-6 px-6 py-20 lg:px-16",
        className
      )}
    >
      <form.Subscribe
        selector={(state) => ({
          step: state.values.step,
          phoneNumber: state.values.phoneNumber,

          isSubmitting: state.isSubmitting,
          canSubmit: state.canSubmit,
        })}
      >
        {({ step, phoneNumber, isSubmitting, canSubmit }) => (
          <React.Fragment>
            {step === "send" && (
              <FieldGroup>
                <div className="space-y-2">
                  <h2 className="font-heading text-xl font-bold">
                    Sign in with phone number
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your phone number and we’ll send you a secure one-time
                    passcode.
                  </p>
                </div>

                <form.AppField
                  name="phoneNumber"
                  children={(field) => (
                    <field.PhoneField
                      label="Phone Number"
                      className="[&_.PhoneInput]:h-12"
                    />
                  )}
                />
              </FieldGroup>
            )}

            {step === "verify" && (
              <FieldGroup>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Verify phone number</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Enter the 6-digit one-time passcode sent to
                  </p>
                  <div className="flex flex-wrap items-start gap-x-3 gap-y-1 text-sm">
                    <span className="font-medium whitespace-nowrap text-foreground">
                      {phoneNumber
                        ? formatPhone(phoneNumber)
                        : "your phone number"}
                    </span>
                    <Button
                      size="sm"
                      variant="link"
                      className="h-auto shrink-0 p-0 text-sm"
                      disabled={isSubmitting}
                      onClick={() => {
                        form.setFieldValue("step", "send")
                        form.setFieldValue("code", "")
                      }}
                      type="button"
                    >
                      Change Number
                    </Button>
                  </div>
                </div>

                <form.Field
                  name="code"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <InputOTP
                          ref={otpRef}
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(value) => {
                            field.handleChange(value)
                            if (
                              value.length === 6 &&
                              !form.state.isSubmitting
                            ) {
                              form.handleSubmit()
                            }
                          }}
                          onBlur={field.handleBlur}
                          autoComplete="one-time-code"
                          aria-invalid={isInvalid}
                          disabled={isSubmitting}
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          containerClassName="w-full justify-between"
                        >
                          <InputOTPGroup className="*:h-12 *:w-12">
                            <InputOTPSlot
                              className="data-[active=true]:ring-1 data-[active=true]:ring-ring"
                              index={0}
                            />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                            <InputOTPSlot
                              className="data-[active=true]:ring-1 data-[active=true]:ring-ring"
                              index={1}
                            />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                            <InputOTPSlot
                              className="data-[active=true]:ring-1 data-[active=true]:ring-ring"
                              index={2}
                            />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                            <InputOTPSlot
                              className="data-[active=true]:ring-1 data-[active=true]:ring-ring"
                              index={3}
                            />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                            <InputOTPSlot
                              className="data-[active=true]:ring-1 data-[active=true]:ring-ring"
                              index={4}
                            />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                            <InputOTPSlot
                              className="data-[active=true]:ring-1 data-[active=true]:ring-ring"
                              index={5}
                            />
                          </InputOTPGroup>
                        </InputOTP>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <span className="text-muted-foreground">
                    Didn&apos;t receive a code?
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    type="button"
                    className="h-auto p-0 text-sm text-foreground tabular-nums disabled:text-muted-foreground disabled:opacity-100"
                    disabled={!canResend || isSubmitting}
                    onClick={() => handleSendOtp()}
                  >
                    {canResend ? "Resend code" : `Resend in ${seconds}s`}
                  </Button>
                </div>
              </FieldGroup>
            )}

            <Field>
              <Button
                type="submit"
                size="xl"
                className="bg-sidebar-accent hover:bg-sidebar-accent/80"
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : step === "send" ? (
                  "Send Code"
                ) : (
                  "Verify Code"
                )}
              </Button>
            </Field>
          </React.Fragment>
        )}
      </form.Subscribe>

      <div className="flex w-full flex-row items-center justify-center gap-4">
        <div className="flex-[1_1_0] border-b"></div>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          OR
        </span>
        <span className="flex-[1_1_0] border-b"></span>
      </div>

      <Field className="text-center">
        <Button type="button" size="xl" asChild>
          <Link href="/auth/signin-password">Sign in with password</Link>
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
    </form>
  )
}
