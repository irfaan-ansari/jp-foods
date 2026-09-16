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
        <div className="gap flex justify-between">
          <FilterTab path="/crm/catalog-inquiries/count" tabs={options} />
          <SearchQueryParam />
        </div>
        <CatalogInquiryClient />
      </PageContent>
    </React.Fragment>
  )
}

export default CustomerInvites
