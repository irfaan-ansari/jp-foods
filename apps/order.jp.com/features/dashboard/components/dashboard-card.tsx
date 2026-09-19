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
  action?: React.ReactNode
  children?: React.ReactNode
}

export const DashboardCard = ({
  title,
  description,
  action,
  children,
  className,
}: DashboardCardProps) => {
  return (
    <Card size="sm" className={cn(`h-full gap-0 shadow-xs`, className)}>
      <CardHeader className="flex flex-row gap-1 border-b">
        <div className="grid min-w-0 flex-1">
          <CardTitle className="font-semibold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>

      <CardContent className="px-0">{children}</CardContent>
    </Card>
  )
}
