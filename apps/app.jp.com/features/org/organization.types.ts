import { OrganizationSelectType } from "@jp/db"

export type Organization = Omit<OrganizationSelectType, "metadata"> & {
  metadata: {
    street?: string
    city?: string
    state?: string
    zip?: string
    [key: string]: string | undefined
  }
}
