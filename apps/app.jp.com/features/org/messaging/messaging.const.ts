import { BadgeStatus } from "@/features/shared/shared.type"

export const MESSAGE_STATUS: Record<string, BadgeStatus> = {
  all: { label: "All", value: "", color: "#71717A" },
  sending: { label: "Sending", value: "sending", color: "#F59E0B" },
  completed: { label: "Completed", value: "completed", color: "#22C55E" },
  partial: { label: "Partial", value: "partial", color: "#F97316" },
  failed: { label: "Failed", value: "failed", color: "#EF4444" },
}

export const RECIPIENT_STATUS: Record<string, BadgeStatus> = {
  queued: { label: "Queued", value: "queued", color: "#71717A" },
  sent: { label: "Sent", value: "sent", color: "#22C55E" },
  failed: { label: "Failed", value: "failed", color: "#EF4444" },
  skipped: { label: "Skipped", value: "skipped", color: "#F59E0B" },
}

export const MESSAGE_VARIABLES = [
  { key: "name", label: "Recipient name" },
  { key: "teamName", label: "Customer/team name" },
  { key: "phoneNumber", label: "Phone number" },
  { key: "organizationName", label: "Organization name" },
]

export const MESSAGE_TEMPLATES = [
  {
    key: "custom",
    label: "Custom",
    message: "",
  },
  {
    key: "weekly-reminder",
    label: "Weekly order reminder",
    message:
      "Hi {{name}}, this is {{organizationName}}. Place your weekly order when you are ready.",
  },
  {
    key: "promotion",
    label: "Promotion",
    message:
      "Hi {{name}}, {{organizationName}} has a new offer available for {{teamName}}.",
  },
]
