import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@jp/ui/components/tabs"
import { formatUSD } from "@jp/utils"
import { Product } from "../product.type"
import { withCalculatedPrices } from "@jp/utils/commerce"

export const ProductPrice = ({ product }: { product: Product }) => {
  const sellUnits = withCalculatedPrices({
    ...product,
    pricingBasis: product.pricingBasis as any,
    splitUnits: product.splitUnits ?? [],
  })
  const defaultUnit = sellUnits.find((unit) => unit.isDefault)
  const stockUOM = product.stockUOM || ""
  const isPerUnit = product.pricingBasis !== "fixed"

  return (
    <Tabs
      key={JSON.stringify([
        defaultUnit?.name,
        sellUnits.map((unit) => unit.name),
      ])}
      defaultValue={defaultUnit?.name}
      className="gap-2"
    >
      {sellUnits.length > 1 && (
        <TabsList className="w-full rounded-xl p-0.5 gap-0.5 relative z-1 h-8!">
          {sellUnits.map((unit) => (
            <TabsTrigger
              key={unit.name}
              value={unit.name}
              className="rounded-lg"
            >
              {unit.name}
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      {sellUnits.map((unit) => {
        return (
          <TabsContent
            key={unit.name}
            value={unit.name}
            className="space-y-2 rounded-lg"
          >
            <div className="space-x-1">
              <span className="text-lg font-bold text-primary">
                {formatUSD(unit.displayPrice)}
                {isPerUnit && (
                  <span className="text-xs font-normal text-muted-foreground">
                    {" / "}
                    {stockUOM}
                  </span>
                )}
              </span>
              {unit.packSize > 1 && (
                <span className="text-xs text-muted-foreground">
                  • {unit.displayLabel}
                </span>
              )}
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
