"use client"
import { useAppForm } from "@/hooks/use-app-form"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { Button } from "@jp/ui/components/button"
import { Field, FieldError, FieldGroup } from "@jp/ui/components/field"
import { formatUSD, pluralize } from "@jp/utils"
import {
  ChevronDown,
  ImageOff,
  Plus,
  Loader2,
  GripVerticalIcon,
} from "lucide-react"
import React from "react"
import { OrderGuideFormSchema, orderGuideSchema } from "../order-guide.schema"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@jp/ui/components/sortable"
import { Tag, TrashBinTrash } from "@solar-icons/react"
import { ProductSelector } from "../../product/components/product-selector"
import { TeamSelector } from "../../team/components/team-selector"
import { Badge } from "@jp/ui/components/badge"
import { createOrderGuide, updateOrderGuide } from "../order-guide.action"
import { toast } from "sonner"

const OrderGuideForm = ({
  id,
  values,
  onSuccess,
  onError,
  onCancel,
}: {
  id?: number
  values: OrderGuideFormSchema
  onSuccess?: () => void
  onError?: () => void
  onCancel?: () => void
}) => {
  const { name, description, products, team } = values

  const form = useAppForm({
    defaultValues: {
      name,
      description,
      products,
      team,
    },
    validators: {
      onChange: orderGuideSchema,
    },

    onSubmit: async ({ value }) => {
      const { products, team, ...rest } = value
      const productIds = products.map((p) => Number(p.id))

      if (id) {
        const { serverError } = await updateOrderGuide({
          id,
          data: {
            ...rest,
            productIds,
            teamId: team.id,
          },
        })

        if (serverError) {
          toast.error(serverError.message)
        } else {
          onSuccess?.()
        }
      } else {
        const { serverError } = await createOrderGuide({
          data: {
            ...rest,
            productIds,
            teamId: team.id,
          },
        })

        if (serverError) {
          toast.error(serverError.message)
        } else {
          onSuccess?.()
        }
      }
    },
  })
  return (
    <>
      <div className="-mx-px no-scrollbar flex-1 overflow-auto px-px">
        <FieldGroup>
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50 p-2">
            <Avatar size="lg" className="rounded-xl **:rounded-xl">
              <AvatarFallback>
                <Tag className="size-5 text-sky-500" />
              </AvatarFallback>
            </Avatar>
            <form.Subscribe
              selector={(state) => state.values.products}
              children={(products) => (
                <div className="grid min-w-0 flex-1 text-sm">
                  <span>{pluralize(products.length, `10 item`)}</span>
                  <span className="text-xs text-muted-foreground">
                    {pluralize(products.length, `10 item`)} in this order guide
                  </span>
                </div>
              )}
            />
          </div>
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Name" placeholder="Weekly essentials" />
            )}
          />
          <form.AppField
            name="description"
            children={(field) => (
              <field.TextAreaField
                label="Description"
                placeholder="Daily produce, dairy and basic dry goods for line service"
              />
            )}
          />

          <form.Field
            name="team"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field>
                  <TeamSelector
                    selected={field.state.value.id}
                    setSelectedChange={(value) => {
                      field.handleChange({
                        ...value,
                      })
                    }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      type="button"
                      className="w-full justify-start text-muted-foreground"
                    >
                      <Plus />
                      {field.state.value?.name ? (
                        <span className="text-foreground">
                          {field.state.value?.name}
                        </span>
                      ) : (
                        "Select customer..."
                      )}
                      <ChevronDown className="ml-auto" />
                    </Button>
                  </TeamSelector>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="products"
            mode="array"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              const items = field.state.value
              return (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <ProductSelector
                      selected={items.map((item) => item.id)}
                      setSelectedChange={(value) => {
                        const index = items.findIndex(
                          (item) => Number(item.id) === Number(value.id)
                        )
                        if (index >= 0) {
                          field.removeValue(index)
                        } else {
                          field.pushValue({
                            ...value,
                          })
                        }
                      }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        type="button"
                        className="w-full justify-start text-muted-foreground"
                      >
                        <Plus />
                        <span className="flex-1 text-left">
                          Select products...
                        </span>
                        {field.state.value?.length > 0 && (
                          <Badge>{field.state.value?.length} Selected</Badge>
                        )}
                        <ChevronDown className="ml-auto" />
                      </Button>
                    </ProductSelector>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
                  <Sortable
                    value={items}
                    className="space-y-1"
                    onValueChange={(v) => {
                      const reordered = v.map((i) => ({
                        ...i,
                        productId: Number(i.id),
                      }))
                      field.handleChange(reordered)
                    }}
                    getItemValue={(item) => String(item.id)}
                    strategy="vertical"
                  >
                    {items.map((subField, idx) => (
                      <SortableItem
                        key={String(subField.id)}
                        value={String(subField.id)}
                        className="relative flex animate-in cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border bg-input/50 p-3 transition fade-in-50 select-none slide-in-from-bottom-10 data-[dragging=true]:opacity-100!"
                      >
                        <SortableItemHandle className="z-1">
                          <GripVerticalIcon className="size-4" />
                        </SortableItemHandle>

                        <Avatar
                          size="lg"
                          className="shrink-0 rounded-lg **:rounded-lg"
                        >
                          <AvatarImage src={subField?.image as string} />
                          <AvatarFallback>
                            <ImageOff className="size-4" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <p className="text-sm leading-tight font-medium">
                            {subField.title}
                          </p>
                          <Badge variant="invert">{subField.itemCode}</Badge>
                        </div>
                        <div className="self-center text-right font-semibold text-primary">
                          {formatUSD(Number(subField.basePrice ?? 0))}
                        </div>
                        <Button
                          size="icon-sm"
                          variant="destructive"

                          onClick={() => field.removeValue(idx)}
                        >
                          <TrashBinTrash />
                        </Button>
                      </SortableItem>
                    ))}
                  </Sortable>
                </div>
              )
            }}
          />
        </FieldGroup>
      </div>
      <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-28">
        <Button variant="outline" onClick={() => onCancel?.()}>
          Cancel
        </Button>

        <form.Subscribe
          selector={({ isSubmitting, canSubmit }) => ({
            isSubmitting,
            canSubmit,
          })}
          children={({ isSubmitting }) => (
            <Button disabled={isSubmitting} onClick={() => form.handleSubmit()}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          )}
        />
      </Field>
    </>
  )
}

export default OrderGuideForm
