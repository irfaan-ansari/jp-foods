import React from "react"
import { PageContent, PageHeader } from "@/components/page-content"

const HomePage = async () => {
  await new Promise((res) => setTimeout(res, 3000))
  return (
    <React.Fragment>
      <PageHeader title="Dashboard" />
      <PageContent loading={true} />
    </React.Fragment>
  )
}

export default HomePage
