"use client"

import React from "react"

import { withForm } from "@/hooks/use-app-form"
import { Card, CardContent, CardHeader } from "@jp/ui/components/card"
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

import type { ProductFormV2Schema } from "./product-form-v2.schema"
import { getUnitV2 } from "./product-form-v2.utils"

export const ProductInventoryV2 = withForm({
  defaultValues: {} as ProductFormV2Schema,
  render: function Render({ form }) {
    return (
      <Card className="shadow-xs" size="sm">
        <CardHeader>
          <form.Field
            name="trackInventory"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field
                  orientation="horizontal"
                  className="pr-2 lg:col-span-2"
                  data-invalid={isInvalid}
                >
                  <FieldLabel htmlFor={field.name}>
                    <FieldContent>
                      <FieldTitle className="text-base font-bold">
                        Track Inventory
                      </FieldTitle>
                      <FieldDescription className="text-sm">
                        Automatically keep stock levels updated as orders are
                        placed.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                  </FieldLabel>
                  <Switch
                    className="self-center"
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    aria-invalid={isInvalid}
                  />
                </Field>
              )
            }}
          />
        </CardHeader>
        <form.Subscribe
          selector={(state) => ({
            trackInventory: state.values.trackInventory,
            inventoryUnit: state.values.sellUnits.find((unit) => unit.isBaseUnit)
              ?.name,
          })}
          children={({ trackInventory, inventoryUnit }) => (
            <CardContent>
              <FieldGroup
                className={`mb-6 grid grid-cols-1 ${!trackInventory ? "hidden" : ""}`}
              >
                <form.AppField
                  name="stock"
                  children={(field) => (
                    <field.TextField
                      label="Current Stock"
                      inputMode="number"
                      placeholder={`Available stock in ${getUnitV2(inventoryUnit)?.label}`}
                      suffix={getUnitV2(inventoryUnit)?.label}
                    />
                  )}
                />

                <form.Field
                  name="allowBackorder"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                      <Field
                        orientation="horizontal"
                        className="rounded-xl border px-3 py-2"
                        data-invalid={isInvalid}
                      >
                        <FieldLabel htmlFor={field.name}>
                          <FieldContent>
                            <FieldTitle>Allow Backorders</FieldTitle>
                            <FieldDescription className="text-sm">
                              Accept orders when out of stock.
                            </FieldDescription>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </FieldContent>
                        </FieldLabel>
                        <Switch
                          className="self-center"
                          id={field.name}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                          aria-invalid={isInvalid}
                        />
                      </Field>
                    )
                  }}
                />
              </FieldGroup>
              <FieldGroup>
                <form.AppField
                  name="location"
                  children={(field) => (
                    <field.TextField label="Location" placeholder="6D" />
                  )}
                />
              </FieldGroup>
            </CardContent>
          )}
        />
      </Card>
    )
  },
})
