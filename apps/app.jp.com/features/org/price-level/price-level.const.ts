import type { BadgeStatus } from "@jp/ui/components/jp/status-badge"

export const STATUS: Record<string, BadgeStatus> = {
  all: { label: "All", value: "", color: "#A1A1AA" },
  active: { label: "Active", value: "active", color: "#22C55E" },
  inactive: { label: "Inactive", value: "inactive", color: "#F59E0B" },
}
