"use client"

import React from "react"
import { toast } from "sonner"
import {
  ArrowRight,
  ChevronDown,
  ImageOff,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react"

import { Button } from "@jp/ui/components/button"
import { Badge } from "@jp/ui/components/badge"
import { useStore } from "@tanstack/react-form"
import { useAppForm } from "@/hooks/use-app-form"

import { Field, FieldGroup } from "@jp/ui/components/field"
import { PriceLevelFormSchema, priceLevelSchema } from "../price-level.schema"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { ProductSelector } from "@/features/org/product/components/product-selector"
import { formatUSD, pluralize } from "@jp/utils"
import { createPriceLevel, updatePriceLevel } from "../price-level.action"

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
      if (id) {
        const { serverError, data, validationErrors } = await updatePriceLevel({
          id,
          data: value,
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
          data: value,
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

  const { appliesTo: apply, adjustmentType: type } = useStore(
    form.store,
    (state) => state.values
  )

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
          <form.AppField
            name="adjustmentValue"
            children={(field) => (
              <field.TextField
                label="Adjustment Value"
                inputMode="decimal"
                description=" Use positive for markup and negative for discount."
                className={apply !== "all" ? "hidden" : ""}
                prefix={adjustmentType === "percentage" ? "%" : "$"}
              />
            )}
          />
          {/* per item  */}
          <form.Field
            name="products"
            mode="array"
            children={(field) => (
              <div
                className={
                  apply == "per_item" ? "flex flex-col gap-4" : "hidden"
                }
              >
                <ProductSelector
                  selected={field.state.value?.map((t) => t.id)}
                  setSelectedChange={(value) => {
                    const { id, title, itemCode, basePrice, image } = value
                    const index = field.state.value.findIndex((t) => t.id == id)
                    if (index === -1) {
                      field.pushValue({
                        id,
                        title,
                        itemCode,
                        image,
                        basePrice,
                        price: "",
                      })
                    }
                  }}
                >
                  <Button variant="outline" className="justify-start">
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
                  {field.state.value?.map((item, i) => {
                    const basePrice = Number(item.basePrice)
                    const percentage = Number(
                      form.getFieldValue(`products[${i}].price`) ?? 0
                    )

                    return (
                      <div
                        className="flex gap-3 rounded-xl border p-2"
                        key={item.id}
                      >
                        <div className="flex flex-1 items-start gap-3">
                          <Avatar className="rounded-xl *:rounded-xl" size="lg">
                            <AvatarImage src={item?.image as string} />
                            <AvatarFallback>
                              <ImageOff className="size-4" />
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="leading-tight font-medium whitespace-normal">
                              {item.title}
                            </h4>
                            <Badge variant="secondary">{item.itemCode}</Badge>
                          </div>
                        </div>

                        <div className="flex gap-1.5 self-center text-right">
                          <div
                            className={`flex w-16 items-center justify-between gap-1.5 ${type !== "fixed" ? "hidden" : ""}`}
                          >
                            <span className="text-xs font-medium text-primary">
                              {formatUSD(basePrice)}
                            </span>
                            <ArrowRight className="size-3 text-muted-foreground" />
                          </div>
                          <form.AppField
                            name={`products[${i}].price`}
                            children={(field) => (
                              <field.TextField
                                className="h-8 w-20 text-right"
                                placeholder="0"
                                inputMode="decimal"
                                suffix={type === "percentage" ? "%" : "$"}
                              />
                            )}
                          />
                          <div
                            className={`flex w-16 items-center justify-between gap-1.5 ${type !== "percentage" ? "hidden" : ""}`}
                          >
                            <ArrowRight className="size-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-primary">
                              {formatUSD(
                                basePrice + (basePrice * percentage) / 100
                              )}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="icon-xs"
                          variant="destructive"
                          className="self-center"
                          onClick={() => {
                            field.removeValue(i)
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
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
