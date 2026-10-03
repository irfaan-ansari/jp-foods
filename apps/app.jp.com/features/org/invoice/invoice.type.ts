export type InvoiceRow = {
  number: string
  customer: string
  issuedAt: string
  dueDate: string
  total: string
  status: "issued" | "paid" | "overdue" | "processing"
}
