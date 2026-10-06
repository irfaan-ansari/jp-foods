"use client"

import { useEffect, useId, useRef, type FormEvent, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { cn } from "@jp/ui/lib/utils"

type ApplicationStep = { title: string; description: string }

type ApplicationFormLayoutProps = {
  steps: ApplicationStep[]
  step: number
  isSubmitting: boolean
  onStepChange: (step: number) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  children: ReactNode
}

export function ApplicationFormLayout({
  steps,
  step,
  isSubmitting,
  onStepChange,
  onSubmit,
  children,
}: ApplicationFormLayoutProps) {
  const headingId = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef(step)
  const current = steps[step]!

  useEffect(() => {
    if (previousStep.current !== step) {
      headingRef.current?.focus({ preventScroll: true })
      previousStep.current = step
    }
  }, [step])

  return (
    <div className="overflow-hidden rounded-3xl border bg-background shadow-sm lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-b bg-secondary/40 p-5 sm:p-6 lg:border-r lg:border-b-0">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Your application
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-medium">
            Step {step + 1} of {steps.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(((step + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Application progress"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-valuetext={`Step ${step + 1} of ${steps.length}: ${current.title}`}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <nav aria-label="Application steps" className="mt-6">
          <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {steps.map((item, index) => (
              <li key={item.title} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  aria-current={index === step ? "step" : undefined}
                  disabled={index > step || isSubmitting}
                  onClick={() => onStepChange(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45",
                    index === step
                      ? "bg-background font-semibold text-primary shadow-sm ring-1 ring-border"
                      : "text-muted-foreground enabled:hover:bg-background/70"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs",
                      index <= step
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    )}
                  >
                    {index < step ? (
                      <Check className="size-3.5" />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="whitespace-nowrap lg:whitespace-normal">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-8 hidden items-start gap-2 border-t pt-5 text-xs leading-relaxed text-muted-foreground lg:flex">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            We use the information you provide to review your application and
            contact you about this opportunity.
          </p>
        </div>
      </aside>
      <form onSubmit={onSubmit} aria-labelledby={headingId} className="min-w-0">
        <div className="@container p-5 sm:p-8 lg:p-10">
          <div className="mb-8 border-b pb-6">
            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Let's get to know you
            </p>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="font-heading text-2xl font-semibold tracking-tight outline-none sm:text-3xl"
            >
              {current.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {current.description}
            </p>
          </div>
          {children}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-secondary/20 px-5 py-5 sm:px-8 lg:px-10">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="xl"
              disabled={isSubmitting}
              onClick={() => onStepChange(step - 1)}
            >
              <ArrowLeft /> Back
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">
              Complete each step to continue.
            </span>
          )}
          <Button
            type="submit"
            size="xl"
            disabled={isSubmitting}
            className="ml-auto min-w-36"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            {isSubmitting
              ? "Please wait..."
              : step === steps.length - 1
                ? "Submit application"
                : "Continue"}
            {!isSubmitting && <ArrowRight />}
          </Button>
        </div>
      </form>
    </div>
  )
}
