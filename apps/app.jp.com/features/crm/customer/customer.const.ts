import { BadgeStatus } from "@jp/ui/components/jp/status-badge"

export const APPLICATION_REJECTION_REASONS = [
  "Incomplete application",
  "Verification failed",
  "Eligibility requirements not met",
  "Missing required documents",
  "Duplicate application",
  "Other",
] as const

export const APPLICATION_STATUS: Record<string, BadgeStatus> = {
  all: {
    label: "All",
    value: "",
    color: "#A1A1AA",
  },
  new: {
    label: "New",
    value: "new",
    color: "#3B82F6",
  },
  under_review: {
    label: "Under Review",
    value: "under_review",
    color: "#F59E0B",
  },
  on_hold: {
    label: "On Hold",
    value: "on_hold",
    color: "#F97316",
  },
  approved: {
    label: "Approved",
    value: "approved",
    color: "#22C55E",
  },
  rejected: {
    label: "Rejected",
    value: "rejected",
    color: "#EF4444",
  },
  submitted: {
    label: "Custom",
    value: "submitted",
    color: "#EF4444",
  },
}

export const APPLICATION_ACTIONS = [
  { status: "approved", label: "Approve", variant: "default" },
  {
    status: "under_review",
    label: "Mark as Under Review",
    variant: "outline",
  },
  { status: "on_hold", label: "Put on Hold", variant: "outline" },
  { status: "rejected", label: "Reject", variant: "destructive" },
] as const

export const INVITE_STATUS: Record<string, BadgeStatus> = {
  all: {
    label: "All",
    value: "",
    color: "#A1A1AA",
  },
  new: {
    label: "New",
    value: "new",
    color: "#F59E0B",
  },
  applied: {
    label: "Applied",
    value: "applied",
    color: "#F97316",
  },
  approved: {
    label: "Approved",
    value: "approved",
    color: "#22C55E",
  },
  rejected: {
    label: "Rejected",
    value: "rejected",
    color: "#EF4444",
  },
}
