type TaxRule = { name: string; rate: number }
type Charges = { type: string; amount: number }

export type OrderItemInput = {
  id: string
  lineItemId?: number | undefined
  productId: number
  itemCode: string
  type: string
  location: string
  title: string
  isTaxable: boolean
  image: string
  categories: string[]
  quantity: number
  price: number
  pricingBasis: string
  stockUOM: string
  unit: string
  displayLabel: string
  packSize: number
}

export type OrderItem = OrderItemInput & {
  unitQuantity: number
  catchWeight: boolean
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
