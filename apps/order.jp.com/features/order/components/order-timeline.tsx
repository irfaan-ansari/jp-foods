import { format } from "date-fns"
import { CheckIcon, CircleIcon, PlayIcon, XIcon } from "lucide-react"

import { Badge } from "@jp/ui/components/badge"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@jp/ui/components/timeline"
import { cn } from "@jp/ui/lib/utils"

type OrderStatus = "in_progress" | "delivered" | "cancelled"

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
      title: "Processing",
      description: "We're preparing your order.",
      date: data.processingAt,
    },
    {
      id: 3,
      key: "delivered",
      title: "Delivered",
      description:
        data.status === "delivered"
          ? "Your order has been delivered."
          : "Estimated delivery.",
      date: data.status === "delivered" ? data.deliveredAt : data.deliveryDate,
    },
  ]

  const currentStep =
    data.status === "delivered" ? 3 : data.status === "cancelled" ? 2 : 2

  const cancelled = data.status === "cancelled"

  const getState = (step: number) => {
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
      <Timeline
        defaultValue={currentStep}
        orientation="horizontal"
        className="w-full"
      >
        {steps.map((step) => {
          const state = getState(step.id)

          return (
            <TimelineItem key={step.id} step={step.id}>
              <TimelineHeader>
                <TimelineSeparator />

                <TimelineDate>
                  {step.date ? format(step.date, "MMM d") : "Pending"}
                </TimelineDate>

                <TimelineTitle className="flex items-center gap-2">
                  {step.title}

                  {state === "current" && (
                    <Badge variant="primary-light" size="sm">
                      Current
                    </Badge>
                  )}

                  {state === "cancelled" && (
                    <Badge variant="destructive" size="sm">
                      Cancelled
                    </Badge>
                  )}
                </TimelineTitle>

                <TimelineIndicator
                  className={cn(
                    "flex size-6 items-center justify-center border-none",
                    state === "completed" && "bg-emerald-500 text-white",
                    state === "current" && "bg-primary text-primary-foreground",
                    state === "upcoming" && "bg-muted text-muted-foreground",
                    state === "cancelled" && "bg-destructive text-white"
                  )}
                >
                  {state === "completed" && <CheckIcon className="size-3.5" />}

                  {state === "current" && (
                    <PlayIcon className="size-3 animate-pulse" />
                  )}

                  {state === "upcoming" && <CircleIcon className="size-3" />}

                  {state === "cancelled" && <XIcon className="size-3.5" />}
                </TimelineIndicator>
              </TimelineHeader>

              <TimelineContent className="text-xs text-muted-foreground">
                {step.description}
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>

      {cancelled && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center gap-2">
            <XIcon className="size-4 text-destructive" />

            <h3 className="font-medium">Order cancelled</h3>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            This order was cancelled before it could be fulfilled.
          </p>

          {data.cancelledAt && (
            <p className="mt-3 text-xs text-muted-foreground">
              Cancelled on {format(data.cancelledAt, "MMM d, yyyy 'at' h:mm a")}
            </p>
          )}

          {data.cancelReason && (
            <div className="mt-4 rounded-lg bg-background p-3">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Reason
              </p>

              <p className="mt-1 text-sm">{data.cancelReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
