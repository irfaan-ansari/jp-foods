import {
  LineItemSelectType,
  OrderSelectType,
  TeamSelectType,
  UserSelectType,
} from "@jp/db"

export type Order = OrderSelectType & {
  lineItems: LineItemSelectType[]
  team: Pick<TeamSelectType, "id" | "name" | "phoneNumber" | "email">
  user: Pick<UserSelectType, "id" | "name" | "phoneNumber" | "email">
}
