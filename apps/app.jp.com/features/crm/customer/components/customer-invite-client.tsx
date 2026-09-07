"use client"

import React from "react"

import { BlurFade } from "@jp/ui/components/blur-fade"

import { GridWrapper } from "@/components/page-content"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { EmptyState, Pagination } from "@jp/ui/components/jp"
import { QueryBoundary } from "@/components/query-boundry"

import { useCustomerInvites } from "../customer.data"
import {
  CustomerInviteCard,
  CustomerInviteCardSkeleton,
} from "./customer-invite-card"

export const CustomerInviteClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const query = useCustomerInvites(searchParamsObj)

  return (
    <QueryBoundary
      query={query}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <CustomerInviteCardSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
      empty={
        <EmptyState
          title="No invite found"
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
                <CustomerInviteCard data={order} />
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
