export type DashboardRanking = {
  id: string
  name: string
  value: number
  href?: string
}

export type DashboardData = {
  topProducts: DashboardRanking[]
  topCustomers: DashboardRanking[]
  frequentlyOrdered: DashboardRanking[]
  topCategories: DashboardRanking[]
  overview: { month: string; orders: number }[]
}
