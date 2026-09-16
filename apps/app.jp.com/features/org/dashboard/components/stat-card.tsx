import React from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { cn } from "@jp/ui/lib/utils"
import { Skeleton } from "@jp/ui/components/skeleton"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  value: string
  loading?: boolean
}

export const StatCard = ({
  title,
  description,
  icon,
  value,
  className,
  loading,
}: DashboardCardProps) => {
  return (
    <Card size="sm" className={cn(`shadow-xs`, className)}>
      <CardHeader className="flex flex-row gap-1">
        <div className="grid min-w-0 flex-1 gap-6">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {loading ? <Skeleton className="h-8 w-20" /> : value}
          </CardTitle>
        </div>
        {icon && <CardAction>{icon}</CardAction>}
      </CardHeader>
      {description && (
        <CardContent>
          <CardDescription className="text-xs">{description}</CardDescription>
        </CardContent>
      )}
    </Card>
  )
}
