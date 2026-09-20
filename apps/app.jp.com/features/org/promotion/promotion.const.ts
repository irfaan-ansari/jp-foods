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
    color: "#64748B",
  },
}

export const PLACEMENT: Record<string, string> = {
  sidebar: "Sidebar",
  banner: "Banner",
  "new-order": "New Order",
  cart: "Cart Upsell",
}
