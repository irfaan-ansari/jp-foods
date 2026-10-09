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

export const PRODUCT_PRICE_IMPORT_FIELDS = [
  { key: "itemCode", label: "Item Code", required: true },
  { key: "price", label: "Price", required: true },
] as const

export type ProductPriceColumnMapping = Partial<
  Record<keyof ProductPriceImportRow, number>
>

export const readProductPriceImportHeaders = (text: string) => {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row.")
  }
  return parseCsvLine(lines[0]!)
}

export const autoMapProductPriceColumns = (headers: string[]) => {
  const mapping: ProductPriceColumnMapping = {}
  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header)
    const field =
      HEADER_ALIASES[normalized] ??
      HEADER_ALIASES[normalized.replaceAll("_", "")]
    if (field && mapping[field] === undefined) mapping[field] = index
  })
  return mapping
}

const HEADER_ALIASES: Record<string, keyof ProductPriceImportRow> = {
  itemcode: "itemCode",
  item_code: "itemCode",
  item: "itemCode",
  code: "itemCode",
  sku: "itemCode",
  price: "price",
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
  fileName: string,
  mapping?: ProductPriceColumnMapping
): ProductPriceImportState => {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row.")
  }

  const headers = parseCsvLine(lines[0]!)
  const columns = mapping ?? autoMapProductPriceColumns(headers)
  const usedColumns = Object.values(columns)
  if (new Set(usedColumns).size !== usedColumns.length) {
    throw new Error("Choose a different CSV column for each field.")
  }
  if (
    usedColumns.some(
      (index) =>
        !Number.isInteger(index) || index < 0 || index >= headers.length
    )
  ) {
    throw new Error("Choose valid CSV columns.")
  }
  const mappedHeaders = headers.map(
    (_, index) =>
      PRODUCT_PRICE_IMPORT_FIELDS.find(({ key }) => columns[key] === index)?.key
  )

  if (!mappedHeaders.includes("itemCode")) {
    throw new Error("Map the required Item Code column.")
  }
  if (!mappedHeaders.includes("price")) {
    throw new Error("Map the required Price column.")
  }

  const availableFields = new Set(mappedHeaders.filter(Boolean)) as Set<
    keyof ProductPriceImportRow
  >

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
    .filter((row) => row.itemCode && row.price)

  for (const row of rows) {
    if (!Number.isFinite(Number(row.price)) || Number(row.price) < 0) {
      throw new Error(
        `Row ${row.rowNumber}: price must be a non-negative number.`
      )
    }
  }

  if (rows.length === 0) {
    throw new Error("No rows with both item code and price found.")
  }

  return {
    fileName,
    rows,
    availableFields,
  }
}
