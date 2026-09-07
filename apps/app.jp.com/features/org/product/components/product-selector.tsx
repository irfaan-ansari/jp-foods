"use client"

import React from "react"
import { ImageOff } from "lucide-react"

import {
  QueryState,
  PopDrawer,
  LoadMore,
  SearchBar,
  CopyButton,
} from "@jp/ui/components/jp"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@jp/ui/components/field"
import { formatUSD } from "@jp/utils"
import { Badge } from "@jp/ui/components/badge"
import { Checkbox } from "@jp/ui/components/checkbox"
import { useInfiniteProducts } from "@/features/org/product/product.data"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"

import { Product } from "../product.type"

type ProductType = Pick<
  Product,
  "id" | "title" | "itemCode" | "image" | "basePrice"
> & { sellUnitId: number }

type ProductSelectorProps = {
  selected: number | number[] | undefined
  setSelectedChange: (value: ProductType) => void
  children: React.ReactNode
}

export const ProductSelector = ({
  selected = [],
  setSelectedChange,
  children,
}: ProductSelectorProps) => {
  const [open, setOpen] = React.useState(false)
  const [filters, setFilters] = React.useState({ q: "", page: "1", cat: "" })
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
        image: t.image!,
        basePrice: t.basePrice!,
        sellUnits: t.sellUnits,
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
                <div key={item.id} className="py-2 not-last:border-b">
                  <Field orientation="horizontal">
                    <Checkbox
                      id={item.id}
                      checked={checked}
                      className="absolute top-2 right-2 size-4 rounded-full"
                      onCheckedChange={() => {
                        setSelectedChange({
                          ...item,
                          id: Number(item.id),
                          sellUnitId: Number(item.sellUnits[0].id),
                        })
                        if (!multiple) {
                          setOpen(false)
                        }
                      }}
                    />
                    <FieldContent>
                      <div className="flex flex-1 items-start gap-3">
                        <Avatar className="rounded-lg *:rounded-lg" size="lg">
                          <AvatarImage src={item?.image as string} />
                          <AvatarFallback>
                            <ImageOff className="size-4" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1 space-y-1">
                          <FieldTitle className="line-clamp-1">
                            {item.title}
                          </FieldTitle>
                          <span className="text-sm text-muted-foreground">
                            {item.itemCode}
                          </span>
                        </div>
                      </div>
                    </FieldContent>
                  </Field>
                </div>
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
