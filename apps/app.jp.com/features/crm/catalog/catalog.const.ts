import { BadgeStatus } from "@/features/shared/shared.type"

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
