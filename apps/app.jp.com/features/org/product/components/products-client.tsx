"use client"
import React from "react"

import { Pagination } from "@jp/ui/components/jp/pagination"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { EmptyState } from "@jp/ui/components/jp/empty-state"

import { useProducts } from "@/features/org/product/product.data"
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/features/org/product/components/product-card"
import { GridWrapper } from "@/components/page-content"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { QueryBoundary } from "@/components/query-boundry"

export const ProductsClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const products = useProducts(searchParamsObj)

  return (
    <QueryBoundary
      query={products}
      loading={
        <GridWrapper className="@sm/page-content:grid-cols-2 @2xl/page-content:grid-cols-3 @5xl/page-content:grid-cols-4 @6xl/page-content:grid-cols-5 @7xl/page-content:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
      empty={
        <EmptyState
          title={"No products found"}
          description="Try adjusting your filter"
        />
      }
    >
      {(data) => (
        <div className="h-full flex-1 space-y-3">
          <GridWrapper className="@sm/page-content:grid-cols-2 @2xl/page-content:grid-cols-3 @5xl/page-content:grid-cols-4 @6xl/page-content:grid-cols-5 @7xl/page-content:grid-cols-6">
            {data.data.map((product, i) => (
              <BlurFade
                key={product.id}
                delay={0.25 + i * 0.01}
                inView
                direction="up"
              >
                <ProductCard data={product} />
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
