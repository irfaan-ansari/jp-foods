"use client"
import React from "react"
import { useParams } from "next/navigation"
import { ErrorState } from "@jp/ui/components/jp"
import { useOrder } from "@/features/order/order.data"
import { StatusBadge } from "@/components/status-badge"
import { PageContent, PageHeader } from "@/components/page-content"
import { OrderDropdown } from "@/features/order/components/order-dropdown"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { OrderDetail } from "@/features/order/components/order-detail"

const OrderPage = () => {
  const { id } = useParams<{ id: string }>()
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString()

  const { isPending, data, isError, error } = useOrder(id)

  return (
    <React.Fragment>
      <PageHeader
        title={`#${id}`}
        loading={isPending}
        backUrl={`/orders${queryString}`}
      >
        <StatusBadge status={data?.data?.status || ""} />
        {data?.data && <OrderDropdown data={data.data} />}
      </PageHeader>
      <PageContent loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <OrderDetail data={data?.data!} />
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default OrderPage
