"use client"
import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { PageContent, PageHeader } from "@/components/page-content"
import { FilterTab } from "@/components/filter-tabs"
import { TeamClient } from "@/features/org/team/components/team-client"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"
import Link from "next/link"

const OPTIONS = [
  { label: "All", value: "", color: "#71717A" },
  { label: "Active", value: "active", color: "#22C55E" },
  { label: "Inactive", value: "inactive", color: "#71717A" },
  { label: "Suspended", value: "suspended", color: "#71717A" },
]

const CustomersPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Customers">
        <Button asChild>
          <Link href="/org/customers/new">
            <Plus />
            Add New
          </Link>
        </Button>
      </PageHeader>

      <PageContent className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
          <FilterTab tabs={OPTIONS} path="/org/teams/count" />
          <SearchQueryParam />
        </div>
        <TeamClient />
      </PageContent>
    </React.Fragment>
  )
}

export default CustomersPage
