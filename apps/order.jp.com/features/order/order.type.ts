import {
  LineItemSelectType,
  OrderSelectType,
  ProductSelectType,
  UserSelectType,
} from "@jp/db"

type LineItem = LineItemSelectType & {
  productId: number
  title: string
  price: string
  itemCode: string
  product: ProductSelectType | null
}

export type Orders = OrderSelectType & {
  lineItemsCount: number
  user: Pick<UserSelectType, "id" | "name" | "email"> | null
}
export type Order = OrderSelectType & {
  lineItems: LineItem[]
  estimateUrl: string
}

export type DashboardOrder = Pick<
  OrderSelectType,
  "id" | "status" | "total" | "lineItemCount" | "deliveryDate" | "createdAt"
>

export type OrderDashboard = {
  stats: {
    openOrderCount: number
    monthOrderCount: number
    monthSpend: number
    totalOrderCount: number
  }
  spend: { month: string; total: number }[]
  recentOrders: DashboardOrder[]
}
