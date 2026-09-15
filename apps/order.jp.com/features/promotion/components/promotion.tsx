"use client"

import React from "react"
import { toast } from "sonner"
import Image from "next/image"
import { motion } from "motion/react"
import type { Promotion as PromotionType } from "../promotion.type"
import { QueryBoundary } from "@/components/query-boundry"
import { usePromotions } from "@/features/promotion/promotion.data"
import { useOrderFormStore } from "@/features/order-form/order-form.store"
import { formatUSD } from "@jp/utils"
import { Button } from "@jp/ui/components/button"
import { ImageOff, Plus, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { useOrderItemQuantity } from "@/features/order-form/order-form.hook"

const variants = {
  sidebar: SidebarPromotion,
  banner: BannerPromotion,
  "new-order": NewOrderPromotion,
}

type PromotionProps = {
  placement: keyof typeof variants
}

export function Promotion({ placement }: PromotionProps) {
  const promotions = usePromotions()
  const Component = variants[placement]

  return (
    <QueryBoundary
      query={promotions}
      error={(err) => <span className="hidden" />}
      loading={null}
    >
      {({ data }) => (
        <>
          {data
            ?.filter((promotion) => promotion?.placement?.includes(placement))
            .map((promotion) => (
              <Component key={promotion.id} data={promotion} />
            ))}
        </>
      )}
    </QueryBoundary>
  )
}

function SidebarPromotion({ data }: { data: PromotionType }) {
  return (
    <div className="p-2">
      <div className="flex rounded-xl transition hover:-translate-y-0.5">
        <Image
          src={data.media!}
          alt={data.name!}
          width={500}
          height={500}
          className="h-36 w-auto rounded-xl object-cover"
        />
      </div>
    </div>
  )
}

function BannerPromotion({ data }: { data: PromotionType }) {
  return (
    <div className="flex rounded-3xl transition hover:-translate-y-0.5">
      <Image
        src={data.media!}
        alt={data.name!}
        width={500}
        height={500}
        className="h-36 w-full rounded-3xl object-cover"
      />
    </div>
  )
}

/** upsell */
function NewOrderPromotion({ data }: { data: PromotionType }) {
  const items = useOrderFormStore((s) => s.order.items)

  const previousCount = React.useRef(items.length)

  React.useEffect(() => {
    const wasAdded = items.length > previousCount.current
    previousCount.current = items.length

    if (!wasAdded) return

    const lastAddedProductId = items.at(-1)?.id
    if (!lastAddedProductId) return

    if (!data.triggerProductIds?.includes(lastAddedProductId)) return

    showPromotionProducts(data.products)
  }, [items, data])

  return null
}

const TOAST_DURATION = 8000
const GAP = -3000
export function showPromotionProducts(products: PromotionType["products"]) {
  products.forEach((product, index) => {
    setTimeout(
      () => {
        toast.custom((id) => <PromotionToast product={product} id={id} />, {
          duration: TOAST_DURATION,
          dismissible: true,
        })
      },
      index * (TOAST_DURATION + GAP)
    )
  })
}

// toast
function PromotionToast({
  id,
  product,
}: {
  id: number | string
  product: PromotionType["products"][number]
}) {
  const sellUnit =
    product.sellUnits.find((unit) => unit.isBaseUnit) ?? product.sellUnits[0]
  const { setQuantity, value } = useOrderItemQuantity(
    product,
    sellUnit?.id ?? 0
  )
  return (
    <div
      className="relative flex w-sm items-center gap-2 overflow-hidden rounded-2xl border bg-background p-3 shadow-lg"
      onClick={() => {
        if (sellUnit)
          setQuantity(
            value
              ? value + Number(sellUnit.orderIncreament)
              : Number(sellUnit.minQuantity)
          )
        toast.dismiss(id)
      }}
    >
      <Button
        size="icon-xs"
        variant="outline"
        className="absolute top-2 right-2"
        onClick={(e) => {
          e.stopPropagation()
          toast.dismiss(id)
        }}
      >
        <X />
      </Button>

      <Button size="xs" className="absolute right-3 bottom-3">
        <Plus />
        Add to cart
      </Button>

      <Avatar className="size-20 shrink-0 rounded-2xl border bg-secondary **:rounded-2xl">
        <AvatarImage src={product.image ?? ""} className="object-contain p-1" />
        <AvatarFallback>
          <ImageOff className="size-6 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="line-clamp-2 text-sm font-semibold">{product.title}</h4>
        <p className="truncate text-[11px] tracking-wide text-muted-foreground uppercase">
          {product.categories?.join(" • ")}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-primary">
            {sellUnit
              ? `${formatUSD(sellUnit.price)} / ${sellUnit.name}`
              : "Unavailable"}
          </span>
        </div>
      </div>
      <motion.div
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: TOAST_DURATION / 1000,
          ease: "linear",
        }}
      />
    </div>
  )
}
