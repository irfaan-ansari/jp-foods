import React from "react"
import { useOrderFormStore } from "../order-form.store"
import { Button } from "@jp/ui/components/button"
import { formatUSD } from "@jp/utils"
import { SubmitOrderButton } from "./submit-order-button"

export const StickyCartAction = () => {
  const cart = useOrderFormStore((state) => state.order)
  const clearCart = useOrderFormStore((state) => state.clear)

  const { items, total } = cart
  if (items.length === 0) return

  return (
    <div className="sticky bottom-4 z-2 mx-auto mt-auto flex min-h-16 w-full max-w-2xl items-center justify-between rounded-2xl border-2 border-background bg-secondary/20 p-3 text-sm text-muted-foreground shadow-sm ring-1 ring-ring/20 backdrop-blur-2xl">
      <div className="flex size-full gap-4">
        <div className="grid flex-1">
          <span className="text-xs uppercase">{items.length} Item(s)</span>
          <span className="text-base font-semibold text-primary">
            {formatUSD(total)}
          </span>
        </div>
        <Button
          variant="link"
          className="text-foreground underline"
          onClick={clearCart}
        >
          Clear cart
        </Button>
        <SubmitOrderButton>
          <Button className="min-w-32">
            {cart.id ? "Update" : "Submit"} Order
          </Button>
        </SubmitOrderButton>
      </div>
    </div>
  )
}
