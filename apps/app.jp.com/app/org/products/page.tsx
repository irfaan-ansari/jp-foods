"use client"
import React from "react"
import { Plus, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@jp/ui/components/button"
import { FilterTab } from "@/components/filter-tabs"
import { DocumentText, FileDownload, Import, Sort } from "@solar-icons/react"
import { PageContent, PageHeader } from "@/components/page-content"

import { ProductsClient } from "@/features/org/product/components/products-client"
import { CategorySelector } from "@/features/org/product/components/category-selector"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"
import { STATUS } from "@/features/org/product/product.const"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { ProductPriceListDialog } from "@/features/org/product/components/product-price-dialog"

const ProductsPage = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()

  return (
    <React.Fragment>
      <PageHeader title="Products">
        <OrgAccess permission={{ product: ["update"] }}>
          {(disabled) => (
            <ProductPriceListDialog>
              <Button variant="outline" disabled={disabled}>
                <Import />
                Import CSV
              </Button>
            </ProductPriceListDialog>
          )}
        </OrgAccess>
        <OrgAccess permission={{ product: ["read"] }}>
          {(disabled) => (
            <ProductPriceListDialog>
              <Button
                variant="outline"
                className="text-primary"
                disabled={disabled}
              >
                <DocumentText />
                Price List
              </Button>
            </ProductPriceListDialog>
          )}
        </OrgAccess>
        <OrgAccess permission={{ product: ["create"] }}>
          {(disabled) => (
            <Button disabled={disabled} asChild>
              <Link href="/org/products/new">
                <Plus />
                Add New
              </Link>
            </Button>
          )}
        </OrgAccess>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="flex gap-4">
          <FilterTab tabs={Object.values(STATUS)} path="/org/products/count" />
          <CategorySelector
            selected={searchParamsObj.cat || ""}
            onSelect={(cat) => queryParams({ set: { cat } })}
          >
            <Button variant="outline" className="ml-auto">
              <Sort />
              {searchParamsObj.cat ?? (
                <span className="text-muted-foreground">All Categories</span>
              )}
              {searchParamsObj.cat && (
                <span
                  className="inline-flex size-6 items-center justify-center rounded-full bg-secondary hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    queryParams({ set: { cat: "" } })
                  }}
                >
                  <X className="size-3.5" />
                </span>
              )}
            </Button>
          </CategorySelector>
          <SearchQueryParam />
        </div>
        <ProductsClient />
      </PageContent>
    </React.Fragment>
  )
}

export default ProductsPage
