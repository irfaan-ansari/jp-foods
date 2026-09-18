import { formatUSD } from "@jp/utils"

export const ProductPrice = ({
  price,
  unit,
}: {
  price: string
  unit: string
}) => {
  return (
    <div className="grid w-full gap-0.5">
      <div className="flex items-end">
        <span className="text-sm font-semibold text-primary">
          {formatUSD(price)}
        </span>
        <span className="text-xs font-normal text-muted-foreground">
          / {unit}
        </span>
      </div>
    </div>
  )
}
