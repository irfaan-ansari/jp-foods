"use client"
import React from "react"
import { useParams } from "next/navigation"
import { ErrorState } from "@jp/ui/components/jp"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { PageContent, PageHeader } from "@/components/page-content"
import { useProduct } from "@/features/org/product/product.data"
import { ProductForm } from "@/features/org/product/forms/product-form"
import { ProductFormSchema } from "@/features/org/product/product.schema"
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

  return (
    <React.Fragment>
      <PageHeader
        title={data?.title + " You have unsaved changes"}
        backUrl={`/org/products?${searchParams}`}
        loading={isPending}
      ></PageHeader>
      <PageContent loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <ProductForm
            id={data?.id}
            data={{
              sellUnits: data?.sellUnits?.map((unit) => ({
                id: unit.id,
                isBaseUnit: unit.isBaseUnit,
                name: unit.name,
                price: unit.price,
                minQuantity: unit.minQuantity,
                inventoryPerUnit: unit.inventoryPerUnit,
                orderIncreament: unit.orderIncreament,
              })),
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
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default ProductPage
