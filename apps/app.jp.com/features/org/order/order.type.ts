import {
  LineItemSelectType,
  OrderSelectType,
  TeamSelectType,
  UserSelectType,
} from "@jp/db"

export type Order = OrderSelectType & {
  lineItemCount: number
  team: Pick<TeamSelectType, "id" | "name" | "phoneNumber" | "email">
  user: Pick<UserSelectType, "id" | "name" | "phoneNumber" | "email">
}

export type OrderWithLineItems = Order & {
  lineItems: LineItemSelectType[]
}
