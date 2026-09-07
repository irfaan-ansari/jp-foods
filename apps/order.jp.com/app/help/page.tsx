import { PageContent, PageHeader } from "@/components/page-content"
import React from "react"

const HelpPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Help & Support" />
      <PageContent loading={true}>Welcome</PageContent>
    </React.Fragment>
  )
}

export default HelpPage
