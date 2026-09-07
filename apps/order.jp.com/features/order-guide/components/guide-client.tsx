"use client"

import React from "react"
import { QueryBoundary } from "@/components/query-boundry"
import { GuideBoard } from "./guide-board"
import { GridWrapper } from "@/components/page-content"
import { EmptyState } from "@jp/ui/components/jp"
import { useInfiniteGuides } from "../guide.data"
import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"
import { ProductCardSkeleton } from "@/features/product/components"

export const GuidesClient = () => {
  const layout = useOrderFormUI((state) => state.layout)
  const query = useInfiniteGuides()

  return (
    <QueryBoundary
      query={query}
      loading={
        <GridWrapper
          data-layout={layout}
          className="group/wrapper grid-cols-2 gap-2 data-[layout=list]:flex data-[layout=list]:flex-col data-[layout=list]:gap-2 @md/page-content:grid-cols-2 @lg/page-content:grid-cols-3 @lg/page-content:gap-4 @2xl/page-content:grid-cols-4 @5xl/page-content:grid-cols-5 @6xl/page-content:grid-cols-5 @7xl/page-content:grid-cols-8"
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.pages.flat().length === 0}
      empty={
        <EmptyState
          title="No guides found"
          description="Try adjusting your filter."
        />
      }
    >
      {(data) =>
        data.pages
          .flatMap((page) => page.data)
          .map((guide) => <GuideBoard key={guide.id} data={guide} />)
      }
    </QueryBoundary>
  )
}
