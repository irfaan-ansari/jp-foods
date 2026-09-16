import React from "react"
import { PageContent, PageHeader } from "@/components/page-content"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"
import { FilterTab } from "@/components/filter-tabs"
import { CandidateApplicationClient } from "@/features/crm/candidate/components/candidate-client"

const EmployeesPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Employees" />

      <PageContent className="space-y-6">
        <div className="gap flex justify-between">
          <FilterTab
            path="/crm/candidates/count"
            tabs={[{ label: "All", value: "hired", color: "#A1A1AA" }]}
          />
          <SearchQueryParam />
        </div>
        <CandidateApplicationClient />
      </PageContent>
    </React.Fragment>
  )
}

export default EmployeesPage
