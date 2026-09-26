"use client"

import React from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@jp/ui/components/field"
import { getUnit } from "@jp/utils/commerce"
import { withForm } from "@/hooks/use-app-form"
import { Switch } from "@jp/ui/components/switch"
import { ProductFormSchema } from "../product.schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"

export const ProductInventory = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    return (
      <Card className="shadow-xs" size="sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Inventory</CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <form.Field
              name="trackInventory"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field
                    orientation="horizontal"
                    className="rounded-xl border px-3 py-2.5"
                    data-invalid={isInvalid}
                  >
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>Track Inventory</FieldTitle>
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
            <form.Subscribe
              selector={(state) => ({
                trackInventory: state.values.trackInventory,
                unit: state.values.uom,
              })}
              children={({ trackInventory, unit }) => {
                return (
                  <FieldGroup className={!trackInventory ? "hidden" : ""}>
                    <form.AppField
                      name="stock"
                      children={(field) => (
                        <field.TextField
                          label="Current Stock"
                          inputMode="number"
                          suffix={getUnit(unit)?.value}
                        />
                      )}
                    />

                    <form.Field
                      name="allowBackorder"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
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
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
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
                )
              }}
            />
          </FieldGroup>
        </CardContent>
      </Card>
    )
  },
})
