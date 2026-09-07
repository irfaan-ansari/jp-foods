import { BadgeStatus } from "@/features/shared/shared.type"

export const MEMBER_ROLES: Record<string, BadgeStatus> = {
  owner: { label: "Owner", value: "", color: "#A1A1AA" },
  manager: { label: "Manager", value: "", color: "#A1A1AA" },
  sales: { label: "Sales", value: "", color: "#A1A1AA" },
  customer: { label: "Customer", value: "", color: "#A1A1AA" },
}
