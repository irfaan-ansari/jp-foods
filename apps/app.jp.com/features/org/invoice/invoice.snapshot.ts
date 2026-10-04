import type {
  LineItemSelectType,
  OrderSelectType,
  OrganizationSelectType,
  TeamSelectType,
} from "@jp/db"

type SourceOrder = OrderSelectType & {
  organization: OrganizationSelectType | null
  team: TeamSelectType | null
  lineItems: LineItemSelectType[]
}

export function createInvoiceSnapshot(source: SourceOrder) {
  return true
}
