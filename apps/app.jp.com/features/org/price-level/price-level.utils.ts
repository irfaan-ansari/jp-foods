import { formatUSD } from "@jp/utils"

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

export const getNewPrice = (
  adjustmentType: string,
  basePrice: number | string | null,
  adjustmentValue: number | string
): string => {
  const base = Number(basePrice ?? 0)
  const adjustment = Number(adjustmentValue)

  const price =
    adjustmentType === "percentage"
      ? base + (base * adjustment) / 100
      : base + adjustment

  return String(Math.max(0, Math.round(price * 100) / 100))
}
