"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { usePromotions } from "../promotion.data"
import { promotionColumns } from "./promotion-columns"

export const PromotionClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const promotions = usePromotions(searchParamsObj)

  return (
    <DataTable
      columns={promotionColumns}
      data={promotions.data?.data ?? []}
      getRowId={(promotion) => String(promotion.id)}
      isLoading={promotions.isPending}
      error={{
        isError: promotions.isError,
        title: promotions.error?.message,
        description: promotions.error?.description,
      }}
      empty={{
        isEmpty: promotions.data?.data.length === 0,
        title: "No promotions found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={promotions.data?.pagination}
    />
  )
}
