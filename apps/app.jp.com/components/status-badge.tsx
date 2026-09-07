import React from "react"
import { cn } from "@jp/ui/lib/utils"
import { Badge } from "@jp/ui/components/badge"
import { BadgeStatus } from "@/features/shared/shared.type"

export const StatusBadge = ({
  status,
  className,
  size = "default",
}: {
  status: BadgeStatus
  className?: string
  size?: "default" | "sm"
}) => {
  return (
    <Badge
      size={size}
      variant="outline"
      style={{ "--color": status.color } as React.CSSProperties}
      className={cn(
        "rounded-md border-(--color)/10 bg-(--color)/10 px-1.5 backdrop-blur-md",
        size === "sm" ? "text-xs" : "text-[calc(var(--text-sm)-1px)]",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-(--color)" />
      {status.label}
    </Badge>
  )
}
