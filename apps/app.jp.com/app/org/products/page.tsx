"use client"
import React from "react"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@jp/ui/components/button"
import { FilterTab } from "@/components/filter-tabs"
import { FileDownload, Sort, Upload } from "@solar-icons/react"
import { PageContent, PageHeader } from "@/components/page-content"

import { ProductDialog } from "@/features/org/product/components/product-dialog"
import { ProductsClient } from "@/features/org/product/components/products-client"
import { CategorySelector } from "@/features/org/product/components/category-selector"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"
import { STATUS } from "@/features/org/product/product.const"

const ProductsPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Products">
        <OrgAccess permission={{ product: ["update"] }}>
          {(disabled) => (
            <Button variant="outline" disabled={disabled}>
              <FileDownload />
              Price List
            </Button>
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
          <FilterTab
            tabs={Object.values(STATUS)}
            path="/api/v1/org/products/count"
          />
          <CategorySelector selected={""}>
            <Button variant="outline" className="ml-auto">
              <Sort />
              Categories
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
