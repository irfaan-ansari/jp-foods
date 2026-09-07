"use client"
import React from "react"

import { Pagination } from "@jp/ui/components/jp/pagination"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

import { GridWrapper } from "@/components/page-content"
import { BlurFade } from "@jp/ui/components/blur-fade"

import { TaxRuleCard, TaxRuleSkeleton } from "./tax-rule-card"
import { useTaxRules } from "../tax-rule.data"
import { QueryBoundary } from "@/components/query-boundry"

export const TaxRuleClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const taxRules = useTaxRules(searchParamsObj)

  return (
    <QueryBoundary
      query={taxRules}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <TaxRuleSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
    >
      {(data) => (
        <div className="h-full flex-1 space-y-3">
          <GridWrapper>
            {data.data.map((taxRule, i) => (
              <BlurFade
                key={taxRule.id}
                delay={0.25 + i * 0.01}
                inView
                direction="up"
              >
                <TaxRuleCard data={taxRule} />
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
