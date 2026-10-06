import Link from "next/link"
import { formatDate, formatUSD, pluralize } from "@jp/utils"
import { Skeleton } from "@jp/ui/components/skeleton"
import { OrderStatusBadge } from "@/features/org/order/components/order-card"
import type { Order } from "../../order/order.type"

export function RecentOrders({
  orders,
  loading,
  error,
}: {
  orders: Order[]
  loading: boolean
  error: boolean
}) {
  if (loading)
    return (
      <div
        role="status"
        aria-label="Loading recent orders"
        className="space-y-3 p-4"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  if (error)
    return (
      <p role="alert" className="p-4 text-sm text-destructive">
        Unable to load orders. Use Refresh to retry.
      </p>
    )
  if (!orders.length)
    return (
      <p className="p-4 text-sm text-muted-foreground">No recent orders.</p>
    )
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id} className="not-last:border-b">
          <Link
            href={`/org/orders/${order.id}`}
            className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-sm font-medium">
                #{order.id} <OrderStatusBadge status={order.status} />
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(order.createdAt)} •
                {order.team?.name ?? "Deleted customer"}
              </p>
            </div>
            <div className="shrink-0 space-y-1 text-right">
              <p className="text-sm font-semibold">{formatUSD(order.total)}</p>
              <p className="text-xs text-muted-foreground">
                {pluralize(order.lineItemCount, `${order.lineItemCount} item`)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
