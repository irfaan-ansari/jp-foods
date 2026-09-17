"use client"

import React from "react"
import { toast } from "sonner"
import { ImageUp } from "lucide-react"

import { withForm } from "@/hooks/use-app-form"
import { Badge } from "@jp/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@jp/ui/components/card"
import { FieldLabel, FieldLegend } from "@jp/ui/components/field"
import { Input } from "@jp/ui/components/input"
import { cn } from "@jp/ui/lib/utils"
import { formatUSD } from "@jp/utils"

import { ProductBadge } from "@/features/org/product/components/product-card"

import type { ProductFormV2Schema } from "./product-form-v2.schema"
import {
  calculateUnitPrices,
  getUnitPackageLabel,
  getUnitV2,
} from "./product-form-v2.utils"

export const ProductPreviewV2 = withForm({
  defaultValues: {} as ProductFormV2Schema,
  props: {} as {
    setFile: (file: File | null) => void
  },
  render: function Render({ form, setFile }) {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]

      if (!file) {
        toast.error("Upload a valid image.")
        return
      }

      setFile(file)
      form.setFieldValue("image", URL.createObjectURL(file))
    }

    return (
      <form.Subscribe
        selector={(state) => state.values}
        children={({
          title,
          image,
          categories,
          sellUnits,
          status,
          isTaxable,
        }) => {
          const unitPrices = calculateUnitPrices(sellUnits)

          return (
            <Card className="gap-0 bg-secondary py-0 shadow-xs" size="sm">
              <div className="relative aspect-video overflow-hidden rounded-t-xl">
                {image && (
                  <img
                    width={100}
                    height={100}
                    src={image!}
                    alt={title}
                    loading="eager"
                    className="absolute inset-0 size-full object-cover mix-blend-multiply transition ease-out"
                  />
                )}

                <FieldLabel
                  htmlFor="image-upload-v2"
                  className={cn(
                    "absolute inset-0 z-3 w-full flex-col justify-center rounded-t-2xl bg-secondary/80 backdrop-blur-lg transition hover:[&>svg]:-translate-y-1",
                    image ? "opacity-0 hover:opacity-100" : ""
                  )}
                >
                  <ImageUp className="size-6 text-muted-foreground transition" />
                  <FieldLegend className="text-sm! text-muted-foreground">
                    Click to upload/replace image
                  </FieldLegend>

                  <Input
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    id="image-upload-v2"
                    onChange={handleFileChange}
                  />
                </FieldLabel>

                <div className="absolute top-2 left-2 z-2 flex flex-col gap-1">
                  <ProductBadge status={status ?? "active"} />
                  {isTaxable && (
                    <Badge
                      variant="warning-light"
                      className="rounded-md backdrop-blur-lg"
                    >
                      Taxable
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="space-y-2 rounded-t-2xl border-t bg-background p-4">
                {categories.length > 0 ? (
                  <CardDescription className="text-xs font-medium uppercase">
                    {categories.join(" • ")}
                  </CardDescription>
                ) : (
                  <div className="h-4 rounded-lg bg-secondary" />
                )}

                {title ? (
                  <CardTitle className="text-sm font-semibold">
                    {title}
                  </CardTitle>
                ) : (
                  <div className="h-5 rounded-lg bg-secondary" />
                )}

                <div className="mt-4 grid gap-2">
                  {sellUnits.map((unit, index) => {
                    const unitLabel = getUnitV2(unit.name)?.label ?? unit.name
                    const containedUnitName = sellUnits[index - 1]?.name

                    return (
                      <div
                        key={`${unit.name}-${index}`}
                        className="rounded-lg border bg-secondary/40 p-3"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="font-medium">
                            {unit.isBaseUnit
                              ? unitLabel
                              : getUnitPackageLabel(unit, containedUnitName)}
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            {formatUSD(unitPrices.get(unit.name) || 0)}/
                            {unit.name}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Min {unit.minQuantity || 1}, increments of{" "}
                          {unit.orderIncreament || 1}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 flex gap-3 border-t border-dashed pt-4">
                  <span className="h-8 flex-1 rounded-lg bg-secondary" />
                </div>
              </CardContent>
            </Card>
          )
        }}
      />
    )
  },
})
