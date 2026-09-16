import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { FilterTab } from "@/components/filter-tabs"
import { SearchQueryParam } from "@jp/ui/components/jp"

import { PageContent, PageHeader } from "@/components/page-content"
import { APPLICATION_FILTER_STATUS } from "@/features/crm/candidate/candidate.const"
import { CandidateApplicationClient } from "@/features/crm/candidate/components/candidate-client"

const options = Object.values(APPLICATION_FILTER_STATUS)

const CustomerApplications = () => {
  return (
    <React.Fragment>
      <PageHeader title="Candidates">
        <Button disabled>
          <Plus /> Invite Candidate
        </Button>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="gap flex justify-between">
          <FilterTab path="/crm/candidates/count" tabs={options} />
          <SearchQueryParam />
        </div>
        <CandidateApplicationClient />
      </PageContent>
    </React.Fragment>
  )
}

export default CustomerApplications
