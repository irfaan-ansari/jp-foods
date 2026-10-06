import type { BadgeStatus } from "@jp/ui/components/jp/status-badge"

export const STATUS: Record<string | "all", BadgeStatus> = {
  all: { label: "All", value: "", color: "#71717A" },
  issued: { label: "Issued", value: "issued", color: "#3B82F6" },
  paid: { label: "Paid", value: "paid", color: "#22C55E" },
  overdue: { label: "Overdue", value: "overdue", color: "#EF4444" },
  processing: { label: "Processing", value: "processing", color: "#F59E0B" },
}
