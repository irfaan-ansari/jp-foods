import React from "react"
import { PageContent, PageHeader } from "@/components/page-content"
import { OrganizationForm } from "@/features/org/components/organization-form"

const NewOrganizationPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="New Organization" />
      <PageContent className="mx-auto max-w-5xl space-y-6">
        <OrganizationForm
          defaultValues={{
            logo: "",
            name: "",
            phoneNumber: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zip: "",
          }}
        />
      </PageContent>
    </React.Fragment>
  )
}

export default NewOrganizationPage
