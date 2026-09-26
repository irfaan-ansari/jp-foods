"use client"
import React from "react"
import { useParams } from "next/navigation"
import { ErrorState } from "@jp/ui/components/jp"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { PageContent, PageHeader } from "@/components/page-content"
import { useProduct } from "@/features/org/product/product.data"
import { ProductForm } from "@/features/org/product/forms/product-form"
import { Product } from "@/features/org/product/product.type"

const ProductPage = () => {
  const params = useParams()
  const { searchParams } = useRouterStuff()

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useProduct(params.id as string)

  const data = product?.data || ({} as Product)
  console.log(error)
  return (
    <React.Fragment>
      <PageHeader
        title={data?.title ?? "Product"}
        backUrl={`/org/products?${searchParams}`}
        loading={isPending}
      ></PageHeader>
      <PageContent loading={isPending} className="mx-auto max-w-7xl">
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : product?.data ? (
          <ProductForm
            key={data.id}
            id={data?.id}
            data={{
              sellingUnits: data?.sellingUnits ?? [],
              uom: data.uom ?? "lb",
              weightLb: data.weightLb ?? "",
              catchWeight: !!data.catchWeight,
              title: data.title ?? "",
              itemCode: data.itemCode ?? "",
              image: data.image ?? "",
              description: data.description ?? "",
              status: data?.status ?? "active",
              isTaxable: !!data.isTaxable,
              categories: data.categories ?? [],
              location: data.location ?? "",
              trackInventory: !!data.trackInventory,
              stock: data?.stock ?? "",
              allowBackorder: !!data.allowBackorder,
            }}
          />
        ) : null}
      </PageContent>
    </React.Fragment>
  )
}

export default ProductPage
