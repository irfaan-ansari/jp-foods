import type { BadgeProps } from "@jp/ui/components/badge"

import type { CartGroup } from "./cart.type"

export const CART_STATUS_LABEL: Record<CartGroup["status"], string> = {
  active: "Active cart",
  checking_out: "Checking out",
  placed: "Order placed",
}

export const CART_STATUS_ACTIVITY_LABEL: Record<CartGroup["status"], string> = {
  active: "Cart updated",
  checking_out: "Checkout started",
  placed: "Order created",
}

export const CART_STATUS_VARIANT: Record<
  CartGroup["status"],
  NonNullable<BadgeProps["variant"]>
> = {
  active: "info-light",
  checking_out: "warning-light",
  placed: "success-light",
}
