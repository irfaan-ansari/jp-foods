import {
  differenceInHours,
  differenceInMinutes,
  format,
  isToday,
  isYesterday,
} from "date-fns"

/**
 *
 * @param value
 * @returns
 */
export const formatPhone = (value: string) => {
  if (!value) return ""
  const digits = value.replace(/\D/g, "").slice(0, 10)

  const match = digits.match(/(\d{0,3})(\d{0,3})(\d{0,4})/)

  if (!match) return value

  const [, a, b, c] = match

  if (b) return `${a}-${b}${c ? `-${c}` : ""}`
  if (a) return a
  return ""
}

/**
 *
 * @param value
 * @returns
 */
export const formatUSD = (value: string | number) => {
  if (!value || isNaN(Number(value))) return "$0.00"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(value as string))
}

/**
 *
 * @param date
 * @returns
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Never"

  const value = typeof date === "string" ? new Date(date) : date
  const now = new Date()

  if (isToday(value)) {
    const minutes = differenceInMinutes(now, value)

    if (minutes < 1) return "Just now"
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
    }

    const hours = differenceInHours(now, value)
    return `${hours} hour${hours === 1 ? "" : "s"} ago`
  }

  if (isYesterday(value)) {
    return `Yesterday`
  }

  return format(value, "MMM d, yyyy")
}
