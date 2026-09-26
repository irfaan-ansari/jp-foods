import React from "react"
import type { PricedSellingUnit } from "../product.type"
import { Button } from "@jp/ui/components/button"
import { Input } from "@jp/ui/components/input"
import { cn } from "@jp/ui/lib/utils"
import { formatUSD } from "@jp/utils"
import { normalizeQuantity } from "@jp/utils/commerce"
import { Minus, Plus } from "lucide-react"

export default function ProductQuantityStepper({
  value = 0, sellUnits, selectedUnit, onSelectUnit, onChange, className, uom,
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
  React.useEffect(() => setDraft(String(quantity)), [quantity, selectedUnit?.name])
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
  return (
    <div className={cn("space-y-2", className)} onClick={(event) => event.stopPropagation()}>
      {sellUnits.length > 1 && (
        <div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1" aria-label="Selling unit">
          {sellUnits.map((unit) => (
            <Button key={unit.name} type="button" size="xs"
              variant={selectedUnit?.name === unit.name ? "outline" : "ghost"}
              aria-pressed={selectedUnit?.name === unit.name}
              onClick={() => onSelectUnit(unit.name)}>{unit.label}</Button>
          ))}
        </div>
      )}
      {selectedUnit ? (
        <div>
          <p className="font-bold text-primary">
            {formatUSD(selectedUnit.catchWeight ? selectedUnit.price : selectedUnit.calculatedPrice)}
            <span className="text-xs font-normal"> / {selectedUnit.catchWeight ? uom : selectedUnit.name}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedUnit.contains} {uom} per {selectedUnit.name}
            {selectedUnit.catchWeight && ` · Est. ${formatUSD(selectedUnit.calculatedPrice)}`}
          </p>
        </div>
      ) : <p className="text-sm text-muted-foreground">Unavailable</p>}
      <div className="grid grid-cols-[36px_1fr_36px] overflow-hidden rounded-xl border bg-background">
        <Button type="button" variant="secondary" className="h-full rounded-none"
          aria-label={`Decrease ${selectedUnit?.label ?? "quantity"}`}
          disabled={!selectedUnit || quantity === 0}
          onClick={() => onChange?.(quantity <= minimum ? 0 : quantity - increment)}><Minus className="size-4" /></Button>
        <Input type="number" inputMode="decimal" min={0} step={increment}
          aria-label={`Quantity in ${selectedUnit?.name ?? "units"}`}
          disabled={!selectedUnit} value={draft} onChange={(event) => setDraft(event.target.value)}
          onBlur={commit} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur() } }}
          className="rounded-none border-0 text-center shadow-none" />
        <Button type="button" variant="secondary" className="h-full rounded-none"
          aria-label={`Increase ${selectedUnit?.label ?? "quantity"}`} disabled={!selectedUnit}
          onClick={() => onChange?.(quantity === 0 ? minimum : quantity + increment)}><Plus className="size-4" /></Button>
      </div>
      {selectedUnit && quantity > 0 && <p className="text-xs font-medium">
        {selectedUnit.catchWeight ? "Estimated line total" : "Line total"}: {formatUSD(selectedUnit.calculatedPrice * quantity)}
      </p>}
    </div>
  )
}
