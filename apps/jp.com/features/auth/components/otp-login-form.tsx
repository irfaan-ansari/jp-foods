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
import { useAppForm } from "@/hooks/use-app-form"
import { AlertCircleIcon, Loader2, Pencil, X } from "lucide-react"
import { sendOtp, verifyOtp } from "@/features/auth/auth.action"
import { Alert, AlertAction, AlertTitle } from "@jp/ui/components/alert"

import { otpLoginSchema } from "../auth.schema"
import { formatPhone } from "@jp/utils"
import { cn } from "@jp/ui/lib/utils"

export function OTPLoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [seconds, setSeconds] = React.useState(0)
  const canResend = seconds === 0

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
      error: "",
    },
    validators: {
      onChange: ({ value }) => {
        const phone = otpLoginSchema.shape.phoneNumber.safeParse(
          value.phoneNumber
        )
        const code = otpLoginSchema.shape.code.safeParse(value.code)
        const fields = {
          phoneNumber: phone.success ? undefined : phone.error.issues[0],
          code:
            value.step === "verify" && !code.success
              ? code.error.issues[0]
              : undefined,
        }
        return fields.phoneNumber || fields.code ? { fields } : undefined
      },
    },
    onSubmit: async ({ value }) => {
      const { phoneNumber, code } = value
      console.log(phoneNumber, code)
      form.setFieldValue("step", "verify")

      // send otp
      if (value.step === "send") {
        await handleSendOtp()
        return
      }

      // verify otp
      form.setFieldValue("error", "")
      const toastId = toast.loading("Please wait...")
      try {
        const result = await verifyOtp({ phoneNumber, code })
        if (!result?.data || result.serverError || result.validationErrors) {
          throw new Error(
            result?.serverError?.message ??
              "Unable to verify the code. Please try again."
          )
        }
      } catch (error) {
        toast.dismiss(toastId)
        form.setFieldValue(
          "error",
          error instanceof Error
            ? error.message
            : "Unable to sign in. Please try again."
        )
        return
      }

      toast.success("Login successful, redirecting...", { id: toastId })
      window.location.reload()
    },
  })

  /**
   * @description handle send otp
   */
  const handleSendOtp = async () => {
    form.setFieldValue("error", "")
    const toastId = toast.loading("Sending code...")

    const { serverError, validationErrors } = await sendOtp({
      phoneNumber: form.state.values.phoneNumber,
    })

    if (serverError || validationErrors) {
      toast.error(
        serverError?.message ??
          "Unable to send the code. Check your phone number and try again.",
        { id: toastId }
      )
      form.setFieldValue(
        "error",
        serverError?.message ??
          "Unable to send the code. Check your phone number and try again."
      )
      return
    }

    form.setFieldValue("code", "")
    form.setFieldValue("step", "verify")
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
          error: state.values.error,
          isSubmitting: state.isSubmitting,
          canSubmit: state.canSubmit,
        })}
      >
        {({ step, phoneNumber, error, isSubmitting, canSubmit }) => (
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
                        form.setFieldValue("error", "")
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
                      <Field>
                        <InputOTP
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(value) => field.handleChange(value)}
                          onBlur={field.handleBlur}
                          autoComplete="one-time-code"
                          aria-invalid={isInvalid}
                          disabled={isSubmitting}
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          containerClassName="w-full justify-between"
                        >
                          <InputOTPGroup className="*:h-12 *:w-12">
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                             <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                             <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                             <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                             <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                             <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup className="*:h-12 *:w-12">
                             <InputOTPSlot index={4} />
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
                    className="h-auto p-0 text-sm tabular-nums disabled:text-muted-foreground text-foreground disabled:opacity-100"
                    disabled={!canResend || isSubmitting}
                    onClick={() => handleSendOtp()}
                  >
                    {canResend ? "Resend code" : `Resend in ${seconds}s`}
                  </Button>
                </div>
              </FieldGroup>
            )}

            {/* alert */}
            {error && (
              <Alert
                variant="destructive"
      
              >
                <AlertCircleIcon />
                <AlertTitle className="line-clamp-2">{error}</AlertTitle>

                <AlertAction>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="outline"
                    onClick={() => form.setFieldValue("error", "")}
                  >
                    <X />
                  </Button>
                </AlertAction>
              </Alert>
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
    </form>
  )
}
