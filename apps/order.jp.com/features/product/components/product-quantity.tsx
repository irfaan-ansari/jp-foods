import React from "react"
import { SellUnit } from "../product.type"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@jp/ui/components/input-group"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp"
import { cn } from "@jp/ui/lib/utils"
import { formatUSD } from "@jp/utils"
import { Check, ChevronDown, Minus, Plus } from "lucide-react"
import { getUnit } from "../product.utils"

const ProductQuantityStepper = ({
  value = 0,
  sellUnits,
  selectedUnit,
  onSelectUnit,
  onChange,
  className,
}: {
  value: number | undefined
  sellUnits: SellUnit[]
  selectedUnit?: SellUnit
  onSelectUnit: (name: string) => void
  className?: string
  onChange?: (newValue: number) => void
}) => {
  const [open, setOpen] = React.useState(false)

  const rawIncrement = Number(selectedUnit?.orderIncreament ?? 1)
  const rawMinimum = Number(selectedUnit?.minQuantity ?? 1)

  const increment =
    Number.isFinite(rawIncrement) && rawIncrement > 0 ? rawIncrement : 1
  const minQty = Number.isFinite(rawMinimum) && rawMinimum > 0 ? rawMinimum : 1
  const canSelectUnit = sellUnits.length > 1
  const canEditQuantity = increment === 1

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

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()

    const newValue = Number(event.target.value)

    if (!Number.isFinite(newValue)) return

    onChange?.(
      newValue <= 0
        ? 0
        : minQty +
            Math.ceil(Math.max(0, newValue - minQty) / increment) * increment
    )
  }

  const selectedUnitValue =
    getUnit(selectedUnit?.name)?.value ?? selectedUnit?.name ?? "Unit"

  const unitSummary = (
    <div className="grid min-w-0 leading-tight">
      <span className="truncate text-xs font-semibold text-primary">
        {formatUSD(selectedUnit?.price ?? 0)}
        <span className="font-normal text-muted-foreground">
          / {selectedUnitValue}
        </span>
      </span>
      <span className="truncate text-left text-[10px] text-muted-foreground">
        Min {minQty}, step {increment}
      </span>
    </div>
  )

  return (
    <div
      className={cn(
        "-mx-2 flex flex-nowrap items-center justify-between gap-0.5",
        className
      )}
      onClick={(event) => event.stopPropagation()}
    >
      {canSelectUnit ? (
        <PopDrawer
          open={open}
          setOpen={setOpen}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!selectedUnit}
              className="h-8 justify-between gap-2 px-2"
            >
              {unitSummary}
            </Button>
          }
        >
          <div className="grid gap-0.5 p-1">
            {sellUnits.map((unit) => {
              const unitLabel = getUnit(unit.name)?.label ?? unit.name
              const isSelected = selectedUnit?.name === unit.name

              return (
                <Button
                  type="button"
                  variant={isSelected ? "secondary" : "ghost"}
                  key={unit.name}
                  className="h-auto justify-start gap-3 px-3 py-2 text-left"
                  onClick={() => {
                    onSelectUnit(unit.name)
                    setOpen(false)
                  }}
                >
                  <span className="grid min-w-0 flex-1">
                    <span className="truncate text-sm font-medium">
                      {unitLabel}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {formatUSD(unit.price ?? 0)} | Min {unit.minQuantity},
                      step {unit.orderIncreament}
                    </span>
                  </span>
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </Button>
              )
            })}
          </div>
        </PopDrawer>
      ) : (
        <div className="inline-flex min-w-0 px-3 py-2">{unitSummary}</div>
      )}

      <InputGroup className="h-8 min-w-18 flex-1 bg-background">
        <InputGroupAddon className="pl-1.5">
          <InputGroupButton
            type="button"
            disabled={!selectedUnit}
            variant="ghost"
            className="size-6 hover:bg-primary/40!"
            onClick={handleDecrement}
          >
            <Minus className="size-3.5" />
          </InputGroupButton>
        </InputGroupAddon>

        {canEditQuantity ? (
          <InputGroupInput
            inputMode="numeric"
            min={0}
            step={increment}
            placeholder="0"
            className="px-px! text-center"
            value={value}
            disabled={!selectedUnit}
            onChange={handleQuantityChange}
          />
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-center px-1 text-sm font-medium tabular-nums">
            {value}
          </div>
        )}

        <InputGroupAddon align="inline-end" className="pr-1.5">
          <InputGroupButton
            type="button"
            disabled={!selectedUnit}
            variant="ghost"
            className="size-6 hover:bg-primary/40!"
            onClick={handleIncrement}
          >
            <Plus className="size-3.5" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default ProductQuantityStepper
