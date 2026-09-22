import React from "react"
import { cn } from "@jp/ui/lib/utils"
import { Badge } from "@jp/ui/components/badge"

import { STATUS_MAP } from "@/lib/constant/status"

export const StatusBadge = ({
  status,
  className,
  size,
}: {
  status: string
  className?: string
  size?: "default" | "sm"
}) => {
  const map = STATUS_MAP[status as keyof typeof STATUS_MAP]

  return (
    <Badge
      variant="outline"
      style={{ "--color": map.color } as React.CSSProperties}
      className={cn(
        "h-6 rounded-lg border-(--color)/10 bg-(--color)/10 px-1.5 [&>svg]:size-3.5!",
        size === "sm" ? "text-xs" : "text-[calc(var(--text-sm)-1px)]",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-(--color)" />
      {map.label}
    </Badge>
  )
}
