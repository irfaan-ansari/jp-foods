import React from "react"
import { PageContent, PageHeader } from "@/components/page-content"
import { ProductForm } from "@/features/org/product/forms/product-form"
import { ProductFormSchema } from "@/features/org/product/product.schema"

const ProductPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Create Product" />
      <PageContent>
        <ProductForm
          data={{
            title: "",
            itemCode: "",
            description: "",
            isTaxable: false,
            categories: [],
            status: "active",
            type: "",
            trackInventory: true,
            stock: "",
            allowBackorder: false,
            image: "",
            sellUnits: [
              { unit: "case", isBaseUnit: true },
            ] as ProductFormSchema["sellUnits"],
          }}
        />
      </PageContent>
    </React.Fragment>
  )
}

export default ProductPage
