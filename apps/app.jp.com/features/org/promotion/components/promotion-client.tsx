"use client"

import React from "react"

import { Pagination } from "@jp/ui/components/jp/pagination"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { BlurFade } from "@jp/ui/components/blur-fade"

import { GridWrapper } from "@/components/page-content"
import { QueryBoundary } from "@/components/query-boundry"
import { usePromotions } from "../promotion.data"
import { PromotionCard, PromotionSkeleton } from "./promotion-card"

export const PromotionClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const promotions = usePromotions(searchParamsObj)

  return (
    <QueryBoundary
      query={promotions}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <PromotionSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
    >
      {(data) => (
        <div className="h-full flex-1 space-y-3">
          <GridWrapper>
            {data.data.map((promotion, i) => (
              <BlurFade
                key={promotion.id}
                delay={0.25 + i * 0.01}
                inView
                direction="up"
              >
                <PromotionCard data={promotion} />
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
