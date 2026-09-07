"use client"

import React from "react"

import { BlurFade } from "@jp/ui/components/blur-fade"
import { OrderCard, OrderSkeleton } from "./order-card"
import { GridWrapper } from "@/components/page-content"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useOrders } from "@/features/org/order/order.data"
import { EmptyState, Pagination } from "@jp/ui/components/jp"
import { QueryBoundary } from "@/components/query-boundry"

export const OrdersClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const orders = useOrders(searchParamsObj)

  return (
    <QueryBoundary
      query={orders}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
      empty={
        <EmptyState
          title="No orders found"
          description="Try adjusting your filter."
        />
      }
    >
      {(data) => (
        <div className="h-full flex-1 space-y-3">
          <GridWrapper>
            {data.data.map((order, i) => (
              <BlurFade
                key={order.id}
                delay={0.25 + i * 0.01}
                inView
                direction="up"
              >
                <OrderCard data={order} />
              </BlurFade>
            ))}
          </GridWrapper>

          <Pagination
            page={data.pagination.page}
            total={data.pagination.total}
            totalPages={data.pagination.totalPages}
            limit={data.pagination.limit}
            onPageChange={(page) =>
              queryParams({ set: { page: page.toString() } })
            }
          />
        </div>
      )}
    </QueryBoundary>
  )
}
