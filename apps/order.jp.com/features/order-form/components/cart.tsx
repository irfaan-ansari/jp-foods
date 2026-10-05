import React from "react"
import Image from "next/image"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@jp/ui/components/drawer"
import { formatUSD } from "@jp/utils"
import { Button } from "@jp/ui/components/button"
import { ChevronUp, ImageOff, Minus, Plus, X } from "lucide-react"
import { useOrderFormUI } from "../order-form-ui.store"
import { useOrderFormStore } from "../order-form.store"
import { BagCheck } from "@solar-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@jp/ui/components/collapsible"

import { Input } from "@jp/ui/components/input"
import { Textarea } from "@jp/ui/components/textarea"
import { SubmitOrderButton } from "./submit-order-button"

export const Cart = () => {
  const isCartOpen = useOrderFormUI((state) => state.isCartOpen)
  const setCartOpen = useOrderFormUI((state) => state.setCartOpen)

  const cart = useOrderFormStore((state) => state.order)
  const removecartItem = useOrderFormStore((state) => state.removeItem)
  const updateCartItem = useOrderFormStore((state) => state.updateItem)
  const { items } = cart
  return (
    <Drawer direction="right" open={isCartOpen} onOpenChange={setCartOpen}>
      <DrawerContent className="gap-2 data-[vaul-drawer-direction=right]:sm:max-w-lg">
        <DrawerHeader className="flex flex-row items-center justify-start p-2">
          <BagCheck className="size-4" />
          <DrawerTitle className="font-semibold">Order Summary</DrawerTitle>
          <Button
            size="icon-xs"
            variant="secondary"
            className="ml-auto"
            onClick={() => setCartOpen(false)}
          >
            <X />
          </Button>
        </DrawerHeader>
        <div className="no-scrollbar flex-1 divide-y overflow-auto px-2">
          {items.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">
              Your cart is empty.
            </p>
          )}
          {items.map((item) => (
            <div
              className="flex items-start gap-2 not-first:pt-2 not-last:pb-2"
              key={`${item.id}:${item.unit}`}
            >
              <Avatar
                className="relative size-12! rounded-xl bg-secondary **:rounded-xl"
                size="lg"
              >
                <AvatarImage src={item.image ?? ""} asChild>
                  <Image
                    src={item.image ?? ""}
                    alt={item.title}
                    width={40}
                    height={40}
                    onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
                    className="bg-secondary opacity-0 transition"
                  />
                </AvatarImage>
                <AvatarFallback>
                  <ImageOff className="text-muted-foreground" />
                </AvatarFallback>
              </Avatar>

              <div className="grid min-w-0 flex-1 gap-0.5">
                <p className="truncate text-sm font-medium">{item.title}</p>

                <div className="flex items-center gap-3">
                  <div className="mt-1 flex max-w-28 items-center justify-between gap-1 self-center rounded-xl border p-0.5">
                    <Button
                      size="icon-xs"
                      variant="secondary"
                      className="rounded-lg bg-primary/30 hover:bg-primary/50"
                      onClick={() => {
                        if (item.quantity < 1) {
                          removecartItem(item.id)
                        } else {
                          updateCartItem({
                            ...item,
                            quantity: item.quantity - 1,
                          })
                        }
                      }}
                    >
                      <Minus />
                    </Button>
                    <span className="min-w-7 flex-2 text-center text-xs font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon-xs"
                      variant="secondary"
                      className="rounded-lg bg-primary/30 hover:bg-primary/50"
                      onClick={() =>
                        updateCartItem({
                          ...item,
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    size="xs"
                    variant="link"
                    className="px-0 text-destructive"
                    onClick={() => removecartItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid h-full min-w-0 text-right">
                <p className="text-base font-bold text-primary">
                  {formatUSD(item.subtotal)}
                </p>
                {item.quantity > 1 && (
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {item.quantity} {item.unit} @ {formatUSD(item.price)}{" "}
                    {item.pricingBasis !== "fixed" ? item.stockUOM : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
          {/* <Promotion placement="cart" /> */}
        </div>
        <DrawerFooter className="relative p-2">
          <div className="grid gap-0.5 rounded-xl border bg-neutral-100/60 p-3">
            <CartNotes />
            <div className="flex justify-between text-muted-foreground">
              <span className="flex-1">Items</span>
              <span className="font-medium">
                {cart.lineItemCount} Items
                {" · "}
                {cart.lineItemQuantity} Units
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{cart.charges.type}</span>
              <span className="font-medium">
                {formatUSD(items.length ? cart.charges.amount : 0)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span className="font-medium">{formatUSD(cart.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>
                {items.some((item) => item.catchWeight)
                  ? "Estimated total"
                  : "Total"}
              </span>
              <span>{formatUSD(cart.total)}</span>
            </div>

            <SubmitOrderButton>
              <Button className="mt-2">
                {cart.id ? "Update" : "Submit"} Order • {formatUSD(cart.total)}
              </Button>
            </SubmitOrderButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const CartNotes = () => {
  const update = useOrderFormStore((store) => store.update)
  const po = useOrderFormStore((store) => store.order.po)
  const deliveryDate = useOrderFormStore((store) => store.order.deliveryDate)

  const instructions = useOrderFormStore(
    (store) => store.order.deliveryInstruction
  )
  const window = useOrderFormStore((store) => store.order.deliveryWindow)

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full aria-expanded:bg-background aria-expanded:[&>svg]:rotate-180"
          size="xs"
          variant="outline"
        >
          Notes and Preferences
          <ChevronUp className="size-3.5!" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="grid gap-4 py-4">
        <Input
          className="bg-background"
          placeholder="PO"
          value={po}
          onChange={(e) => update({ po: e.target.value })}
        />
        <Input
          className="bg-background"
          placeholder="Delivery Date"
          type="date"
          aria-label="Delivery date"
          value={deliveryDate}
          onChange={(e) => update({ deliveryDate: e.target.value })}
        />
        <Input
          className="bg-background"
          placeholder="Delivery Window"
          value={window}
          onChange={(e) => update({ deliveryWindow: e.target.value })}
        />
        <Textarea
          className="min-h-20 bg-background"
          placeholder="Instructions..."
          value={instructions}
          onChange={(e) => update({ deliveryInstruction: e.target.value })}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}
