import React from "react"

import { PageContent, PageHeader } from "@/components/page-content"
import { ProductFormV2 } from "@/features/org/product/form-v2/product-form-v2"

const ProductPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Create Product" />
      <PageContent>
        <ProductFormV2 />
      </PageContent>
    </React.Fragment>
  )
}

export default ProductPage
