"use client"

import * as React from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  Trash2,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@jp/ui/components/alert-dialog"

import { cn } from "@jp/ui/lib/utils"

type ConfirmVariant = "default" | "destructive" | "warning" | "info"

interface ConfirmAction {
  label?: string
  action?: () => Promise<void> | void
}

interface ConfirmOptions {
  variant?: ConfirmVariant
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ConfirmAction
  cancel?: ConfirmAction
}

interface ConfirmContextValue {
  open: (options: ConfirmOptions) => void
  close: () => void
  showLoader: (message?: string) => void
  hideLoader: () => void
}

const ConfirmContext = React.createContext<ConfirmContextValue | null>(null)

const VARIANTS = {
  default: {
    title: "Are you sure?",
    description: "Please confirm that you want to continue.",
    icon: CheckCircle2,
    iconClass: "bg-primary/10 border-primary/10 text-primary",
    buttonVariant: "default" as const,
  },
  destructive: {
    title: "Delete this item?",
    description: "This action cannot be undone.",
    icon: Trash2,
    iconClass: "bg-destructive/10 border-destructive/10 text-destructive",
    buttonVariant: "destructive" as const,
  },
  warning: {
    title: "Proceed with caution?",
    description: "This action may have unintended consequences.",
    icon: AlertTriangle,
    iconClass:
      "bg-yellow-500/10 border-yellow-500/10 text-yellow-600 dark:text-yellow-500",
    buttonVariant: "default" as const,
  },
  info: {
    title: "Continue?",
    description: "Please confirm that you want to continue.",
    icon: Info,
    iconClass:
      "bg-blue-500/10 border-blue-500/10 text-blue-600 dark:text-blue-400",
    buttonVariant: "default" as const,
  },
}

export function ConfirmDialogProvider({ children }: React.PropsWithChildren) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState<ConfirmOptions>({})

  const [loaderOpen, setLoaderOpen] = React.useState(false)
  const [loaderMessage, setLoaderMessage] = React.useState<string>()

  const openDialog = React.useCallback((options: ConfirmOptions) => {
    setOptions(options)
    setOpen(true)
  }, [])

  const closeDialog = React.useCallback(() => {
    setLoading(false)
    setOpen(false)
  }, [])

  const handleConfirm = async () => {
    try {
      setLoading(true)

      await options.action?.action?.()

      closeDialog()
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    try {
      await options.cancel?.action?.()
    } finally {
      closeDialog()
    }
  }

  const showLoader = React.useCallback((message?: string) => {
    setLoaderMessage(message ?? "Please wait...")
    setLoaderOpen(true)
  }, [])

  const hideLoader = React.useCallback(() => {
    setLoaderOpen(false)
  }, [])

  const variant = options.variant ?? "default"
  const config = VARIANTS[variant]
  const Icon = config.icon

  return (
    <ConfirmContext.Provider
      value={{
        open: openDialog,
        close: closeDialog,
        showLoader,
        hideLoader,
      }}
    >
      {children}

      <AlertDialog
        open={open}
        onOpenChange={(value) => {
          if (loading) return

          if (!value) {
            closeDialog()
          }
        }}
      >
        <AlertDialogContent className="data-[size=default]:sm:max-w-lg">
          <AlertDialogHeader className="items-center gap-3 text-center sm:flex sm:flex-row">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl border sm:size-10",
                config.iconClass
              )}
            >
              <Icon className="size-4" />
            </div>

            <div className="space-y-1.5">
              <AlertDialogTitle className="text-base leading-tight font-bold">
                {options.title ?? config.title}
              </AlertDialogTitle>

              <AlertDialogDescription className="text-muted-foreground">
                {options.description ?? config.description}
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-2 gap-2">
            <AlertDialogCancel
              disabled={loading}
              className="h-9 min-w-28"
              onClick={(e) => {
                e.preventDefault()
                void handleCancel()
              }}
            >
              {options.cancel?.label ?? "Cancel"}
            </AlertDialogCancel>

            <AlertDialogAction
              variant={config.buttonVariant}
              disabled={loading}
              className="min-w-28"
              onClick={(e) => {
                e.preventDefault()
                void handleConfirm()
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                (options.action?.label ?? "Continue")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loaderOpen && (
        <div
          role="alert"
          aria-busy="true"
          className="fixed inset-0 z-60 flex items-center justify-center gap-1.5 bg-background/80 backdrop-blur-sm"
        >
          <Loader2 className="size-4 animate-spin" />

          {loaderMessage && (
            <p className="text-sm text-muted-foreground">{loaderMessage}</p>
          )}
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = React.useContext(ConfirmContext)

  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmDialogProvider")
  }

  return {
    open: context.open,
    close: context.close,
  }
}

export function useLoader() {
  const context = React.useContext(ConfirmContext)

  if (!context) {
    throw new Error("useLoader must be used inside ConfirmDialogProvider")
  }

  return {
    show: context.showLoader,
    hide: context.hideLoader,
  }
}
