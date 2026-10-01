export type OrderItemInput = {
  id: string
  lineItemId?: number | undefined
  productId: number
  itemCode: string
  title: string
  isTaxable: boolean
  image: string
  categories: string[]
  quantity: number
  price: number
  uom: string
  unitName: string
  unitLabel: string
  minOrderQty: number
  qtyPerUnit: number
  orderIncrement: number
  catchWeight: boolean
  calculatedPrice: number
}

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
