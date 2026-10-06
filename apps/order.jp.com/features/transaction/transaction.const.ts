import type { BadgeStatus } from "@jp/ui/components/jp/status-badge"

export const STATUS: Record<string | "all", BadgeStatus> = {
  all: { label: "All", value: "", color: "#71717A" },
  paid: { label: "Paid", value: "paid", color: "#22C55E" },
  processing: { label: "Processing", value: "processing", color: "#F59E0B" },
  failed: { label: "Failed", value: "failed", color: "#EF4444" },
  refunded: { label: "Refunded", value: "refunded", color: "#06B6D4" },
}
