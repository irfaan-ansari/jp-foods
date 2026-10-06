import type { ProductPriceImportRow } from "./product.schema"

export type ProductPriceImportPreviewRow = ProductPriceImportRow & {
  rowNumber: number
}

export type ProductPriceImportState = {
  fileName: string
  rows: ProductPriceImportPreviewRow[]
  availableFields: Set<keyof ProductPriceImportRow>
}

export const PRODUCT_PRICE_IMPORT_PREVIEW_LIMIT = 10

const HEADER_ALIASES: Record<string, keyof ProductPriceImportRow> = {
  itemcode: "itemCode",
  item_code: "itemCode",
  item: "itemCode",
  code: "itemCode",
  sku: "itemCode",
  price: "price",
  stock: "stock",
  stockuom: "stockUOM",
  stock_uom: "stockUOM",
  inventoryuom: "stockUOM",
  inventory_uom: "stockUOM",
  selluom: "sellUOM",
  sell_uom: "sellUOM",
  salesuom: "sellUOM",
  sales_uom: "sellUOM",
}

const normalizeHeader = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")

const parseCsvLine = (line: string) => {
  const values: string[] = []
  let value = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"' && inQuotes && next === '"') {
      value += '"'
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === "," && !inQuotes) {
      values.push(value.trim())
      value = ""
      continue
    }

    value += char
  }

  values.push(value.trim())
  return values
}

export const parseProductPriceImportCsv = (
  text: string,
  fileName: string
): ProductPriceImportState => {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row.")
  }

  const headers = parseCsvLine(lines[0]!)
  const mappedHeaders = headers.map((header) => {
    const normalized = normalizeHeader(header)
    return (
      HEADER_ALIASES[normalized] ??
      HEADER_ALIASES[normalized.replaceAll("_", "")]
    )
  })

  if (!mappedHeaders.includes("itemCode")) {
    throw new Error("CSV must include an item code column.")
  }

  const availableFields = new Set(
    mappedHeaders.filter(Boolean)
  ) as Set<keyof ProductPriceImportRow>

  const updatableFields = [...availableFields].filter(
    (field) => field !== "itemCode"
  )

  if (updatableFields.length === 0) {
    throw new Error("CSV must include at least one update column.")
  }

  const rows = lines
    .slice(1)
    .map((line, index) => {
      const values = parseCsvLine(line)
      const row: Partial<ProductPriceImportPreviewRow> = {
        rowNumber: index + 2,
      }

      mappedHeaders.forEach((field, fieldIndex) => {
        if (!field) return
        const value = values[fieldIndex]?.trim()
        if (value === undefined || value === "") return
        row[field] = value
      })

      return row as ProductPriceImportPreviewRow
    })
    .filter((row) => row.itemCode)

  if (rows.length === 0) {
    throw new Error("No valid product rows found.")
  }

  return {
    fileName,
    rows,
    availableFields,
  }
}
