import { CustomerApplicationSelectType, CustomerInviteSelectType } from "@jp/db"

export type Document = {
  label: string
  field: string
  url: string
}
export type CustomerApplication = Omit<
  CustomerApplicationSelectType,
  "certificateUrl" | "dlFrontUrl" | "dlBackUrl" | "signatureUrl"
> & {
  documents: Document[]
}

export type CustomerInvite = CustomerInviteSelectType
