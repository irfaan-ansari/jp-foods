import { BadgeStatus } from "../shared/shared.type"
export const USER_ROLES: Record<string, BadgeStatus> = {
  user: {
    label: "User",
    value: "user",
    color: "#6B7280",
  },
  sales: {
    label: "Sales",
    value: "sales",
    color: "#6B7280",
  },
  customer: {
    label: "Customer",
    value: "customer",
    color: "#EC4899",
  },
  driver: {
    label: "Driver",
    value: "driver",
    color: "#14B8A6",
  },
  reviewer: {
    label: "Application Reviewer",
    value: "reviewer",
    color: "#EAB308",
  },
  developer: {
    label: "Developer",
    value: "developer",
    color: "#3B82F6",
  },
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
}
export const STATUS: Record<string, BadgeStatus> = {
  all: { label: "All", color: "#A1A1AA", value: "all" },
  active: { label: "Active", value: "active", color: "#22C55E" },
  banned: { label: "Banned", value: "banned", color: "#F59E0B" },
}
