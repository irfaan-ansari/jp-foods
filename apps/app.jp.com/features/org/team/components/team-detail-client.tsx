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
  Letter,
  MapPoint,
  Smartphone,
  UserCircle,
  Wallet,
} from "@solar-icons/react"
import React from "react"
import type { TeamAnalytics, TeamDetail } from "../team.type"
import { formatDate, formatUSD } from "@jp/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { ImageOff } from "lucide-react"
import { OrderStatusBadge } from "@/features/org/order/components/order-card"
import { StatCard } from "@/features/org/dashboard/components/stat-card"
import { CopyButton } from "@jp/ui/components/jp"
import { TeamBadge } from "./team-card"

export const TeamDetailClient = ({
  data,
}: {
  data: { analytics: TeamAnalytics; team: TeamDetail }
}) => {
  const { analytics, team } = data
  const { recentOrders, summary, topCategories, range, topProducts } = analytics

  const metadata = team.metadata || {}

  const address = [
    metadata.street,
    metadata.city,
    metadata.state,
    metadata.zipcode,
  ]
    .join(" ")
    .trim()

  const priceLevel = team.priceLevel || {}
  const taxRule = team.taxRule || {}

  return (
    <div className="grid grid-cols-1 gap-4 @5xl/page-content:grid-cols-3 @5xl/page-content:gap-6">
      <div className="space-y-4 @5xl/page-content:col-span-2 @5xl/page-content:space-y-6">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {team.name}
            </CardTitle>
            <CardAction>
              <TeamBadge status={team.status ?? "active"} />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid">
              <div className="flex items-center gap-1.5">
                <UserCircle />
                <span className="text-muted-foreground">
                  {team.managerName}
                </span>
              </div>
              <CopyButton
                prefix={<Smartphone className="size-3.5" />}
                value={team.phoneNumber}
              />
              <CopyButton
                prefix={<Letter className="size-3.5" />}
                value={team.email}
              />
              {address && (
                <div className="flex items-center gap-1.5">
                  <MapPoint />
                  <span className="text-muted-foreground">{address}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="flex-1">Available credit</span>
                <div className="flex items-end gap-1">
                  <CardTitle className="text-xl font-bold">$520</CardTitle>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">$1020</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-neutral-200">
                <div className="h-full w-1/2 rounded-full bg-lime-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-4 @5xl/page-content:grid-cols-2 @5xl/page-content:gap-6">
          <StatCard
            title="Total Orders"
            icon={
              <IconTile variant="elevated">
                <Inbox className="size-4 text-green-600" />
              </IconTile>
            }
            value={formatUSD(summary.totalOrders)}
          />
          <StatCard
            title="Total Spend"
            icon={
              <IconTile variant="elevated">
                <DollarMinimalistic className="size-4 text-purple-600" />
              </IconTile>
            }
            value={formatUSD(summary.totalSpend)}
          />
          <StatCard
            title="Average Order Value"
            icon={
              <IconTile variant="elevated">
                <Wallet className="size-4 text-yellow-600" />
              </IconTile>
            }
            value={formatUSD(summary.averageOrderValue)}
          />
          <StatCard
            title="Open Orders"
            icon={
              <IconTile variant="elevated">
                <Box className="size-4 text-sky-600" />
              </IconTile>
            }
            value={summary.activeOrders?.toString()}
          />
        </div>

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

          {/* price & tax */}
          <Card size="sm" className="@8xl/page-content:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-bold">Price & Tax</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <span className="text-xs text-muted-foreground">
                  Price Level
                </span>
                <div className="flex rounded-xl bg-secondary/50 p-2">
                  {priceLevel.name ?? "Price level name"}
                </div>
              </div>
              <div className="grid gap-1.5">
                <span className="text-xs text-muted-foreground">Tax rule</span>
                <div className="flex rounded-xl bg-secondary/50 p-2">
                  {taxRule.name ?? "Tax rule name"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* private items */}
          <Card className="@8xl/page-content:col-span-2" size="sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Private Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {team.products.map((product) => (
                <div className="flex flex-1 items-start gap-3">
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

                  <div className="shrink-0 space-y-0">
                    {product.sellUnits?.map((unit) => (
                      <div key={unit.id}>
                        <span className="line-clamp-1 font-semibold">
                          {formatUSD(unit.price)}
                          <span className="pl-1 text-xs text-muted-foreground">
                            {unit.unit}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* users */}
          <Card className="@8xl/page-content:col-span-2" size="sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {team.teamMembers.map((member) => (
                <div className="flex flex-1 items-start gap-3" key={member.id}>
                  <Avatar className="rounded-lg *:rounded-lg" size="lg">
                    <AvatarImage src={member?.image as string} />
                    <AvatarFallback>
                      <ImageOff className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 line-clamp-1 font-medium">
                      {member.name}
                    </div>

                    <CopyButton
                      prefix={<Smartphone className="size-3.5" />}
                      value={member.phoneNumber}
                    />
                    <CopyButton
                      prefix={<Letter className="size-3.5" />}
                      value={member.email}
                    />
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
