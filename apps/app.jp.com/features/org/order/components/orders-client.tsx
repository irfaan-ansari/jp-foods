"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { Button } from "@jp/ui/components/button"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { X } from "lucide-react"
import { useOrders } from "@/features/org/order/order.data"
import { orderColumns } from "./orders-columns"

export const OrdersClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const orders = useOrders(searchParamsObj)
  const customer = searchParamsObj.customer
  const user = searchParamsObj.user

  return (
    <div className="space-y-3">
      {(customer || user) && (
        <div className="flex flex-wrap items-center gap-2">
          {customer && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                queryParams({
                  del: "customer",
                  set: { page: "1" },
                  scroll: false,
                })
              }
            >
              Customer:{" "}
              {orders.data?.data.find((order) => order.team.id === customer)
                ?.team.name ?? customer}
              <X className="size-3.5" />
            </Button>
          )}
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                queryParams({ del: "user", set: { page: "1" }, scroll: false })
              }
            >
              Placed by:{" "}
              {orders.data?.data.find((order) => order.user?.id === user)?.user
                ?.name ?? user}
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      )}
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
    </div>
  )
}
