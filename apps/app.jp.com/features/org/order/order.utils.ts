import { OrderWithLineItems } from "./order.type"

export const sortLineItems = <T extends OrderWithLineItems["lineItems"]>(
  lineItems: T
) => {
  return [...lineItems].sort((a, b) =>
    (a.location ?? "").localeCompare(b.location ?? "", undefined, {
      numeric: true,
      sensitivity: "base",
    })
  )
}
