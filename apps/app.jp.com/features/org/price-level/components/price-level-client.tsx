"use client"
import React from "react"

import { Pagination } from "@jp/ui/components/jp/pagination"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

import { GridWrapper } from "@/components/page-content"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { usePriceLevels } from "../price-level.data"
import { PriceLevelCard, PriceLevelSkeleton } from "./price-level-card"
import { QueryBoundary } from "@/components/query-boundry"

export const PriceLevelClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const priceLevels = usePriceLevels(searchParamsObj)

  return (
    <QueryBoundary
      query={priceLevels}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <PriceLevelSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
    >
      {(data) => (
        <div className="h-full flex-1 space-y-3">
          <GridWrapper>
            {data.data.map((level, i) => (
              <BlurFade
                key={level.id}
                delay={0.25 + i * 0.01}
                inView
                direction="up"
              >
                <PriceLevelCard data={level} />
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
