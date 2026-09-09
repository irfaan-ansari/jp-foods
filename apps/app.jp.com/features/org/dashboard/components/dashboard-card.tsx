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
    <Card size="sm" className={cn(`h-full shadow-xs`, className)}>
      <CardHeader className="flex flex-row gap-1">
        <div className="grid min-w-0 flex-1">
          <CardTitle className="font-semibold">{title}</CardTitle>
          {description && <CardDescription>DashboardSection</CardDescription>}
        </div>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  )
}
