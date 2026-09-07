"use client"

import React from "react"
import { X } from "lucide-react"
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
                  options={[
                    { label: "Active", value: "acive" },
                    { label: "Private", value: "private" },
                    { label: "Archived", value: "archived" },
                  ]}
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
                        field.pushValue(value)
                      }}
                    >
                      <Button
                        variant="outline"
                        className="flex h-auto min-h-10 items-start justify-start py-2"
                      >
                        <ListCheckMinimalistic className="mt-0.5 size-5 shrink-0" />
                        {field.state.value.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {field.state.value.map((v, i) => (
                              <Badge
                                key={v}
                                variant="warning-light"
                                className="rounded-md"
                              >
                                {v}
                                <span onClick={() => field.removeValue(i)}>
                                  <X />
                                </span>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Select categories
                          </span>
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
