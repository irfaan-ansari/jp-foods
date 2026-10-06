"use client"

import { useActionState } from "react"
import { Search } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { Input } from "@jp/ui/components/input"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@jp/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@jp/ui/components/select"
import { Alert, AlertDescription, AlertTitle } from "@jp/ui/components/alert"
import { StatusBadge } from "@jp/ui/components/jp/status-badge"
import { formatDate } from "@jp/utils"
import {
  trackApplication,
  type TrackingState,
  type TrackingStatus,
} from "../tracking.action"

const initialState: TrackingState = {}

const STATUS_MAP = {
  new: {
    label: "Under review",
    value: "new",
    color: "#3B82F6",
    description:
      "Your application has been received and is being reviewed by our team.",
  },
  under_review: {
    label: "Under review",
    value: "under_review",
    color: "#F59E0B",
    description:
      "Your application is currently being reviewed by our team.",
  },
  on_hold: {
    label: "Additional information needed",
    value: "on_hold",
    color: "#F97316",
    description:
      "We may need additional information before we can continue reviewing your application.",
  },
  approved: {
    label: "Approved",
    value: "approved",
    color: "#22C55E",
    description:
      "Your application has been approved. Our team will follow up with next steps.",
  },
  rejected: {
    label: "Not approved",
    value: "rejected",
    color: "#EF4444",
    description:
      "We are unable to move forward with this application at this time.",
  },
  verification_in_progress: {
    label: "Verification in progress",
    value: "verification_in_progress",
    color: "#F59E0B",
    description:
      "We are verifying the information provided with your application.",
  },
  pending: {
    label: "Awaiting your signed agreement",
    value: "pending",
    color: "#8B5CF6",
    description:
      "An agreement has been sent to you. Please review and sign it to continue.",
  },
  agreement_signed: {
    label: "Signed agreement received",
    value: "agreement_signed",
    color: "#14B8A6",
    description:
      "We have received your signed agreement and are completing final review.",
  },
  hired: {
    label: "Approved for hire",
    value: "hired",
    color: "#22C55E",
    description:
      "Your job application has been approved. Our team will follow up with next steps.",
  },
} as const

const getStatus = (status: string) =>
  STATUS_MAP[status as keyof typeof STATUS_MAP] ?? {
    label: status.replaceAll("_", " "),
    value: status,
    color: "#71717A",
    description:
      "Your application status has been updated. Please contact our team if you need more information.",
  }

const ResultCard = ({ result }: { result: TrackingStatus }) => {
  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {result.type === "customer" ? "Customer application" : "Job application"} #{result.id}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-semibold">
            {result.title}
          </h2>
        </div>
        <StatusBadge status={getStatus(result.status)} />
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {getStatus(result.status).description}
      </p>

      <dl className="mt-6 grid gap-4 border-t pt-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Submitted</dt>
          <dd className="mt-1 font-medium">
            {result.submittedAt ? formatDate(result.submittedAt) : "Not available"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Last updated</dt>
          <dd className="mt-1 font-medium">
            {result.updatedAt ? formatDate(result.updatedAt) : "Not available"}
          </dd>
        </div>
      </dl>

      {(result.statusReason || result.statusDetails) && (
        <Alert
          className="mt-5"
          variant={result.status === "rejected" ? "destructive" : "warning"}
        >
          <AlertTitle>{result.statusReason ?? "Status note"}</AlertTitle>
          {result.statusDetails && (
            <AlertDescription>{result.statusDetails}</AlertDescription>
          )}
        </Alert>
      )}
    </div>
  )
}

export const TrackingForm = () => {
  const [state, formAction, pending] = useActionState(
    trackApplication,
    initialState
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form action={formAction} className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6">
        <div className="grid gap-5">
          <Field>
            <FieldLabel htmlFor="type">Application type</FieldLabel>
            <Select name="type" defaultValue="customer">
              <SelectTrigger id="type" className="h-12 w-full rounded-xl">
                <SelectValue placeholder="Choose application type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer application</SelectItem>
                <SelectItem value="job">Job application</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="id">Application number</FieldLabel>
            <Input
              id="id"
              name="id"
              type="number"
              min={1}
              required
              placeholder="Example: 1024"
              className="h-12"
            />
            <FieldDescription>
              This is the number shown after submitting your application.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="h-12"
            />
          </Field>

          {state.error && (
            <Alert variant="destructive">
              <AlertTitle>Unable to find application</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" size="xl" disabled={pending}>
            <Search />
            {pending ? "Checking..." : "Check status"}
          </Button>
        </div>
      </form>

      <div className="min-h-64">
        {state.result ? (
          <ResultCard result={state.result} />
        ) : (
          <div className="flex h-full min-h-64 flex-col justify-center rounded-2xl border bg-secondary/30 p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              What you will see
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold">
              Current review status
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              We will show a clear update such as under review, awaiting your
              signed agreement, approved, or additional information needed. For
              privacy, the application number and email must match.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
