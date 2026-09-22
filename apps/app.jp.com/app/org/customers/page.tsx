"use client"
import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { PageContent, PageHeader } from "@/components/page-content"
import { FilterTab } from "@/components/filter-tabs"
import { TeamClient } from "@/features/org/team/components/team-client"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"
import Link from "next/link"
import { STATUS } from "@/features/org/team/team.const"

const CustomersPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Customers">
        <Button asChild>
          <Link href="/org/customers/new">
            <Plus />
            New Customer
          </Link>
        </Button>
      </PageHeader>

      <PageContent className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterTab tabs={Object.values(STATUS)} path="/org/teams/count" />
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search customers..."
          />
        </div>
        <TeamClient />
      </PageContent>
    </React.Fragment>
  )
}

export default CustomersPage
