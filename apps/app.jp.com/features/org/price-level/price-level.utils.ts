import { formatUSD } from "@jp/utils"
import type { Product } from "../product/product.type"
import type { PriceLevelConfig } from "./price-level.type"

export const formatPriceLevelAdjustment = (
  appliesTo: "all" | "per_item",
  type: "fixed" | "percentage",
  value?: number | string
) => {
  if (appliesTo === "per_item") {
    return type === "percentage" ? "Percentage" : "Fixed"
  }

  const numberValue = Number(value)
  const sign = numberValue > 0 ? "+" : numberValue < 0 ? "-" : ""
  const abs = Math.abs(numberValue)

  if (type === "percentage") {
    return `${sign}${abs}%`
  }

  return `${sign}${formatUSD(abs)}`
}

export const getAdjustedPrice = (
  adjustmentType: string,
  basePrice: string | number | null,
  adjustmentValue: string | number
): string => {
  const base = Number(basePrice ?? 0)
  const adjustment = Number(adjustmentValue)

  const price =
    adjustmentType === "percentage"
      ? base + (base * adjustment) / 100
      : adjustment

  return String(Math.max(0, Math.round(price * 100) / 100))
}

export const createProductPriceResolver = (
  config?: PriceLevelConfig | null
) => {
  const pricesByProduct = new Map(
    config?.priceLevelItem.map((item) => [item.productId, item.price])
  )

  return <T extends Pick<Product, "id" | "price">>(product: T): T => {
    if (!config || config.status !== "active") return product

    const adjustment =
      config.appliesTo === "all"
        ? config.adjustmentValue
        : config.appliesTo === "per_item"
          ? pricesByProduct.get(product.id)
          : undefined

    if (adjustment === undefined) return product

    const basePrice = Number(product.price ?? 0)
    const adjustmentValue = Number(adjustment)
    const price =
      config.adjustmentType === "percentage"
        ? basePrice + (basePrice * adjustmentValue) / 100
        : config.appliesTo === "all"
          ? basePrice + adjustmentValue
          : adjustmentValue

    return {
      ...product,
      price: String(Math.max(0, Math.round(price * 100) / 100)),
    }
  }
}
