"use client"

import { useMemo } from "react"
import { authClient } from "@jp/auth/client"
import { DataTable } from "@jp/ui/components/data-table"
import { useOrders } from "../order.data"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { getOrderColumns } from "./order-columns"

export const OrderClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const { data: session } = authClient.useSession()
  const orders = useOrders(searchParamsObj)

  const orderColumns = useMemo(
    () => getOrderColumns(session?.user?.id),
    [session?.user?.id]
  )

  return (
    <DataTable
      columns={orderColumns}
      data={orders.data?.data ?? []}
      getRowId={(order) => String(order.id)}
      isLoading={orders.isPending}
      error={{
        isError: orders.isError,
        title: orders.error?.message,
        description: orders.error?.description,
      }}
      empty={{
        isEmpty: orders.data?.data.length === 0,
        title: "No orders found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={orders.data?.pagination}
    />
  )
}
