import {
  differenceInHours,
  differenceInMinutes,
  format,
  isToday,
  isYesterday,
} from "date-fns"
import { parsePhoneNumberFromString } from "libphonenumber-js"

/**
 *
 * @param value
 * @returns
 */
export const formatPhone = (value: string) => {
  if (!value) return ""
  const trimmed = value.trim()
  const international = trimmed.startsWith("+") ? trimmed : `+${trimmed}`
  const phone = parsePhoneNumberFromString(international, { extract: false })

  return phone?.isPossible() ? phone.formatInternational() : value
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
