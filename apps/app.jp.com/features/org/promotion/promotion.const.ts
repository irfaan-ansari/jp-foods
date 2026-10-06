import type { BadgeStatus } from "@jp/ui/components/jp/status-badge"

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
  dashbaord: "Dashboard",
  banner: "Banner",
  "new-order": "New Order",
  cart: "Cart",
}
