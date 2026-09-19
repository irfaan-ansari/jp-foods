import React from "react"
import { getSellingUnits } from "@/features/product/product.utils"
import { Plus } from "lucide-react"
import { Guide } from "../guide.type"
import { Tooltip } from "@jp/ui/components/jp"
import { Button } from "@jp/ui/components/button"
import { ProductCard } from "@/features/product/components"
import { Sortable, SortableItem } from "@jp/ui/components/sortable"
import { toOrderItemInput } from "@/features/order-form/order-form.utils"
import { useOrderFormStore } from "@/features/order-form/order-form.store"
import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"

import { GuideDropdown } from "./guide-dropdown"

export const GuideBoard = ({ data }: { data: Guide }) => {
  const layout = useOrderFormUI((state) => state.layout)
  const filters = useOrderFormUI((state) => state.filters)

  const filteredItems = React.useMemo(() => {
    return data.items.filter((item) => {
      const q = filters.q?.trim().toLowerCase()

      if (!q) return true

      return (
        item.title.toLowerCase().includes(q) ||
        item.categories?.some((category) => category.toLowerCase().includes(q))
      )
    })
  }, [data.items, filters.q])

  if (filteredItems.length === 0) return null

  return (
    <div className="overflow-hidden rounded-3xl border bg-neutral-50">
      <GuideBoardHeader data={data} />
      <div className="rounded-t-3xl border-t bg-background p-4">
        <Sortable
          strategy={layout === "list" ? "vertical" : "grid"}
          value={filteredItems}
          getItemValue={(item) => String(item.id)}
          onValueChange={(v) => console.log(v)}
          data-layout={layout}
          className="grid grid-cols-2 gap-2 data-[layout=list]:flex data-[layout=list]:flex-col data-[layout=list]:gap-2 @md/page-content:grid-cols-2 @lg/page-content:grid-cols-3 @lg/page-content:gap-4 @2xl/page-content:grid-cols-4 @5xl/page-content:grid-cols-5 @6xl/page-content:grid-cols-5 @7xl/page-content:grid-cols-6"
        >
          {filteredItems.map((item) => (
            <SortableItem key={item.id} value={String(item.id)}>
              <ProductCard data={item} sortable={true} />
            </SortableItem>
          ))}
        </Sortable>
      </div>
    </div>
  )
}

const GuideBoardHeader = ({ data }: { data: Guide }) => {
  const addItem = useOrderFormStore((state) => state.addItem)

  const handleAddToCart = () => {
    for (const item of data.items) {
      if (getSellingUnits(item).length === 0) continue
      const orderItem = toOrderItemInput(item)
      addItem({
        ...orderItem,
      })
    }
  }
  return (
    <div className="relative flex items-center gap-3 px-4 py-3">
      <div className="flex flex-1 items-center gap-3">
        <div className="grid min-w-0">
          <span className="truncate text-base font-semibold">{data.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {data.description}
          </span>
        </div>
      </div>
      <div className="ml-auto flex gap-2">
        <Button
          size="sm"
          className="text-sm text-primary hover:text-primary"
          variant={"outline"}
          disabled
          onClick={handleAddToCart}
        >
          <Plus className="size-3.5" /> Add to Cart
        </Button>
        <Tooltip content="Menu">
          <GuideDropdown />
        </Tooltip>
      </div>
    </div>
  )
}
