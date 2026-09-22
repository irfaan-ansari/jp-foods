"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useCatalogInquiries } from "../catalog.data"
import { catalogColumns } from "./catalog-columns"

export const CatalogInquiryClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const inquiries = useCatalogInquiries(searchParamsObj)

  return (
    <DataTable
      columns={catalogColumns}
      data={inquiries.data?.data ?? []}
      getRowId={(item) => String(item.id)}
      isLoading={inquiries.isPending}
      error={{
        isError: inquiries.isError,
        title: inquiries.error?.message,
        description: inquiries.error?.description,
      }}
      empty={{
        isEmpty: inquiries.data?.data.length === 0,
        title: "No catalog inquiries found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={inquiries.data?.pagination}
    />
  )
}
