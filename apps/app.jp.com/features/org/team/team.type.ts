import { OrderGuideSelectType, TeamSelectType, UserSelectType } from "@jp/db"
import { Product } from "../product/product.type"
import { TaxRule } from "../tax-rule/tax-rule.type"
import { PriceLevel } from "../price-level/price-level.type"

type Metadata = {
  street?: string
  city?: string
  state?: string
  zipcode?: string
}

type TeamMember = {
  id: string
  userId: string
  name: string
  image: string
}

type TeamMemberDetail = TeamMember & {
  email: string
  phoneNumber: string
}

export type Team = TeamSelectType & {
  salesRep: Pick<UserSelectType, "id" | "name" | "image">
  teamMembers: TeamMember[]
}

export type TeamDetail = Omit<Team, "teamMembers"> & {
  priceLevel: PriceLevel
  taxRule: TaxRule
  products: Pick<Product, "id" | "title" | "image" | "itemCode" | "sellUnits">[]
  metadata: Metadata
  teamMembers: TeamMemberDetail[]
}

export type TeamAnalytics = {
  range: string

  summary: {
    totalOrders: number
    activeOrders: number
    totalSpend: number
    averageOrderValue: number
  }

  topProducts: {
    id: string
    title: string
    itemCode: string | null
    image: string | null
    quantity: number
    total: number
  }[]

  topCategories: {
    name: string
    quantity: number
    total: number
  }[]

  recentOrders: {
    id: string
    orderNumber: string
    status: string
    total: string
    createdAt: Date
  }[]

  orderGuides: OrderGuideSelectType &
    {
      products: Product[]
      productCount: number
    }[]
}
