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
import {
  type ProductFormSchema,
  productFormSchema,
  productFormValues,
} from "../product.schema"

import { ProductSplit } from "./product-split"
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
import ProductDeleteAlert from "../components/product-delete-alert"
import { ProductPricing } from "./product-pricing"

interface FormProps {
  data?: ProductFormSchema
  id?: number
}

export const ProductForm = ({ data, id }: FormProps) => {
  const [file, setFile] = useState<File | null>(null)

  const { router } = useRouterStuff()

  const form = useAppForm({
    defaultValues: data ?? productFormValues,
    validators: {
      onChange: productFormSchema,
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...")
      const values = { ...value }

      try {
        // upload image
        if (file && file instanceof File) {
          toast.loading("Uploading image...", { id: toastId })
          const blob = await upload(`products/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/v1/upload",
          })

          if (blob.url) values.image = blob.url
        }

        toast.loading("Saving product...", { id: toastId })

        if (id) {
          const result = await updateProduct({
            id,
            data: values,
          })
          if (
            result?.serverError ||
            result?.validationErrors ||
            !result?.data
          ) {
            toast.error(
              result?.serverError?.message ??
                "Unable to save product. Check the form values.",
              { id: toastId }
            )
          } else {
            toast.success("Product saved...", { id: toastId })
            form.reset(values)
            setFile(null)
          }
        } else {
          const result = await createProduct({
            data: values,
          })
          if (
            result?.serverError ||
            result?.validationErrors ||
            !result?.data
          ) {
            toast.error(
              result?.serverError?.message ??
                "Unable to save product. Check the form values.",
              { id: toastId }
            )
          } else {
            toast.success("Product saved...", { id: toastId })
            form.reset(values)
            setFile(null)
            router.push(`/org/products/${result.data.id}`)
          }
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to save product",
          { id: toastId }
        )
      }
    },
  })

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* general */}
          <ProductGeneral form={form} />
          {/* pricing */}
          <ProductPricing form={form} />
          {/* inventory  */}
          {/* <ProductInventory form={form} /> */}
          {/* pricing */}
          {/* <ProductSplit form={form} /> */}

          {/* delete alert */}
          {id && <ProductDeleteAlert id={id} />}
        </div>
        <div className="col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* preview */}
            <ProductPreview form={form} setFile={setFile} />
            {/* analytics */}
            {id && (
              <Card className="shadow-xs" size="sm">
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>NA</CardContent>
              </Card>
            )}
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
              onClick={() => {
                form.reset()
                setFile(null)
              }}
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
