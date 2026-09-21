"use client"

import React, { useState } from "react"
import { upload } from "@vercel/blob/client"
import { toast } from "sonner"
import {
  ChevronDown,
  ImageOff,
  ImageUp,
  Loader2,
  MousePointerClick,
  Plus,
  ShoppingCart,
} from "lucide-react"
import { TrashBinTrash } from "@solar-icons/react"

import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { Badge } from "@jp/ui/components/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@jp/ui/components/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@jp/ui/components/field"
import { formatUSD } from "@jp/utils"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

import { StatusBadge } from "@/components/status-badge"
import { ProductSelector } from "../../product/components/product-selector"
import { TeamSelector } from "../../team/components/team-selector"
import { createPromotion, updatePromotion } from "../promotion.action"
import { PLACEMENT, STATUS } from "../promotion.const"
import { PromotionFormValues, promotionSchema } from "../promotion.schema"
import { cn } from "@jp/ui/lib/utils"
import { Input } from "@jp/ui/components/input"

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

const placementOptions = [
  { label: "Sidebar", value: "sidebar" },
  { label: "Banner", value: "banner" },
  { label: "New Order", value: "new-order" },
  { label: "Cart", value: "cart" },
]

export const promotionFormValues: PromotionFormValues = {
  name: "",
  media: "",
  status: "active",
  placement: "sidebar",
  teams: [],
  products: [],
  triggerProducts: [],
}

type ProductListFieldProps = {
  label: string
  description: string
  items: PromotionFormValues["products"]
  className?: string
  error?: React.ReactNode
  onToggle: (value: PromotionFormValues["products"][number]) => void
  onRemove: (index: number) => void
}

