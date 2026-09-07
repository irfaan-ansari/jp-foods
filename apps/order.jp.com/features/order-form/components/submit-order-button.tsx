import * as React from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createOrder, updateOrder } from "../order-form.action"
import { useOrderFormStore } from "../order-form.store"
import { useConfirm, useLoader } from "@jp/ui/components/jp"
import { useQueryClient } from "@tanstack/react-query"

type SubmitOrderButtonProps = {
  children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>
}

export function SubmitOrderButton({ children }: SubmitOrderButtonProps) {
  const router = useRouter()
  const loader = useLoader()
  const { open } = useConfirm()
  const queryClient = useQueryClient()

  const order = useOrderFormStore((state) => state.order)
  const clearCart = useOrderFormStore((state) => state.clear)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    children.props.onClick?.(e)

    if (e.defaultPrevented) return

    loader.show()

    let result = null

    if (order.id) {
      // update
      result = await updateOrder({
        id: order.id,
        data: order,
      })
    } else {
      // create
      result = await createOrder({
        data: order,
      })
    }

    if (result.serverError) {
      toast.error(result.serverError.message)
      return
    }

    // invalidate queries
    queryClient.invalidateQueries({
      queryKey: ["orders"],
    })
    queryClient.invalidateQueries({
      queryKey: ["order", String(order.id)],
    })
    queryClient.invalidateQueries({
      queryKey: ["/api/v1/team/orders/count"],
    })

    if (order.id) {
      router.replace(`/orders/${order.id}`)
      loader.hide()
      return
    }
    clearCart()
    open({
      variant: "default",
      title: order.id ? "Order Updated" : "Order Submitted",
      description: `Your order #${result.data?.id} has been ${
        order.id ? "updated" : "submitted"
      } successfully.`,
      cancel: {
        label: "Done",
      },
      action: {
        label: "View Order",
        action: () => router.push(`/orders/${result.data?.id}`),
      },
    })

    loader.hide()
  }

  return React.cloneElement(children, {
    disabled: children.props.disabled,
    onClick: handleClick,
    children: children.props.children,
  })
}
