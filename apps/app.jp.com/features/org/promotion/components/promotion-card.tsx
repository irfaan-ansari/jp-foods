"use client"

import Image from "next/image"
import React from "react"
import { ImageOff } from "lucide-react"

import { Card, CardContent, CardTitle } from "@jp/ui/components/card"
import {
  Avatar,
  AvatarFallback,
  AvatarGroupCount,
  AvatarImage,
} from "@jp/ui/components/avatar"
import { Skeleton } from "@jp/ui/components/skeleton"
import { Tooltip } from "@jp/ui/components/jp"
import { pluralize } from "@jp/utils"

import { StatusBadge } from "@/components/status-badge"
import type { Promotion } from "../promotion.type"
import { PLACEMENT, STATUS } from "../promotion.const"
import { PromotionDropdown } from "./promotion-dropdown"

export const PromotionCard = ({ data }: { data: Promotion }) => {
  const visibleProducts = data.products.slice(0, 4)
  const remainingProducts = Math.max(
    data.products.length - visibleProducts.length,
    0
  )

  return (
    <Card
      size="sm"
      className="relative h-full gap-0 bg-secondary py-0 shadow-xs transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="absolute top-2 left-2 z-2">
        <StatusBadge status={STATUS[data.status] ?? STATUS.inactive!} />
      </div>
      <div className="absolute top-2 right-2 z-2">
        <PromotionDropdown data={data} />
      </div>
      <div className="relative z-0 flex aspect-video items-center justify-center bg-secondary">
        {data.media ? (
          <Image
            src={data.media}
            width={320}
            height={180}
            alt={data.name}
            className="absolute inset-0 size-full object-contain mix-blend-multiply"
          />
        ) : (
          <ImageOff className="size-6 opacity-40" />
        )}
      </div>
      <CardContent className="flex flex-1 flex-col space-y-3 rounded-t-2xl bg-background py-4">
        <div className="space-y-1">
          <CardTitle className="line-clamp-1 text-sm font-semibold">
            {data.name}
          </CardTitle>
          <div className="text-xs font-medium text-muted-foreground">
            {PLACEMENT[data.placement]} •{" "}
            {data.target === "all"
              ? "All customers"
              : pluralize(data.teams.length, `${data.teams.length} customer`)}
          </div>
        </div>
        <div className="mt-auto flex items-center gap-px">
          {visibleProducts.map((product) => (
            <Tooltip content={product.title} key={product.id}>
              <Avatar className="size-8 overflow-hidden rounded-full">
                <AvatarImage asChild src={product.image as string}>
                  <Image
                    alt={product.title}
                    src={product.image as string}
                    width={32}
                    height={32}
                  />
                </AvatarImage>
                <AvatarFallback>
                  <ImageOff className="size-3.5" />
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          ))}
          {remainingProducts > 0 && (
            <AvatarGroupCount className="size-8 rounded-full">
              <span className="text-xs font-medium">+{remainingProducts}</span>
            </AvatarGroupCount>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const PromotionSkeleton = () => {
  return (
    <Card className="gap-0 bg-secondary py-0 shadow-none" size="sm">
      <Skeleton className="aspect-video" />
      <CardContent className="flex flex-col gap-3 rounded-t-2xl border-t bg-background py-4">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-px">
          {[...Array(4)].map((_, i) => (
            <Skeleton className="size-8 rounded-full" key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
