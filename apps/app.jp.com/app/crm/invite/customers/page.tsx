import React from "react"
import { Button } from "@jp/ui/components/button"
import { Plus } from "lucide-react"
import { FilterTab } from "@/components/filter-tabs"
import { SearchQueryParam } from "@jp/ui/components/jp"
import { PageContent, PageHeader } from "@/components/page-content"
import { CustomerInviteClient } from "@/features/crm/customer/components/customer-invite-client"
import { INVITE_STATUS } from "@/features/crm/customer/customer.const"

const options = Object.values(INVITE_STATUS)

const CustomerInvites = () => {
  return (
    <React.Fragment>
      <PageHeader title="Customer Invites">
        <Button>
          <Plus /> Invite Customer
        </Button>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterTab path="/crm/customers/invites/count" tabs={options} />
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search invites..."
          />
        </div>
        <CustomerInviteClient />
      </PageContent>
    </React.Fragment>
  )
}

export default CustomerInvites
