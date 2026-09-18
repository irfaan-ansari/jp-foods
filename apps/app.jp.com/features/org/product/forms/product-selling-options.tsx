"use client"

import React from "react"
import { formatUSD } from "@jp/utils"

import { Plus, Anchor } from "lucide-react"
import { withForm } from "@/hooks/use-app-form"
import { Box, TrashBinMinimalistic } from "@solar-icons/react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"

import { Button } from "@jp/ui/components/button"
import { FieldError, FieldGroup } from "@jp/ui/components/field"

import { ProductFormSchema } from "../product.schema"
import { getAvailableUnits, getUnit } from "../product.utils"

export const ProductSellingOptions = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    // handle add option
    const handleAddOption = () => {
      const sellUnits = form.getFieldValue("sellUnits")

      const units = getAvailableUnits(
        sellUnits.map((item) => item.name),
        sellUnits.length
      )

      if (!units.length) return

      form.pushFieldValue("sellUnits", {
        name: units?.[0]?.value ?? "",
        unitConversion: "",
        orderIncreament: "1",
        minQuantity: "1",
      })
    }

    return (
      <Card size="sm" className="shadow-xs">
        <CardHeader>
          <CardTitle className="font-bold">Selling Options</CardTitle>
        </CardHeader>
        <CardContent>
          <form.Subscribe
            selector={(state) => ({
              unit: state.values.unit,
              price: state.values.price,
              sellUnits: state.values.sellUnits,
            })}
            children={({ unit, sellUnits, price }) => {
              return (
                <form.Field
                  name="sellUnits"
                  mode="array"
                  children={(field) => (
                    <div className="space-y-6">
                      {sellUnits.map((subField, i) => {
                        const currentUnit = getUnit(subField.name)

                        return (
                          <div key={i} className="relative">
                            <div className="grid gap-4 rounded-2xl border p-4 shadow-xs">
                              <div className="flex flex-wrap justify-start gap-3">
                                <div className="flex flex-1 items-center gap-2 font-medium">
                                  <Box className="size-4" />
                                  {currentUnit?.label}
                                </div>
                                <div className="flex h-7 items-center gap-2 rounded-xl bg-primary/20 px-3 text-xs">
                                  <Anchor className="size-3" />
                                  <span>
                                    {subField.unitConversion || "—"} {unit} /{" "}
                                    {subField.name}
                                  </span>
                                  •
                                  <span>
                                    {price.trim() !== "" &&
                                    Number(price) >= 0 &&
                                    Number(subField.unitConversion) > 0 &&
                                    Number.isFinite(
                                      Number(price) *
                                        Number(subField.unitConversion)
                                    )
                                      ? formatUSD(
                                          Number(price) *
                                            Number(subField.unitConversion)
                                        )
                                      : "—"}
                                  </span>
                                </div>

                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="destructive"
                                  className="size-7 shrink-0"
                                  aria-label={`Remove ${currentUnit?.label ?? "selling unit"}`}
                                  disabled={sellUnits.length === 1}
                                  onClick={() => field.removeValue(i)}
                                >
                                  <TrashBinMinimalistic />
                                </Button>
                              </div>

                              <FieldGroup className="grid flex-1 gap-4 lg:grid-cols-2">
                                <form.AppField
                                  name={`sellUnits[${i}].name`}
                                  children={(unitField) => (
                                    <unitField.SelectField
                                      label="Sell As"
                                      placeholder="Select unit..."
                                      options={getAvailableUnits(
                                        sellUnits.map((item) => item.name),
                                        i
                                      )}
                                    />
                                  )}
                                />

                                <form.AppField
                                  name={`sellUnits[${i}].unitConversion`}
                                  children={(field) => (
                                    <field.TextField
                                      label="Unit Conversion"
                                      placeholder="Enter unit conversion"
                                      inputMode="number"
                                      suffix={getUnit(unit)?.value ?? ""}
                                    />
                                  )}
                                />

                                <form.AppField
                                  name={`sellUnits[${i}].minQuantity`}
                                  children={(field) => (
                                    <field.TextField
                                      label="Minimum Quantity"
                                      placeholder="Enter minimum quantity"
                                      inputMode="number"
                                      description="Minimum quantity required to place an order."
                                    />
                                  )}
                                />

                                <form.AppField
                                  name={`sellUnits[${i}].orderIncreament`}
                                  children={(field) => (
                                    <field.TextField
                                      label="Order Increment"
                                      placeholder="Enter increment"
                                      inputMode="number"
                                      description="Quantity must be added in this increment."
                                    />
                                  )}
                                />
                              </FieldGroup>
                            </div>
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
                          ).length === 0
                        }
                      >
                        <Plus /> Add sell option
                      </Button>
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />
              )
            }}
          />
        </CardContent>
      </Card>
    )
  },
})
