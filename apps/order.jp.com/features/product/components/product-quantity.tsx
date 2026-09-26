import React from "react"
import type { PricedSellingUnit } from "../product.type"

import { cn } from "@jp/ui/lib/utils"
import { formatUSD } from "@jp/utils"
import { normalizeQuantity } from "@jp/utils/commerce"
import { Minus, Plus } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@jp/ui/components/tabs"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@jp/ui/components/input-group"

export default function ProductQuantityStepper({
  value = 0,
  sellUnits,
  selectedUnit,
  onSelectUnit,
  onChange,
  className,
  uom,
}: {
  value: number | undefined
  sellUnits: PricedSellingUnit[]
  selectedUnit?: PricedSellingUnit
  onSelectUnit: (name: string) => void
  onChange?: (value: number) => void
  className?: string
  uom: string
}) {
  const quantity = value ?? 0
  const minimum = selectedUnit?.min ?? 1
  const increment = selectedUnit?.increament ?? 1
  const [draft, setDraft] = React.useState(String(quantity))
  React.useEffect(
    () => setDraft(String(quantity)),
    [quantity, selectedUnit?.name]
  )
  const commit = () => {
    const parsed = Number(draft)
    if (!Number.isFinite(parsed) || parsed < 0) {
      setDraft(String(quantity))
      return
    }
    const next = normalizeQuantity(parsed, minimum, increment)
    setDraft(String(next))
    onChange?.(next)
  }

  if (!selectedUnit) {
    return (
      <div
        className={cn("space-y-2", className)}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm text-muted-foreground">Unavailable</p>
      </div>
    )
  }

  return (
    <div
      className={cn("space-y-2", className)}
      onClick={(event) => event.stopPropagation()}
    >
      <Tabs
        value={selectedUnit.name}
        onValueChange={onSelectUnit}
        className="gap-2"
      >
        {sellUnits.length > 1 && (
          <TabsList className="w-full rounded-xl px-[3px] py-0.5 group-data-horizontal/tabs:h-8">
            {sellUnits.map((unit) => (
              <TabsTrigger
                key={unit.name}
                value={unit.name}
                className="rounded-lg"
              >
                {unit.displayLabel}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {sellUnits.map((unit) => (
          <TabsContent
            key={unit.name}
            value={unit.name}
            className="space-y-2 rounded-lg"
          >
            <div className="space-x-1">
              <span className="text-base font-bold text-primary">
                {formatUSD(unit.price)}
                {unit.catchWeight && (
                  <span className="text-xs font-normal text-muted-foreground">
                    {" / "}
                    {uom}
                  </span>
                )}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                • {unit.contains} {uom}
                {unit.catchWeight && " avg"}
              </span>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <InputGroup className="h-8">
        <InputGroupAddon className="pl-2!">
          <InputGroupButton
            type="button"
            variant="default"
            size="icon-xs"
            aria-label={`Decrease ${selectedUnit?.label ?? "quantity"}`}
            disabled={!selectedUnit || quantity === 0}
            onClick={() =>
              onChange?.(quantity <= minimum ? 0 : quantity - increment)
            }
          >
            <Minus className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>

        <InputGroupAddon align="inline-end" className="pr-2!">
          <InputGroupButton
            size="icon-xs"
            type="button"
            variant="default"
            aria-label={`Increase ${selectedUnit?.label ?? "quantity"}`}
            disabled={!selectedUnit}
            onClick={() =>
              onChange?.(quantity === 0 ? minimum : quantity + increment)
            }
          >
            <Plus className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          type="number"
          inputMode="decimal"
          min={0}
          step={increment}
          aria-label={`Quantity in ${selectedUnit?.name ?? "units"}`}
          disabled={!selectedUnit}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              event.currentTarget.blur()
            }
          }}
          className="rounded-none border-0 text-center shadow-none"
        />
      </InputGroup>
    </div>
  )
}
