import { BadgeStatus } from "@/features/shared/shared.type"

export const APPLICATION_REJECTION_REASONS = [
  "Incomplete application",
  "Required documents not provided",
  "Verification requirements not met",
  "Eligibility requirements not met",
  "Information could not be verified",
  "Other",
] as const

export const APPLICATION_FILTER_STATUS: Record<string, BadgeStatus> = {
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
  verification_in_progress: {
    label: "Verification In Progress",
    value: "verification_in_progress",
    color: "#F59E0B",
  },
  rejected: {
    label: "Rejected",
    value: "rejected",
    color: "#EF4444",
  },
  hired: {
    label: "Hired",
    value: "hired",
    color: "#22C55E",
  },
}

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
  pending: {
    label: "Agreement Sent",
    value: "pending",
    color: "#8B5CF6",
  },
  hired: {
    label: "Hired",
    value: "hired",
    color: "#22C55E",
  },
  rejected: {
    label: "Rejected",
    value: "rejected",
    color: "#EF4444",
  },
  // new status for verified first
  verification_in_progress: {
    label: "Verification In Progress",
    value: "verification_in_progress",
    color: "#F59E0B",
  },
  verification_failed: {
    label: "Verification Failed",
    value: "verification_failed",
    color: "#EF4444",
  },
}

export const APPLICATION_ACTIONS = {
  new: [
    {
      label: "Accept",
      action: "accept",
      variant: "default",
      className: "col-span-2",
    },
    {
      label: "Start Verification",
      action: "start_verification",
      variant: "outline",
      className: "col-span-2",
    },
    {
      label: "Reject",
      action: "reject",
      variant: "destructive",
      className: "col-span-2",
    },
  ],

  verification_in_progress: [
    {
      label: "Accept",
      action: "accept",
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
