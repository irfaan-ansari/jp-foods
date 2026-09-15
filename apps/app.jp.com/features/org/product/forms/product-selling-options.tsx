"use client"

import React from "react"
import { pluralize } from "@jp/utils"

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
import { FieldGroup } from "@jp/ui/components/field"

import { ProductFormSchema } from "../product.schema"
import { getAvailableUnits, getBaseUnit, getUnit } from "../product.utils"

export const ProductSellingOptions = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    // handle make submit
    const handleMakeBaseUnit = (index: number) => {
      const sellUnits = form.getFieldValue("sellUnits")

      sellUnits.forEach((_, i) => {
        form.setFieldValue(`sellUnits[${i}].isBaseUnit`, i === index)
      })

      form.setFieldValue(`sellUnits[${index}].inventoryPerUnit`, "1")
    }

    // handle add option
    const handleAddOption = () => {
      const sellUnits = form.getFieldValue("sellUnits")

      const units = getAvailableUnits(
        sellUnits.map((item) => item.name),
        sellUnits.length
      )
      const hasBaseUnit = sellUnits.some((i) => i.isBaseUnit)
      form.pushFieldValue("sellUnits", {
        name: units?.[0]?.value ?? "",
        orderIncreament: "1",
        minQuantity: "1",
        inventoryPerUnit: hasBaseUnit ? "" : "1",
        price: "",
        isBaseUnit: !hasBaseUnit,
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
              sellUnits: state.values.sellUnits,
              trackInventory: state.values.trackInventory,
            })}
            children={({ sellUnits, trackInventory }) => {
              const baseUnit = getBaseUnit(sellUnits)

              return (
                <form.Field
                  name="sellUnits"
                  mode="array"
                  children={(field) => (
                    <div className="space-y-6">
                      {sellUnits.map((subField, i) => {
                        // get current unit and check if base unit
                        const currentUnit = getUnit(subField.name)
                        const isBaseUnit = subField.name && subField.isBaseUnit

                        return (
                          <div key={i} className="relative">
                            <div
                              className={`grid gap-4 rounded-2xl border p-4 shadow-xs ${isBaseUnit ? "border-primary" : ""}`}
                            >
                              <div className="flex justify-start gap-3">
                                <div className="flex flex-1 items-center gap-2 font-medium">
                                  <Box className="size-4" />
                                  {currentUnit?.label}
                                </div>

                                {isBaseUnit ? (
                                  <div className="flex h-7 items-center gap-2 rounded-xl bg-primary/20 px-3 text-xs">
                                    <Anchor className="size-3" />
                                    <span>Base unit</span>
                                    {trackInventory && (
                                      <span>
                                        • Inventory is tracked in{" "}
                                        {pluralize(
                                          2,
                                          currentUnit?.label ?? "",
                                          {
                                            case: "lowercase",
                                          }
                                        )}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => handleMakeBaseUnit(i)}
                                  >
                                    Make base unit
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="destructive"
                                  className="size-7 shrink-0"
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
                                      className="lg:col-span-2"
                                      options={getAvailableUnits(
                                        sellUnits.map((item) => item.name),
                                        i
                                      )}
                                    />
                                  )}
                                />

                                <form.AppField
                                  name={`sellUnits[${i}].price`}
                                  children={(field) => (
                                    <field.TextField
                                      label="Selling Price"
                                      placeholder="Enter selling price"
                                      className={
                                        isBaseUnit ? "lg:col-span-2" : ""
                                      }
                                      prefix="$"
                                      inputMode="decimal"
                                      suffix={`/${getUnit(subField.name)?.value}`}
                                    />
                                  )}
                                />
                                <form.AppField
                                  name={`sellUnits[${i}].inventoryPerUnit`}
                                  children={(field) => (
                                    <field.TextField
                                      className={
                                        isBaseUnit
                                          ? "hidden"
                                          : "**:data-[slot=field-label]:capitalize"
                                      }
                                      label={`${baseUnit?.label} per ${currentUnit?.label}`}
                                      placeholder={`Number of ${baseUnit?.value} in each ${currentUnit?.value}.`}
                                      inputMode="number"
                                      suffix={`${baseUnit?.value} per ${currentUnit?.value}`}
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
                      >
                        <Plus /> Add sell option
                      </Button>
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
