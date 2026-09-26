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
