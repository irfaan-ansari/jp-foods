import type { BadgeStatus } from "@jp/ui/components/jp/status-badge"

export const USER_ROLES: Record<string, BadgeStatus> = {
  admin: {
    label: "Admin",
    value: "admin",
    color: "#F97316",
  },
  superAdmin: {
    label: "Super Admin",
    value: "superAdmin",
    color: "#DC2626",
  },
  customer: {
    label: "Customer",
    value: "customer",
    color: "#EC4899",
  },
  reviewer: {
    label: "Application Reviewer",
    value: "reviewer",
    color: "#EAB308",
  },
}

export const STATUS: Record<string, BadgeStatus> = {
  all: { label: "All", color: "#A1A1AA", value: "" },
  active: { label: "Active", value: "active", color: "#22C55E" },
  banned: { label: "Banned", value: "banned", color: "#F59E0B" },
}
