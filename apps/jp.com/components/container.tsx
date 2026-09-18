import React from "react"
import { cn } from "@jp/ui/lib/utils"

interface Props {
  className?: string
  children: React.ReactNode
}
export const Container = ({ className, children }: Props) => {
  return (
    <div className={cn("mx-auto max-w-8xl px-5 md:px-8", className)}>
      {children}
    </div>
  )
}
