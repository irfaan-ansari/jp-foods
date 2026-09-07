"use client"
import React from "react"

import { useOrders } from "../order.data"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { GridWrapper } from "@/components/page-content"
import { QueryBoundary } from "@/components/query-boundry"
import { OrderCard, OrderCardSkeleton } from "./order-card"
import { EmptyState } from "@jp/ui/components/jp/empty-state"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { Pagination } from "@jp/ui/components/jp"

export const OrderClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const orders = useOrders(searchParamsObj)

  return (
    <QueryBoundary
      query={orders}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
      empty={
        <EmptyState
          title="No order found"
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
