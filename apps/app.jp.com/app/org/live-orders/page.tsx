"use client"

import React from "react"
import { Clock, PackageCheck, Radio, ShoppingCart } from "lucide-react"
import { Badge } from "@jp/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { Progress } from "@jp/ui/components/progress"
import { PageContent, PageHeader } from "@/components/page-content"
import { formatUSD } from "@jp/utils"

type LiveOrder = {
  id: string
  customer: string
  team: string
  user: string
  status: "building" | "reviewing" | "ready"
  items: number
  total: number
  updated: string
  progress: number
  lines: {
    itemCode: string
    name: string
    qty: number
    uom: string
    total: number
  }[]
}

const DEMO_ORDERS: LiveOrder[] = [
  {
    id: "LIVE-1042",
    customer: "Casa Romero",
    team: "Downtown Kitchen",
    user: "Elena Martinez",
    status: "building",
    items: 18,
    total: 842.35,
    updated: "18 seconds ago",
    progress: 64,
    lines: [
      { itemCode: "90014", name: "Roma Tomatoes", qty: 4, uom: "CS", total: 128 },
      { itemCode: "90221", name: "Cilantro", qty: 8, uom: "BN", total: 24 },
      { itemCode: "10772", name: "Corn Tortillas", qty: 12, uom: "CS", total: 312 },
    ],
  },
  {
    id: "LIVE-1043",
    customer: "Harbor Grill",
    team: "Main Account",
    user: "Chris Walton",
    status: "reviewing",
    items: 9,
    total: 529.8,
    updated: "1 minute ago",
    progress: 88,
    lines: [
      { itemCode: "80318", name: "Ground Beef", qty: 3, uom: "CS", total: 221.4 },
      { itemCode: "60240", name: "Sparkling Water", qty: 5, uom: "CS", total: 115 },
      { itemCode: "30052", name: "Black Beans", qty: 6, uom: "CS", total: 96 },
    ],
  },
  {
    id: "LIVE-1044",
    customer: "Green Spoon Catering",
    team: "Events",
    user: "Maya Patel",
    status: "ready",
    items: 27,
    total: 1438.1,
    updated: "3 minutes ago",
    progress: 100,
    lines: [
      { itemCode: "90102", name: "Avocados", qty: 6, uom: "CS", total: 390 },
      { itemCode: "20116", name: "Queso Fresco", qty: 4, uom: "CS", total: 188 },
      { itemCode: "40110", name: "Foil Pans", qty: 10, uom: "CS", total: 240 },
    ],
  },
]

const STATUS_META = {
  building: {
    label: "Building cart",
    variant: "primary-light" as const,
  },
  reviewing: {
    label: "Reviewing",
    variant: "warning-light" as const,
  },
  ready: {
    label: "Ready to submit",
    variant: "success-light" as const,
  },
}

const LiveOrderCard = ({ order }: { order: LiveOrder }) => {
  const meta = STATUS_META[order.status]

  return (
    <Card className="shadow-xs" size="sm">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              {order.customer}
              <Badge variant={meta.variant}>{meta.label}</Badge>
            </CardTitle>
            <CardDescription>
              {order.team} • {order.user} • {order.id}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="font-semibold tabular-nums">
              {formatUSD(order.total)}
            </div>
            <div className="text-xs text-muted-foreground">
              {order.items} items
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Cart progress</span>
            <span>{order.progress}%</span>
          </div>
          <Progress value={order.progress} className="h-2" />
        </div>

        <div className="space-y-2">
          {order.lines.map((line) => (
            <div
              key={`${order.id}-${line.itemCode}`}
              className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border bg-secondary/30 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{line.name}</div>
                <div className="text-xs text-muted-foreground">
                  {line.itemCode} • {line.qty} {line.uom}
                </div>
              </div>
              <div className="font-medium tabular-nums">
                {formatUSD(line.total)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          Last activity {order.updated}
        </div>
      </CardContent>
    </Card>
  )
}

const LiveOrdersPage = () => {
  const totalValue = DEMO_ORDERS.reduce((sum, order) => sum + order.total, 0)
  const totalItems = DEMO_ORDERS.reduce((sum, order) => sum + order.items, 0)

  return (
    <React.Fragment>
      <PageHeader
        title="Live Orders"
        description="Demo preview of customer carts as they build orders in the ordering app."
      >
        <Badge variant="success-light" className="gap-2">
          <Radio className="size-3" />
          Demo live
        </Badge>
      </PageHeader>
      <PageContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Card size="sm">
            <CardHeader>
              <CardDescription>Active carts</CardDescription>
              <CardTitle className="text-3xl">{DEMO_ORDERS.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription>Total draft value</CardDescription>
              <CardTitle className="text-3xl">{formatUSD(totalValue)}</CardTitle>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription>Items in motion</CardDescription>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <PackageCheck className="size-6 text-primary" />
                {totalItems}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
          <div className="grid gap-4 lg:grid-cols-2">
            {DEMO_ORDERS.map((order) => (
              <LiveOrderCard key={order.id} order={order} />
            ))}
          </div>

          <Card className="shadow-xs" size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-primary" />
                Activity stream
              </CardTitle>
              <CardDescription>
                Recent demo cart events from ordering sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Casa Romero added 8 bunches of Cilantro",
                "Harbor Grill changed Ground Beef from 2 CS to 3 CS",
                "Green Spoon Catering reviewed delivery notes",
                "Casa Romero removed 1 CS of Limes",
                "Harbor Grill opened checkout review",
              ].map((event, index) => (
                <div
                  key={event}
                  className="rounded-xl border bg-secondary/30 px-3 py-2 text-sm"
                >
                  <div>{event}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {index + 1} min ago
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </React.Fragment>
  )
}

export default LiveOrdersPage
