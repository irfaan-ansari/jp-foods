import {
  LineItemSelectType,
  OrderSelectType,
  TeamSelectType,
  UserSelectType,
} from "@jp/db"

export type Order = Omit<OrderSelectType, "lineItemCount"> & {
  lineItemCount: number
  team: Pick<TeamSelectType, "id" | "name" | "phoneNumber" | "email">
  user: Pick<UserSelectType, "id" | "name" | "phoneNumber" | "email">
}

export type OrderWithLineItems = Order & {
  lineItems: LineItemSelectType[]
}
