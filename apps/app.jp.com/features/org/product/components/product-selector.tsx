"use client"

import React from "react"
import { ImageOff } from "lucide-react"

import {
  QueryState,
  PopDrawer,
  LoadMore,
  SearchBar,
} from "@jp/ui/components/jp"
import { formatUSD } from "@jp/utils"
import { Checkbox } from "@jp/ui/components/checkbox"
import { useInfiniteProducts } from "@/features/org/product/product.data"
import { FieldContent, FieldLabel, FieldTitle } from "@jp/ui/components/field"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"

type ProductType = Pick<
  import("@jp/db").ProductSelectType,
  "id" | "title" | "itemCode" | "price" | "unit" | "sellUnits"
> & { image: string }

type ProductSelectorProps = {
  selected: number | number[] | undefined
  setSelectedChange: (value: ProductType) => void
  children: React.ReactNode
  status?: string
}

export const ProductSelector = ({
  status,
  selected = [],
  setSelectedChange,
  children,
}: ProductSelectorProps) => {
  const [open, setOpen] = React.useState(false)
  const [filters, setFilters] = React.useState({
    q: "",
    page: "1",
    cat: "",
    ...(status ? { status } : {}),
  })
  const multiple = Array.isArray(selected)

  const {
    data,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
  } = useInfiniteProducts(filters)

  const options = React.useMemo(() => {
    const products = data?.pages.flatMap((page) => page.data) ?? []
    return (
      products.flatMap((t) => ({
        id: String(t.id),
        title: t.title!,
        itemCode: t.itemCode!,
        status: t.status!,
        image: t.image ?? "",
        sellUnits: t.sellUnits,
        price: t.price,
        unit: t.unit,
      })) ?? []
    )
  }, [data])

  const isSelected = (id: number) =>
    multiple
      ? Array.isArray(selected) && selected.includes(id)
      : selected === id

  return (
    <PopDrawer trigger={children} open={open} setOpen={setOpen} modal={true}>
      <div className="flex max-h-[max(520px,70svh)] flex-col gap-1.5 md:max-h-80">
        <SearchBar
          className="max-w-full"
          onSearch={(value) => setFilters({ ...filters, q: value })}
        />
        <div className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto">
          <QueryState
            isPending={isPending}
            isError={isError}
            error={error}
            isEmpty={options.length === 0}
          >
            {options.map((item) => {
              const checked = isSelected(Number(item.id))
              return (
                <FieldLabel
                  key={item.id}
                  className="relative w-full rounded-xl px-2.5 py-1.5 hover:bg-secondary has-data-checked:bg-secondary"
                >
                  <FieldContent className="flex-1 gap-0">
                    <div className="flex flex-1 items-start gap-3">
                      <Avatar size="lg">
                        <AvatarImage src={item?.image as string} />
                        <AvatarFallback>
                          <ImageOff className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 space-y-0">
                        <FieldTitle className="line-clamp-1">
                          {item.title}
                        </FieldTitle>
                        <span className="text-xs text-muted-foreground">
                          {item.itemCode}
                        </span>
                      </div>

                      <div className="shrink-0 text-xs text-muted-foreground">
                        {formatUSD(item.price)} / {item.unit}
                      </div>
                    </div>
                  </FieldContent>
                  <Checkbox
                    id={item.id}
                    checked={checked}
                    className="rounded-full"
                    onCheckedChange={() => {
                      setSelectedChange({
                        ...item,
                        id: Number(item.id),
                      })
                      if (!multiple) {
                        setOpen(false)
                      }
                    }}
                  />
                </FieldLabel>
              )
            })}
          </QueryState>

          <LoadMore
            hasMore={hasNextPage}
            loading={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        </div>
      </div>
    </PopDrawer>
  )
}
