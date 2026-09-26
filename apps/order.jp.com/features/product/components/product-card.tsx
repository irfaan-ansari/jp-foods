import React from "react"
import Image from "next/image"
import type { PricedSellingUnit, Product } from "../product.type"
import { formatUSD } from "@jp/utils"
import { cn } from "@jp/ui/lib/utils"
import { format } from "date-fns/format"
import { getUnit, withCalculatedPrices } from "@jp/utils/commerce"
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

import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"
import { useOrderFormStore } from "@/features/order-form/order-form.store"
import { useOrderItemQuantity } from "@/features/order-form/order-form.hook"
import { toOrderItemInput } from "@/features/order-form/order-form.utils"
import ProductQuantityStepper from "./product-quantity"

type ProductCardState = {
  sellUnits: PricedSellingUnit[]
  selectedUnit?: PricedSellingUnit
  value: number | undefined
  setQuantity: (value: number | string) => void
  setUnitName: (name: string) => void
  actionProps: {
    role: "button"
    tabIndex: number
    onClick: () => void
    onKeyDown: (event: React.KeyboardEvent) => void
  }
}

export const ProductCard = React.memo(function ProductCard({
  data,
  sortable = false,
}: {
  data: Product
  sortable?: boolean
}) {
  const layout = useOrderFormUI((state) => state.layout)

  return (
    <ProductCardWrapper data={data}>
      {(state) =>
        layout === "list" ? (
          <ProductRow data={data} sortable={sortable} state={state} />
        ) : (
          <ProductGridCard data={data} sortable={sortable} state={state} />
        )
      }
    </ProductCardWrapper>
  )
})

const ProductCardWrapper = ({
  data,
  children,
}: {
  data: Product
  children: (state: ProductCardState) => React.ReactNode
}) => {
  const sellUnits = withCalculatedPrices(
    data.sellingUnits ?? [],
    !!data.catchWeight
  )
  const [unitName, setUnitName] = React.useState(() => sellUnits[0]?.name ?? "")
  const selectedUnit =
    sellUnits.find((unit) => unit.name === unitName) ?? sellUnits[0]
  const { value, setQuantity } = useOrderItemQuantity(
    data,
    selectedUnit?.name ?? ""
  )
  const addItem = useOrderFormStore((state) => state.addItem)
  const handleAddSelectedUnit = React.useCallback(() => {
    if (!selectedUnit) return
    addItem(toOrderItemInput(data, selectedUnit))
  }, [addItem, data, selectedUnit])

  return children({
    sellUnits,
    selectedUnit,
    value,
    setQuantity,
    setUnitName,
    actionProps: {
      role: "button",
      tabIndex: 0,
      onClick: handleAddSelectedUnit,
      onKeyDown: (event) => {
        if (event.key !== "Enter" && event.key !== " ") return
        event.preventDefault()
        handleAddSelectedUnit()
      },
    },
  })
}

const ProductGridCard = React.memo(function ProductGridCard({
  data,
  sortable = false,
  state,
}: {
  data: Product
  sortable?: boolean
  state: ProductCardState
}) {
  return (
    <Card
      size="sm"
      data-sortable={sortable}
      {...state.actionProps}
      className={`relative h-full cursor-pointer gap-0 bg-secondary py-0 shadow-xs transition select-none hover:-translate-y-0.5 hover:shadow-sm`}
    >
      {sortable && (
        <SortableItemHandle className="absolute top-2 right-2 z-1 inline-flex size-7 items-center justify-center rounded-lg bg-background/50 shadow-sm backdrop-blur-sm">
          <GripVertical className="size-4" />
        </SortableItemHandle>
      )}

      <ProductCheckbox id={data.id} className="p-2.5" />
      <HoverCard>
        <HoverCardTrigger>
          <ProductMedia
            data={data}
            className="aspect-video size-auto rounded-none"
          />
        </HoverCardTrigger>
        <HoverCardContent className="overflow-hidden p-0">
          <ProductMedia
            data={data}
            className="aspect-video size-auto rounded-none"
          />
        </HoverCardContent>
      </HoverCard>

      {data?.lastOrder?.id && (
        <Badge className="absolute top-2 left-2 h-4.5 text-xs uppercase">
          {data.lastOrder?.quantity} {data.lastOrder.unitName || "units"} •
          {format(data.lastOrder.createdAt ?? new Date(), "dd/MM")}
        </Badge>
      )}
      <CardContent
        className={`relative flex flex-1 flex-col space-y-1.5 rounded-t-2xl bg-background py-4`}
      >
        <div className="truncate text-[10px] font-medium text-muted-foreground uppercase">
          {data.categories?.join(" • ")}
        </div>
        <CardTitle className="mt-auto text-xs font-medium @3xl/page-content:text-sm">
          {data.title}
        </CardTitle>
        <ProductQuantityStepper
          value={state.value}
          onChange={state.setQuantity}
          sellUnits={state.sellUnits}
          uom={data.uom ?? ""}
          selectedUnit={state.selectedUnit}
          onSelectUnit={state.setUnitName}
          className="mt-2"
        />
      </CardContent>
    </Card>
  )
})

const ProductRow = React.memo(function ProductRow({
  data,
  sortable = false,
  state,
}: {
  data: Product
  sortable?: boolean
  state: ProductCardState
}) {
  return (
    <Card
      size="sm"
      {...state.actionProps}
      className={`relative h-full cursor-pointer gap-0 py-3 shadow-xs transition select-none hover:-translate-y-0.5 hover:shadow-sm`}
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
          <CardTitle>{data.title}</CardTitle>
          <div className="truncate text-xs font-medium text-muted-foreground uppercase">
            {data.categories?.join(" • ")}
          </div>
          {data?.lastOrder?.id && (
            <Badge className="text-xs uppercase">
              {data.lastOrder?.quantity} {data.lastOrder.unitName || "units"} •{" "}
              {format(data.lastOrder.createdAt ?? new Date(), "dd/MM")}
            </Badge>
          )}
          <div className="mt-auto text-sm font-semibold text-primary">
            {state.selectedUnit
              ? `${formatUSD(state.selectedUnit.calculatedPrice)} / ${getUnit(state.selectedUnit.name)?.label ?? state.selectedUnit.name}`
              : "Unavailable"}
          </div>
        </div>

        <ProductQuantityStepper
          value={state.value}
          onChange={state.setQuantity}
          sellUnits={state.sellUnits}
          uom={data.uom ?? ""}
          selectedUnit={state.selectedUnit}
          onSelectUnit={state.setUnitName}
          className="mx-0 w-full max-w-44 self-center"
        />
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

const ProductMedia = ({
  data,
  className,
}: {
  data: Product
  className?: string
}) => {
  return (
    <div
      className={cn(
        "relative flex aspect-square size-24 items-center justify-center rounded-xl bg-secondary",
        className
      )}
    >
      {data.image ? (
        <Image
          src={data.image}
          width={160}
          height={160}
          alt={data.title}
          className="absolute inset-0 size-full object-contain opacity-0 mix-blend-multiply transition"
          onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
        />
      ) : (
        <ImageOff className="size-6 opacity-40" />
      )}
    </div>
  )
}

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
