import { formatUSD } from "@jp/utils"

export const formatPriceLevelAdjustment = (
  type: string,
  value: number | string
) => {
  const numberValue = Number(value)
  const sign = numberValue > 0 ? "+" : numberValue < 0 ? "-" : ""
  const abs = Math.abs(numberValue)

  if (type === "percentage") {
    return `${sign}${abs}%`
  }

  const formatted = formatUSD(abs)

  return `${sign}${formatted}`
}
