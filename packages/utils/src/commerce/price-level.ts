type PriceLevel = {
  status: string
  appliesTo: string
  adjustmentType: string
  adjustmentValue: string | number | null
  priceLevelItem: { productId: number; adjustmentValue: string | number }[]
}

/** Apply customer adjustments to each selling unit's price basis. */
export function createProductPriceResolver(config?: PriceLevel | null) {
  const adjustments = new Map(
    config?.priceLevelItem.map((item) => [item.productId, item.adjustmentValue])
  )
  return <T extends { id: number; sellingUnits?: { price: string }[] | null }>(
    product: T
  ): T => {
    if (!config || config.status !== "active") return product
    if (config.appliesTo !== "all" && config.appliesTo !== "per_item")
      return product
    if (
      config.adjustmentType !== "fixed" &&
      config.adjustmentType !== "percentage"
    )
      return product
    const adjustment =
      config.appliesTo === "all"
        ? config.adjustmentValue
        : adjustments.get(product.id)
    if (
      adjustment == null ||
      String(adjustment).trim() === "" ||
      !Number.isFinite(Number(adjustment))
    )
      return product
    const adjust = (price: string) => {
      const base = Number(price)
      if (price.trim() === "" || !Number.isFinite(base)) return price
      const amount = Number(adjustment)
      const next =
        config.adjustmentType === "percentage"
          ? base * (1 + amount / 100)
          : base + amount
      if (!Number.isFinite(next)) return price
      return String(
        Math.max(0, Math.round((next + Number.EPSILON) * 10000) / 10000)
      )
    }
    if (!product.sellingUnits) return product
    return {
      ...product,
      sellingUnits: product.sellingUnits.map((unit) => ({
        ...unit,
        price: adjust(unit.price),
      })),
    }
  }
}
