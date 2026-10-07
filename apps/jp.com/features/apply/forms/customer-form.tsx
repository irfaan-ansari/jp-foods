"use client"
import React from "react"
import {
  useTranslation,
  LanguageSelector,
  type Translations,
} from "@/components/language-selector"
import { toast } from "sonner"
import { Button } from "@jp/ui/components/button"
import { useRouter } from "next/navigation"
import { createCustomer } from "@/features/apply/customer.action"
import { DEFAULT_VALUES } from "@/features/apply/customer.const"
import { steps } from "@/features/apply/customer.steps"
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import { uploadFile } from "@jp/utils/blob/client"
import { useAppForm } from "@jp/ui/forms/public"
import translations from "@/features/apply/customer.translations.json"
import { formOptions, useStore } from "@jp/ui/forms/public"
import { customerSchema } from "@/features/apply/customer.schema"

import { Card, CardFooter, CardHeader } from "@jp/ui/components/card"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"

export const formOpts = formOptions({
  defaultValues: DEFAULT_VALUES,
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
        const { certificate, dlFront, dlBack, signature, ...rest } = value
        const [certUrl, frontUrl, backUrl, signUrl] = await Promise.all([
          uploadFile({
            file: value.certificate,
            path: `/customer/${value.certificate.name}`,
          }),
          uploadFile({
            file: value.dlFront,
            path: `/customer/${value.dlFront.name}`,
          }),
          uploadFile({
            file: value.dlBack,
            path: `/customer/${value.dlBack.name}`,
          }),
          uploadFile({
            file: value.signature,
            path: `/customer/${value.signature.name}`,
          }),
        ])

        // submit form
        const { success, error } = await createCustomer({
          ...rest,
          certificateUrl: certUrl.url,
          dlFrontUrl: frontUrl.url,
          dlBackUrl: backUrl.url,
          signatureUrl: signUrl.url,
        })

        if (success) {
          open({
            title: "Application Submitted",
            description: `Your application has been successfully submitted.`,

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

  const labels = steps.map((_, index) => t[`applicationStep${index + 1}Label`])
  const descriptions = steps.map(
    (_, index) => t[`applicationStep${index + 1}Description`]
  )

  const progress = Math.round((step / steps.length) * 100)

  return (
    <div
      dir={dir}
      className="grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10"
    >
      <aside className="lg:sticky lg:top-30">
        <div className="mb-6 flex items-center justify-between lg:block">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              {t.applicationNewAccount}
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
              {t.applicationTitle}
            </h2>
          </div>
          <span className="rounded-full border bg-background px-3 py-1 text-xs font-medium lg:hidden">
            {step + 1} / {steps.length}
          </span>
        </div>
        <ol
          aria-label={t.applicationSteps}
          className="-mx-3 hidden space-y-2 lg:block"
        >
          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <li
                key={item.key}
                aria-current={index === step ? "step" : undefined}
                className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${index === step ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${index === step ? "border-primary bg-primary text-primary-foreground shadow-sm" : index < step ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-background"}`}
                >
                  {index < step ? (
                    <CircleCheck className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </span>
                <div>
                  <p className="font-medium">{labels[index]}</p>
                  <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                    {descriptions[index]}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
        <div className="mt-8 hidden border-t pt-6 text-sm/6 text-muted-foreground lg:block">
          <ShieldCheck className="mb-3 size-5 text-primary" />
          <p className="font-medium text-foreground">
            {t.applicationPrivacyTitle}
          </p>
          <p className="mt-1">{t.applicationPrivacyDescription}</p>
        </div>
      </aside>

      <form
        className="@container min-w-0"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <Card className="gap-0 rounded-2xl border bg-background py-0 shadow-sm ring-0">
          <CardHeader className="gap-5 rounded-none border-b p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {t.applicationStep} {String(step + 1).padStart(2, "0")} /{" "}
                {String(steps.length).padStart(2, "0")}
              </p>
              <LanguageSelector
                value={language}
                onValueChange={setLanguage}
                className="gap-0.5 rounded-xl bg-secondary p-0.5"
              />
            </div>
            <div aria-live="polite">
              <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {labels[step]}
              </h2>
              <p className="mt-2 text-sm/6 text-muted-foreground">
                {descriptions[step]}
              </p>
            </div>
            <div
              role="progressbar"
              aria-label={t.applicationProgress}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="flex gap-1.5"
            >
              {steps.map((item, index) => (
                <span
                  key={item.key}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${index < step ? "bg-primary" : index === step ? "bg-primary/40" : "bg-secondary"}`}
                />
              ))}
            </div>
          </CardHeader>
          <div className="p-5 **:data-[slot=card-description]:mt-2 **:data-[slot=card-description]:leading-6 **:data-[slot=card-title]:font-semibold **:data-[slot=input]:min-h-11 **:data-[slot=select-trigger]:min-h-11 sm:p-8">
            {steps.map(
              (item, index) =>
                step === index && (
                  <div key={item.key}>
                    <item.component form={form} />
                  </div>
                )
            )}
          </div>
          <CardFooter className="flex-wrap justify-between gap-3 rounded-none border-t bg-secondary/20 p-5 sm:px-8 sm:py-5">
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => {
                form.reset()
                form.setFieldValue("step", 0)
              }}
            >
              {t.applicationReset}
            </Button>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {step > 0 && step < steps.length && (
                <Button
                  size="xl"
                  type="button"
                  variant="secondary"
                  onClick={() => form.setFieldValue("step", step - 1)}
                >
                  <ArrowLeft />
                  {t.applicationPrevious}
                </Button>
              )}
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button size="xl" type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    {step < steps.length - 1
                      ? t.applicationContinue
                      : t.applicationSubmit}
                    {!isSubmitting && <ArrowRight />}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
