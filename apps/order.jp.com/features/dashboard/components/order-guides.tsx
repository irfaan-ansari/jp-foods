"use client"
import { CardDescription, CardTitle } from "@jp/ui/components/card"
import { formatDate } from "@jp/utils"
import React from "react"
import { DashboardCard } from "./dashboard-card"
import { useInfiniteGuides } from "@/features/order-guide/guide.data"
import Link from "next/link"
import { Button } from "@jp/ui/components/button"
import { ArrowRight } from "lucide-react"

export const OrderGuides = () => {
  const { data } = useInfiniteGuides({ limit: 5 })
  const orders = data?.pages.flatMap((o) => o.data)

  return (
    <DashboardCard
      title="Order guides"
      description="Quickly reorder from a saved list"
      action={
        <Button asChild size="sm" variant="ghost">
          <Link href="/create/guides">
            Browse <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="divide-y">
        {orders?.map((order) => (
          <Link
            href="/create/guides"
            className="block px-4 py-3 hover:bg-secondary/50"
            key={order.id}
          >
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle>{order.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {formatDate(order.createdAt)}
                </CardDescription>
              </div>
              <div className="text-right text-sm font-medium">
                {order.items.length} items
              </div>
            </div>
          </Link>
        ))}
        {!orders?.length && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No order guides have been created yet.
          </p>
        )}
      </div>
    </DashboardCard>
  )
}
