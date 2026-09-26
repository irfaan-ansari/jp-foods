import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@jp/ui/components/card"
import { cn } from "@jp/ui/lib/utils"
import { ImageUp, Minus, Plus } from "lucide-react"
import { withForm } from "@/hooks/use-app-form"
import { Input } from "@jp/ui/components/input"
import { ProductFormSchema } from "../product.schema"
import { FieldLabel, FieldLegend } from "@jp/ui/components/field"
import { ProductBadge } from "../components/product-card"
import { Badge } from "@jp/ui/components/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@jp/ui/components/tabs"
import { formatUSD } from "@jp/utils"
import { normalizeQuantity, roundMoney } from "@jp/utils/commerce"

import { withCalculatedPrices } from "../product.utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@jp/ui/components/input-group"

export const ProductPreview = withForm({
  defaultValues: {} as ProductFormSchema,
  props: {} as {
    setFile: (file: File | null) => void
  },
  render: function Render({ form, setFile }) {
    const [quantities, setQuantities] = useState<Record<string, number>>({})
    const setQuantity = (unit: string, value: number) => {
      setQuantities((previous) => ({
        ...previous,
        [unit]: normalizeQuantity(Math.max(0, value)),
      }))
    }
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
          uom,
          catchWeight,
          categories,
          sellingUnits,
          status,
          isTaxable,
        }) => {
          const sellUnits = withCalculatedPrices(sellingUnits, catchWeight)
          const defaultUnit =
            sellUnits.find((unit) => unit.isDefault) ?? sellUnits[0]
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

                <div className="space-y-4 pt-2">
                  <Tabs
                    key={JSON.stringify([
                      defaultUnit?.name,
                      sellUnits.map((unit) => unit.name),
                    ])}
                    defaultValue={defaultUnit?.name}
                    className="gap-2"
                  >
                    {sellUnits.length > 1 && (
                      <TabsList className="w-full rounded-xl p-0.5">
                        {sellUnits.map((unit) => (
                          <TabsTrigger
                            key={unit.name}
                            value={unit.name}
                            className="rounded-lg"
                          >
                            {unit.displayLabel}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    )}

                    {sellUnits.map((unit) => {
                      const quantity = quantities[unit.name] ?? 0
                      const total = roundMoney(unit.calculatedPrice * quantity)

                      return (
                        <TabsContent
                          key={unit.name}
                          value={unit.name}
                          className="space-y-2 rounded-lg"
                        >
                          <div className="space-x-1">
                            <span className="text-lg font-bold text-primary">
                              {formatUSD(unit.price)}
                              {catchWeight && (
                                <span className="text-xs font-normal text-muted-foreground">
                                  {" / "}
                                  {uom}
                                </span>
                              )}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">
                              • {unit.qtyPerUnit} {uom}
                              {catchWeight && " avg"}
                            </span>
                          </div>
                          <div className="mt-4">
                            <InputGroup>
                              <InputGroupAddon>
                                <InputGroupButton
                                  type="button"
                                  variant="default"
                                  disabled={quantity === 0}
                                  onClick={() =>
                                    setQuantity(unit.name, quantity - 1)
                                  }
                                >
                                  <Minus />
                                </InputGroupButton>
                              </InputGroupAddon>
                              <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                  type="button"
                                  variant="default"
                                  onClick={() =>
                                    setQuantity(unit.name, quantity + 1)
                                  }
                                >
                                  <Plus />
                                </InputGroupButton>
                              </InputGroupAddon>
                              <InputGroupInput
                                className="text-center"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                aria-label={`Quantity in ${unit.name}`}
                                value={quantity}
                                onChange={(event) => {
                                  const parsed = Number(event.target.value)
                                  setQuantity(
                                    unit.name,
                                    Number.isFinite(parsed) ? parsed : 0
                                  )
                                }}
                              />
                            </InputGroup>
                          </div>
                          {quantity > 0 && (
                            <div className="space-y-1.5 rounded-xl bg-secondary p-3">
                              <div className="flex justify-between gap-1">
                                <span>Items</span>
                                <span>
                                  {quantity} x {unit.qtyPerUnit} {uom}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>
                                  {catchWeight ? "Est. total" : "Total"}
                                </span>
                                <span className="text-base text-primary">
                                  {formatUSD(total)}
                                </span>
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      )
                    })}
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          )
        }}
      </form.Subscribe>
    )
  },
})
