import * as React from "react"
import { cn } from "@jp/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const iconCardVariants = cva(
  "inline-flex items-center justify-center rounded-3xl bg-muted p-2 transition-all hover:shadow-md active:scale-95",
  {
    variants: {
      size: {
        xs: "size-6",
        sm: "size-8",
        default: "size-9",
        lg: "size-11",
        xl: "size-12",
      },
      variant: {
        primary: "ring-1 ring-border ring-offset-1 ring-offset-background",
        "primary-outline": "",
        secondary: "",
        outline: "",
        "warning-outline": "",
        "warning-light": "",
        warning: "",
        info: "",
        "info-light": "",
        "info-outline": "",
        destructive: "",
        "destructive-light": "",
        "destructive-outline": "",
        success: "",
        "success-light": "",
        "success-outline": "",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "primary",
    },
  }
)

interface IconCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconCardVariants> {
  children: React.ReactNode
}

export function IconCard({
  className,
  size,
  variant,
  children,
  ...props
}: IconCardProps) {
  return (
    <div
      className={cn(iconCardVariants({ size, variant }), className)}
      data-slot="icon-card"
      {...props}
    >
      <div
        data-slot="icon-card-media"
        className="flex h-full w-full items-center justify-center rounded-2xl border bg-background shadow-sm"
      >
        {children}
      </div>
    </div>
  )
}
