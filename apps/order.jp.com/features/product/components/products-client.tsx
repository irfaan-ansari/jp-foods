"use client"

import React from "react"
import { QueryBoundary } from "@/components/query-boundry"
import { ProductCard, ProductCardSkeleton } from "./product-card"
import { GridWrapper } from "@/components/page-content"
import { EmptyState, LoadMore } from "@jp/ui/components/jp"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { useInfiniteProducts } from "../product.data"
import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"

export const ProductsClient = () => {
  const layout = useOrderFormUI((state) => state.layout)
  const filters = useOrderFormUI((state) => state.filters)
  const query = useInfiniteProducts(filters)

  return (
    <QueryBoundary
      query={query}
      loading={
        <GridWrapper
          data-layout={layout}
          className="group/wrapper grid-cols-2 gap-2 data-[layout=list]:flex data-[layout=list]:flex-col data-[layout=list]:gap-2 @md/page-content:grid-cols-2 @lg/page-content:grid-cols-3 @lg/page-content:gap-4 @2xl/page-content:grid-cols-4 @5xl/page-content:grid-cols-5 @7xl/page-content:grid-cols-8"
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.pages.flat().length === 0}
      empty={
        <EmptyState
          title="No products found"
          description="Try adjusting your filter."
        />
      }
    >
      {(data) => (
        <div>
          <GridWrapper
            data-layout={layout}
            className="grid-cols-2 gap-2 data-[layout=list]:flex data-[layout=list]:flex-col data-[layout=list]:gap-2 @md/page-content:grid-cols-2 @lg/page-content:grid-cols-3 @lg/page-content:gap-4 @2xl/page-content:grid-cols-4 @5xl/page-content:grid-cols-5 @7xl/page-content:grid-cols-8"
          >
            {data.pages
              .flatMap((page) => page.data)
              .map((product, i) => (
                <BlurFade
                  key={product.id}
                  delay={0.25 + i * 0.005}
                  inView
                  direction="up"
                >
                  <ProductCard data={product} />
                </BlurFade>
              ))}
          </GridWrapper>

          <LoadMore
            hasMore={query.hasNextPage}
            loading={query.isFetchingNextPage}
            onLoadMore={query.fetchNextPage}
          />
        </div>
      )}
    </QueryBoundary>
  )
}
