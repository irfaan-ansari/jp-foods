"use client"
import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"

import { formatDate, formatUSD } from "@jp/utils"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { StatusBadge } from "@/components/status-badge"
import { STATUS_MAP } from "@/lib/constant/status"

export const TransactionCard = () => {
  const { searchParams } = useRouterStuff()
  const statuses = Object.keys(STATUS_MAP) as (keyof typeof STATUS_MAP)[]

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

  return (
    <Card
      size="sm"
      className="relative h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
    >
      <Link
        href={`/invoices/1283?${searchParams}`}
        className="absolute inset-0"
      />

      <CardHeader>
        <div className="space-y-1">
          <CardTitle>#PAY-1283</CardTitle>
          <CardDescription className="text-xs">
            Paid {formatDate(new Date("2026-05-23"))}
          </CardDescription>
        </div>
        <CardAction className="flex items-center gap-2">
          <StatusBadge status={randomStatus!} />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <span className="flex-1">Invoice</span>

            <span>#INV-1234</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex-1">Method</span>
            <span>{formatUSD(76.88)}</span>
          </div>
          <div className="flex items-center gap-2 text-base font-semibold">
            <span className="flex-1">Amount</span>
            <span>{formatUSD(76.88)}</span>
          </div>
        </div>
        <div className="border-t border-dashed" />
        <div className="flex items-center gap-4">
          <div className="text-muted-foreground">View Receipt</div>
          <ArrowRight className="ml-auto size-4 text-muted-foreground transition group-hover/card:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  )
}
