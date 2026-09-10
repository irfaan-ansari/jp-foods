import { BadgeStatus } from "@/features/shared/shared.type"

export const MEMBER_ROLES: Record<string, BadgeStatus> = {
  owner: { label: "Owner", value: "owner", color: "#8B5CF6" },
  manager: { label: "Manager", value: "manager", color: "#3B82F6" },
  sales: { label: "Sales", value: "sales", color: "#F59E0B" },
  member: { label: "Member", value: "member", color: "#10B981" },
  customer: { label: "Customer", value: "customer", color: "#6B7280" },
}
