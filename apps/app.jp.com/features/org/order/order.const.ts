import { BadgeStatus } from "@/features/shared/shared.type"

export const STATUS: Record<string, BadgeStatus> = {
  all: {
    label: "All",
    value: "",
    color: "#71717A",
  },
  in_progress: {
    label: "In Progress",
    value: "in_progress",
    color: "#F59E0B",
  },
  completed: {
    label: "Completed",
    value: "completed",
    color: "#22C55E",
  },
  cancelled: {
    label: "Cancelled",
    value: "cancelled",
    color: "#EF4444",
  },
}
