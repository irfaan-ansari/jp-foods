"use client"
import React from "react"

import { Pagination } from "@jp/ui/components/jp/pagination"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { GridWrapper } from "@/components/page-content"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { useOrderGuides } from "../order-guide.data"
import { OrderGuideCard, OrderGuideSkeleton } from "./order-guide-card"
import { QueryBoundary } from "@/components/query-boundry"

export const OrderGuideClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const orderGuides = useOrderGuides(searchParamsObj)

  return (
    <QueryBoundary
      query={orderGuides}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <OrderGuideSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
    >
      {(data) => (
        <div className="h-full flex-1 space-y-3">
          <GridWrapper>
            {data.data.map((guide, i) => (
              <BlurFade
                key={guide.id}
                delay={0.25 + i * 0.01}
                inView
                direction="up"
              >
                <OrderGuideCard data={guide} />
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
