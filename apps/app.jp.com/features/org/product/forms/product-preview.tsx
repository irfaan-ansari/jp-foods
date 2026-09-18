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
          unit,
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
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              ) : (
                <div className="h-5 rounded-lg bg-secondary" />
              )}

              <div className="mt-4">
                {price.trim() !== "" &&
                Number.isFinite(Number(price)) &&
                Number(price) >= 0 ? (
                  <ProductPrice price={price} unit={unit} />
                ) : (
                  <Skeleton className="h-5 w-20" />
                )}
              </div>
              <div className="mt-4 space-y-3 border-t border-dashed pt-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Selling options
                </p>
                {sellUnits.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add a selling option to preview it.
                  </p>
                )}
                {sellUnits.map((sellUnit, index) => {
                  const amount = Number(price) * Number(sellUnit.unitConversion)
                  const validPrice =
                    price.trim() !== "" &&
                    Number(price) >= 0 &&
                    Number(sellUnit.unitConversion) > 0 &&
                    Number.isFinite(amount)

                  return (
                    <div
                      key={index}
                      className="space-y-1 rounded-xl border p-3"
                    >
                      <div className="flex items-start justify-between gap-2 text-sm font-medium">
                        <span>
                          {getUnit(sellUnit.name)?.label ??
                            (sellUnit.name || "Selling unit")}
                        </span>
                        <span className="text-primary">
                          {validPrice ? formatUSD(amount) : "—"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {sellUnit.unitConversion || "—"} {unit} per{" "}
                        {sellUnit.name || "unit"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Minimum: {sellUnit.minQuantity || "—"} · Increment:{" "}
                        {sellUnit.orderIncreament || "—"}
                      </p>
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
