import type { BadgeStatus } from "@jp/ui/components/jp/status-badge"

export const STATUS: Record<string | "all", BadgeStatus> = {
  all: { label: "All", value: "", color: "#71717A" },
  placed: { label: "New", value: "placed", color: "#3B82F6" },
  processing: { label: "Processing", value: "processing", color: "#F59E0B" },
  packed: { label: "Packed", value: "packed", color: "#8B5CF6" },
  completed: { label: "Completed", value: "completed", color: "#22C55E" },
  invoiced: { label: "Invoiced", value: "invoiced", color: "#14B8A6" },
  cancelled: { label: "Cancelled", value: "cancelled", color: "#EF4444" },
}
