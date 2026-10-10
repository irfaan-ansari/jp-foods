import type { BadgeProps } from "@jp/ui/components/badge"

import type { CartGroup } from "./cart.type"

export const CART_STATUS_LABEL: Record<CartGroup["status"], string> = {
  active: "Active",
  submitting: "Submitting",
  placed: "Submitted",
}

export const CART_STATUS_ACTIVITY_LABEL: Record<CartGroup["status"], string> = {
  active: "Cart updated",
  submitting: "Submission started",
  placed: "Order created",
}

export const CART_STATUS_VARIANT: Record<
  CartGroup["status"],
  NonNullable<BadgeProps["variant"]>
> = {
  active: "info-light",
  submitting: "warning-light",
  placed: "success-light",
}
