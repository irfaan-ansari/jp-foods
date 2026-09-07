import React from "react"
import { cn } from "@jp/ui/lib/utils"

interface Props {
  className?: string
  children: React.ReactNode
}
export const Container = ({ className, children }: Props) => {
  return (
    <div className={cn("relative container mx-auto px-4 md:px-8", className)}>
      {children}
    </div>
  )
}
