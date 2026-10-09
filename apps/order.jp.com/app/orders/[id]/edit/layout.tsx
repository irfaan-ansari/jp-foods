"use client"

import React from "react"
import { useParams } from "next/navigation"

import {
  Cart,
  OrderPageHeader,
  StickyCartAction,
} from "@/features/order-form/components"
import { useOrderFormStore } from "@/features/order-form/order-form.store"
import { Button } from "@jp/ui/components/button"
import { useOrder } from "@/features/order/order.data"
import { BagCheck, BagCross } from "@solar-icons/react"
import { PageContent } from "@/components/page-content"
import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"
import { OrderFormToolbar } from "@/features/order-form/components/order-form-toolbar"
import { ErrorState } from "@jp/ui/components/jp"
import { useOrderForm } from "@/features/order-form/order-form.hook"
import { format } from "@jp/utils/date"

const NewOrderLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams()

  const { data, isPending, isError, error } = useOrder(params.id as string)
  const items = useOrderFormStore((state) => state.order.items)

  const cartOrderId = useOrderFormStore((state) => state.order.id)

  const setCartOpen = useOrderFormUI((state) => state.setCartOpen)
  const { init, ready } = useOrderForm()
  const initializedRef = React.useRef(false)

  React.useEffect(() => {
    if (initializedRef.current) return

    if (!ready || isPending || isError || !data?.data) return
    const { lineItems, ...order } = data.data
    init({
      id: order.id,
      taxRule: {
        name: order.taxName ?? "",
        rate: Number(order.taxRate ?? 0),
      },
      charges: {
        type: order.charges?.type ?? "",
        amount: Number(order.charges?.amount ?? 0),
      },
      po: order.po ?? "",
      deliveryDate: format(order.deliveryDate!, "yyyy-MM-dd"),
      deliveryWindow: order.deliveryWindow ?? "",
      deliveryInstruction: order.deliveryInstruction ?? "",
      items: lineItems.map((item) => ({
        id: `${item.productId}:${item.unit}`,
        lineItemId: item.id,
        productId: item.productId,
        title: item.title ?? "",
        itemCode: item.itemCode ?? "",
        type: item.type ?? "",
        location: item.location ?? "",
        isTaxable: !!item.isTaxable,
        image: item.image ?? "",
        categories: item.categories ?? [],
        quantity: item.quantity,
        price: Number(item.price),
        pricingBasis: item.pricingBasis,
        stockUOM: item.stockUOM ?? "",
        unit: item.unit,
        displayLabel: item.displayLabel ?? item.unit,
        packSize: Number(item.packSize),
        unitQuantity: Number(item.unitQuantity),
        catchWeight: !!item.catchWeight,
        subtotal: Number(item.subtotal),
        taxAmount: Number(item.taxAmount),
        total: Number(item.total),
      })),
      lineItemCount: Number(order.lineItemCount),
      lineItemQuantity: Number(order.lineItemQuantity),
      subtotal: Number(order.subtotal),
      total: Number(order.total),
    })
    initializedRef.current = true
  }, [init, ready, data, isError, isPending])

  const formReady = ready && String(cartOrderId) === String(params.id)

  return (
    <React.Fragment>
      <OrderPageHeader>
        <Button
          disabled={!formReady || isError}
          onClick={() => setCartOpen(true)}
        >
          {items.length > 0 ? <BagCheck /> : <BagCross />}
          View Cart ({items.length})
        </Button>
      </OrderPageHeader>
      <PageContent
        className="space-y-6"
        loading={!isError && (isPending || !formReady)}
      >
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <>
            <OrderFormToolbar />
            {children}
          </>
        )}
      </PageContent>
      {formReady && !isPending && !isError && (
        <>
          <Cart />
          <StickyCartAction />
        </>
      )}
    </React.Fragment>
  )
}

export default NewOrderLayout
