import React from "react"
import Image from "next/image"
import type { Product } from "../product.type"

import { cn } from "@jp/ui/lib/utils"
import { format } from "date-fns/format"

import { Label } from "@jp/ui/components/label"
import { Badge } from "@jp/ui/components/badge"
import { Skeleton } from "@jp/ui/components/skeleton"
import { Checkbox } from "@jp/ui/components/checkbox"
import { SortableItemHandle } from "@jp/ui/components/sortable"
import { GripVertical, ImageOff } from "lucide-react"
import { Card, CardContent, CardTitle } from "@jp/ui/components/card"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@jp/ui/components/hover-card"

import { ProductUnits, ProductCartAction } from "./product-action"
import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"
import { useOrderItemQuantity } from "@/features/order-form/order-form.hook"

export const ProductItem = React.memo(function ProductItem({
  data,
  sortable = false,
  layoutOverride,
}: {
  data: Product
  sortable?: boolean
  layoutOverride?: "list" | "grid"
}) {
  const storeLayout = useOrderFormUI((state) => state.layout)
  const layout = layoutOverride ?? storeLayout

  if (layout === "list") {
    return <ProductRow data={data} sortable={sortable} />
  }

  return <ProductCard data={data} sortable={sortable} />
})

const ProductCard = React.memo(function ProductGridCard({
  data,
  sortable = false,
}: {
  data: Product
  sortable?: boolean
}) {
  const { quantity, addToCart } = useOrderItemQuantity(data)
  return (
    <Card
      size="sm"
      data-sortable={sortable}
      onClick={() => addToCart(quantity + 1)}
      className={`relative h-full cursor-pointer gap-0 bg-secondary py-0 shadow-xs transition select-none hover:-translate-y-0.5 hover:shadow-sm`}
    >
      {sortable && (
        <SortableItemHandle className="absolute top-2 right-2 z-1 inline-flex size-7 items-center justify-center rounded-lg bg-background/50 shadow-sm backdrop-blur-sm">
          <GripVertical className="size-4" />
        </SortableItemHandle>
      )}

      <ProductCheckbox id={data.id} className="p-2.5" />

      <ProductMedia
        data={data}
        className="aspect-video size-auto rounded-none"
      />

      <ProductLastOrder
        className="absolute top-2 left-2 h-4.5 text-[10px] uppercase"
        data={data}
      />

      <CardContent
        className={`relative flex flex-1 flex-col space-y-1.5 rounded-t-2xl bg-background px-3 py-4`}
      >
        <ProductMeta data={data} />
        <ProductUnits className="mt-auto" data={data} />
        <ProductCartAction data={data} />
      </CardContent>
    </Card>
  )
})

const ProductRow = React.memo(function ProductRow({
  data,
  sortable = false,
}: {
  data: Product
  sortable?: boolean
}) {
  const { quantity, addToCart } = useOrderItemQuantity(data)
  return (
    <Card
      size="sm"
      className={`relative h-full cursor-pointer gap-0 py-3 shadow-xs transition select-none hover:-translate-y-0.5 hover:shadow-sm`}
      onClick={() => addToCart(quantity + 1)}
    >
      <ProductCheckbox id={data.id} />
      {sortable && (
        <SortableItemHandle className="absolute top-1/2 left-1 z-1 inline-flex size-7 -translate-y-1/2 items-center justify-center self-center rounded-lg bg-background/50 shadow-sm backdrop-blur-sm">
          <GripVertical className="size-4" />
        </SortableItemHandle>
      )}

      <CardContent className="flex flex-row items-stretch gap-3 px-3">
        <ProductMedia data={data} />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ProductMeta data={data} />
          <ProductLastOrder data={data} />
        </div>

        <div className="flex gap-3 self-center">
          <ProductUnits className="min-w-36" data={data} />
          <ProductCartAction className="max-w-36 self-center" data={data} />
        </div>
      </CardContent>
    </Card>
  )
})

const ProductCheckbox = ({
  id,
  className,
}: {
  id: number
  className?: string
}) => {
  const isSelecting = useOrderFormUI((state) => state.selecting)
  const checked = useOrderFormUI((state) => state.selected.includes(id))
  const toggleSelected = useOrderFormUI((state) => state.toggleSelected)

  if (!isSelecting) return

  return (
    <Label
      htmlFor={`checkbox-${id}`}
      className={cn(
        "absolute inset-0 z-2 flex flex-col items-end bg-linear-to-bl from-black/10 p-3 group-data-[sortable=true]/card:hidden has-data-checked:bg-primary/20",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => toggleSelected(id)}
        id={`checkbox-${id}`}
        className="rounded-full p-2"
      />
    </Label>
  )
}

const ProductMeta = ({ data }: { data: Product }) => (
  <>
    <div className="truncate text-xs font-medium text-muted-foreground uppercase">
      {data.categories?.join(" • ")}
    </div>
    <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
  </>
)

const ProductImage = ({ data }: { data: Product }) =>
  data.image ? (
    <Image
      src={data.image}
      width={320}
      height={320}
      alt={data.title}
      className="absolute inset-0 size-full object-contain mix-blend-multiply"
    />
  ) : (
    <ImageOff className="size-6 opacity-40" />
  )

const ProductLastOrder = ({
  data,
  className,
}: {
  data: Product
  className?: string
}) => {
  if (!data.lastOrder?.id) return null
  return (
    <Badge className={cn("h-5 text-[10px] uppercase", className)}>
      {data.lastOrder.quantity} {data.lastOrder.unitName || "CS"} •{" "}
      {format(data.lastOrder.createdAt ?? new Date(), "dd/MM")}
    </Badge>
  )
}

const ProductMedia = ({
  data,
  className,
}: {
  data: Product
  className?: string
}) => (
  <HoverCard openDelay={300} closeDelay={100}>
    <HoverCardTrigger asChild>
      <div
        className={cn(
          "relative flex aspect-square size-24 items-center justify-center rounded-xl bg-secondary",
          className
        )}
      >
        <ProductImage data={data} />
      </div>
    </HoverCardTrigger>

    <HoverCardContent
      side="right"
      align="start"
      className="w-72 overflow-hidden bg-secondary p-0"
    >
      <div className="relative flex aspect-video items-center justify-center">
        <ProductImage data={data} />
      </div>
      <div className="space-y-2 rounded-t-2xl bg-background p-3">
        <ProductMeta data={data} />
        <ProductLastOrder data={data} />
        <ProductUnits data={data} />
        <ProductCartAction data={data} />
      </div>
    </HoverCardContent>
  </HoverCard>
)

export const ProductCardSkeleton = () => {
  return (
    <Card
      className="h-full gap-0 bg-secondary py-0 shadow-none group-data-[layout=list]/wrapper:flex-row group-data-[layout=list]/wrapper:bg-background group-data-[layout=list]/wrapper:p-4"
      size="sm"
    >
      <Skeleton className="aspect-video group-data-[layout=list]/wrapper:aspect-square group-data-[layout=list]/wrapper:size-24" />
      <CardContent className="flex flex-col gap-2 rounded-t-2xl bg-background py-4 group-data-[layout=list]/wrapper:flex-1 group-data-[layout=list]/wrapper:py-0">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full group-data-[layout=list]/wrapper:hidden" />
        <div className="flex h-8 gap-2 *:flex-1">
          <Skeleton />
          <Skeleton />
        </div>
      </CardContent>
    </Card>
  )
}
