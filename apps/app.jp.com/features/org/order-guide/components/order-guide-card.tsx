"use client"

import React from "react"
import Image from "next/image"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"

import { User } from "@solar-icons/react"
import { Skeleton } from "@jp/ui/components/skeleton"
import { OrderGuide } from "../order-guide.type"
import {
  Avatar,
  AvatarFallback,
  AvatarGroupCount,
  AvatarImage,
} from "@jp/ui/components/avatar"
import { ImageOff } from "lucide-react"
import { Tooltip } from "@jp/ui/components/jp"
import { formatDate } from "@jp/utils"
import { OrderGuideDropdown } from "./order-guide-dropdown"

export const OrderGuideCard = ({ data }: { data: OrderGuide }) => {
  const visibleProducts = data.products.slice(0, 4)
  const remainingProducts = Math.max(
    data.products.length - visibleProducts.length,
    0
  )
  return (
    <Card
      size="sm"
      className="h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
    >
      <CardHeader className="relative">
        <div className="flex items-start gap-2">
          <Avatar size="lg" className="overflow-hidden rounded-xl *:rounded-md">
            <AvatarImage src={data.team?.logo ?? ""} />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>{data.name}</CardTitle>
            <CardDescription>{data.team?.name}</CardDescription>
          </div>
        </div>
        <CardAction className="absolute top-0 right-4 flex items-center gap-2">
          <OrderGuideDropdown data={data} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-px">
          {visibleProducts.map((product, i) => (
            <Tooltip content={product.title}>
              <Avatar key={i} className="overflow-hidden">
                <AvatarImage asChild src={product.image as string}>
                  <Image
                    alt={product.title}
                    src={product.image as string}
                    width={32}
                    height={32}
                  />
                </AvatarImage>

                <AvatarFallback>
                  <ImageOff className="size-4" />
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          ))}
          {remainingProducts > 0 && (
            <AvatarGroupCount className="size-[38px] rounded-xl">
              <span className="">+{remainingProducts}</span>
            </AvatarGroupCount>
          )}
        </div>
        <div className="border-t border-dashed"></div>
        <span className="mt-auto flex items-center gap-2 truncate text-muted-foreground">
          Last updated • {formatDate(data.updatedAt)}
        </span>
      </CardContent>
    </Card>
  )
}

export const OrderGuideSkeleton = () => {
  return (
    <Card className="shadow-none" size="sm">
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="size-9" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
        <div className="flex gap-px">
          {[...Array(4)].map((_, i) => (
            <Skeleton className="size-9 rounded-xl" key={i} />
          ))}
        </div>
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  )
}
