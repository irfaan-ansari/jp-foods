import { BadgeStatus } from "../shared/shared.type"

export const USER_ROLES: Record<string, BadgeStatus> = {
  user: {
    label: "User",
    value: "user",
    color: "#A1A1AA",
  },
  admin: {
    label: "Admin",
    value: "admin",
    color: "#A1A1AA",
  },
  developer: {
    label: "Developer",
    value: "developer",
    color: "#A1A1AA",
  },
  customer: {
    label: "Customer",
    value: "customer",
    color: "#A1A1AA",
  },
  driver: {
    label: "Driver",
    value: "driver",
    color: "#A1A1AA",
  },
  superAdmin: {
    label: "Super Admin",
    value: "superAdmin",
    color: "#A1A1AA",
  },
  reviewer: {
    label: "Application Reviewer",
    value: "reviewer",
    color: "#A1A1AA",
  },
}

export const STATUS: Record<string, BadgeStatus> = {
  all: { label: "All", color: "#A1A1AA", value: "all" },
  active: { label: "Active", value: "active", color: "#22C55E" },
  banned: { label: "Banned", value: "banned", color: "#F59E0B" },
}
