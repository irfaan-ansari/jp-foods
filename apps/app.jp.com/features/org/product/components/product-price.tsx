import { formatUSD } from "@jp/utils"

type PriceProps = {
  sellUnits: {
    name: string
    price: string | number
    inventoryPerUnit: string
  }[]
  trackInventory?: boolean
  stock?: string | number
}

export const ProductPrice = ({
  sellUnits,
  stock,
  trackInventory = false,
}: PriceProps) => {
  const prices = sellUnits

  return (
    <div className="grid w-full gap-0.5">
      {prices.map((item, index) => (
        <div key={`${item.name}-${index}`} className="flex items-center gap-2">
          <div className="flex items-baseline gap-0">
            <span className="text-sm font-semibold text-primary">
              {formatUSD(item.price)}
            </span>
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              | {item.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
