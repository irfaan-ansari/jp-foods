"use client"

import { memo, useMemo, useRef, useState, useSyncExternalStore } from "react"
import {
  Minus,
  Package,
  Plus,
  Radio,
  Search,
  ShoppingBag,
  Users,
  Wallet,
  X,
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
import { Buildings } from "@solar-icons/react"

/* -------------------------------------------------------------------------- */
/* Live time helpers: one shared 1s ticker for every timestamp on the page    */
/* -------------------------------------------------------------------------- */

const FRESH_MS = 8_000
const listeners = new Set<() => void>()
let tick = 0
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  timer ??= setInterval(() => {
    tick += 1
    listeners.forEach((l) => l())
  }, 1000)
  return () => {
    listeners.delete(listener)
    if (!listeners.size && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}
const useTick = () =>
  useSyncExternalStore(
    subscribe,
    () => tick,
    () => 0
  )

function timeAgo(at: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - +new Date(at)) / 1000))
  if (seconds < 5) return "just now"
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)}h ago`
  return formatDate(at)
}

function TimeAgo({ at, className }: { at: string; className?: string }) {
  useTick()
  return (
    <time
      dateTime={at}
      title={new Date(at).toLocaleString()}
      className={className}
    >
      {timeAgo(at)}
    </time>
  )
}

/** Pulsing dot that shows for a few seconds after a cart changes. */
function LiveDot({ at }: { at: string }) {
  useTick()
  if (Date.now() - +new Date(at) > FRESH_MS) return null
  return (
    <span className="relative flex size-2 shrink-0" aria-label="Just updated">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

type StatusFilter = "all" | CartGroup["status"]
const STATUS_KEYS = Object.keys(CART_STATUS_LABEL) as CartGroup["status"][]

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
  const [status, setStatus] = useState<StatusFilter>("all")
  const query = search.trim().toLowerCase()

  // Keep the last opened cart so the drawer doesn't go blank while closing.
  const lastSelected = useRef(selected)
  if (selected) lastSelected.current = selected
  const drawerGroup = selected ?? lastSelected.current

  const groupsByKey = useMemo(
    () => new Map(groups.map((group) => [getCartGroupKey(group), group])),
    [groups]
  )

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<CartGroup["status"], number>> = {}
    for (const group of groups)
      counts[group.status] = (counts[group.status] ?? 0) + 1
    return counts
  }, [groups])

  const visibleGroups = useMemo(
    () =>
      groups.filter(
        (group) =>
          (status === "all" || group.status === status) &&
          `${group.user.name} ${group.team.name}`.toLowerCase().includes(query)
      ),
    [groups, query, status]
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

  return (
    <>
      <PageHeader title="Live orders">
        <Badge variant={connected ? "success-light" : "secondary"} size="lg">
          <Radio className={cn("size-3.5", connected && "animate-pulse")} />
          {connected ? "Live" : hasSnapshot ? "Reconnecting" : "Connecting"}
        </Badge>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="grid grid-cols-1 items-start gap-6 @4xl/page-content:grid-cols-3">
          <div className="min-w-0 space-y-6 @4xl/page-content:col-span-2">
            <div className="grid grid-cols-1 gap-4 @3xl/page-content:grid-cols-2 @6xl/page-content:grid-cols-4 @6xl/page-content:gap-6">
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
              action={<Badge variant="secondary">{visibleGroups.length}</Badge>}
            >
              <div className="space-y-3 border-b p-4">
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
                <div
                  className="flex flex-wrap gap-1.5"
                  role="group"
                  aria-label="Filter by status"
                >
                  <FilterChip
                    active={status === "all"}
                    onClick={() => setStatus("all")}
                    label="All"
                    count={groups.length}
                  />
                  {STATUS_KEYS.filter((key) => statusCounts[key]).map((key) => (
                    <FilterChip
                      key={key}
                      active={status === key}
                      onClick={() => setStatus(key)}
                      label={CART_STATUS_LABEL[key]}
                      count={statusCounts[key] ?? 0}
                    />
                  ))}
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
                <EmptyState
                  text={
                    query || status !== "all"
                      ? "No carts match your filters."
                      : "No recent carts. Customer carts will appear here as they add products."
                  }
                />
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
                  {activity.map((entry) => (
                    <li key={entry.id} className="not-last:border-b">
                      <ActivityRow
                        entry={entry}
                        group={groupsByKey.get(
                          `${entry.teamId}:${entry.userId}`
                        )}
                        onOpen={openCart}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState text="No recent cart activity." />
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
            {drawerGroup && <CartDetailsDrawer group={drawerGroup} />}
          </DrawerContent>
        </Drawer>
      </PageContent>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Pieces                                                                     */
/* -------------------------------------------------------------------------- */

function statusColor(status: CartGroup["status"]) {
  return status === "placed"
    ? "var(--success)"
    : status === "checking_out"
      ? "var(--warning)"
      : "var(--info)"
}

function FilterChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      )}
    >
      {label}
      <span className="tabular-nums opacity-70">{count}</span>
    </button>
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
          <AvatarFallback>
            <Buildings className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{group.team.name}</p>
            <LiveDot at={group.updatedAt} />
          </div>
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
          <TimeAgo
            at={group.updatedAt}
            className="text-[11px] text-muted-foreground"
          />
        </div>
        <StatusBadge
          status={{
            value: group.status,
            label: CART_STATUS_LABEL[group.status],
            color: statusColor(group.status),
          }}
          size="sm"
        />
      </div>
    </button>
  )
})

const ActivityRow = memo(function ActivityRow({
  entry,
  group,
  onOpen,
}: {
  entry: CartActivity
  group?: CartGroup
  onOpen: (key: string) => void
}) {
  const increased = entry.quantity > entry.previousQuantity
  const delta = Math.abs(entry.quantity - entry.previousQuantity)
  const team = group?.team.name ?? "Customer"

  return (
    <button
      type="button"
      disabled={!group}
      onClick={() => group && onOpen(getCartGroupKey(group))}
      title={`${team}: ${increased ? "added" : "removed"} ${delta} × ${entry.item.title} (${entry.previousQuantity} → ${entry.quantity})`}
      className="flex w-full items-start gap-2.5 px-4 py-2.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset enabled:hover:bg-secondary/40 disabled:cursor-default"
    >
      <Badge
        variant={increased ? "primary-light" : "destructive-light"}
        className="size-6 shrink-0 p-0"
      >
        <span className="tabular-nums">
          {increased ? "+" : "−"}
          {delta}
        </span>
      </Badge>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate font-medium">{entry.item.title}</p>
        <p className="truncate text-xs text-muted-foreground">{team}</p>
      </div>
      <span className="shrink-0 self-start pt-0.5 text-[11px] text-muted-foreground tabular-nums">
        {formatDate(new Date())}
      </span>
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
      <DrawerHeader className="flex flex-row items-center gap-3 p-3">
        <Avatar className="shrink-0">
          <AvatarImage src={group.team.logo} alt={group.team.name} />
          <AvatarFallback>
            <Buildings className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <DrawerTitle className="truncate text-base font-semibold">
            {group.team.name}
          </DrawerTitle>
          <DrawerDescription className="flex items-center gap-1.5">
            <span className="truncate">{group.user.name}</span>
            <span aria-hidden>·</span>
            <TimeAgo at={group.updatedAt} className="shrink-0" />
          </DrawerDescription>
        </div>
        <StatusBadge
          status={{
            value: group.status,
            label: CART_STATUS_LABEL[group.status],
            color: statusColor(group.status),
          }}
          size="sm"
        />
        <DrawerClose asChild>
          <Button size="icon-xs" variant="secondary" aria-label="Close">
            <X />
          </Button>
        </DrawerClose>
      </DrawerHeader>

      <div className="min-h-0 flex-1 overflow-auto border-t px-3">
        {group.items.length ? (
          <ul className="divide-y">
            {group.items.map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3">
                <ProductThumbnail
                  title={item.title}
                  image={item.image}
                  className="size-11 rounded-xl"
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="line-clamp-2 text-sm leading-5 font-medium">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatUSD(item.price)}
                    <span className="px-1">×</span>
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatUSD(item.total)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState text="This cart is empty." />
        )}
      </div>

      <div className="p-3">
        <div className="space-y-1.5 rounded-2xl border bg-secondary p-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {group.items.length} {pluralize(group.items.length, "product")}
            </span>
            <span className="tabular-nums">
              {group.itemCount} {pluralize(group.itemCount, "item")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-medium">Total</span>
            <span className="text-base font-semibold tabular-nums">
              {formatUSD(group.total)}
            </span>
          </div>
        </div>
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
        className="rounded-xl object-contain"
      />
      <AvatarFallback className="rounded-xl">
        <Package className="size-3.5" />
      </AvatarFallback>
    </Avatar>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="p-6 text-center text-sm text-muted-foreground">{text}</p>
}

function LoadingRows() {
  return (
    <div className="divide-y">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="flex items-center gap-3 px-4 py-3" key={index}>
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
