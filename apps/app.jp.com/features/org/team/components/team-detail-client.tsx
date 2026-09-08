import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { IconTile } from "@jp/ui/components/icon-tile"
import {
  Box,
  DollarMinimalistic,
  Inbox,
  Wallet,
  WalletMoney,
} from "@solar-icons/react"
import React from "react"
import { TeamAnalytics } from "../team.type"
import { formatDate, formatUSD } from "@jp/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { ImageOff } from "lucide-react"
import { OrderStatusBadge } from "../../order/components/order-card"

export const TeamDetailClient = ({ data }: { data: TeamAnalytics }) => {
  const { recentOrders, summary, topCategories, range, topProducts } = data

  return (
    <div className="grid grid-cols-1 gap-4 @5xl/page-content:grid-cols-3 @5xl/page-content:gap-6">
      <div className="space-y-4 @5xl/page-content:col-span-2 @5xl/page-content:space-y-6">
        <div className="grid grid-cols-1 gap-4 @5xl/page-content:grid-cols-2 @5xl/page-content:gap-6">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
              <CardTitle className="mt-6 text-3xl font-bold">
                {summary.totalOrders}
              </CardTitle>
              <CardAction>
                <IconTile variant="elevated">
                  <Inbox className="size-4 text-green-600" />
                </IconTile>
              </CardAction>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Total Spend</CardTitle>
              <CardTitle className="mt-6 text-3xl font-bold">
                {formatUSD(summary.totalSpend)}
              </CardTitle>

              <CardAction>
                <IconTile variant="elevated">
                  <DollarMinimalistic className="size-4 text-purple-600" />
                </IconTile>
              </CardAction>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Average Order Value</CardTitle>
              <CardTitle className="mt-6 text-3xl font-bold">
                {formatUSD(summary.averageOrderValue)}
              </CardTitle>

              <CardAction>
                <IconTile variant="elevated">
                  <Wallet className="size-4 text-yellow-600" />
                </IconTile>
              </CardAction>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Open Orders</CardTitle>
              <CardTitle className="mt-6 text-3xl font-bold">
                {summary.activeOrders}
              </CardTitle>
              <CardAction>
                <IconTile variant="elevated">
                  <Box className="size-4 text-sky-600" />
                </IconTile>
              </CardAction>
            </CardHeader>
          </Card>
        </div>
        <Card
          size="sm"
          className="bg-linear-to-b from-sky-50 to-green-50 ring-3 ring-sky-100"
        >
          <CardHeader>
            <CardTitle>Available Credit</CardTitle>
            <div className="flex items-end gap-1">
              <CardTitle className="mt-6 text-3xl font-bold">$520</CardTitle>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">$1020</span>
            </div>
            <CardAction>
              <IconTile variant="elevated">
                <WalletMoney className="size-4 text-amber-600" />
              </IconTile>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="h-2 rounded-full bg-neutral-200">
              <div className="h-full w-1/2 rounded-full bg-lime-500"></div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-4 @8xl/page-content:grid-cols-2 @8xl/page-content:gap-6">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {topCategories.length === 0 && (
                <span className="text-muted-foreground">
                  No category data in this period
                </span>
              )}
              {topCategories.map((cat) => (
                <div
                  className="flex flex-1 items-start gap-3 not-first:pt-2 not-last:pb-2"
                  key={cat.name}
                >
                  <div className="min-w-0 flex-1 space-y-0">
                    <span className="line-clamp-1 font-medium">{cat.name}</span>
                  </div>
                  <div className="grid">
                    <span className="text-right text-muted-foreground">
                      Unit {cat.quantity}
                    </span>
                    <span className="font-medium">{formatUSD(cat.total)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {topProducts.length === 0 && (
                <span className="text-muted-foreground">
                  No product data in this period
                </span>
              )}
              {topProducts.map((product) => (
                <div
                  className="flex flex-1 items-start gap-3 not-first:pt-2 not-last:pb-2"
                  key={product.id}
                >
                  <Avatar className="rounded-lg *:rounded-lg" size="lg">
                    <AvatarImage src={product?.image as string} />
                    <AvatarFallback>
                      <ImageOff className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-0">
                    <span className="line-clamp-1 font-medium">
                      {product.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {product.itemCode}
                    </span>
                  </div>
                  <div className="grid">
                    <span className="text-right text-muted-foreground">
                      Unit {product.quantity}
                    </span>
                    <span className="font-medium">
                      {formatUSD(product.total)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <Card
          size="sm"
          className="bg-secondary/50 @5xl/page-content:sticky @5xl/page-content:top-20"
        >
          <CardHeader>
            <CardTitle className="text-base font-bold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {recentOrders.length === 0 && (
              <span className="text-muted-foreground">
                No orders in this period
              </span>
            )}
            {recentOrders.map((order, i) => (
              <div
                className="flex items-start gap-4 not-first:pt-2 not-last:pb-2"
                key={order.id}
              >
                <div className="grid flex-1 gap-1">
                  <div className="flex gap-2">
                    <span className="font-medium">#{order.id}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <span className="font-medium">{formatUSD(order.total)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
