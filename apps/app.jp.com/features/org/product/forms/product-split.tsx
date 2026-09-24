"use client"

import React from "react"
import { formatUSD } from "@jp/utils"

import { Plus } from "lucide-react"
import { withForm } from "@/hooks/use-app-form"
import { TrashBinMinimalistic } from "@solar-icons/react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"

import { Badge } from "@jp/ui/components/badge"
import { Button } from "@jp/ui/components/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@jp/ui/components/field"
import { Switch } from "@jp/ui/components/switch"

import { ProductFormSchema } from "../product.schema"
import { getAvailableUnits, getUnit } from "../product.utils"

const toNumber = (value: string | undefined) =>
  value?.trim() && Number.isFinite(Number(value)) ? Number(value) : 0

const getSplitUnitPrice = ({
  splitPrice,
  splitWeight,
  defaultWeight,
}: {
  splitPrice: string | undefined
  splitWeight: string | undefined
  defaultWeight: string
}) => {
  const unitsPerSellUnit =
    toNumber(splitWeight) > 0
      ? toNumber(defaultWeight) / toNumber(splitWeight)
      : 0

  if (!unitsPerSellUnit || !toNumber(splitPrice)) return 0

  return toNumber(splitPrice) / unitsPerSellUnit
}

export const ProductSplit = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    const handleAddOption = () => {
      const sellUnits = form.getFieldValue("sellUnits")
      const sellUnit = form.getFieldValue("sellUnit")

      const units = getAvailableUnits(
        sellUnits.map((item) => item.name),
        sellUnits.length
      ).filter((unit) => unit.value !== sellUnit)

      if (!units.length) return

      form.pushFieldValue("sellUnits", {
        name: units?.[0]?.value ?? "",
        label: "",
        price: "",
        unitConversion: "",
        orderIncreament: "1",
        minQuantity: "1",
      })
    }

    return (
      <Card size="sm" className="shadow-xs">
        <CardHeader>
          <CardTitle className="font-bold">
            Split Case & Selling Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form.Subscribe
            selector={(state) => ({
              uom: state.values.uom,
              price: state.values.price,
              sellUnit: state.values.sellUnit,
              unitSize: state.values.unitSize,
              catchWeight: state.values.catchWeight,
              enableSplit: state.values.enableSplit,
              sellUnits: state.values.sellUnits,
            })}
            children={({
              uom,
              sellUnit,
              unitSize,
              catchWeight,
              enableSplit,
              sellUnits,
              price,
            }) => {
              const defaultUnitLabel = getUnit(sellUnit)?.label || "Default"
              const splitUnits = sellUnits.filter(
                (item) => item.name !== sellUnit
              )

              return (
                <div className="space-y-5">
                  <form.Field
                    name="sellUnits"
                    mode="array"
                    children={(field) => (
                      <div className="space-y-4">
                        {sellUnits.map((subField, i) => {
                          if (subField.name === sellUnit) return null

                          const splitUnitPrice = getSplitUnitPrice({
                            splitPrice: subField.price,
                            splitWeight: subField.unitConversion,
                            defaultWeight: unitSize,
                          })

                          return (
                            <div
                              key={i}
                              className="grid gap-4 rounded-2xl border p-4 shadow-xs"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="min-w-0 truncate font-medium">
                                  Split option
                                </p>

                                <div className="flex items-center gap-2">
                                  <Badge variant="primary-light">
                                    {formatUSD(splitUnitPrice)} /
                                    {subField.unitConversion || "—"} {uom} per{" "}
                                    {subField.name || "unit"}
                                  </Badge>
                                  <Button
                                    type="button"
                                    size="icon-sm"
                                    variant="destructive"
                                    className="size-7 shrink-0"
                                    aria-label="Remove split option"
                                    onClick={() => field.removeValue(i)}
                                  >
                                    <TrashBinMinimalistic />
                                  </Button>
                                </div>
                              </div>

                              <FieldGroup className="grid flex-1 gap-4 lg:grid-cols-2">
                                <form.AppField
                                  name={`sellUnits[${i}].name`}
                                  children={(unitField) => (
                                    <unitField.SelectField
                                      label="Split unit"
                                      placeholder="Select unit..."
                                      options={getAvailableUnits(
                                        sellUnits.map((item) => item.name),
                                        i
                                      ).filter(
                                        (unit) => unit.value !== sellUnit
                                      )}
                                    />
                                  )}
                                />

                                <form.AppField
                                  name={`sellUnits[${i}].label`}
                                  children={(field) => (
                                    <field.TextField
                                      label="Label"
                                      placeholder="5 lb Bag"
                                    />
                                  )}
                                />

                                <form.AppField
                                  name={`sellUnits[${i}].price`}
                                  children={(field) => (
                                    <field.TextField
                                      label={`Split ${sellUnit} price`}
                                      placeholder="45.00"
                                      inputMode="decimal"
                                      prefix="$"
                                      description={`Equivalent ${sellUnit} price when sold in splits.`}
                                    />
                                  )}
                                />

                                <form.AppField
                                  name={`sellUnits[${i}].unitConversion`}
                                  children={(field) => (
                                    <field.TextField
                                      label={`Split ${getUnit(subField.name)?.label?.toLowerCase() ?? "unit"} weight`}
                                      placeholder="5"
                                      inputMode="number"
                                      suffix={uom}
                                    />
                                  )}
                                />

                                <form.AppField
                                  name={`sellUnits[${i}].minQuantity`}
                                  children={(field) => (
                                    <field.TextField
                                      label={`Minimum ${subField.name} per order`}
                                      placeholder="1"
                                      inputMode="number"
                                    />
                                  )}
                                />
                              </FieldGroup>
                            </div>
                          )
                        })}

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-dashed"
                          onClick={handleAddOption}
                          disabled={
                            getAvailableUnits(
                              sellUnits.map((item) => item.name),
                              sellUnits.length
                            ).filter((unit) => unit.value !== sellUnit)
                              .length === 0
                          }
                        >
                          <Plus /> Add split option
                        </Button>
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    )}
                  />
                </div>
              )
            }}
          />
        </CardContent>
      </Card>
    )
  },
})
