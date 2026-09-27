type TaxRule = { name: string; rate: number }
type Charges = { type: string; amount: number }

export type OrderItemInput = {
  id: string /** productId+sellingUnit.name */
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
  orderIncrement: number
  catchWeight: boolean
  calculatedPrice: number
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
