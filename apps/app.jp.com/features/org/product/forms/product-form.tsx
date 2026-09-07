"use client"

import { toast } from "sonner"
import React, { useState } from "react"
import { upload } from "@vercel/blob/client"

import { useAppForm } from "@/hooks/use-app-form"

import { ProductPreview } from "./product-preview"

import {
  createProduct,
  updateProduct,
} from "@/features/org/product/product.action"
import { type ProductFormSchema, productFormSchema } from "../product.schema"

import { ProductSellingOptions } from "./product-selling-options"
import { ProductInventory } from "./product-inventory"
import { ProductGeneral } from "./product-general"
import { Button } from "@jp/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { Loader2 } from "lucide-react"

import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

interface FormProps {
  data: ProductFormSchema
  id?: number
}

export const ProductForm = ({ data, id }: FormProps) => {
  const [file, setFile] = useState<File | null>(null)

  const { router } = useRouterStuff()
  const form = useAppForm({
    defaultValues: data,
    validators: {
      onChange: productFormSchema,
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...")

      // upload image
      if (file && file instanceof File) {
        toast.loading("Uploading image...", { id: toastId })
        const blob = await upload(`products/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        })

        if (blob.url) value.image = blob.url
      }

      toast.loading("Saving product...", { id: toastId })

      if (id) {
        const { serverError } = await updateProduct({
          id,
          data: value,
        })
        if (serverError) {
          toast.error(serverError.message, { id: toastId })
        } else {
          toast.success("Product saved...", { id: toastId })
          form.reset()
        }
      } else {
        const { serverError, data: response } = await createProduct({
          data: value,
        })
        if (serverError) {
          toast.error(serverError.message, { id: toastId })
        } else {
          toast.success("Product saved...", { id: toastId })
          router.push(`/products/${response?.id}`)
        }
      }
    },
  })
  console.log(form.state)
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* general */}
          <ProductGeneral form={form} />
          {/* inventory  */}
          <ProductInventory form={form} />
          {/* pricing */}
          <ProductSellingOptions form={form} />
        </div>
        <div className="col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* preview */}
            <ProductPreview form={form} setFile={setFile} />
            {/* analytics */}
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>Chart data here for last 2-3 moths</CardContent>
            </Card>
          </div>
        </div>
      </div>

      <form.Subscribe
        selector={(state) => ({
          title: state.values.title,
          isSubmitting: state.isSubmitting,
          isDirty: state.isDirty,
        })}
        children={({ title, isSubmitting, isDirty }) => (
          <div
            className={`sticky bottom-4 z-2 mx-auto mt-auto flex min-h-16 w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border-2 border-background bg-secondary/20 p-3 text-sm shadow-sm ring-1 ring-ring/20 backdrop-blur-2xl ${!isDirty ? "hidden" : null}`}
          >
            <div className="grid min-w-0 flex-1 gap-0.5 truncate font-medium">
              <p className="truncate text-sm font-medium">
                {title || "Product"}
              </p>
              <p className="text-xs text-muted-foreground">
                You have unsaved changes
              </p>
            </div>

            <Button
              variant="link"
              disabled={isSubmitting}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              size="lg"
              className="w-34"
              disabled={isSubmitting}
              onClick={() => {
                form.handleSubmit()
              }}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Product"
              )}
            </Button>
          </div>
        )}
      />
    </React.Fragment>
  )
}
