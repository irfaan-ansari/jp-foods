"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ErrorState } from "@jp/ui/components/jp"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

import { PageContent, PageHeader } from "@/components/page-content"
import { PromotionForm } from "@/features/org/promotion/forms/promotion-form"
import { usePromotion } from "@/features/org/promotion/promotion.data"

const PromotionPage = () => {
  const params = useParams()
  const { searchParams } = useRouterStuff()

  const {
    data: promotion,
    isPending,
    isError,
    error,
  } = usePromotion(params.id as string)

  const data = promotion?.data

  return (
    <React.Fragment>
      <PageHeader
        title={data?.name ?? "Promotion"}
        backUrl={`/org/promotions?${searchParams}`}
        loading={isPending}
      />
      <PageContent loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : data ? (
          <PromotionForm
            key={data.id}
            id={data.id}
            data={{
              name: data.name ?? "",
              media: data.media ?? "",
              status: data.status as "active" | "inactive",
              placement: data.placement,
              teams: data.teams,
              products: data.products,
              triggerProducts: data.triggerProducts,
            }}
          />
        ) : null}
      </PageContent>
    </React.Fragment>
  )
}

export default PromotionPage
