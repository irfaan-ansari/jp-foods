import { Product } from "./product.type"

const GROUP_MAP: Record<string, string> = {
  "9": "Produce",
  "1": "Tortilla",
  "2": "Dairy",
  "3": "Dry Goods",
  "4": "Disposable",
  "5": "Janitorial",
  "6": "Beverages",
  "7": "Frozen",
  "8": "Meat",
}

const GROUP_ORDER = ["9", "1", "2", "3", "4", "5", "6", "7", "8"]

export const groupProducts = (
  products: Product[]
): Record<string, Product[]> => {
  const seen = new Set<Product["id"]>()

  const sortedProducts = [...products].sort((a, b) =>
    naturalCompare(a.title, b.title)
  )

  const groupedProducts: Record<string, Product[]> = {}

  for (const product of sortedProducts) {
    if (seen.has(product.id)) continue

    const prefix = String(product.itemCode ?? "").charAt(0)

    const groupName = GROUP_MAP[prefix] ?? product.categories?.[0] ?? "Other"

    ;(groupedProducts[groupName] ??= []).push(product)

    seen.add(product.id)
  }

  // Sort by subcategory first, then title.
  for (const products of Object.values(groupedProducts)) {
    products.sort((a, b) => {
      const subCategoryA = a.categories?.[1]
      const subCategoryB = b.categories?.[1]

      if (subCategoryA && !subCategoryB) return -1
      if (!subCategoryA && subCategoryB) return 1

      if (subCategoryA && subCategoryB) {
        const result = naturalCompare(subCategoryA, subCategoryB)

        if (result !== 0) {
          return result
        }
      }

      return naturalCompare(a.title, b.title)
    })
  }

  const orderedGroupedProducts: Record<string, Product[]> = {}

  for (const key of GROUP_ORDER) {
    const groupName = GROUP_MAP[key]
    const products = groupedProducts[groupName]

    if (products) {
      orderedGroupedProducts[groupName] = products
    }
  }

  // Add groups not defined in GROUP_ORDER.
  for (const [groupName, products] of Object.entries(groupedProducts)) {
    if (!(groupName in orderedGroupedProducts)) {
      orderedGroupedProducts[groupName] = products
    }
  }

  return orderedGroupedProducts
}

export const naturalCompare = (a: string, b: string): number => {
  const chunkPattern = /(\d+\.\d+|\d+|\D+)/g

  const chunksA = a.match(chunkPattern) ?? []
  const chunksB = b.match(chunkPattern) ?? []

  const maxLength = Math.max(chunksA.length, chunksB.length)

  for (let i = 0; i < maxLength; i++) {
    const chunkA = chunksA[i] ?? ""
    const chunkB = chunksB[i] ?? ""

    const numA = Number.parseFloat(chunkA)
    const numB = Number.parseFloat(chunkB)

    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      if (numA !== numB) {
        return numA - numB
      }

      continue
    }

    const result = chunkA.localeCompare(chunkB, undefined, {
      sensitivity: "base",
    })

    if (result !== 0) {
      return result
    }
  }

  return 0
}
