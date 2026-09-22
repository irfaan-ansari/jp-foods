import React from "react"
import { PageContent, PageHeader } from "@/components/page-content"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"
import { CandidateApplicationClient } from "@/features/crm/candidate/components/candidate-client"

const EmployeesPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Employees" />

      <PageContent className="space-y-6">
        <div className="flex justify-end">
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search employees..."
          />
        </div>
        <CandidateApplicationClient status="hired" />
      </PageContent>
    </React.Fragment>
  )
}

export default EmployeesPage
