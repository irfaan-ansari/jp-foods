import React from "react"
import { PageContent, PageHeader } from "@/components/page-content"
import { ProductForm } from "@/features/org/product/forms/product-form"

const ProductPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Create Product" />
      <PageContent>
        <ProductForm />
      </PageContent>
    </React.Fragment>
  )
}

export default ProductPage
