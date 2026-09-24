import React from "react"
import { PricedSellingUnit } from "../product.type"
import { Button } from "@jp/ui/components/button"
import { cn } from "@jp/ui/lib/utils"
import { formatUSD } from "@jp/utils"
import { Minus, Plus } from "lucide-react"
import { Badge } from "@jp/ui/components/badge"

const toNumber = (value: string | number | undefined, fallback = 0) => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

const pluralize = (value: number, label: string) =>
  `${value} ${label}${value === 1 ? "" : "s"}`

const ProductQuantityStepper = ({
  value = 0,
  sellUnits,
  selectedUnit,
  onSelectUnit,
  onChange,
  className,
}: {
  value: number | undefined
  sellUnits: PricedSellingUnit[]
  selectedUnit?: PricedSellingUnit
  onSelectUnit: (name: string) => void
  className?: string
  onChange?: (newValue: number) => void
}) => {
  const rawIncrement = toNumber(selectedUnit?.orderIncreament, 1)
  const rawMinimum = toNumber(selectedUnit?.minQuantity, 1)

  const increment = rawIncrement > 0 ? rawIncrement : 1
  const minQty = rawMinimum > 0 ? rawMinimum : 1
  const quantity = value ?? 0
  const selectedLabel =
    selectedUnit?.displayLabel ||
    selectedUnit?.unitLabel ||
    selectedUnit?.name ||
    "Unit"
  const unitName = selectedUnit?.displayUnit || selectedUnit?.name || "unit"
  const lineTotal = toNumber(selectedUnit?.price) * quantity
  const totalWeight = toNumber(selectedUnit?.unitConversion) * quantity

  const handleIncrement = () => {
    if (quantity < minQty) {
      onChange?.(minQty)
      return
    }

    onChange?.(quantity + increment)
  }

  const handleDecrement = () => {
    if (quantity <= minQty) {
      onChange?.(0)
      return
    }

    const newValue = quantity - increment
    onChange?.(newValue < minQty ? minQty : newValue)
  }

  const handleAdd = () => {
    if (!selectedUnit) return
    onChange?.(quantity > 0 ? quantity : minQty)
  }

  return (
    <div
      className={cn("space-y-2", className)}
      onClick={(event) => event.stopPropagation()}
    >
      {sellUnits.length > 1 && (
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-secondary p-px">
          {sellUnits.map((unit) => {
            const selected = selectedUnit?.name === unit.name

            return (
              <Button
                key={unit.name}
                type="button"
                size="xs"
                variant={selected ? "outline" : "ghost"}
                className={cn("uppercase")}
                onClick={() => onSelectUnit(unit.name)}
              >
                {unit.displayLabel || unit.unitLabel || unit.name}
              </Button>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-1">
        <p className="flex-1 text-base font-bold tracking-tight text-primary">
          {selectedUnit ? formatUSD(selectedUnit.price) : "—"}
        </p>
        <Badge variant="primary-light">
          {increment} {unitName} increments
        </Badge>
      </div>

      <div className="grid grid-cols-[36px_1fr_36px] overflow-hidden rounded-2xl border bg-background">
        <Button
          type="button"
          variant="secondary"
          className="h-full rounded-none"
          disabled={!selectedUnit}
          onClick={handleDecrement}
        >
          <Minus className="size-4" />
        </Button>
        <div className="grid place-items-center px-3 py-2 text-center">
          <p className="text-sm leading-none font-bold">
            {pluralize(quantity, selectedLabel)}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-full rounded-none px-0"
          disabled={!selectedUnit}
          onClick={handleIncrement}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* <p className="text-base font-bold text-center text-primary">
        {formatUSD(lineTotal)}
      </p>

      <Button
        type="button"
        className="w-full text-base font-semibold h-9 rounded-2xl"
        disabled={!selectedUnit}
        onClick={handleAdd}
      >
        Add to cart
      </Button> */}
    </div>
  )
}

export default ProductQuantityStepper
