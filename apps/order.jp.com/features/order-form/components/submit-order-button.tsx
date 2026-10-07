import * as React from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createOrder, updateOrder } from "../order-form.action"
import { useOrderFormStore } from "../order-form.store"
import { useConfirm } from "@jp/ui/components/jp"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

type SubmitOrderButtonProps = {
  children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>
}

export function SubmitOrderButton({ children }: SubmitOrderButtonProps) {
  const router = useRouter()
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = React.useState(false)

  const order = useOrderFormStore((state) => state.order)
  const clearCart = useOrderFormStore((state) => state.clear)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    children.props.onClick?.(e)

    if (e.defaultPrevented) return

    setIsLoading(true)
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

    if (result.serverError || result.validationErrors || !result.data) {
      toast.error(
        result.serverError?.message ??
          "Check the products and quantities in your order."
      )
      setIsLoading(false)
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
      queryKey: ["/orders/count"],
    })

    if (order.id) {
      router.replace(`/orders/${order.id}`)
      setIsLoading(false)
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
        label: "Close",
      },
      action: {
        label: "View Order",
        action: () => router.push(`/orders/${result.data?.id}`),
      },
    })

    setIsLoading(false)
  }

  return React.cloneElement(children, {
    disabled: children.props.disabled || isLoading,
    onClick: handleClick,
    children: (
      <>
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {children.props.children}
      </>
    ),
  })
}
