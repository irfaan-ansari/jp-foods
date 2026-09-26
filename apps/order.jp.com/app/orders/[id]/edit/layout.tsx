"use client"

import React from "react"
import { useParams } from "next/navigation"

import {
  Cart,
  OrderPageHeader,
  StickyCartAction,
} from "@/features/order-form/components"
import {
  initOrderForm,
  useOrderFormStore,
} from "@/features/order-form/order-form.store"
import { Button } from "@jp/ui/components/button"
import { useOrder } from "@/features/order/order.data"
import { BagCheck, BagCross } from "@solar-icons/react"
import { PageContent } from "@/components/page-content"
import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"
import { OrderFormToolbar } from "@/features/order-form/components/order-form-toolbar"
import { withCalculatedPrices } from "@jp/utils/commerce"

const NewOrderLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams()

  const { data: order, isPending } = useOrder(params.id as string)
  const items = useOrderFormStore((state) => state.order.items)
  const setCartOpen = useOrderFormUI((state) => state.setCartOpen)

  const initializedRef = React.useRef(false)

  React.useEffect(() => {
    if (initializedRef.current) return

    if (isPending || !order?.data) return
    const data = order?.data

    initOrderForm(undefined, {
      id: data.id,
      taxRule: {
        name: data.taxName ?? "",
        rate: Number(data.taxRate ?? 0),
      },
      charges: {
        type: data.charges?.type ?? "",
        amount: Number(data.charges?.amount),
      },
      lineItemCount: Number(data.lineItemCount),
      lineItemQuantity: Number(data.lineItemQuantity),
      subtotal: Number(data.subtotal),
      total: Number(data.total),
      items: data.lineItems.map((item) => {
        const sellingUnits = item.product
          ? withCalculatedPrices(
              item.product.sellingUnits ?? [],
              !!item.product.catchWeight
            )
          : []
        const unit = sellingUnits.find((unit) => unit.name === item.unitName)
        const quantity = Number(item.quantity)
        const inputOrder = {
          id: item.productId,
          title: item.title,
          itemCode: item.itemCode,
          price: Number(item.price),
          unitName: item.unitName ?? unit?.name ?? "",
          baseQuantity: Number(unit?.contains ?? item.baseQuantity ?? 1),
          unitConversion: Number(unit?.contains ?? item.baseQuantity ?? 1),
          minQuantity: Number(unit?.min ?? 1),
          orderIncrement: Number(unit?.increament ?? 1),
          sellingUnits,
          pricing: {
            label: unit?.label ?? item.unitName ?? "",
            uom: item.product?.uom ?? "",
            catchWeight: !!unit?.catchWeight,
            contains: Number(unit?.contains ?? item.baseQuantity ?? 1),
            price: Number(unit?.price ?? item.price),
            calculatedPrice: Number(unit?.calculatedPrice ?? item.price),
            min: Number(unit?.min ?? 1),
            increament: Number(unit?.increament ?? 1),
          },
          quantity,
          isTaxable: !!item.isTaxable,
          image: item.image ?? "",
          categories: item.categories ?? [],
        }
        return {
          ...inputOrder,
          subtotal: Number(item.subtotal),
          taxAmount: Number(item.taxAmount),
          total: Number(item.total),
        }
      }),
    })

    initializedRef.current = true
  }, [order, isPending])

  return (
    <React.Fragment>
      <OrderPageHeader>
        <Button onClick={() => setCartOpen(true)}>
          {items.length > 0 ? <BagCheck /> : <BagCross />}
          View Cart ({items.length})
        </Button>
      </OrderPageHeader>
      <PageContent className="space-y-6" loading={isPending}>
        <OrderFormToolbar />
        {children}
      </PageContent>
      {!isPending && (
        <>
          <Cart />
          <StickyCartAction />
        </>
      )}
    </React.Fragment>
  )
}

export default NewOrderLayout
