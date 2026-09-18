import type { DashboardRanking } from "./dashboard.type"

type RankingOrder = {
  status: string
  teamId: string | null
  total: string
  lineItems: {
    productId: number | null
    title: string | null
    itemCode: string | null
    subtotal: string | null
    categories: string[] | null
  }[]
}

export function getDashboardRankings(
  orders: RankingOrder[],
  products: { id: number; title: string }[],
  customers: { id: string; name: string }[]
) {
  const productNames = new Map(
    products.map((product) => [product.id, product.title])
  )
  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.name])
  )
  const topProducts = new Map<string, DashboardRanking>()
  const topCustomers = new Map<string, DashboardRanking>()
  const frequentlyOrdered = new Map<string, DashboardRanking>()
  const topCategories = new Map<string, DashboardRanking>()
  const add = (map: Map<string, DashboardRanking>, row: DashboardRanking) => {
    const previous = map.get(row.id)
    map.set(row.id, { ...row, value: (previous?.value ?? 0) + row.value })
  }
  const cents = (value: string | null) => {
    const number = Number(value)
    return Number.isFinite(number) ? Math.round(number * 100) : 0
  }
  const rank = (map: Map<string, DashboardRanking>, money = false) =>
    [...map.values()]
      .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
      .slice(0, 5)
      .map((row) => ({ ...row, value: money ? row.value / 100 : row.value }))

  for (const order of orders) {
    if (order.status === "cancelled") continue
    if (order.teamId) {
      const name = customerNames.get(order.teamId)
      add(topCustomers, {
        id: order.teamId,
        name: name ?? "Deleted customer",
        value: cents(order.total),
        href: name ? `/org/customers/${order.teamId}` : undefined,
      })
    }
    const seenProducts = new Set<string>()
    const seenCategories = new Set<string>()
    for (const item of order.lineItems) {
      const id =
        item.productId !== null
          ? `product:${item.productId}`
          : `deleted:${item.itemCode ?? item.title ?? "unknown"}`
      const name =
        (item.productId !== null
          ? productNames.get(item.productId)
          : undefined) ??
        item.title ??
        "Deleted product"
      const href =
        item.productId !== null && productNames.has(item.productId)
          ? `/org/products/${item.productId}`
          : undefined
      add(topProducts, { id, name, href, value: cents(item.subtotal) })
      if (!seenProducts.has(id)) {
        add(frequentlyOrdered, { id, name, href, value: 1 })
        seenProducts.add(id)
      }
      for (const category of item.categories ?? []) {
        if (!category.trim() || seenCategories.has(category)) continue
        add(topCategories, {
          id: category,
          name: category,
          value: 1,
          href: `/org/products?cat=${encodeURIComponent(category)}`,
        })
        seenCategories.add(category)
      }
    }
  }
  return {
    topProducts: rank(topProducts, true),
    topCustomers: rank(topCustomers, true),
    frequentlyOrdered: rank(frequentlyOrdered),
    topCategories: rank(topCategories),
  }
}
