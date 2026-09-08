import { BadgeStatus } from "@/features/shared/shared.type"

export const STATUS: Record<string, BadgeStatus> = {
  all: {
    label: "All",
    value: "",
    color: "#71717A",
  },
  suspended: {
    label: "Archived",
    value: "archived",
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
}

export const TEAM_STATUS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]
