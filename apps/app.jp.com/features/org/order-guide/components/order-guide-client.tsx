"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useOrderGuides } from "../order-guide.data"
import { orderGuideColumns } from "./order-guide-columns"

export const OrderGuideClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const orderGuides = useOrderGuides(searchParamsObj)

  return (
    <DataTable
      columns={orderGuideColumns}
      data={orderGuides.data?.data ?? []}
      getRowId={(guide) => String(guide.id)}
      isLoading={orderGuides.isPending}
      error={{
        isError: orderGuides.isError,
        title: orderGuides.error?.message,
        description: orderGuides.error?.description,
      }}
      empty={{
        isEmpty: orderGuides.data?.data.length === 0,
        title: "No order guides found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={orderGuides.data?.pagination}
    />
  )
}
