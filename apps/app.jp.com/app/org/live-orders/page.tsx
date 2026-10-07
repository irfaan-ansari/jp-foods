"use client"

import { useEffect, useState } from "react"
import {
  Pause,
  Play,
  Plus,
  Minus,
  Radio,
  ShoppingBag,
  Package,
  CreditCard,
  ClipboardList,
} from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { Badge } from "@jp/ui/components/badge"
import { Card } from "@jp/ui/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { IconTile } from "@jp/ui/components/icon-tile"
import { StatCard } from "@/features/org/dashboard/components/stat-card"
import { DashboardCard } from "@/features/org/dashboard/components/dashboard-card"
import { PageContent, PageHeader } from "@/components/page-content"
import { formatUSD } from "@jp/utils"

type Product = { id: string; name: string; description: string; price: number }
type Bag = {
  id: string
  name: string
  userName: string
  initials: string
  checkout: boolean
  updated: number
  lines: { product: Product; qty: number }[]
}
type Event = {
  id: number
  customerId: string
  customer: string
  product: string
  qty: number
  added: boolean
  time: number
}

const PRODUCTS: Product[] = [
  {
    id: "salmon",
    name: "Salmon fillet",
    description: "10 lb box · Protein",
    price: 142,
  },
  {
    id: "chicken",
    name: "Chicken breast",
    description: "35 lb case · Protein",
    price: 94.5,
  },
  {
    id: "potatoes",
    name: "Yukon potatoes",
    description: "50 lb sack · Produce",
    price: 44,
  },
  {
    id: "flour",
    name: "Bread flour",
    description: "50 lb bag · Dry goods",
    price: 38,
  },
  {
    id: "mozzarella",
    name: "Mozzarella",
    description: "6 lb case · Dairy",
    price: 59,
  },
  {
    id: "romaine",
    name: "Romaine hearts",
    description: "24 count · Produce",
    price: 28,
  },
  {
    id: "oil",
    name: "Fry oil",
    description: "35 lb jug · Dry goods",
    price: 47,
  },
]
const product = (index: number) => PRODUCTS[index]!
const INITIAL_BAGS: Bag[] = [
  {
    id: "cedar",
    name: "Cedar Street Diner",
    userName: "Elena Martinez",
    initials: "CS",
    checkout: false,
    updated: 0,
    lines: [
      { product: product(0), qty: 4 },
      { product: product(1), qty: 2 },
      { product: product(2), qty: 2 },
    ],
  },
  {
    id: "luma",
    name: "Luma Kitchen",
    userName: "Chris Walton",
    initials: "LK",
    checkout: false,
    updated: -2,
    lines: [
      { product: product(1), qty: 2 },
      { product: product(3), qty: 1 },
    ],
  },
  {
    id: "saffron",
    name: "Saffron Table",
    userName: "Maya Patel",
    initials: "ST",
    checkout: false,
    updated: -3,
    lines: [
      { product: product(3), qty: 1 },
      { product: product(5), qty: 1 },
      { product: product(1), qty: 2 },
    ],
  },
  {
    id: "oak",
    name: "Oak & Ember",
    userName: "James Wilson",
    initials: "OE",
    checkout: false,
    updated: -5,
    lines: [{ product: product(4), qty: 2 }],
  },
  {
    id: "tidewater",
    name: "Tidewater Grill",
    userName: "Sofia Chen",
    initials: "TG",
    checkout: false,
    updated: -7,
    lines: [{ product: product(0), qty: 1 }],
  },
  {
    id: "harbor",
    name: "Harbor & Pine",
    userName: "Daniel Brooks",
    initials: "HP",
    checkout: false,
    updated: -17,
    lines: [
      { product: product(1), qty: 2 },
      { product: product(2), qty: 2 },
      { product: product(6), qty: 2 },
    ],
  },
  {
    id: "northside",
    name: "Northside Deli",
    userName: "Olivia Reed",
    initials: "ND",
    checkout: true,
    updated: -18,
    lines: [{ product: product(1), qty: 2 }],
  },
  {
    id: "bellwether",
    name: "Bellwether Catering",
    userName: "Marcus Lee",
    initials: "BC",
    checkout: false,
    updated: -25,
    lines: [
      { product: product(0), qty: 2 },
      { product: product(3), qty: 2 },
      { product: product(5), qty: 2 },
    ],
  },
]
const INITIAL_EVENTS: Event[] = INITIAL_BAGS.map((bag, index) => ({
  id: -index,
  customerId: bag.id,
  customer: bag.name,
  product: bag.lines.at(-1)!.product.name,
  qty: bag.lines.at(-1)!.qty,
  added: index !== 1,
  time: bag.updated,
}))
const total = (bag: Bag) =>
  bag.lines.reduce((sum, line) => sum + line.product.price * line.qty, 0)
