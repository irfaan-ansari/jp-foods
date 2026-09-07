export const sortLineItems = (lineItems: Record<string, any>[]) => {
  const sortOrder = ["9", "8", "7", "2", "1", "3", "4", "5", "6"]
  const orderMap = Object.fromEntries(sortOrder.map((v, i) => [v, i]))

  return lineItems.sort((a, b) => {
    const aKey = a.identifier?.[0]!
    const bKey = b.identifier?.[0]!
    return (orderMap[aKey] ?? Infinity) - (orderMap[bKey] ?? Infinity)
  })
}
