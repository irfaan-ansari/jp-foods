import type { PricedSellingUnit } from "../product/product.type"

type TaxRule = { name: string; rate: number }
type Charges = { type: string; amount: number }

export type OrderItemInput = {
  id: number
  itemCode: string
  title: string
  price: number
  isTaxable: boolean
  image: string
  categories: string[]
  quantity: number
  unitName: string
  baseQuantity: number
  unitConversion: number
  minQuantity: number
  orderIncrement: number
  sellingUnits: PricedSellingUnit[]
  pricing: {
    label: string
    uom: string
    catchWeight: boolean
    contains: number
    price: number
    calculatedPrice: number
    min: number
    increament: number
  }
}

export type OrderItem = OrderItemInput & {
  subtotal: number
  taxAmount: number
  total: number
}

export interface OrderForm {
  id?: number
  teamId?: string
  charges: Charges
  taxRule: TaxRule | undefined
  po: string
  deliveryDate: string
  deliveryWindow: string
  deliveryInstruction: string
  items: OrderItem[]
  subtotal: number
  taxAmount: number
  total: number
  lineItemQuantity: number
  lineItemCount: number
  taxableSubtotal: number
  nonTaxableSubtotal: number
}

export interface OrderUIFilters {
  q: string
  cat: string
}
