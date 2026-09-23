import { toast } from "sonner"
import { useEffect, useRef } from "react"
import { formatUSD } from "@jp/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@jp/ui/components/card"
import { cn } from "@jp/ui/lib/utils"
import { ImageUp } from "lucide-react"
import { withForm } from "@/hooks/use-app-form"
import { Input } from "@jp/ui/components/input"
import { ProductFormSchema } from "../product.schema"
import { FieldLabel, FieldLegend } from "@jp/ui/components/field"
import { ProductPrice } from "../components/product-price"
import { ProductBadge } from "../components/product-card"
import { Badge } from "@jp/ui/components/badge"
import { getUnit } from "../product.utils"
import { Skeleton } from "@jp/ui/components/skeleton"

const toNumber = (value: string | undefined) =>
  value?.trim() && Number.isFinite(Number(value)) ? Number(value) : 0

export const ProductPreview = withForm({
  defaultValues: {} as ProductFormSchema,
  props: {} as {
    setFile: (file: File | null) => void
  },
  render: function Render({ form, setFile }) {
    const previewUrl = useRef<string | null>(null)
    useEffect(
      () => () => {
        if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
      },
      []
    )

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith("image/")) {
        toast.error("Upload a valid image.")
        return
      }
      setFile(file)
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
      const url = URL.createObjectURL(file)
      previewUrl.current = url
      form.setFieldValue("image", url)
      e.target.value = ""
    }

    return (
      <form.Subscribe
        selector={(state) => state.values}
        children={({
          title,
          image,
          price,
          uom,
          sellUnit,
          unitSize,
          enableSplit,
          categories,
          sellUnits,
          status,
          isTaxable,
        }) => (
          <Card className="gap-0 bg-secondary py-0 shadow-xs" size="sm">
            <div className="relative aspect-video overflow-hidden rounded-t-xl">
              {/* product image */}
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

              {/* upload image */}
              <FieldLabel
                htmlFor="image-upload"
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
                  id="image-upload"
                  onChange={handleFileChange}
                />
              </FieldLabel>

              {/* badge */}
              <div className="absolute top-2 left-2 z-10 grid gap-1">
                <ProductBadge status={status ?? "active"} />
                {isTaxable && (
                  <Badge
                    variant="warning-light"
                    className="h-6 rounded-md backdrop-blur-lg"
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
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              ) : (
                <div className="h-5 rounded-lg bg-secondary" />
              )}

              <div className="mt-4 space-y-3 border-t border-dashed pt-4">
                <div className="flex items-start justify-between gap-2 rounded-xl border bg-secondary p-3 text-sm font-medium">
                  <div className="grid min-w-0 flex-1">
                    <span>{getUnit(sellUnit)?.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {`${unitSize || "—"} ${uom} per ${sellUnit}`}
                    </span>
                  </div>

                  <span className="text-base font-bold text-primary">
                    {formatUSD(price ?? 0)}
                  </span>
                </div>
                {enableSplit &&
                  sellUnits
                    .filter((item) => item.name !== sellUnit)
                    .map((splitUnit, index) => {
                      const splitUnitsPerSellUnit =
                        toNumber(splitUnit.unitConversion) > 0
                          ? toNumber(unitSize) /
                            toNumber(splitUnit.unitConversion)
                          : 0
                      const splitPrice =
                        splitUnitsPerSellUnit > 0
                          ? toNumber(splitUnit.price) / splitUnitsPerSellUnit
                          : 0

                      return (
                        <div
                          key={index}
                          className="flex items-start justify-between gap-2 rounded-xl border bg-secondary p-3 text-sm font-medium"
                        >
                          <div className="grid">
                            <span>Split option</span>

                            <p className="text-xs text-muted-foreground">
                              {splitUnit.unitConversion || "—"} {uom} per{" "}
                              {splitUnit.name || "unit"}
                            </p>
                          </div>
                          <span className="text-base font-bold text-primary">
                            {splitPrice ? formatUSD(splitPrice) : "—"}
                          </span>
                        </div>
                      )
                    })}
              </div>
            </CardContent>
          </Card>
        )}
      />
    )
  },
})
