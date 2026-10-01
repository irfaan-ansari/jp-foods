export type SellingUnitPriceInput = {
  name: string
  displayLabel?: string
  price: string | number
  qtyPerUnit: string | number
  minOrderQty: string | number
  orderIncrement: string | number
  isDefault: boolean
}

export type PriceLevel = {
  status: string
  appliesTo: string
  adjustmentType: string
  adjustmentValue: string | number | null
  priceLevelItem: { productId: number; adjustmentValue: string | number }[]
}

export type CalculationItem = {
  price: number
  quantity: number
  qtyPerUnit: number
  catchWeight: boolean
  isTaxable: boolean
  taxRate?: number
  actualUnitQuantity?: number
}
