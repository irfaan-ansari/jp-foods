import { BadgeStatus } from "@/features/shared/shared.type"

export const STATUS: Record<string, BadgeStatus> = {
  all: {
    label: "All",
    value: "",
    color: "#71717A",
  },
  active: {
    label: "Active",
    value: "active",
    color: "#22C55E",
  },
  inactive: {
    label: "Inactive",
    value: "inactive",
    color: "#71717A",
  },
  suspended: {
    label: "Suspended",
    value: "suspended",
    color: "#DC2626",
  },
}

export const RANGE_DAYS: Record<string, { label: string; days: number }> = {
  "7d": {
    label: "Last 7 days",
    days: 7,
  },
  "30d": {
    label: "Last 30 days",
    days: 30,
  },
  "90d": {
    label: "Last 90 days",
    days: 90,
  },
}
