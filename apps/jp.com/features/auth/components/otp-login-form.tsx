"use client"

import React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@jp/ui/components/input-otp"

import { Button } from "@jp/ui/components/button"
import { useAppForm } from "@/hooks/use-app-form"
import { AlertCircleIcon, Loader2, X } from "lucide-react"
import { sendOtp, verifyOtp } from "@/features/auth/auth.action"
import { Alert, AlertAction, AlertTitle } from "@jp/ui/components/alert"

import { sendOtpSchema, verifyOtpSchema } from "../auth.schema"
import { formatPhone } from "@jp/utils"
import { cn } from "@jp/ui/lib/utils"

export function OTPLoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [step, setStep] = React.useState<"send" | "verify">("verify")
  const [seconds, setSeconds] = React.useState(0)
  const [error, setError] = React.useState("")
  const [isSending, setIsSending] = React.useState(false)
  const sending = React.useRef(false)

  const canResend = seconds === 0

  const form = useAppForm({
    defaultValues: {
      phoneNumber: "",
      code: "",
    },
    validators: {
      onChange: ({ value }) => {
        const phone = sendOtpSchema.shape.phoneNumber.safeParse(
          value.phoneNumber
        )
        const code = verifyOtpSchema.shape.code.safeParse(value.code)
        const fields = {
          phoneNumber: phone.success ? undefined : phone.error.issues[0],
          code:
            step === "verify" && !code.success
              ? code.error.issues[0]
              : undefined,
        }
        return fields.phoneNumber || fields.code ? { fields } : undefined
      },
    },
    onSubmit: async ({ value }) => {
      const { phoneNumber, code } = value

      // send otp
      if (step == "send") {
        await handleSendOtp()
      }

      // verify otp
      if (step === "verify") {
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
          const message =
            error instanceof Error
              ? error.message
              : "Unable to sign in. Please try again."
          toast.error(message, { id: toastId })
          setError(message)
          return
        }

        // clear error
        setError("")

        toast.success("Login successful, redirecting...", { id: toastId })
        window.location.reload()
      }
    },
  })

  /**
   * @description handle send otp
   */
  const handleSendOtp = async () => {
    if (sending.current) return
    sending.current = true
    setIsSending(true)
    const toastId = toast.loading("Please wait...")
    try {
      const result = await sendOtp({
        phoneNumber: form.state.values.phoneNumber,
      })
      if (!result?.data || result.serverError || result.validationErrors) {
        throw new Error(
          result?.serverError?.message ??
            "Unable to send the code. Check your phone number and try again."
        )
      }
      setError("")
      form.setFieldValue("code", "")
      setSeconds(60)
      setStep("verify")
      toast.success("OTP sent successfully!", { id: toastId })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send the code. Please try again."
      setError(message)
      toast.error(message, { id: toastId })
    } finally {
      sending.current = false
      setIsSending(false)
    }
  }

  React.useEffect(() => {
    if (step !== "verify") return
    if (seconds === 0) return
    const timer = setTimeout(() => {
      setSeconds((remaining) => Math.max(0, remaining - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [seconds, step])

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
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <>
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
                    Enter the 6-digit one-time passcode sent to your phone.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="font-medium whitespace-nowrap text-foreground">
                      {formatPhone(form.state.values.phoneNumber)}
                    </span>
                    <Button
                      size="sm"
                      variant="link"
                      className="h-auto shrink-0 p-0 text-sm"
                      disabled={isSubmitting || isSending}
                      onClick={() => {
                        setStep("send")
                        form.setFieldValue("code", "")
                        setError("")
                      }}
                      type="button"
                    >
                      Change
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
                        <FieldLabel htmlFor={field.name}>Enter Code</FieldLabel>
                        <InputOTP
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(value) => field.handleChange(value)}
                          onBlur={field.handleBlur}
                          autoComplete="one-time-code"
                          aria-invalid={isInvalid}
                          disabled={isSubmitting || isSending}
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                        >
                          <InputOTPGroup className="w-full flex-1 bg-background *:h-11 *:w-auto! *:flex-1! *:data-[active=true]:ring-2 *:data-[active=true]:ring-border">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup className="w-full flex-1 bg-background *:h-11 *:w-auto! *:flex-1! *:data-[active=true]:ring-2 *:data-[active=true]:ring-border">
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
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
                    Didn�t receive a code?
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    type="button"
                    className="h-auto p-0 text-sm tabular-nums disabled:text-muted-foreground disabled:opacity-100"
                    disabled={!canResend || isSending || isSubmitting}
                    onClick={handleSendOtp}
                  >
                    {isSending
                      ? "Sending"
                      : canResend
                        ? "Resend code"
                        : `Resend in ${seconds}s`}
                  </Button>
                </div>
              </FieldGroup>
            )}
            {/* alert */}
            {error && (
              <Alert
                variant="destructive"
                className="rounded-xl border-destructive/5 bg-destructive/5 has-data-[slot=alert-action]:pr-8"
              >
                <AlertCircleIcon />
                <AlertTitle>{error}</AlertTitle>

                <AlertAction>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setError("")}
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
                    className="bg-sidebar-accent hover:bg-sidebar-accent/80"
                    disabled={isSubmitting || isSending || !canSubmit}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : step === "send" ? (
                      "Send Code"
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                )}
              />
            </Field>

            <div className="flex w-full flex-row items-center justify-center gap-4">
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

                asChild
              >
                <Link href="/auth/signin-password">Sign in with password</Link>
              </Button>
            </Field>
          </>
        )}
      </form.Subscribe>
    </form>
  )
}
