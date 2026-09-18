"use client"

import { useState } from "react"
import { Button } from "@jp/ui/components/button"
import { Check, Copy } from "lucide-react"
import { cn } from "cn"

type CopyRenderProps = {
  value: string
  copied: boolean
  copy: () => Promise<void>
}

type CopyProps = {
  value: string
  prefix?: React.ReactNode

  className?: string
}

export function CopyButton({ value, prefix, className }: CopyProps) {
  const [copied, setCopied] = useState(false)

  const copy = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch (err) {
      console.error("Copy failed", err)
    }
  }

  if (!value) return null

  return (
    <div
      className={cn(
        "inline-flex min-w-0 shrink-0 items-center gap-0.5 hover:*:data-[slot=button]:opacity-100",
        className
      )}
    >
      {prefix}
      <span
        data-slot="copy-value"
        className={`min-w-0 truncate text-sm text-nowrap text-muted-foreground ${prefix ? "ml-1" : ""}`}
      >
        {value}
      </span>
      <Button
        onClick={copy}
        size="icon-xs"
        variant="ghost"
        className="relative z-1 rounded-md border text-sm opacity-0"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  )
}
