import { BadgeStatus } from "../shared/shared.type"

export const USER_ROLES: Record<string, BadgeStatus> = {
  user: {
    label: "User",
    value: "user",
    color: "#64748B", // Slate
  },

  admin: {
    label: "Admin",
    value: "admin",
    color: "#E07A3F", // Orange
  },

  developer: {
    label: "Developer",
    value: "developer",
    color: "#4F6FD8", // Blue
  },

  customer: {
    label: "Customer",
    value: "customer",
    color: "#D05A8A", // Rose
  },

  driver: {
    label: "Driver",
    value: "driver",
    color: "#2F9B78", // Emerald
  },

  superAdmin: {
    label: "Super Admin",
    value: "superAdmin",
    color: "#8B5CF6", // Purple
  },

  reviewer: {
    label: "Application Reviewer",
    value: "reviewer",
    color: "#C49A32", // Gold
  },
}

export const STATUS: Record<string, BadgeStatus> = {
  all: { label: "All", color: "#A1A1AA", value: "all" },
  active: { label: "Active", value: "active", color: "#22C55E" },
  banned: { label: "Banned", value: "banned", color: "#F59E0B" },
}
