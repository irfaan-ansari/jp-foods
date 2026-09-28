import { format } from "date-fns"
import { CheckIcon, CircleIcon, Loader2, PlayIcon, XIcon } from "lucide-react"
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@jp/ui/components/alert"

import { cn } from "@jp/ui/lib/utils"
import { formatDate } from "@jp/utils"

type StepState = "completed" | "current" | "upcoming" | "cancelled"
type StepAlignment = "start" | "center" | "end"

const STEP_ALIGNMENTS: Record<
  StepAlignment,
  {
    item: string
    title: string
  }
> = {
  start: {
    item: "items-start text-left",
    title: "justify-start",
  },
  center: {
    item: "items-center text-center",
    title: "justify-center",
  },
  end: {
    item: "items-end text-right",
    title: "justify-end",
  },
}

const STEP_STATE_STYLES: Record<StepState, string> = {
  completed: "bg-primary text-white",
  current: "bg-primary text-primary-foreground",
  upcoming: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive text-white",
}

type Props = {
  data: {
    status: string
    createdAt: Date
    processingAt?: Date | null
    deliveryDate?: Date | null | string
    deliveredAt?: Date | null
    cancelledAt?: Date | null
    cancelReason?: string | null
  }
}

function getStepAlignment(index: number, total: number): StepAlignment {
  if (index === 0) return "start"
  if (index === total - 1) return "end"

  return "center"
}

function StepIcon({ state }: { state: StepState }) {
  if (state === "completed") return <CheckIcon className="size-3.5" />
  if (state === "current") return <Loader2 className="size-3 animate-spin" />
  if (state === "cancelled") return <XIcon className="size-3.5" />

  return <CircleIcon className="size-3" />
}

function TimelineConnector({ currentStep }: { currentStep: number }) {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-3 z-0">
      <div
        className={cn(
          "absolute left-3 h-0.5 w-[calc(50%-0.75rem)] bg-primary/10",
          currentStep > 1 && "bg-primary"
        )}
      />

      <div
        className={cn(
          "absolute right-3 h-0.5 w-[calc(50%-0.75rem)] bg-primary/10",
          currentStep > 2 && "bg-primary"
        )}
      />
    </div>
  )
}

export function OrderTimeline({ data }: Props) {
  const steps = [
    {
      id: 1,
      key: "ordered",
      title: "Order placed",
      description: "We've received your order.",
      date: data.createdAt,
    },
    {
      id: 2,
      key: "processing",
      title: data.status === "cancelled" ? "Cancelled" : "Processing",
      description: "We're preparing your order.",
      date: data.processingAt,
    },
    {
      id: 3,
      key: "delivered",
      title: data.status === "cancelled" ? "Delivery cancelled" : "Delivered",
      description:
        data.status === "completed"
          ? "Your order has been delivered."
          : data.status === "cancelled"
            ? "This order will not be delivered."
            : "Estimated delivery.",
      date:
        data.status === "delivered"
          ? data.deliveredAt
          : data.status === "cancelled"
            ? data.cancelledAt
            : data.deliveryDate,
    },
  ]

  const currentStep =
    data.status === "delivered" ? 3 : data.status === "cancelled" ? 2 : 2

  const cancelled = data.status === "cancelled"

  const getState = (step: number): StepState => {
    if (cancelled) {
      if (step < currentStep) return "completed"
      if (step === currentStep) return "cancelled"
      return "upcoming"
    }

    if (step < currentStep) return "completed"

    if (step === currentStep) return "current"

    return "upcoming"
  }

  return (
    <div className="space-y-6">
      <div className="relative flex w-full flex-nowrap">
        <TimelineConnector currentStep={currentStep} />

        {steps.map((step, index) => {
          const state = getState(step.id)
          const alignment =
            STEP_ALIGNMENTS[getStepAlignment(index, steps.length)]

          return (
            <div
              key={step.id}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col",
                alignment.item
              )}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "z-10 flex size-6 items-center justify-center rounded-full",
                  STEP_STATE_STYLES[state]
                )}
              >
                <StepIcon state={state} />
              </div>

              <time className="mt-3 text-xs font-medium text-muted-foreground">
                {step.date ? format(step.date, "MMM d") : "Pending"}
              </time>

              <div
                className={cn(
                  "mt-1 min-w-0 text-sm font-medium",
                  alignment.title
                )}
              >
                {step.title}
              </div>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>

      {cancelled && (
        <Alert variant="destructive">
          <XIcon className="size-4" />
          <AlertTitle>Order cancelled</AlertTitle>

          <AlertDescription>{data.cancelReason}</AlertDescription>
          {data.cancelledAt && (
            <AlertAction>{formatDate(data.cancelledAt)}</AlertAction>
          )}
        </Alert>
      )}
    </div>
  )
}
