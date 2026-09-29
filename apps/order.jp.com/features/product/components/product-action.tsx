import React from "react"
import type { Product } from "../product.type"

import { formatUSD } from "@jp/utils"

import { Minus, Plus } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@jp/ui/components/tabs"

import { useOrderItemQuantity } from "@/features/order-form/order-form.hook"
import { Button } from "@jp/ui/components/button"
import { Badge } from "@jp/ui/components/badge"
import { cn } from "@jp/ui/lib/utils"

export function ProductUnits({
  data,
  className,
}: {
  data: Product
  className?: string
}) {
  const {
    selectedUnit,
    setSelectedUnit,

    sellingUnits,
  } = useOrderItemQuantity(data)

  if (!selectedUnit && sellingUnits.length === 0) {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <p className="text-sm text-muted-foreground">Unavailable</p>
      </div>
    )
  }

  return (
    <Tabs
      value={selectedUnit?.name}
      onValueChange={setSelectedUnit}
      className={className}
    >
      {sellingUnits.length > 1 && (
        <TabsList className="w-full rounded-xl p-0.5 group-data-horizontal/tabs:h-auto!">
          {sellingUnits.map((unit) => (
            <TabsTrigger
              key={unit.name}
              value={unit.name}
              className="h-6 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {unit.displayLabel}
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      {sellingUnits.map((unit) => (
        <TabsContent
          key={unit.name}
          value={unit.name}
          className="space-y-2 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-primary">
              {formatUSD(unit.price)}

              {unit.catchWeight && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {data.uom}
                </span>
              )}
            </span>
            {!unit.isDefault && (
              <Badge variant="warning-light">
                {unit.qtyPerUnit}
                {data.uom} Increment
              </Badge>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export const ProductCartAction = ({
  data,
  className,
}: {
  data: Product
  className?: string
}) => {
  const {
    quantity,
    addToCart,
    selectedUnit,

    cartItem,
  } = useOrderItemQuantity(data)

  return (
    <div className={cn("flex items-center rounded-xl border p-1", className)}>
      <Button
        variant="secondary"
        className="rounded-lg bg-primary/40 hover:bg-primary/50"
        size="icon-xs"
        disabled={!selectedUnit || quantity <= 0}
        onClick={(e) => {
          e.stopPropagation()
          addToCart(quantity - 1)
        }}
      >
        <Minus className="size-3.5" />
      </Button>
      <div className="flex min-w-20 flex-1 items-center justify-center gap-1">
        {/* <span className="text-center text-xs text-muted-foreground">
            {quantity}x{selectedUnit?.qtyPerUnit} {data.uom}
          </span>
          • */}
        <span className="text-center text-sm font-medium">
          {cartItem?.unitQuantity ?? 0} {data.uom}
        </span>
      </div>
      <Button
        variant="secondary"
        className="rounded-lg bg-primary/40 hover:bg-primary/50"
        size="icon-xs"
        disabled={!selectedUnit}
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  )
}
