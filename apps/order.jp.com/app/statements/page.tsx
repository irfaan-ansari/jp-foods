import React from "react"

import { PageContent, PageHeader } from "@/components/page-content"
import { SearchQueryParam } from "@jp/ui/components/jp"
import { StatementClient } from "@/features/statement/components/statement-client"

const StatementsPage = async () => {
  return (
    <React.Fragment>
      <PageHeader title="Statements" />
      <PageContent className="space-y-6">
        <div className="flex justify-end">
          <SearchQueryParam />
        </div>
        <StatementClient />
      </PageContent>
    </React.Fragment>
  )
}

export default StatementsPage
