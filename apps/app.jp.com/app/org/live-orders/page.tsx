"use client"

import { CheckCircle2, CreditCard, Radio, ShoppingBag } from "lucide-react"
import {
  Card as SolarCard,
  CartLarge,
  UsersGroupRounded,
  WalletMoney,
} from "@solar-icons/react"

import { Avatar, AvatarImage } from "@jp/ui/components/avatar"
import { Badge } from "@jp/ui/components/badge"
import { Button } from "@jp/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@jp/ui/components/drawer"
import { IconTile } from "@jp/ui/components/icon-tile"
import { PageContent, PageHeader } from "@/components/page-content"
import { StatCard } from "@/features/org/dashboard/components/stat-card"
import { formatUSD } from "@jp/utils"

import {
  getCartGroupKey,
  useLiveCarts,
} from "@/features/org/cart/use-live-carts"
import {
  CART_STATUS_ACTIVITY_LABEL,
  CART_STATUS_LABEL,
  CART_STATUS_VARIANT,
} from "@/features/org/cart/cart.const"
import type { CartGroup } from "@/features/org/cart/cart.type"

export default function LiveOrdersPage() {
  const {
    activity,
    connected,
    detailsOpen,
    groups,
    openCart,
    selected,
    selectedKey,
    setDetailsOpen,
  } = useLiveCarts()

  return (
    <>
      <PageHeader title="Live orders">
        <Badge variant={connected ? "primary-light" : "secondary"}>
          <Radio className={connected ? "text-primary" : undefined} />
          {connected ? "Live" : "Connecting"}
        </Badge>
      </PageHeader>
      <PageContent>
        <div className="grid items-start gap-6 @4xl/page-content:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-6">
            <div className="grid grid-cols-1 gap-4 @2xl/page-content:grid-cols-2 @2xl/page-content:gap-6 @6xl/page-content:grid-cols-4">
              <StatCard
                title="Active carts"
                value={groups.length.toLocaleString()}
                description="Currently tracked"
                icon={
                  <IconTile variant="elevated">
                    <CartLarge className="size-5 text-amber-500" />
                  </IconTile>
                }
              />
              <StatCard
                title="Customers"
                value={groups.length.toLocaleString()}
                description="With cart activity"
                icon={
                  <IconTile variant="elevated">
                    <UsersGroupRounded className="size-5 text-sky-500" />
                  </IconTile>
                }
              />
              <StatCard
                title="Checking out"
                value={groups
                  .filter((group) => group.status === "checking_out")
                  .length.toLocaleString()}
                description="Carts near order placement"
                icon={
                  <IconTile variant="elevated">
                    <SolarCard className="size-5 text-emerald-500" />
                  </IconTile>
                }
              />
              <StatCard
                title="Potential value"
                value={selected ? formatUSD(selected.total) : formatUSD(0)}
                description="Selected cart total"
                icon={
                  <IconTile variant="elevated">
                    <WalletMoney className="size-5 text-rose-500" />
                  </IconTile>
                }
              />
            </div>

            <Card size="sm" className="gap-0 overflow-hidden pb-0">
              <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">
                  Live carts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {groups.map((group) => {
                  const key = getCartGroupKey(group)
                  return (
                    <Button
                      key={key}
                      variant={selectedKey === key ? "secondary" : "ghost"}
                      className="h-auto w-full justify-start rounded-none px-4 py-3 text-left"
                      onClick={() => openCart(key)}
                    >
                      <Avatar className="size-9">
                        <AvatarImage src={group.user.image} />
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="truncate text-sm font-semibold">
                            {group.user.name}
                          </div>
                          <StatusBadge status={group.status} />
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {group.team.name}
                        </div>
                      </div>
                      <div className="text-right text-sm font-semibold tabular-nums">
                        {formatUSD(group.total)}
                      </div>
                    </Button>
                  )
                })}
                {!groups.length && (
                  <div className="p-6 text-sm text-muted-foreground">
                    Waiting for cart activity.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card size="sm" className="h-full gap-0 pb-0">
            <CardHeader className="border-b">
              <CardTitle className="text-base font-semibold">
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {activity.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="flex w-full gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-secondary/40"
                  onClick={() => openCart(getCartGroupKey(entry))}
                >
                  <ActivityIcon status={entry.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium">
                        {CART_STATUS_ACTIVITY_LABEL[entry.status]}
                      </div>
                      <div className="shrink-0 text-xs text-muted-foreground">
                        {new Date(entry.updatedAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {entry.user.name} · {entry.team.name}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <StatusBadge status={entry.status} />
                      <span className="text-xs font-medium tabular-nums">
                        {entry.orderId
                          ? `Order #${entry.orderId}`
                          : formatUSD(entry.total)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              {!activity.length && (
                <div className="p-6 text-sm text-muted-foreground">
                  Waiting for live cart updates.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <Drawer
          direction="right"
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        >
          <DrawerContent className="p-0 data-[vaul-drawer-direction=right]:w-[min(560px,92vw)] data-[vaul-drawer-direction=right]:sm:max-w-none">
            {selected ? (
              <CartDetailsDrawer group={selected} />
            ) : (
              <DrawerHeader>
                <DrawerTitle>Cart details</DrawerTitle>
                <DrawerDescription>
                  Select a cart to inspect its items.
                </DrawerDescription>
              </DrawerHeader>
            )}
          </DrawerContent>
        </Drawer>
      </PageContent>
    </>
  )
}

function CartDetailsDrawer({ group }: { group: CartGroup }) {
  return (
    <>
      <DrawerHeader className="border-b pr-12">
        <div className="flex items-start gap-3">
          <Avatar className="size-11">
            <AvatarImage src={group.team.logo} />
          </Avatar>
          <div className="min-w-0 flex-1">
            <DrawerTitle className="truncate">{group.team.name}</DrawerTitle>
            <DrawerDescription>
              {group.orderId
                ? `Order #${group.orderId}`
                : `Updated ${new Date(group.updatedAt).toLocaleTimeString()}`}
            </DrawerDescription>
          </div>
          <StatusBadge status={group.status} />
        </div>
      </DrawerHeader>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <div className="font-medium">{group.user.name}</div>
          <div className="text-sm text-muted-foreground">
            {group.itemCount} items
          </div>
        </div>
        <div className="text-2xl font-semibold tabular-nums">
          {formatUSD(group.total)}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="sticky top-0 border-b bg-popover text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-normal">Item</th>
              <th className="px-3 py-3 text-right font-normal">Qty</th>
              <th className="px-3 py-3 text-right font-normal">Price</th>
              <th className="px-4 py-3 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {group.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.id}</div>
                  <div className="text-muted-foreground">{item.unit}</div>
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {formatUSD(item.price)}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatUSD(item.total)}
                </td>
              </tr>
            ))}
            {!group.items.length && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-muted-foreground"
                >
                  This cart is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

function StatusBadge({ status }: { status: CartGroup["status"] }) {
  return (
    <Badge variant={CART_STATUS_VARIANT[status]} className="shrink-0">
      {CART_STATUS_LABEL[status]}
    </Badge>
  )
}

function ActivityIcon({ status }: { status: CartGroup["status"] }) {
  if (status === "placed") {
    return (
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="size-4 text-success" />
      </span>
    )
  }

  if (status === "checking_out") {
    return (
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-warning/10">
        <CreditCard className="size-4 text-warning-foreground" />
      </span>
    )
  }

  return (
    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-info/10">
      <ShoppingBag className="size-4 text-info" />
    </span>
  )
}
