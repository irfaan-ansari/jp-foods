"use client"

import React, { useState } from "react"
import { Loader2 } from "lucide-react"

import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"

import {
  productFormV2Schema,
  productFormV2Values,
  type ProductFormV2Schema,
} from "./product-form-v2.schema"
import { ProductGeneralV2 } from "./product-general-v2"
import { ProductInventoryV2 } from "./product-inventory-v2"
import { ProductPreviewV2 } from "./product-preview-v2"
import { ProductSellingUnitsV2 } from "./product-selling-units-v2"

interface FormProps {
  data?: ProductFormV2Schema
}

export const ProductFormV2 = ({ data }: FormProps) => {
  const [, setFile] = useState<File | null>(null)

  const form = useAppForm({
    defaultValues: data ?? productFormV2Values,
    validators: {
      onChange: productFormV2Schema,
    },
    onSubmit: async () => {},
  })

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProductGeneralV2 form={form} />
          <ProductInventoryV2 form={form} />
          <ProductSellingUnitsV2 form={form} />
        </div>
        <div className="col-span-1">
          <div className="sticky top-20 space-y-6">
            <ProductPreviewV2 form={form} setFile={setFile} />
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
