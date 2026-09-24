import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import { formatUSD } from "@jp/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@jp/ui/components/card"
import { cn } from "@jp/ui/lib/utils"
import { ImageUp, ShoppingCart } from "lucide-react"
import { withForm } from "@/hooks/use-app-form"
import { Input } from "@jp/ui/components/input"
import { ProductFormSchema } from "../product.schema"
import { FieldLabel, FieldLegend } from "@jp/ui/components/field"
import { ProductBadge } from "../components/product-card"
import { Badge } from "@jp/ui/components/badge"
import { getSellingUnits } from "../product.utils"
import { Tabs, TabsList, TabsTrigger } from "@jp/ui/components/tabs"
import { Button } from "@jp/ui/components/button"

export const ProductPreview = withForm({
  defaultValues: {} as ProductFormSchema,
  props: {} as {
    setFile: (file: File | null) => void
  },
  render: function Render({ form, setFile }) {
    const [selectedUnitName, setSelectedUnitName] = useState("")
    const previewUrl = useRef<string | null>(null)

    useEffect(
      () => () => {
        if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
      },
      []
    )

    // upload image
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
      <form.Subscribe selector={(state) => state.values}>
        {({
          title,
          image,
          price,
          uom,
          sellUnit,
          contains,
          label,
          weightLb,
          catchWeight,
          categories,
          sellUnits,
          status,
          isTaxable,
          itemCode,
        }) => {
          const prices = getSellingUnits({
            price,
            uom,
            sellUnit,
            weightLb,
            catchWeight,
            sellUnits,
            contains,
            label,
          })

          const selectedUnit =
            prices.find((unit) => unit.name === selectedUnitName) ?? prices[0]
          const selectedValue = selectedUnit?.name ?? ""
          const itemMeta = [itemCode && `Item ${itemCode}`, label].filter(
            Boolean
          )
          const unitLabel =
            selectedUnit?.displayUnit || selectedUnit?.name || sellUnit || uom

          return (
            <Card
              className="gap-0 overflow-hidden bg-secondary py-0 shadow-xs"
              size="sm"
            >
              {/* image */}
              <div className="relative mb-0 aspect-video overflow-hidden rounded-xl">
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
                    "absolute inset-0 z-3 w-full flex-col justify-center rounded-xl bg-secondary/80 backdrop-blur-lg transition hover:[&>svg]:-translate-y-1",
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
                      className="h-6 rounded-md bg-background/80 backdrop-blur-lg"
                    >
                      Taxable
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="space-y-2 rounded-t-2xl bg-background p-4">
                {categories.length > 0 ? (
                  <CardDescription className="text-xs font-medium uppercase">
                    {categories.join(" • ")}
                  </CardDescription>
                ) : (
                  <div className="h-4 rounded-lg bg-secondary" />
                )}

                {title ? (
                  <CardTitle className="text-base leading-tight font-bold">
                    {title}
                  </CardTitle>
                ) : (
                  <div className="h-5 rounded-lg bg-secondary" />
                )}

                {itemMeta.length > 0 ? (
                  <p className="text-sm font-medium text-muted-foreground">
                    {itemMeta.join(" · ")}
                  </p>
                ) : (
                  <div className="h-4 w-2/3 rounded-lg bg-secondary" />
                )}

                {prices.length > 0 ? (
                  <Tabs
                    value={selectedValue}
                    onValueChange={setSelectedUnitName}
                    className="gap-2"
                  >
                    <TabsList className="w-full rounded-xl border p-0.5!">
                      {prices.map((unit) => (
                        <TabsTrigger
                          key={unit.name}
                          value={unit.name}
                          className="rounded-lg"
                        >
                          {unit.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                ) : (
                  <div className="h-10 rounded-xl border bg-transparent" />
                )}

                <div className="space-y-2">
                  <div className="text-lg font-bold tracking-normal text-primary">
                    {selectedUnit
                      ? formatUSD(selectedUnit.displayPrice)
                      : formatUSD(price)}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {selectedUnit ? (
                      <>
                        {selectedUnit.pricing === "per_uom"
                          ? `per ${unitLabel}`
                          : `per ${unitLabel}`}
                        {selectedUnit.weightIsEstimate
                          ? ` · Estimated ${formatUSD(
                              selectedUnit.calculatedPrice
                            )} per ${selectedUnit.name}`
                          : ` · Minimum 1 ${uom}`}
                      </>
                    ) : (
                      "Pricing unavailable"
                    )}
                  </p>
                </div>

                <Button type="button" className="w-full">
                  <ShoppingCart />
                  Add to order
                </Button>
              </CardContent>
            </Card>
          )
        }}
      </form.Subscribe>
    )
  },
})
