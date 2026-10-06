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
  private: {
    label: "Private",
    value: "private",
    color: "#8B5CF6", // Violet
  },
  draft: {
    label: "Draft",
    value: "draft",
    color: "#F59E0B", // Amber
  },
  archived: {
    label: "Archived",
    value: "archived",
    color: "#64748B", // Slate
  },
}
