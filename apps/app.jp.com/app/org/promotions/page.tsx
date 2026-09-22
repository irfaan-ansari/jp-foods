"use client"
import React from "react"
import { Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@jp/ui/components/button"
import { SearchQueryParam } from "@jp/ui/components/jp"

import { FilterTab } from "@/components/filter-tabs"
import { PageContent, PageHeader } from "@/components/page-content"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { PromotionClient } from "@/features/org/promotion/components/promotion-client"
import { STATUS } from "@/features/org/promotion/promotion.const"

const OPTIONS = [STATUS.all!, STATUS.active!, STATUS.inactive!]

const PromotionsPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Promotions">
        <OrgAccess permission={{ promotion: ["create"] }}>
          {(disabled) => (
            <Button disabled={disabled} asChild>
              <Link href="/org/promotions/new">
                <Plus />
                Add New
              </Link>
            </Button>
          )}
        </OrgAccess>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterTab tabs={OPTIONS} path="/org/promotions/count" />
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search promotions..."
          />
        </div>
        <PromotionClient />
      </PageContent>
    </React.Fragment>
  )
}

export default PromotionsPage
