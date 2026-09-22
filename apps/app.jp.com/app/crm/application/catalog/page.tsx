import React from "react"
import { FilterTab } from "@/components/filter-tabs"
import { SearchQueryParam } from "@jp/ui/components/jp"
import { PageContent, PageHeader } from "@/components/page-content"
import { STATUS } from "@/features/crm/catalog/catalog.const"
import { CatalogInquiryClient } from "@/features/crm/catalog/components/catalog-inquiry-client"

const options = Object.values(STATUS)

const CustomerInvites = () => {
  return (
    <React.Fragment>
      <PageHeader title="Catalog Inquiries" />

      <PageContent className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterTab path="/crm/catalog-inquiries/count" tabs={options} />
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search catalog inquiries..."
          />
        </div>
        <CatalogInquiryClient />
      </PageContent>
    </React.Fragment>
  )
}

export default CustomerInvites
