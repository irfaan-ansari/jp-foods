import React from "react"
import { TeamForm } from "@/features/org/team/form/team-form"
import { PageContent, PageHeader } from "@/components/page-content"

const NewCustomerPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Create Customer" />
      <PageContent>
        <TeamForm />
      </PageContent>
    </React.Fragment>
  )
}

export default NewCustomerPage
