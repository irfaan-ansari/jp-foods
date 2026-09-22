"use client"

import React from "react"
import z from "zod"
import { toast } from "sonner"
import { Loader2, Pencil } from "lucide-react"
import { authClient } from "@jp/auth/client"
import { useAppForm } from "@/hooks/use-app-form"
import { phoneSchema } from "@jp/utils"
import { Button } from "@jp/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@jp/ui/components/input-otp"
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"

type Step = "send" | "verify"

const DIGITS_ONLY = "^\\d+$"
const formSchema = z.object({
  phoneNumber: phoneSchema,
  code: z.string(),
})

export const ChangePhoneForm = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<Step>("send")

  const form = useAppForm({
    defaultValues: {
      phoneNumber: "",
      code: "",
    },
    validators: {
      onChange: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (step === "send") {
        const { error } = await authClient.phoneNumber.sendOtp({
          phoneNumber: value.phoneNumber,
        })

        if (error) {
          toast.error(error.message)
          return
        }

        toast.success("Verification code sent.")
        form.setFieldValue("code", "")
        setStep("verify")
        return
      }

      if (value.code.length < 6) {
        toast.error("Enter the 6-digit verification code")
        return
      }

      const { error } = await authClient.phoneNumber.verify({
        phoneNumber: value.phoneNumber,
        code: value.code,
        updatePhoneNumber: true,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Phone number updated.")
      setOpen(false)
      form.reset()
      setStep("send")
      window.location.reload()
    },
  })

  const reset = () => {
    form.reset()
    setStep("send")
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-base font-bold">
            Change Phone Number
          </AppDialogTitle>
          <AppDialogDescription>
            Verify the new phone number with a one-time SMS code.
          </AppDialogDescription>
          {step === "verify" && (
            <div className="mt-4 flex items-center gap-2">
              We have sent the one-time code to{" "}
              {form.getFieldValue("phoneNumber")}
              <Button size="xs" onClick={() => setStep("send")}>
                <Pencil /> Change
              </Button>
            </div>
          )}
        </AppDialogHeader>
        <div className="flex flex-col gap-6">
          <FieldGroup className="-mx-1 no-scrollbar flex-1 overflow-auto px-1">
            <form.AppField
              name="phoneNumber"
              children={(field) => (
                <field.PhoneField
                  className={step === "verify" ? "hidden" : ""}
                  label="New Phone Number"
                  description="We will send a verification code to this number."
                  placeholder="123-123-1234"
                />
              )}
            />
            {step === "verify" && (
              <form.Field
                name="code"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Verification Code
                      </FieldLabel>
                      <InputOTP
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(value) => field.handleChange(value)}
                        onBlur={field.handleBlur}
                        maxLength={6}
                        pattern={DIGITS_ONLY}
                      >
                        <InputOTPGroup className="w-full flex-1 bg-background *:h-11 *:w-auto! *:flex-1! *:border-border">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <FieldDescription>
                        Enter the 6-digit code sent to the new phone number.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            )}
          </FieldGroup>
        </div>
        <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-32">
          <AppDialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </AppDialogClose>

          <form.Subscribe
            selector={({ isSubmitting, canSubmit }) => ({
              isSubmitting,
              canSubmit,
            })}
            children={({ isSubmitting, canSubmit }) => (
              <Button
                disabled={isSubmitting || !canSubmit}
                onClick={() => form.handleSubmit()}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : step === "send" ? (
                  "Send Code"
                ) : (
                  "Verify"
                )}
              </Button>
            )}
          />
        </Field>
      </AppDialogContent>
    </AppDialog>
  )
}
