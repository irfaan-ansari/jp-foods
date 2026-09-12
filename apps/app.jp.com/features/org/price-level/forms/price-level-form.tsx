"use client"

import React from "react"
import { toast } from "sonner"

import { getNewPrice } from "../price-level.utils"
import { Badge } from "@jp/ui/components/badge"
import { formatUSD, pluralize } from "@jp/utils"
import { Button } from "@jp/ui/components/button"
import { useAppForm } from "@/hooks/use-app-form"
import { TrashBinMinimalistic } from "@solar-icons/react"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { ChevronDown, ImageOff, Loader2, Plus } from "lucide-react"
import { createPriceLevel, updatePriceLevel } from "../price-level.action"
import { PriceLevelFormSchema, priceLevelSchema } from "../price-level.schema"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { ProductSelector } from "@/features/org/product/components/product-selector"

type FormProps = {
  values?: PriceLevelFormSchema
  id?: number
  onSuccess?: () => void
  onError?: () => void
  onCancel?: () => void
}
export const PriceLevelForm = ({
  values,
  id,
  onSuccess,
  onError,
  onCancel,
}: FormProps) => {
  const {
    name = "",
    adjustmentType = "fixed",
    adjustmentValue = "",
    appliesTo = "all",
    status = "active",
    products = [],
  } = values || {}

  const form = useAppForm({
    defaultValues: {
      name,
      adjustmentType,
      adjustmentValue,
      appliesTo,
      status,
      products,
    },
    validators: {
      onSubmit: priceLevelSchema,
    },
    onSubmit: async ({ value }) => {
      const products = value.products.flatMap((product) =>
        product.sellUnits.map((sellUnit) => ({
          id: product.id,

          sellUnitId: sellUnit.id,
          name: sellUnit.name,
          price: sellUnit.price,
        }))
      )

      if (id) {
        const { serverError } = await updatePriceLevel({
          id,
          data: { ...value, products },
        })
        if (serverError) {
          toast.error(serverError.message)
          onError?.()
        } else {
          onSuccess?.()
          toast.success("Price level saved.")
        }
      } else {
        const { serverError, data, validationErrors } = await createPriceLevel({
          data: { ...value, products },
        })
        if (serverError) {
          toast.error(serverError.message)
          onError?.()
        } else {
          onSuccess?.()
          toast.success("Price level saved.")
        }
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex h-[max(520px,70svh)] flex-col gap-4 overflow-hidden md:gap-6"
    >
      <div className="no-scrollbar flex-1 overflow-auto p-px">
        <FieldGroup>
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Name" placeholder="Wholesale" />
            )}
          />
          <form.AppField
            name="status"
            children={(field) => (
              <field.SelectField
                label="Status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            )}
          />
          <form.AppField
            name="appliesTo"
            children={(field) => (
              <field.RadioField
                label="Apply To"
                options={[
                  {
                    label: "All",
                    value: "all",
                    description: "Apply to all items",
                  },
                  {
                    label: "Selected Items",
                    value: "per_item",
                    description: "Apply to selected items",
                  },
                ]}
              />
            )}
          />

          {/* adjustment type */}
          <form.AppField
            name="adjustmentType"
            children={(field) => (
              <field.RadioField
                label="Adjustment Type"
                options={[
                  {
                    label: "Fixed Amount",
                    value: "fixed",
                    description: "Adjust by fixed amount",
                  },
                  {
                    label: "Percentage",
                    value: "percentage",
                    description: "Adjust by percentage",
                  },
                ]}
              />
            )}
          />
          {/* all items */}
          <form.Subscribe
            selector={(state) => ({
              appliesTo: state.values.appliesTo,
              type: state.values.adjustmentType,
            })}
            children={({ appliesTo, type }) => (
              <React.Fragment>
                <form.AppField
                  name="adjustmentValue"
                  children={(field) => (
                    <field.TextField
                      label="Adjustment Value"
                      inputMode="decimal"
                      description=" Use positive for markup and negative for discount."
                      className={appliesTo !== "all" ? "hidden" : ""}
                      prefix={type === "percentage" ? "%" : "$"}
                    />
                  )}
                />
                {/* per item  */}
                <form.Field
                  name="products"
                  mode="array"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                      <div
                        className={
                          appliesTo === "per_item"
                            ? "flex flex-col gap-4"
                            : "hidden"
                        }
                      >
                        <ProductSelector
                          selected={field.state.value?.map((t) => t.id)}
                          setSelectedChange={(value) => {
                            const { id, title, itemCode, image } = value
                            const index = field.state.value.findIndex(
                              (t) => t.id == id
                            )
                            if (index === -1) {
                              field.pushValue({
                                id,
                                title,
                                itemCode,
                                image,
                                sellUnits: value.sellUnits.map((su) => ({
                                  ...su,
                                  price: "",
                                  basePrice: su.price,
                                })),
                              })
                            }
                          }}
                        >
                          <Button
                            variant="outline"
                            aria-invalid={isInvalid}
                            className="justify-start"
                          >
                            <Plus /> Select items...
                            <Badge className="ml-auto">
                              {pluralize(
                                field.state.value.length,
                                `${field.state.value.length} item`
                              )}
                            </Badge>
                            <ChevronDown />
                          </Button>
                        </ProductSelector>
                        <div className="space-y-0.5">
                          {field.state.value?.map((item, itemIndex) => {
                            return (
                              <div
                                className="grid gap-3 rounded-xl border p-2"
                                key={item.id}
                              >
                                <div className="flex items-start gap-3">
                                  <Avatar
                                    className="rounded-xl *:rounded-xl"
                                    size="lg"
                                  >
                                    <AvatarImage src={item?.image as string} />
                                    <AvatarFallback>
                                      <ImageOff className="size-4" />
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="grid flex-1 gap-1">
                                    <h4 className="leading-tight font-medium whitespace-normal">
                                      {item.title}
                                    </h4>
                                    <span className="text-xs text-muted-foreground">
                                      {item.itemCode}
                                    </span>
                                  </div>
                                  <Button
                                    size="icon-sm"
                                    variant="destructive"
                                    onClick={() => field.removeValue(itemIndex)}
                                  >
                                    <TrashBinMinimalistic />
                                  </Button>
                                </div>
                                <div className="border-b border-dashed" />
                                {/* sell units */}
                                <div className="space-y-1">
                                  {/* Header */}
                                  <div className="grid grid-cols-[1fr_96px_1fr] gap-4 px-1">
                                    <span className="text-[11px] font-medium text-muted-foreground">
                                      Current Price
                                    </span>
                                    <span className="text-center text-[11px] font-medium text-muted-foreground">
                                      Adjustment
                                    </span>
                                    <span className="text-right text-[11px] font-medium text-muted-foreground">
                                      New Price
                                    </span>
                                  </div>

                                  {/* Prices */}
                                  {item.sellUnits.map((unit, unitIndex) => {
                                    const newPrice = getNewPrice(
                                      type,
                                      unit.basePrice,
                                      unit.price
                                    )
                                    const suffix =
                                      type === "percentage" ? "%" : "$"

                                    return (
                                      <div
                                        key={unit.id}
                                        className="grid grid-cols-[1fr_96px_1fr] items-center gap-4 px-1"
                                      >
                                        <div className="inline-flex items-baseline gap-px">
                                          <span className="text-xs font-medium text-muted-foreground">
                                            {formatUSD(unit.basePrice ?? "")}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            • {unit.name}
                                          </span>
                                        </div>

                                        <form.AppField
                                          name={`products[${itemIndex}].sellUnits[${unitIndex}].price`}
                                          children={(field) => (
                                            <field.TextField
                                              className="*:data-[slot=field-error]:hidden! *:data-[slot=input-group]:h-8"
                                              inputMode="decimal"
                                              suffix={suffix}
                                            />
                                          )}
                                        />
                                        <div className="inline-flex items-baseline justify-end gap-px">
                                          <span className="text-xs font-medium text-primary">
                                            {formatUSD(newPrice)}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            • {unit.name}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }}
                />
              </React.Fragment>
            )}
          />
        </FieldGroup>
      </div>
      <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:**:w-28">
        <Button variant="secondary" type="button" onClick={() => onCancel?.()}>
          Cancel
        </Button>

        <form.Subscribe
          selector={({ isSubmitting, canSubmit }) => ({
            isSubmitting,
            canSubmit,
          })}
          children={({ isSubmitting }) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          )}
        />
      </Field>
    </form>
  )
}
