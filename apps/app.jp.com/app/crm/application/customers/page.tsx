import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { FilterTab } from "@/components/filter-tabs"
import { SearchQueryParam } from "@jp/ui/components/jp"
import { APPLICATION_STATUS } from "@/features/crm/customer/customer.const"
import { PageContent, PageHeader } from "@/components/page-content"
import { CustomerApplicationClient } from "@/features/crm/customer/components/customer-client"

const options = Object.entries(APPLICATION_STATUS)
  .filter(([key]) => key !== "submitted")
  .map(([_, value]) => ({
    ...value,
  }))

const CustomerApplications = () => {
  return (
    <React.Fragment>
      <PageHeader title="Customers">
        <Button disabled>
          <Plus /> Invite Customer
        </Button>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="gap flex justify-between">
          <FilterTab path="/crm/customers/count" tabs={options} />
          <SearchQueryParam />
        </div>
        <CustomerApplicationClient />
      </PageContent>
    </React.Fragment>
  )
}

export default CustomerApplications
