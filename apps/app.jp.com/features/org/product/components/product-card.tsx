import React from "react"
import Image from "next/image"
import { toast } from "sonner"
import { ImageOff } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { TrashBinMinimalistic } from "@solar-icons/react"

import { Button } from "@jp/ui/components/button"
import { Badge } from "@jp/ui/components/badge"
import { Skeleton } from "@jp/ui/components/skeleton"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { Card, CardContent, CardTitle } from "@jp/ui/components/card"

import type { Product } from "@/features/org/product/product.type"
import { ProductPrice } from "@/features/org/product/components/product-price"

import { deleteProduct } from "../product.action"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { StatusBadge } from "@/components/status-badge"
import { STATUS } from "../product.const"
import { CopyButton } from "@jp/ui/components/jp"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import Link from "next/link"

export const ProductCard = ({ data }: { data: Product }) => {
  const { searchParams } = useRouterStuff()

  return (
    <Card
      size="sm"
      className="relative h-full gap-0 bg-secondary py-0 shadow-xs transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="absolute top-2 left-2 z-2 flex flex-col gap-1">
        <ProductBadge status={data.status ?? "active"} />
        {data.isTaxable && (
          <Badge
            variant="warning-light"
            className="rounded-md backdrop-blur-lg"
          >
            Taxable
          </Badge>
        )}
      </div>
      <Link
        href={`/org/products/${data.id}?${searchParams}`}
        className="absolute inset-0 z-1"
      />
      <div className="relative z-0 flex aspect-video items-center justify-center bg-secondary">
        {data.image ? (
          <Image
            src={data.image!}
            width={160}
            height={90}
            alt={data.title}
            className="absolute inset-0 size-full object-contain mix-blend-multiply"
          />
        ) : (
          <ImageOff className="size-6 opacity-40" />
        )}
      </div>
      <CardContent className="flex flex-1 flex-col space-y-1.5 rounded-t-2xl bg-background py-4">
        <div className="flex items-center gap-2">
          <CopyButton
            value={data.itemCode}
            className="**:data-[slot=copy-value]:font-medium **:data-[slot=copy-value]:text-primary"
          />
        </div>

        <div className="text-xs font-medium text-muted-foreground uppercase">
          {data.categories?.join(" • ")}
        </div>

        <CardTitle className="mt-auto text-sm font-semibold">
          {data.title}
        </CardTitle>

        <div className="font-semibold">
          <ProductPrice
            sellUnits={data.sellUnits}
            stock={data.stock ?? ""}
            trackInventory={!!data.trackInventory}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export const ProductCardSkeleton = () => {
  return (
    <Card className="gap-0 bg-secondary py-0 shadow-none" size="sm">
      <Skeleton className="aspect-video" />
      <CardContent className="flex flex-col gap-2 rounded-t-2xl border-t bg-background py-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  )
}

export const ProductBadge = ({ status }: { status: string }) => {
  const map = STATUS[status]! ?? {}
  return <StatusBadge status={map} className="backdrop-blur-lg" />
}
