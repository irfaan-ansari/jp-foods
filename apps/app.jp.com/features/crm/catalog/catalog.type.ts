import { CustomerInviteSelectType } from "@jp/db"

export type CatalogInquiry = Omit<CustomerInviteSelectType, "token"> & {
  url: string | null
}
