import React from "react"

import { PageHeader, PageContent } from "@/components/page-content"

import { ChangePasswordForm } from "@/features/profile/forms/change-password-form"

const SecurityPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Security" />
      <PageContent className="mx-auto max-w-5xl space-y-6">
        <ChangePasswordForm />
      </PageContent>
    </React.Fragment>
  )
}

export default SecurityPage
