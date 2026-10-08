"use client"

import { memo, useMemo, useState } from "react"
import {
  Package,
  Radio,
  Search,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@jp/ui/components/avatar"
import { Badge } from "@jp/ui/components/badge"
import { Button } from "@jp/ui/components/button"
import { Input } from "@jp/ui/components/input"
import { IconTile } from "@jp/ui/components/icon-tile"
import { StatusBadge } from "@jp/ui/components/jp/status-badge"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@jp/ui/components/drawer"
import { Skeleton } from "@jp/ui/components/skeleton"
import { cn } from "@jp/ui/lib/utils"
import { PageContent, PageHeader } from "@/components/page-content"
import { StatCard } from "@/features/org/dashboard/components/stat-card"
import { DashboardCard } from "@/features/org/dashboard/components/dashboard-card"
import { formatDate, formatUSD, pluralize } from "@jp/utils"
import { CART_STATUS_LABEL } from "@/features/org/cart/cart.const"
import {
  getCartGroupKey,
  useLiveCarts,
} from "@/features/org/cart/use-live-carts"
import type { CartActivity, CartGroup } from "@/features/org/cart/cart.type"

const timeLabel = (at: string) =>
  new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

export default function LiveOrdersPage() {
  const {
    activity,
    connected,
    hasSnapshot,
    detailsOpen,
    groups,
    openCart,
    selected,
    selectedKey,
    setDetailsOpen,
  } = useLiveCarts()
  const [search, setSearch] = useState("")
  const query = search.trim().toLowerCase()
  const visibleGroups = useMemo(
    () =>
      groups.filter((group) =>
        `${group.user.name} ${group.team.name}`.toLowerCase().includes(query)
      ),
    [groups, query]
  )
  const stats = useMemo(() => {
    const summary = groups.reduce(
      (result, group) => {
        result.active += Number(group.items.length > 0)
        result.customers.add(group.user.id)
        result.items += group.itemCount
        result.total += group.total
        return result
      },
      { active: 0, customers: new Set<string>(), items: 0, total: 0 }
    )
    return [
      {
        title: "Active carts",
        value: summary.active.toLocaleString(),
        icon: ShoppingBag,
        color: "text-amber-500",
        description: "Customer carts with items",
      },
      {
        title: "Customers",
        value: summary.customers.size.toLocaleString(),
        icon: Users,
        color: "text-sky-500",
        description: "With recent cart activity",
      },
      {
        title: "Items in carts",
        value: summary.items.toLocaleString(),
        icon: Package,
        color: "text-rose-500",
        description: "Across tracked carts",
      },
      {
        title: "Cart value",
        value: formatUSD(summary.total),
        icon: Wallet,
        color: "text-emerald-500",
        description: "Across tracked carts",
      },
    ]
  }, [groups])
  const availableCartKeys = useMemo(
    () => new Set(groups.map(getCartGroupKey)),
    [groups]
  )

  return (
    <>
      <PageHeader title="Live orders">
        <Badge variant={connected ? "success-light" : "secondary"} size="lg">
          <Radio className="size-3.5" />
          {connected ? "Live" : hasSnapshot ? "Reconnecting" : "Connecting"}
        </Badge>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="grid grid-cols-1 items-start gap-6 @4xl/page-content:grid-cols-3">
          <div className="min-w-0 space-y-6 @4xl/page-content:col-span-2">
            <div className="grid grid-cols-1 gap-4 @2xl/page-content:grid-cols-2 @4xl/page-content:grid-cols-4 @4xl/page-content:gap-6">
              {stats.map(({ title, value, icon: Icon, color, description }) => (
                <StatCard
                  key={title}
                  title={title}
                  value={value}
                  loading={!hasSnapshot}
                  description={description}
                  icon={
                    <IconTile variant="elevated">
                      <Icon className={`size-5 ${color}`} />
                    </IconTile>
                  }
                />
              ))}
            </div>
            <DashboardCard
              title="Live carts"
              description="Most recently updated customer carts"
              action={<Badge variant="secondary">{groups.length}</Badge>}
            >
              <div className="border-b p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
                  <Input
                    aria-label="Search customers or teams"
                    placeholder="Search customers or teams"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              {!hasSnapshot ? (
                <LoadingRows />
              ) : visibleGroups.length ? (
                <ul>
                  {visibleGroups.map((group) => {
                    const key = getCartGroupKey(group)
                    return (
                      <li key={key} className="not-last:border-b">
                        <CartRow
                          group={group}
                          selected={selectedKey === key}
                          onOpen={openCart}
                        />
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="p-4 text-sm text-muted-foreground">
                  {query
                    ? "No matching customers or teams."
                    : "No recent carts. Customer carts will appear here as they add products."}
                </p>
              )}
            </DashboardCard>
          </div>

          <div className="min-w-0">
            <DashboardCard
              title="Activity"
              description="Latest customer cart changes"
            >
              {!hasSnapshot ? (
                <LoadingRows />
              ) : activity.length ? (
                <ul>
                  {activity.map((entry) => {
                    const available = availableCartKeys.has(
                      `${entry.teamId}:${entry.userId}`
                    )
                    return (
                      <li key={entry.id} className="not-last:border-b">
                        <ActivityRow
                          entry={entry}
                          available={available}
                          onOpen={openCart}
                        />
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="p-4 text-sm text-muted-foreground">
                  No recent cart activity.
                </p>
              )}
            </DashboardCard>
          </div>
        </div>
        <Drawer
          direction="right"
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        >
          <DrawerContent className="gap-0 data-[vaul-drawer-direction=right]:sm:max-w-lg">
            {selected ? (
              <CartDetailsDrawer group={selected} />
            ) : (
              <DrawerHeader>
                <DrawerTitle>Cart unavailable</DrawerTitle>
                <DrawerDescription>
                  This cart is no longer among the latest tracked carts.
                </DrawerDescription>
              </DrawerHeader>
            )}
          </DrawerContent>
        </Drawer>
      </PageContent>
    </>
  )
}
const CartRow = memo(function CartRow({
  group,
  selected,
  onOpen,
}: {
  group: CartGroup
  selected: boolean
  onOpen: (key: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(getCartGroupKey(group))}
      className={cn(
        "group w-full space-y-3 px-4 py-3 text-left transition-colors hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
        selected && "bg-secondary/30"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage src={group.team.logo} alt={group.team.name} />
          <AvatarFallback>{initials(group.team.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="truncate text-sm font-semibold">{group.team.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {group.user.name}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold tabular-nums">
            {formatUSD(group.total)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {group.itemCount} {pluralize(group.itemCount, "item")}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {group.items.length > 0 && (
            <AvatarGroup
              className="-space-x-2"
              aria-label={`${group.items.length} ${pluralize(group.items.length, "product")} in cart`}
            >
              {group.items.slice(0, 3).map((item) => (
                <Avatar
                  key={item.id}
                  title={item.title}
                  className="size-7 overflow-hidden bg-card shadow-none ring-1 ring-border/50"
                >
                  <AvatarImage
                    src={item.image}
                    alt={item.title}
                    className="bg-card object-contain"
                  />
                  <AvatarFallback>
                    <Package className="size-3" />
                  </AvatarFallback>
                </Avatar>
              ))}
              {group.items.length > 3 && (
                <AvatarGroupCount className="size-7 text-[10px] font-medium">
                  +{group.items.length - 3}
                </AvatarGroupCount>
              )}
            </AvatarGroup>
          )}
          <span
            className="text-[11px] text-muted-foreground"
            title={`Last active: ${new Date(group.updatedAt).toLocaleString()}`}
          >
            Last active {formatDate(group.updatedAt)}
          </span>
        </div>
        <StatusBadge
          status={{
            value: group.status,
            label: CART_STATUS_LABEL[group.status],
            color:
              group.status === "placed"
                ? "var(--success)"
                : group.status === "checking_out"
                  ? "var(--warning)"
                  : "var(--info)",
          }}
          size="sm"
        />
      </div>
    </button>
  )
})
const ActivityRow = memo(function ActivityRow({
  entry,
  available,
  onOpen,
}: {
  entry: CartActivity
  available: boolean
  onOpen: (key: string) => void
}) {
  const increased = entry.quantity > entry.previousQuantity
  return (
    <button
      type="button"
      onClick={() => onOpen(`${entry.teamId}:${entry.userId}`)}
      disabled={!available}
      className="flex w-full items-start gap-3 px-4 py-2.5 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset enabled:hover:bg-secondary/50 disabled:cursor-default"
      title={available ? "View customer cart" : "Cart is no longer tracked"}
    >
      <Badge
        variant={increased ? "success" : "destructive"}
        size="lg"
        className="gap-0.5 tabular-nums"
      >
        {Math.abs(entry.quantity - entry.previousQuantity)}
      </Badge>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium" title={entry.item.title}>
          {entry.item.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {entry.userName ?? "Customer"}
        </p>
      </div>
      <div className="shrink-0 space-y-1 text-right">
        <p className="text-sm font-semibold tabular-nums">
          {entry.item.price === undefined ? "—" : formatUSD(entry.item.price)}
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {entry.quantity} {entry.item.unit}
        </p>
      </div>
    </button>
  )
})

const CartDetailsDrawer = memo(function CartDetailsDrawer({
  group,
}: {
  group: CartGroup
}) {
  return (
    <>
      <DrawerHeader className="gap-4 border-b p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Customer cart
          </span>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              Close
            </Button>
          </DrawerClose>
        </div>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={group.team.logo} alt={group.team.name} />
            <AvatarFallback>{initials(group.team.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <DrawerTitle className="text-base font-semibold">
              {group.team.name}
            </DrawerTitle>
            <DrawerDescription>
              {group.user.name} · Updated {timeLabel(group.updatedAt)}
            </DrawerDescription>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Cart items</span>
          <Badge variant="secondary">
            {group.itemCount} {pluralize(group.itemCount, "item")}
          </Badge>
        </div>
      </DrawerHeader>
      <div className="min-h-0 flex-1 overflow-auto px-4">
        <div className="flex items-center justify-between pt-5 pb-2 text-xs text-muted-foreground">
          <span>Products</span>
          <span>Line total</span>
        </div>
        {group.items.length ? (
          <ul className="divide-y">
            {group.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <ProductThumbnail
                  title={item.title}
                  image={item.image}
                  className="size-10 rounded-lg"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm leading-5 font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {item.quantity} {item.unit} <span className="px-1">×</span>{" "}
                    {formatUSD(item.price)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatUSD(item.total)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-sm text-muted-foreground">
            This cart is empty.
          </p>
        )}
      </div>
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Cart total</span>
          <span className="text-base font-semibold tabular-nums">
            {formatUSD(group.total)}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Radio className="size-3" /> Reflects the latest customer update
        </p>
      </div>
    </>
  )
})

function ProductThumbnail({
  title,
  image,
  className,
}: {
  title: string
  image: string
  className?: string
}) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage
        src={image}
        alt={title}
        className="rounded-none object-contain"
      />
      <AvatarFallback className="rounded-none">
        <Package className="size-3.5" />
      </AvatarFallback>
    </Avatar>
  )
}

function LoadingRows() {
  return (
    <div
      role="status"
      aria-label="Loading live carts"
      className="space-y-3 p-4"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  )
}
