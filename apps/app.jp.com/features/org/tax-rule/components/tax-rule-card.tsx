"use client"

import React from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { formatDate, pluralize } from "@jp/utils"
import { MenuDots } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { Skeleton } from "@jp/ui/components/skeleton"
import type { TaxRule } from "../tax-rule.type"
import { Badge } from "@jp/ui/components/badge"
import { TaxRuleDropdown } from "./tax-rule-dropdown"

export const TaxRuleCard = ({ data }: { data: TaxRule }) => {
  return (
    <Card
      size="sm"
      className="h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
    >
      <CardHeader className="relative">
        <CardTitle>{data.name}</CardTitle>

        <CardAction className="absolute top-0 right-4 flex items-center gap-2">
          <TaxRuleDropdown data={data} />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Badge
            variant="warning-light"
            className="h-auto px-2 text-sm font-bold"
          >
            {data.rate}%
          </Badge>
          <CardDescription>
            Assigned to{" "}
            {pluralize(data.customerCount, `${data.customerCount} account`)}
          </CardDescription>
        </div>
        <div className="my-4 border-t border-dashed" />
        <div className="text-muted-foreground">
          Last updated • {formatDate(data.updatedAt)}
        </div>
      </CardContent>
    </Card>
  )
}

export const TaxRuleSkeleton = () => {
  return (
    <Card className="shadow-xs" size="sm">
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-3/5" />

        <div className="space-y-1.5">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  )
}
