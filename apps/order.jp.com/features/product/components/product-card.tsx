import React from "react"
import Image from "next/image"
import { Product } from "../product.type"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@jp/ui/components/input-group"
import { formatUSD } from "@jp/utils"
import { cn } from "@jp/ui/lib/utils"
import { format } from "date-fns/format"
import { getUnit } from "../product.utils"
import { Label } from "@jp/ui/components/label"
import { Badge } from "@jp/ui/components/badge"
import { PopDrawer } from "@jp/ui/components/jp"
import { Button } from "@jp/ui/components/button"
import { Skeleton } from "@jp/ui/components/skeleton"
import { Checkbox } from "@jp/ui/components/checkbox"
import { SortableItemHandle } from "@jp/ui/components/sortable"
import {
  Check,
  ChevronDown,
  GripVertical,
  ImageOff,
  Minus,
  Plus,
} from "lucide-react"
import { Card, CardContent, CardTitle } from "@jp/ui/components/card"
import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"
import { useOrderItemQuantity } from "@/features/order-form/order-form.hook"

export const ProductCard = React.memo(function ProductCard({
  data,
  sortable = false,
}: {
  data: Product
  sortable?: boolean
}) {
  const [sellUnitId, setSellUnitId] = React.useState(
    () =>
      (data.sellUnits.find((unit) => unit.isBaseUnit) ?? data.sellUnits[0])
        ?.id ?? 0
  )
  const selectedUnit = data.sellUnits.find((unit) => unit.id === sellUnitId)
  const { value, setQuantity } = useOrderItemQuantity(data, sellUnitId)
  const layout = useOrderFormUI((state) => state.layout)

  if (layout === "list") return <ProductRow data={data} sortable={sortable} />

  return (
    <Card
      size="sm"
      data-sortable={sortable}
      className={`relative h-full gap-0 bg-secondary py-0 shadow-xs transition select-none hover:-translate-y-0.5 hover:shadow-sm`}
      onClick={() =>
        selectedUnit &&
        setQuantity(
          value
            ? value + Number(selectedUnit.orderIncreament)
            : Number(selectedUnit.minQuantity)
        )
      }
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
      {data?.lastOrder?.id && (
        <Badge className="absolute top-2 left-2 h-4.5 text-xs uppercase">
          {data.lastOrder?.quantity} {data.lastOrder.unitName || "units"} •
          {format(data?.lastOrder?.createdAt, "dd/MM")}
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

        <QuantityStepper
          value={value}
          onChange={setQuantity}
          sellUnits={data.sellUnits}
          selectedUnit={selectedUnit}
          onSelectUnit={setSellUnitId}
          className="mt-2"
        />
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
  const [sellUnitId, setSellUnitId] = React.useState(
    () =>
      (data.sellUnits.find((unit) => unit.isBaseUnit) ?? data.sellUnits[0])
        ?.id ?? 0
  )
  const selectedUnit = data.sellUnits.find((unit) => unit.id === sellUnitId)
  const { value, setQuantity } = useOrderItemQuantity(data, sellUnitId)

  return (
    <Card
      size="sm"
      className={`relative h-full gap-0 py-3 shadow-xs transition select-none hover:-translate-y-0.5 hover:shadow-sm`}
      onClick={() =>
        selectedUnit &&
        setQuantity(
          value
            ? value + Number(selectedUnit.orderIncreament)
            : Number(selectedUnit.minQuantity)
        )
      }
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
              {format(data?.lastOrder?.createdAt, "dd/MM")}
            </Badge>
          )}
          <div className="mt-auto text-sm font-semibold text-primary">
            {selectedUnit
              ? `${formatUSD(selectedUnit.price)} / ${getUnit(selectedUnit.name)?.label ?? selectedUnit.name}`
              : "Unavailable"}
          </div>
        </div>

        <QuantityStepper
          value={value}
          onChange={setQuantity}
          sellUnits={data.sellUnits}
          selectedUnit={selectedUnit}
          onSelectUnit={setSellUnitId}
          className="grid self-center"
        />
      </CardContent>
    </Card>
  )
})

const QuantityStepper = ({
  value = 0,
  sellUnits,
  selectedUnit,
  onSelectUnit,
  onChange,
  className,
}: {
  value: number | undefined
  sellUnits: Product["sellUnits"]
  selectedUnit?: Product["sellUnits"][number]
  onSelectUnit: (id: number) => void
  className?: string
  onChange?: (newValue: number) => void
}) => {
  const [open, setOpen] = React.useState(false)
  const rawIncrement = Number(selectedUnit?.orderIncreament ?? 1)
  const rawMinimum = Number(selectedUnit?.minQuantity ?? 1)
  const increment =
    Number.isFinite(rawIncrement) && rawIncrement > 0 ? rawIncrement : 1
  const minQty = Number.isFinite(rawMinimum) && rawMinimum > 0 ? rawMinimum : 1

  const handleIncrement = () => {
    if (value < minQty) {
      onChange?.(minQty)
      return
    }

    onChange?.(value + increment)
  }

  const handleDecrement = () => {
    if (value <= minQty) {
      onChange?.(0)
      return
    }
    const newValue = value - increment
    onChange?.(newValue < minQty ? minQty : newValue)
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2",
        className
      )}
    >
      <PopDrawer
        open={open}
        setOpen={setOpen}
        trigger={
          <div
            className="grid min-w-0"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <span className="text-xs font-semibold text-primary">
              {formatUSD(selectedUnit?.price ?? 0)}
            </span>
            <span className="flex items-center justify-between gap-0 text-xs text-muted-foreground">
              {selectedUnit?.name} <ChevronDown className="size-3.5" />
            </span>
          </div>
        }
      >
        {sellUnits.map((unit) => (
          <Button
            variant="ghost"
            key={unit.id}
            className="justify-start"
            onClick={(e) => {
              e.stopPropagation()
              onSelectUnit(unit.id)
              setOpen(false)
            }}
          >
            {formatUSD(unit?.price ?? 0)}
            <span className="text-xs text-muted-foreground">| {unit.name}</span>
            {selectedUnit?.id === unit.id && (
              <Check className="ml-auto size-3.5 text-muted-foreground" />
            )}
          </Button>
        ))}
      </PopDrawer>

      <InputGroup
        className={cn("h-8 w-22")}
        onClick={(e) => e.stopPropagation()}
      >
        <InputGroupAddon className="pl-1">
          <InputGroupButton
            type="button"
            disabled={!selectedUnit}
            variant="ghost"
            className="size-6 hover:bg-primary/20!"
            onClick={(e) => {
              e.stopPropagation()
              handleDecrement()
            }}
          >
            <Minus />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          placeholder="0"
          className="px-px! text-center"
          value={value}
          disabled={!selectedUnit || increment > 1}
          onChange={(e) => {
            e.stopPropagation()

            const newValue = Number(e.target.value)

            if (Number.isFinite(newValue)) {
              onChange?.(
                newValue <= 0
                  ? 0
                  : minQty +
                      Math.ceil(Math.max(0, newValue - minQty) / increment) *
                        increment
              )
            }
          }}
        />
        <InputGroupAddon align="inline-end" className="pr-1">
          <InputGroupButton
            type="button"
            disabled={!selectedUnit}
            variant="ghost"
            className="size-6 hover:bg-primary/20!"
            onClick={(e) => {
              e.stopPropagation()
              handleIncrement()
            }}
          >
            <Plus />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

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
