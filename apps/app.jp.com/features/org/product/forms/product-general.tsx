"use client"

import React from "react"
import { ChevronsUpDown, X } from "lucide-react"
import { withForm } from "@/hooks/use-app-form"

import { ListCheckMinimalistic } from "@solar-icons/react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@jp/ui/components/field"
import { Badge } from "@jp/ui/components/badge"
import { Button } from "@jp/ui/components/button"
import { Switch } from "@jp/ui/components/switch"

import { CategorySelector } from "@/features/org/product/components/category-selector"

import { type ProductFormSchema } from "../product.schema"
import { PRODUCT_UNITS, STATUS } from "../product.const"
import { getUnit } from "../product.utils"

export const ProductGeneral = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    return (
      <Card size="sm" className="shadow-xs">
        <CardHeader>
          <CardTitle className="font-bold">General</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
            <form.AppField
              name="title"
              children={(field) => (
                <field.TextField
                  label="Title"
                  className="lg:col-span-2"
                  placeholder="Item title"
                />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextAreaField
                  label="Description"
                  className="lg:col-span-2"
                  placeholder="Type here..."
                />
              )}
            />
            <form.AppField
              name="itemCode"
              children={(field) => (
                <field.TextField label="Item Code" placeholder="TBD-ITEM" />
              )}
            />
            <form.AppField
              name="status"
              children={(field) => (
                <field.SelectField
                  label="Status"
                  options={Object.values(STATUS)
                    .filter((status) => status.value)
                    .map((status) => ({
                      label: status.label,
                      value: status.value,
                    }))}
                />
              )}
            />

            <form.AppField
              name="unit"
              children={(field) => (
                <field.SelectField label="Price Unit" options={PRODUCT_UNITS} />
              )}
            />

            <form.Subscribe
              selector={(state) => state.values.unit}
              children={(unit) => (
                <form.AppField
                  name="price"
                  children={(field) => (
                    <field.TextField
                      label="Price"
                      placeholder="2.00"
                      inputMode="decimal"
                      prefix={"$"}
                      suffix={`/${getUnit(unit)?.value}`}
                    />
                  )}
                />
              )}
            />

            <form.Field
              name="categories"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field
                    aria-invalid={isInvalid}
                    className="gap-2 lg:col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>Categories</FieldLabel>
                    <CategorySelector
                      canCreate
                      selected={field.state.value}
                      onSelect={(value) => {
                        const index = field.state.value.indexOf(value)
                        if (index !== -1) {
                          field.removeValue(index)
                        } else {
                          field.pushValue(value)
                        }
                      }}
                    >
                      <Button
                        variant="outline"
                        className="flex h-auto min-h-10 justify-start py-2"
                      >
                        <span className="flex-1 text-left text-muted-foreground">
                          {field.state.value.length > 0
                            ? field.state.value.join(" • ")
                            : "Select..."}
                        </span>
                        {field.state.value.length > 0 && (
                          <Badge variant="primary-light">
                            {field.state.value.length}
                          </Badge>
                        )}
                      </Button>
                    </CategorySelector>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="isTaxable"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field
                    orientation="horizontal"
                    className="rounded-xl border px-3 py-2 lg:col-span-2"
                    data-invalid={isInvalid}
                  >
                    <FieldLabel htmlFor={field.name}>
                      <FieldContent>
                        <FieldTitle> Taxable</FieldTitle>
                        <FieldDescription className="text-sm">
                          Apply sales tax to this product
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
        </CardContent>
      </Card>
    )
  },
})
