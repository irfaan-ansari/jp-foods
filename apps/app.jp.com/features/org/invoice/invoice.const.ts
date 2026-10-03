import type { BadgeStatus } from "@/features/shared/shared.type"
import type { InvoiceRow } from "./invoice.type"

export const STATUS: Record<InvoiceRow["status"], BadgeStatus> = {
  issued: {
    label: "Issued",
    value: "issued",
    color: "#3B82F6",
  },
  paid: {
    label: "Paid",
    value: "paid",
    color: "#22C55E",
  },
  overdue: {
    label: "Overdue",
    value: "overdue",
    color: "#EF4444",
  },
  processing: {
    label: "Processing",
    value: "processing",
    color: "#F59E0B",
  },
}

// Sample records for the invoices table until live data is connected.
export const DUMMY_INVOICES: InvoiceRow[] = [
  {
    number: "INV-000101",
    customer: "Sunrise Market",
    issuedAt: "2026-09-21T12:00:00Z",
    dueDate: "2026-10-05T12:00:00Z",
    total: "1250.00",
    status: "issued",
  },
  {
    number: "INV-000102",
    customer: "Harbor Fresh Foods",
    issuedAt: "2026-09-22T12:00:00Z",
    dueDate: "2026-10-06T12:00:00Z",
    total: "846.75",
    status: "paid",
  },
  {
    number: "INV-000103",
    customer: "Oak Street Deli",
    issuedAt: "2026-09-23T12:00:00Z",
    dueDate: "2026-09-30T12:00:00Z",
    total: "2134.50",
    status: "overdue",
  },
  {
    number: "INV-000104",
    customer: "Palm Grove Grocery",
    issuedAt: "2026-09-24T12:00:00Z",
    dueDate: "2026-10-08T12:00:00Z",
    total: "567.25",
    status: "processing",
  },
  {
    number: "INV-000105",
    customer: "Riverside Kitchen",
    issuedAt: "2026-09-25T12:00:00Z",
    dueDate: "2026-10-09T12:00:00Z",
    total: "1599.00",
    status: "issued",
  },
]
