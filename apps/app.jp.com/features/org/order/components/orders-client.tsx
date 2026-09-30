"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useOrders } from "@/features/org/order/order.data"
import { orderColumns } from "./orders-columns"

export const OrdersClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const orders = useOrders(searchParamsObj)

  return (
    <DataTable
      columns={orderColumns}
      data={orders.data?.data ?? []}
      error={{
        isError: orders.isError,
        title: orders.error?.message,
        description: orders.error?.description,
      }}
      empty={{
        isEmpty: orders.data?.data?.length === 0,
        title: "No orders found.",
      }}
      getRowId={(order) => String(order.id)}
      isLoading={orders.isPending}
      pagination={orders.data?.pagination}
    />
  )
}
