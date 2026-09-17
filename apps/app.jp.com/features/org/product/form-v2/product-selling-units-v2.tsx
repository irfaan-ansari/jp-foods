"use client"

import React from "react"

import { withForm } from "@/hooks/use-app-form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@jp/ui/components/input-group"
import { formatUSD } from "@jp/utils"

import { PRODUCT_UNITS } from "../product.const"
import type { ProductFormV2Schema } from "./product-form-v2.schema"
import {
  calculateUnitPrices,
  getUnitPackageLabel,
} from "./product-form-v2.utils"

export const ProductSellingUnitsV2 = withForm({
  defaultValues: {} as ProductFormV2Schema,
  render: function Render({ form }) {
    const syncPrices = (sellUnits: ProductFormV2Schema["sellUnits"]) => {
      const prices = calculateUnitPrices(sellUnits)

      sellUnits.forEach((unit, index) => {
        if (unit.isBaseUnit) return
        form.setFieldValue(
          `sellUnits[${index}].price`,
          prices.get(unit.name) ?? ""
        )
      })
    }

    return (
      <Card size="sm" className="shadow-xs">
        <CardHeader>
          <CardTitle className="font-bold">Unit Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form.Subscribe
            selector={(state) => ({
              sellUnits: state.values.sellUnits,
            })}
            children={({ sellUnits }) => {
              const unitPrices = calculateUnitPrices(sellUnits)
              const priceUnit = sellUnits[0]
              const standardUnit = sellUnits[1]
              const caseUnit = sellUnits[2]

              return (
                <FieldGroup>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <form.AppField
                      name="sellUnits[0].name"
                      children={(field) => (
                        <field.SelectField
                          label="Price Unit"
                          placeholder="Select unit..."
                          options={PRODUCT_UNITS}
                          description="Base unit used for pricing."
                        />
                      )}
                    />

                    <form.Field
                      name="sellUnits[0].price"
                      children={(priceField) => (
                        <Field className="gap-2">
                          <FieldLabel htmlFor={priceField.name}>
                            Unit Price
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupAddon>$</InputGroupAddon>
                            <InputGroupAddon align="inline-end">
                              /{priceUnit?.name}
                            </InputGroupAddon>
                            <InputGroupInput
                              id={priceField.name}
                              name={priceField.name}
                              value={priceField.state.value}
                              inputMode="decimal"
                              placeholder="2.00"
                              onBlur={priceField.handleBlur}
                              onChange={(event) => {
                                const value = event.target.value
                                priceField.handleChange(value)
                                syncPrices(
                                  sellUnits.map((unit, index) =>
                                    index === 0
                                      ? { ...unit, price: value }
                                      : unit
                                  )
                                )
                              }}
                            />
                          </InputGroup>
                        </Field>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 rounded-2xl border p-4 shadow-xs lg:grid-cols-[1fr_9rem]">
                    <form.Field
                      name="sellUnits[1].quantityPerUnit"
                      children={(weightField) => (
                        <Field className="gap-2">
                          <FieldLabel htmlFor={weightField.name}>
                            Standard Weight
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupAddon align="inline-end">
                              {priceUnit?.name}
                            </InputGroupAddon>
                            <InputGroupInput
                              id={weightField.name}
                              name={weightField.name}
                              value={weightField.state.value}
                              inputMode="decimal"
                              placeholder="10"
                              onBlur={weightField.handleBlur}
                              onChange={(event) => {
                                const value = event.target.value
                                weightField.handleChange(value)
                                syncPrices(
                                  sellUnits.map((unit, index) =>
                                    index === 1
                                      ? { ...unit, quantityPerUnit: value }
                                      : unit
                                  )
                                )
                              }}
                            />
                          </InputGroup>
                          <FieldDescription>
                            Weight of one sell unit.
                          </FieldDescription>
                        </Field>
                      )}
                    />

                    <form.AppField
                      name="sellUnits[1].name"
                      children={(field) => (
                        <field.SelectField
                          label="Sell UOM"
                          options={PRODUCT_UNITS}
                        />
                      )}
                    />

                    <div className="text-sm text-muted-foreground lg:col-span-2">
                      {standardUnit
                        ? `${getUnitPackageLabel(standardUnit, priceUnit?.name)} = ${formatUSD(unitPrices.get(standardUnit.name) || 0)}`
                        : null}
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-2xl border p-4 shadow-xs lg:grid-cols-[1fr_9rem]">
                    <form.Field
                      name="sellUnits[2].quantityPerUnit"
                      children={(conversionField) => (
                        <Field className="gap-2">
                          <FieldLabel htmlFor={conversionField.name}>
                            Case Conversion
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupAddon align="inline-end">
                              {standardUnit?.name}
                            </InputGroupAddon>
                            <InputGroupInput
                              id={conversionField.name}
                              name={conversionField.name}
                              value={conversionField.state.value}
                              inputMode="decimal"
                              placeholder="5"
                              onBlur={conversionField.handleBlur}
                              onChange={(event) => {
                                const value = event.target.value
                                conversionField.handleChange(value)
                                syncPrices(
                                  sellUnits.map((unit, index) =>
                                    index === 2
                                      ? { ...unit, quantityPerUnit: value }
                                      : unit
                                  )
                                )
                              }}
                            />
                          </InputGroup>
                          <FieldDescription>
                            Number of sell units in one case.
                          </FieldDescription>
                        </Field>
                      )}
                    />

                    <form.AppField
                      name="sellUnits[2].name"
                      children={(field) => (
                        <field.SelectField
                          label="Case UOM"
                          options={PRODUCT_UNITS}
                        />
                      )}
                    />

                    <div className="text-sm text-muted-foreground lg:col-span-2">
                      {caseUnit
                        ? `${getUnitPackageLabel(caseUnit, standardUnit?.name)} = ${formatUSD(unitPrices.get(caseUnit.name) || 0)}`
                        : null}
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {[1, 2].map((index) => {
                      const unit = sellUnits[index]
                      if (!unit) return null

                      return (
                        <div
                          key={index}
                          className="grid gap-4 rounded-2xl border p-4"
                        >
                          <div className="text-sm font-medium">
                            {getUnitPackageLabel(
                              unit,
                              sellUnits[index - 1]?.name
                            )}
                          </div>
                          <form.AppField
                            name={`sellUnits[${index}].minQuantity`}
                            children={(field) => (
                              <field.TextField
                                label="Minimum Quantity"
                                placeholder="1"
                                inputMode="number"
                                suffix={unit?.name}
                              />
                            )}
                          />
                          <form.AppField
                            name={`sellUnits[${index}].orderIncreament`}
                            children={(field) => (
                              <field.TextField
                                label="Order Increment"
                                placeholder="1"
                                inputMode="number"
                                suffix={unit?.name}
                              />
                            )}
                          />
                        </div>
                      )
                    })}
                  </div>
                </FieldGroup>
              )
            }}
          />
        </CardContent>
      </Card>
    )
  },
})
