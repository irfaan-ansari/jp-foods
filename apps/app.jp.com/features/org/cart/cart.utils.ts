import type { CartActivity, CartGroup } from "./cart.type"

export function getCartGroupKey(group: Pick<CartGroup, "team" | "user">) {
  return `${group.team.id}:${group.user.id}`
}

export function reconcileCartGroups(
  current: CartGroup[],
  incoming: CartGroup[]
) {
  const byKey = new Map(current.map((group) => [getCartGroupKey(group), group]))
  const next = incoming.map((group) => {
    const previous = byKey.get(getCartGroupKey(group))
    return previous && JSON.stringify(previous) === JSON.stringify(group)
      ? previous
      : group
  })
  return next.length === current.length &&
    next.every((group, index) => group === current[index])
    ? current
    : next
}

export function mergeCartActivity(
  current: CartActivity[],
  incoming: CartActivity[]
) {
  const seen = new Set<string>()
  const next = [...incoming, ...current]
    .filter((entry) => {
      if (seen.has(entry.id)) return false
      seen.add(entry.id)
      return true
    })
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 14)

  // Activity IDs identify immutable changes; duplicate deliveries need no render.
  return next.length === current.length &&
    next.every((entry, index) => entry.id === current[index]?.id)
    ? current
    : next
}