const age = (now: number, time: number) =>
  now - time < 3 ? "just now" : `${now - time}s ago`

function Status({ checkout }: { checkout: boolean }) {
  return (
    <Badge
      variant={checkout ? "warning-light" : "primary-light"}
      className="text-sm"
    >
      {checkout ? "Checking out" : "Building bag"}
    </Badge>
  )
}
function EventRow({
  event,
  now,
  compact = false,
}: {
  event: Event
  now: number
  compact?: boolean
}) {
  return (
    <div
      className={`flex items-start gap-2.5 ${compact ? "py-1" : "border-b px-4 py-3"}`}
    >
      <div className="relative shrink-0">
        <Avatar size={compact ? "sm" : "default"} className="size-6">
          <AvatarImage
            src={`https://api.dicebear.com/10.x/glyphs/svg?seed=${encodeURIComponent(`demo-user-${event.customerId}`)}`}
            alt="User avatar"
          />
          <AvatarFallback>{event.customer.charAt(0)}</AvatarFallback>
        </Avatar>
        <span
          className={`absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full border border-background ${event.added ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          {event.added ? (
            <Plus className="size-2.5" />
          ) : (
            <Minus className="size-2.5" />
          )}
        </span>
      </div>
      <div className="min-w-0 flex-1 text-sm leading-relaxed">
        {!compact && <div className="font-semibold">{event.customer}</div>}
        <div className={compact ? "" : "text-muted-foreground"}>
          {event.added ? `added ${event.qty} × ` : `removed ${event.qty} × `}
          {event.product}
        </div>
      </div>
      <span className="shrink-0 text-sm text-muted-foreground">
        {age(now, event.time)}
      </span>
    </div>
  )
}

export default function LiveOrdersPage() {
  const [state, setState] = useState({
    bags: INITIAL_BAGS,
    events: INITIAL_EVENTS,
    now: 0,
    tick: 0,
    history: Array.from({ length: 20 }, (_, i) =>
      i > 14 ? [3, 6, 8, 6, 6][i - 15]! : 0
    ),
  })
  const [paused, setPaused] = useState(false)
  const [following, setFollowing] = useState(true)
  const [selectedId, setSelectedId] = useState("cedar")

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setState((previous) => {
        const tick = previous.tick + 1
        const now = previous.now + 6
        const index = tick % previous.bags.length
        const bag = previous.bags[index]!
        const target = product(tick % PRODUCTS.length)
        const existing = bag.lines.find((line) => line.product.id === target.id)
        const added = tick % 4 !== 0 || !existing
        const qty = added ? 1 + (tick % 2) : 1
        const lines = added
          ? existing
            ? bag.lines.map((line) =>
                line.product.id === target.id
                  ? { ...line, qty: line.qty + qty }
                  : line
              )
            : [...bag.lines, { product: target, qty }]
          : bag.lines
              .map((line) =>
                line.product.id === target.id
                  ? { ...line, qty: line.qty - qty }
                  : line
              )
              .filter((line) => line.qty > 0)
        const event: Event = {
          id: tick,
          customerId: bag.id,
          customer: bag.name,
          product: target.name,
          qty,
          added,
          time: now,
        }
        return {
          bags: previous.bags.map((entry) =>
            entry.id === bag.id ? { ...entry, lines, updated: now } : entry
          ),
          events: [event, ...previous.events].slice(0, 10),
          now,
          tick,
          history: [...previous.history.slice(1), qty],
        }
      })
    }, 6000)
    return () => clearInterval(timer)
  }, [paused])

  const selected =
    state.bags.find(
      (bag) => bag.id === (following ? state.events[0]?.customerId : selectedId)
    ) ?? state.bags[0]!
  const bagTotal = total(selected)
  const units = selected.lines.reduce((sum, line) => sum + line.qty, 0)
  const recent = state.events
    .filter((event) => event.customerId === selected.id)
    .slice(0, 3)
  const latest = recent[0]
  const chart = state.history
    .map((count, i) => `${(i * 100) / 19},${44 - count * 4}`)
    .join(" ")
  const stats = [
    { label: "Active bags", value: state.bags.length, note: "0 browsing" },
    {
      label: "Items in bags",
      value: state.bags.reduce(
        (sum, bag) =>
          sum + bag.lines.reduce((count, line) => count + line.qty, 0),
        0
      ),
      note: `${formatUSD(state.bags.reduce((sum, bag) => sum + total(bag), 0))} potential`,
    },
    {
      label: "In checkout",
      value: state.bags.filter((bag) => bag.checkout).length,
      note: "Closest to ordering",
    },
    { label: "Orders today", value: 13, note: `${formatUSD(8852)} revenue` },
  ]

  return (
    <>
      <PageHeader title="Live overview">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Radio className={`size-3.5 ${paused ? "" : "text-primary"}`} />
            {paused ? "Paused" : "Demo live"}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play /> : <Pause />}
            {paused ? "Resume" : "Pause"}
          </Button>
        </div>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="grid items-start gap-6 @4xl/page-content:grid-cols-[minmax(0,1fr)_440px]">
          <div className="min-w-0 space-y-6">
            <div className="grid grid-cols-1 gap-4 @2xl/page-content:grid-cols-2 @6xl/page-content:grid-cols-4 @6xl/page-content:gap-6">
              {stats.map((stat, index) => {
                const Icon = [ShoppingBag, Package, CreditCard, ClipboardList][
                  index
                ]!
                const color = [
                  "text-amber-500",
                  "text-sky-500",
                  "text-emerald-500",
                  "text-rose-500",
                ][index]
                return (
                  <StatCard
                    key={stat.label}
                    title={stat.label}
                    value={String(stat.value)}
                    description={stat.note}
                    icon={
                      <IconTile variant="elevated">
                        <Icon className={`size-5 ${color}`} />
                      </IconTile>
                    }
                  />
                )
              })}
            </div>
            <Card size="sm" className="gap-0 overflow-hidden py-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold">Customer carts</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select a customer to see what they’re ordering.
                  </p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {state.bags.length} online
                </Badge>
              </div>
              <div className="grid @5xl/page-content:grid-cols-[320px_minmax(0,1fr)]">
                <section
                  aria-label="Online customers"
                  className="min-w-0 border-r"
                >
                  <div className="">
                    {state.bags.map((bag) => (
                      <Button
                        key={bag.id}
                        variant={bag.id === selected.id ? "secondary" : "ghost"}
                        data-active={bag.id === selected.id}
                        onClick={() => {
                          setSelectedId(bag.id)
                          setFollowing(false)
                        }}
                        className="h-auto w-full justify-start rounded-none py-2 text-left data-active:bg-primary/20"
                      >
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/10.x/glyphs/svg?seed=${encodeURIComponent(`demo-user-${bag.id}`)}`}
                            alt={`${bag.userName} avatar`}
                          />
                          <AvatarFallback>
                            {bag.userName
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">
                            {bag.userName}
                          </div>
                          <div className="mt-0.5 truncate text-xs text-muted-foreground">
                            {bag.name}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-sm font-semibold tabular-nums">
                            {formatUSD(total(bag))}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {bag.lines.length} lines
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </section>
                <section className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage
                          src={`https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(selected.name)}`}
                          alt={`${selected.name} team avatar`}
                        />
                        <AvatarFallback>{selected.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                          {selected.name}
                        </h2>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <Status checkout={selected.checkout} />
                          <span className="text-sm text-muted-foreground">
                            active {age(state.now, selected.updated)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-semibold tracking-tight tabular-nums">
                        {formatUSD(bagTotal)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        bag total
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 px-5 pb-5 text-sm text-muted-foreground">
                    <span>
                      <strong className="font-medium text-foreground">
                        {selected.lines.length}
                      </strong>{" "}
                      product lines
                    </span>
                    <span>
                      <strong className="font-medium text-foreground">
                        {units}
                      </strong>{" "}
                      units
                    </span>
                    <span>
                      <strong className="font-medium text-foreground">
                        {formatUSD(
                          selected.lines.length
                            ? bagTotal / selected.lines.length
                            : 0
                        )}
                      </strong>{" "}
                      avg. per line
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] text-sm">
                      <thead className="border-y bg-secondary/25 text-muted-foreground">
                        <tr>
                          <th
                            scope="col"
                            className="px-5 py-3 text-left font-normal"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-right font-normal"
                          >
                            Qty
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-right font-normal"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selected.lines.map((line) => (
                          <tr
                            key={line.product.id}
                            className={
                              latest?.added &&
                              latest.product === line.product.name
                                ? "bg-primary/5"
                                : ""
                            }
                          >
                            <td className="px-5 py-3">
                              <div className="font-medium">
                                {line.product.name}
                              </div>
                              <div className="mt-1 text-muted-foreground">
                                {formatUSD(line.product.price)} each{" "}
                                {line.product.description}
                              </div>
                            </td>
                            <td className="px-3 py-4 text-right tabular-nums">
                              {line.qty}
                            </td>
                            <td className="px-5 py-4 text-right font-medium whitespace-nowrap tabular-nums">
                              {formatUSD(line.product.price * line.qty)}
                            </td>
                          </tr>
                        ))}
                        {!selected.lines.length && (
                          <tr>
                            <td
                              colSpan={3}
                              className="p-5 text-center text-muted-foreground"
                            >
                              This cart is empty.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t px-5 py-4">
                    <h3 className="mb-2 text-sm font-semibold">
                      Recent actions
                    </h3>
                    {recent.map((event) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        now={state.now}
                        compact
                      />
                    ))}
                  </div>
                </section>
              </div>
            </Card>
          </div>
          <DashboardCard
            title="Activity"
            description="Units changed per 6 seconds"
            className="@4xl/page-content:sticky @4xl/page-content:top-24"
          >
            <div className="border-b px-4 pb-3">
              <svg
                viewBox="0 0 100 48"
                preserveAspectRatio="none"
                role="img"
                aria-label="Demo bag activity over the last two minutes"
                className="mt-3 h-12 w-full text-primary"
              >
                <polygon
                  points={`0,48 ${chart} 100,48`}
                  fill="currentColor"
                  opacity="0.1"
                />
                <polyline
                  points={chart}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <div aria-label="Recent bag activity">
              {state.events.map((event) => (
                <EventRow key={event.id} event={event} now={state.now} />
              ))}
            </div>
          </DashboardCard>
        </div>
        <p className="text-sm text-muted-foreground">
          Demo preview · Bag changes are simulated every 6 seconds. Today’s
          order totals are sample data.
        </p>
      </PageContent>
    </>
  )
}
