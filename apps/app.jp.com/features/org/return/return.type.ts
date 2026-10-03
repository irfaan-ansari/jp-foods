export type ReturnRow = {
  number: string
  order: string
  customer: string
  createdAt: string
  amount: string
  status: "pending" | "approved" | "completed" | "rejected"
}
