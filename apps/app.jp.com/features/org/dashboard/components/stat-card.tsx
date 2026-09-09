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

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  value: string
}

export const StatCard = ({
  title,
  description,
  icon,
  value,
  className,
}: DashboardCardProps) => {
  return (
    <Card size="sm" className={cn(`shadow-xs`, className)}>
      <CardHeader className="flex flex-row gap-1">
        <div className="grid min-w-0 flex-1 gap-6">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {value}
          </CardTitle>
        </div>
        {icon && <CardAction>{icon}</CardAction>}
      </CardHeader>
      {description && (
        <CardContent className="space-y-2">
          <CardDescription>{description}</CardDescription>
        </CardContent>
      )}
    </Card>
  )
}
