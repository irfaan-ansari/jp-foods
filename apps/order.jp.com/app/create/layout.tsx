"use client"

import React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import {
  Cart,
  OrderPageHeader,
  StickyCartAction,
  StickyGuideAction,
} from "@/features/order-form/components"
import { Button } from "@jp/ui/components/button"
import { PageContent } from "@/components/page-content"
import { BagCheck, BagCross } from "@solar-icons/react"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { Promotion } from "@/features/promotion/components/promotion"
import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"
import { useOrderFormStore } from "@/features/order-form/order-form.store"
import { OrderFormToolbar } from "@/features/order-form/components/order-form-toolbar"

const NewOrderLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useRouterStuff()
  const selecting = useOrderFormUI((state) => state.selecting)
  const setSelecting = useOrderFormUI((state) => state.setSelecting)

  const items = useOrderFormStore((state) => state.order.items)
  const setCartOpen = useOrderFormUI((state) => state.setCartOpen)

  return (
    <React.Fragment>
      <OrderPageHeader>
        <Button
          className="text-primary hover:text-primary"
          variant="outline"
          onClick={() => setSelecting(true)}
          asChild
        >
          <Link href="/create/all">
            <Plus />
            New Guide
          </Link>
        </Button>
        <Button onClick={() => setCartOpen(true)}>
          {items.length > 0 ? <BagCheck /> : <BagCross />}
          View Cart ({items.length})
        </Button>
      </OrderPageHeader>

      <PageContent className="space-y-6">
        <OrderFormToolbar />
        {children}
      </PageContent>

      <Cart />
      {!selecting && <StickyCartAction />}
      {!pathname.includes("guides") && <StickyGuideAction />}
      <Promotion placement="new-order" />
    </React.Fragment>
  )
}

export default NewOrderLayout