export const PromotionForm = ({
  id,
  data,
}: {
  id?: number
  data?: PromotionFormValues
}) => {
  const [file, setFile] = useState<File | null>(null)

  const { router } = useRouterStuff()

  const form = useAppForm({
    defaultValues: data ?? promotionFormValues,
    validators: {
      onChange: promotionSchema,
    },
    onSubmit: async ({ value }) => {
      let media = value.media

      if (file && file instanceof File) {
        const blob = await upload(`promotions/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/v1/upload",
        })
        if (blob.url) media = blob.url
      }

      const payload = {
        name: value.name,
        media,
        status: value.status,
        placement: value.placement,
        teamIds: value.teams.map((team) => team.id),
        productIds: value.products.map((product) => product.id),
        triggerProductIds: value.triggerProducts.map((product) => product.id),
      }

      const result = id
        ? await updatePromotion({ id, data: payload })
        : await createPromotion({ data: payload })

      if (result.serverError || result.validationErrors || !result.data) {
        toast.error(
          result.serverError?.message ??
            "Unable to save promotion. Check the form values."
        )
        return
      }

      toast.success("Promotion saved.")
      form.reset({ ...value, media })
      setFile(null)
      if (!id && result.data.id) {
        router.push(`/org/promotions/${result.data.id}`)
      }
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith("image/")) {
      toast.error("Upload a valid image.")
      return
    }
    setFile(selected)
    form.setFieldValue("media", URL.createObjectURL(selected))
  }

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card size="sm" className="shadow-xs">
            <CardHeader>
              <CardTitle className="font-bold">General</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.TextField
                      label="Name"
                      placeholder="Promotion name"
                    />
                  )}
                />

                <form.AppField
                  name="placement"
                  children={(field) => (
                    <field.SelectField
                      label="Placement"
                      placeholder="Select..."
                      options={placementOptions}
                    />
                  )}
                />
                <form.AppField
                  name="status"
                  children={(field) => (
                    <field.SelectField
                      label="Status"
                      placeholder="Select..."
                      options={statusOptions}
                    />
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          <Card size="sm" className="shadow-xs">
            <CardHeader>
              <CardTitle className="font-bold">Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <form.Field
                name="teams"
                mode="array"
                children={(field) => {
                  const items = field.state.value
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field>
                      <FieldLabel>Customers</FieldLabel>

                      <TeamSelector
                        selected={items.map((item) => item.id)}
                        setSelectedChange={(value) => {
                          const index = items.findIndex(
                            (item) => item.id === value.id
                          )
                          if (index >= 0) field.removeValue(index)
                          else {
                            field.pushValue({
                              id: value.id,
                              name: value.name,
                              phoneNumber: "",
                              email: "",
                            })
                          }
                        }}
                      >
                        <Button
                          variant="outline"
                          type="button"
                          className="w-full justify-start text-muted-foreground"
                        >
                          <Plus />
                          <span className="flex-1 text-left">Select...</span>
                          {items.length > 0 && (
                            <Badge variant="primary-light">
                              {items.length} Selected
                            </Badge>
                          )}
                          <ChevronDown className="ml-auto" />
                        </Button>
                      </TeamSelector>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      {items.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((item, index) => (
                            <Badge
                              variant="secondary"
                              className="h-7 gap-1 rounded-lg px-2.5"
                              key={item.id}
                            >
                              {item.name}
                              <button
                                type="button"
                                onClick={() => field.removeValue(index)}
                              >
                                x
                              </button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <FieldDescription>
                          This promotion is visible to all customers. Choose the
                          customers that should see this promotion.
                        </FieldDescription>
                      )}
                    </Field>
                  )
                }}
              />
            </CardContent>
          </Card>

          <Card size="sm" className="shadow-xs">
            <CardHeader>
              <CardTitle className="font-bold">Cart Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Select the products that will trigger the popup when added to the cart. */}
              <form.Subscribe
                selector={(state) => state.values.placement}
                children={(placement) => {
                  return (
                    <React.Fragment>
                      <form.Field
                        name="products"
                        mode="array"
                        children={(field) => {
                          const items = field.state.value
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <ProductListField
                              label="Upsell Products"
                              description="The products this promotion offers. Depending on placement, they're
  either added to the cart directly or shown as an upsell."
                              items={items}
                              error={
                                isInvalid ? (
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                ) : undefined
                              }
                              onToggle={(value) => {
                                const index = items.findIndex(
                                  (item) => item.id === value.id
                                )
                                if (index >= 0) field.removeValue(index)
                                else field.pushValue(value)
                              }}
                              onRemove={(index) => field.removeValue(index)}
                            />
                          )
                        }}
                      />
                      <form.Field
                        name="triggerProducts"
                        mode="array"
                        children={(field) => {
                          const items = field.state.value
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <ProductListField
                              className={
                                !["cart", "new-order"].includes(placement)
                                  ? "hidden"
                                  : ""
                              }
                              label="Trigger Products"
                              description="When any of these products are added to the cart (or are
                  already in it), the upsell products above will be
                  displayed."
                              items={items}
                              error={
                                isInvalid ? (
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                ) : undefined
                              }
                              onToggle={(value) => {
                                const index = items.findIndex(
                                  (item) => item.id === value.id
                                )
                                if (index >= 0) field.removeValue(index)
                                else field.pushValue(value)
                              }}
                              onRemove={(index) => field.removeValue(index)}
                            />
                          )
                        }}
                      />
                    </React.Fragment>
                  )
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <div className="sticky top-20 space-y-6">
            <form.Subscribe
              selector={(state) => state.values}
              children={(state) => (
                <Card className="gap-0 bg-secondary py-0 shadow-xs" size="sm">
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-t-xl bg-secondary">
                    {/* product image */}
                    {state.media && (
                      <img
                        width={100}
                        height={100}
                        src={state.media}
                        alt={state.name || "Promotion preview"}
                        loading="eager"
                        className="absolute inset-0 size-full object-cover mix-blend-multiply transition ease-out"
                      />
                    )}

                    {/* upload image */}
                    <FieldLabel
                      htmlFor="image-upload"
                      className={cn(
                        "absolute inset-0 z-3 w-full flex-col justify-center rounded-t-2xl bg-secondary/80 backdrop-blur-lg transition hover:[&>svg]:-translate-y-1",
                        state.media ? "opacity-0 hover:opacity-100" : ""
                      )}
                    >
                      <ImageUp className="size-6 text-muted-foreground transition" />
                      <FieldLegend className="text-sm! text-muted-foreground">
                        Click to upload/replace image
                      </FieldLegend>

                      <Input
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        onChange={handleFileChange}
                      />
                    </FieldLabel>
                    <div className="absolute top-2 left-2">
                      <StatusBadge
                        status={STATUS[state.status] ?? STATUS.active!}
                      />
                    </div>
                  </div>
                  <CardContent className="space-y-3 rounded-t-2xl border-t bg-background p-4">
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-1 text-sm font-semibold">
                        {state.name || "Promotion"}
                      </CardTitle>
                      <div className="text-xs font-medium text-muted-foreground">
                        Placement: {PLACEMENT[state.placement]}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Visible to: {state.teams.length || "All"} Customers
                      </div>
                    </div>
                    <div className="flex items-center gap-px">
                      <AvatarGroup>
                        {state.products.slice(0, 10).map((product) => (
                          <Avatar
                            className="size-8 rounded-full"
                            key={product.id}
                          >
                            <AvatarImage src={product.image as string} />
                            <AvatarFallback>
                              <ImageOff className="size-3.5" />
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {state.products.length > 10 && (
                          <AvatarGroupCount>
                            +{state.products.length - 10}
                          </AvatarGroupCount>
                        )}
                      </AvatarGroup>
                    </div>
                  </CardContent>
                </Card>
              )}
            />

            <Card className="shadow-xs" size="sm">
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <MousePointerClick className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="grid gap-1">
                    <span className="font-medium text-foreground">
                      Uspell Products
                    </span>
                    <p className="text-sm text-muted-foreground">
                      the items you select here are added straight to the
                      customer's cart the moment they click the promotion image.
                    </p>
                  </div>
                </div>

                <form.Subscribe
                  selector={(state) => state.values.placement}
                  children={(placement) => {
                    const shouldShow = ["cart", "new-order"].includes(placement)
                    return (
                      <div
                        className={`flex gap-3 ${!shouldShow ? "hidden" : ""}`}
                      >
                        <ShoppingCart className="mt-0.5 size-4 shrink-0 text-primary" />

                        <div className="grid gap-1">
                          <span className="font-medium text-foreground">
                            Trigger Products
                          </span>
                          <p className="text-sm text-muted-foreground">
                            this promotion only appears once one of these
                            products is in the cart, either added just now or
                            already there. Once triggered, a popup opens
                            offering the products you chose above as an upsell.
                          </p>
                        </div>
                      </div>
                    )
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <form.Subscribe
        selector={(state) => ({
          name: state.values.name,
          isSubmitting: state.isSubmitting,
          isDirty: state.isDirty,
        })}
        children={({ name, isSubmitting, isDirty }) => (
          <div
            className={`sticky bottom-4 z-2 mx-auto mt-auto flex min-h-16 w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border-2 border-background bg-secondary/20 p-3 text-sm shadow-sm ring-1 ring-ring/20 backdrop-blur-2xl ${!isDirty ? "hidden" : null}`}
          >
            <div className="grid min-w-0 flex-1 gap-0.5 truncate font-medium">
              <p className="truncate text-sm font-medium">
                {name || "Promotion"}
              </p>
              <p className="text-xs text-muted-foreground">
                You have unsaved changes
              </p>
            </div>
            <Button
              variant="link"
              disabled={isSubmitting}
              onClick={() => {
                form.reset()
                setFile(null)
              }}
            >
              Reset
            </Button>
            <Button
              size="lg"
              className="w-28"
              disabled={isSubmitting}
              onClick={() => form.handleSubmit()}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : id ? (
                "Save"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        )}
      />
    </React.Fragment>
  )
}

const ProductListField = ({
  label,
  description,
  items,
  error,
  onToggle,
  onRemove,
  className,
}: ProductListFieldProps) => (
  <Field className={className}>
    <FieldLabel>{label}</FieldLabel>
    <FieldDescription>{description}</FieldDescription>
    <ProductSelector
      selected={items.map((item) => item.id)}
      status="active"
      setSelectedChange={(value) => {
        onToggle({
          id: value.id,
          title: value.title,
          image: value.image,
          itemCode: value.itemCode,
          price: value.price,
        })
      }}
    >
      <Button
        variant="outline"
        type="button"
        className="w-full justify-start text-muted-foreground"
      >
        <Plus />
        <span className="flex-1 text-left">Select...</span>
        {items.length > 0 && (
          <Badge variant="primary-light">{items.length} Selected</Badge>
        )}
        <ChevronDown className="ml-auto" />
      </Button>
    </ProductSelector>
    {error}
    {items.length > 0 && (
      <div className="space-y-1">
        {items.map((item, index) => (
          <div
            className="flex items-center gap-3 rounded-xl border bg-input/50 p-2"
            key={item.id}
          >
            <Avatar size="lg" className="rounded-lg **:rounded-lg">
              <AvatarImage src={item.image as string} />
              <AvatarFallback>
                <ImageOff className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
              <span className="text-xs text-muted-foreground">
                {item.itemCode}
              </span>
            </div>
            <span className="text-xs font-medium text-primary">
              {formatUSD(item.price)}
            </span>
            <Button
              size="icon-xs"
              variant="destructive"
              type="button"
              onClick={() => onRemove(index)}
            >
              <TrashBinTrash />
            </Button>
          </div>
        ))}
      </div>
    )}
  </Field>
)
