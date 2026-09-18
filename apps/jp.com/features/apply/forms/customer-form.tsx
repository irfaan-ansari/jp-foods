"use client"
import {
  useTranslation,
  LanguageSelector,
  type Translations,
} from "@/components/language-selector"
import { toast } from "sonner"
import { Button } from "@jp/ui/components/button"
import { useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"

import { createCustomer } from "@/features/apply/customer.action"
import { defaultValues } from "@/features/apply/customer.const"
import { steps } from "@/features/apply/customer.steps"
import { ArrowLeft, ArrowRight, Loader } from "lucide-react"
import translations from "@/features/apply/customer.translations.json"
import { formOptions, useStore } from "@tanstack/react-form"
import { customerSchema } from "@/features/apply/customer.schema"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@jp/ui/components/card"
import React from "react"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { useAppForm } from "@/hooks/use-app-form"
import { Tabs, TabsContent } from "@jp/ui/components/tabs"

export const formOpts = formOptions({
  defaultValues,
  validators: {
    onSubmit: ({ value, formApi }) => {
      return formApi.parseValuesWithSchema(
        (value.step === steps.length - 1
          ? customerSchema
          : (steps[value.step]?.schema ??
            customerSchema)) as typeof customerSchema
      )
    },
  },
})

export const CustomerForm = () => {
  const { open } = useConfirm()
  const router = useRouter()
  const { t, dir, setLanguage, language } = useTranslation(
    translations as Translations,
    "en"
  )

  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value, formApi }) => {
      try {
        if (value.step < steps.length - 1) {
          formApi.setFieldValue("step", value.step + 1)
          return
        }

        // upload files and send the files url to
        const sign = await upload(
          `customer/${value.signature.name}`,
          value.signature,
          {
            access: "public",
            handleUploadUrl: "/api/upload",
          }
        )

        const { certificate, dlFront, dlBack, signature, ...rest } = value
        // submit form
        const { success, error } = await createCustomer({
          ...rest,
          certificateUrl: value.certificate,
          dlFrontUrl: value.dlFront,
          dlBackUrl: value.dlBack,
          signatureUrl: sign.url,
        })

        if (success) {
          open({
            title: "Application Submitted Successfully",
            description: `Your application has been successfully submitted and is now under review. 
            If additional information is required, our team will contact you.`,

            action: {
              label: "Back to home",
              action: () => router.push("/"),
            },
          })
          form.reset()
        } else {
          toast.error(error.message)
        }
      } catch {
        toast.error(
          "Unable to submit. Please check your uploads and try again."
        )
      }
    },
  })

  const step = useStore(form.store, (state) => state.values.step)

  return (
    <Tabs value={step.toString()} dir={dir}>
      <LanguageSelector
        value={language}
        onValueChange={(v) => setLanguage(v)}
        className="mb-8 ml-auto"
      />

      <form
        className="@container"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <Card className="gap-8 rounded-2xl bg-secondary/20 shadow-md ring ring-border/50 lg:py-8">
          <CardHeader className="space-y-1 lg:px-8">
            <form.Subscribe selector={(state) => state.values.step}>
              {(step) => {
                const progress = Math.round((step / steps.length) * 100)

                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium uppercase">
                        Step {step + 1} of {steps.length}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {progress}% Complete
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                )
              }}
            </form.Subscribe>
          </CardHeader>
          {steps.map((step, i) => (
            <TabsContent value={i.toString()} key={step.key}>
              <CardContent className="lg:px-8">
                <step.component
                  // @ts-ignore
                  form={form}
                />
              </CardContent>
            </TabsContent>
          ))}

          {/* submit and preview */}
          <CardFooter className="justify-end gap-6 lg:px-8">
            {/* reset*/}
            <Button
              size="xl"
              className="min-w-32 rounded-2xl"
              type="button"
              variant="outline"
              onClick={() => {
                form.reset()
              }}
            >
              Reset
            </Button>
            {step > 0 && step < steps.length && (
              <Button
                size="xl"
                className="min-w-32 rounded-2xl"
                type="button"
                variant="secondary"
                onClick={() => form.setFieldValue("step", step - 1)}
              >
                <ArrowLeft />
                Previous
              </Button>
            )}

            {/* submit button */}
            <form.Subscribe
              children={({ isSubmitting }) => (
                <Button
                  size="xl"
                  className="min-w-32 rounded-2xl"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader className="animate-spin" />}
                  {step < steps.length - 1 ? "Next" : "Submit"}
                  {step < steps.length && <ArrowRight />}
                </Button>
              )}
            />
          </CardFooter>
        </Card>
      </form>
    </Tabs>
  )
}
