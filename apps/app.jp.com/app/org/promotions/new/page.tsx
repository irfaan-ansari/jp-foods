import React from "react"

import { PageContent, PageHeader } from "@/components/page-content"
import { PromotionForm } from "@/features/org/promotion/forms/promotion-form"

const PromotionPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Create Promotion" backUrl="/org/promotions" />
      <PageContent>
        <PromotionForm />
      </PageContent>
    </React.Fragment>
  )
}

export default PromotionPage
