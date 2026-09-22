"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { usePriceLevels } from "../price-level.data"
import { priceLevelColumns } from "./price-level-columns"

export const PriceLevelClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const priceLevels = usePriceLevels(searchParamsObj)

  return (
    <DataTable
      columns={priceLevelColumns}
      data={priceLevels.data?.data ?? []}
      getRowId={(level) => String(level.id)}
      isLoading={priceLevels.isPending}
      error={{
        isError: priceLevels.isError,
        title: priceLevels.error?.message,
        description: priceLevels.error?.description,
      }}
      empty={{
        isEmpty: priceLevels.data?.data.length === 0,
        title: "No price levels found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={priceLevels.data?.pagination}
    />
  )
}
