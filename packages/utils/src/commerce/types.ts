export type SplitUnit = {
  name: string
  displayLabel?: string
  sellUnitPrice: number | string // premium price of the whole sell unit
  unitConversion: number | string // how many split units one sell unit breaks into
}

export type ProductInput = {
  price: number | string | null
  packSize: number | string | null
  sellUOM: string | null
  stockUOM: string | null
  displayLabel: string | null
  pricingBasis: string | null
  splitUnits: SplitUnit[] | []
}

export type SellUnit = {
  name: string
  displayLabel: string
  price: number // the rate shown: per sell unit (fixed) or per stock UOM, e.g. 2.5 / lb
  packSize: number
  isDefault: boolean
}

export type PricedSellingUnit = SellUnit

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
  packSize: number
  isTaxable: boolean
  taxRate?: number
  pricingBasis: string
}
