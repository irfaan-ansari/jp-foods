import type { BadgeStatus } from "@jp/ui/components/jp/status-badge"

export const STATUS: Record<string | "all", BadgeStatus> = {
  all: { label: "All", value: "", color: "#71717A" },
  placed: { label: "Placed", value: "placed", color: "#3B82F6" },
  processing: { label: "Processing", value: "in_progress", color: "#F59E0B" },
  packed: { label: "Packed", value: "packed", color: "#8B5CF6" },
  completed: { label: "Completed", value: "completed", color: "#22C55E" },
  invoiced: { label: "Invoiced", value: "invoiced", color: "#14B8A6" },
  cancelled: { label: "Cancelled", value: "cancelled", color: "#EF4444" },
}

export const ORDER_CANCEL_REASONS = [
  { value: "Ordered in error", label: "Ordered in error" },
  { value: "Duplicate order", label: "Duplicate order" },
  { value: "Need to modify the order", label: "Need to modify the order" },
  {
    value: "Incorrect products or quantities",
    label: "Incorrect products or quantities",
  },
  {
    value: "Business needs have changed",
    label: "Business needs have changed",
  },
  { value: "Other", label: "Other" },
]
