import type { BadgeStatus } from "@jp/ui/components/jp/status-badge"

import type { ReturnRow } from "./return.type"

export const STATUS: Record<ReturnRow["status"], BadgeStatus> = {
  pending: {
    label: "Pending",
    value: "pending",
    color: "#F59E0B",
  },
  approved: {
    label: "Approved",
    value: "approved",
    color: "#3B82F6",
  },
  completed: {
    label: "Completed",
    value: "completed",
    color: "#22C55E",
  },
  rejected: {
    label: "Rejected",
    value: "rejected",
    color: "#EF4444",
  },
}

// Sample records for the returns table until live data is connected.
export const DUMMY_RETURNS: ReturnRow[] = [
  {
    number: "RET-000001",
    order: "ORD-000101",
    customer: "Sunrise Market",
    createdAt: "2026-09-25T12:00:00Z",
    amount: "125.00",
    status: "pending",
  },
  {
    number: "RET-000002",
    order: "ORD-000102",
    customer: "Harbor Fresh Foods",
    createdAt: "2026-09-26T12:00:00Z",
    amount: "84.75",
    status: "approved",
  },
  {
    number: "RET-000003",
    order: "ORD-000103",
    customer: "Oak Street Deli",
    createdAt: "2026-09-27T12:00:00Z",
    amount: "213.50",
    status: "completed",
  },
  {
    number: "RET-000004",
    order: "ORD-000104",
    customer: "Palm Grove Grocery",
    createdAt: "2026-09-28T12:00:00Z",
    amount: "56.25",
    status: "rejected",
  },
  {
    number: "RET-000005",
    order: "ORD-000105",
    customer: "Riverside Kitchen",
    createdAt: "2026-09-29T12:00:00Z",
    amount: "159.00",
    status: "pending",
  },
]
