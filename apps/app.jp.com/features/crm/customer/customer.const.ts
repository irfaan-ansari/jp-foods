import { BadgeStatus } from "@/features/shared/shared.type"

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
    color: "#F59E0B",
  },
  under_review: {
    label: "Under Review",
    value: "under_review",
    color: "#8B5CF6",
  },
  on_hold: {
    label: "On Hold",
    value: "on_hold",
    color: "#F97316",
  },
  active: {
    label: "Approved",
    value: "active",
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

export const APPLICATION_ACTIONS = {
  new: [
    {
      label: "Approve",
      action: "approve",
      variant: "default",
      className: "col-span-2",
    },
    {
      label: "Review",
      action: "review",
      variant: "outline",
      className: "",
    },
    {
      label: "Hold",
      action: "hold",
      variant: "outline",
      className: "",
    },
    {
      label: "Reject",
      action: "reject",
      variant: "destructive",
      className: "col-span-2",
    },
  ],

  under_review: [
    {
      label: "Approve",
      action: "approve",
      variant: "default",
      className: "col-span-2",
    },
    {
      label: "Reject",
      action: "reject",
      variant: "destructive",
      className: "col-span-2",
    },
  ],

  on_hold: [
    {
      label: "Approve",
      action: "approve",
      variant: "default",
      className: "col-span-2",
    },
    {
      label: "Reject",
      action: "reject",
      variant: "destructive",
      className: "col-span-2",
    },
  ],

  active: [],
  rejected: [],
} as const

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
    value: "active",
    color: "#22C55E",
  },
  rejected: {
    label: "Rejected",
    value: "rejected",
    color: "#EF4444",
  },
}
