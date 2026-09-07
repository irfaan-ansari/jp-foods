import React from "react"
import { useOrderFormUI } from "../order-form-ui.store"
import { Button } from "@jp/ui/components/button"
import { GuideDialog } from "@/features/order-guide/components/guide-dialog"

export const StickyGuideAction = () => {
  const selecting = useOrderFormUI((state) => state.selecting)
  const selected = useOrderFormUI((state) => state.selected)
  const setSelecting = useOrderFormUI((state) => state.setSelecting)

  if (!selecting) return

  return (
    <div className="sticky bottom-4 z-2 mx-auto mt-auto flex min-h-16 w-full max-w-2xl items-center justify-between rounded-2xl border-2 border-background bg-secondary/20 p-3 text-sm text-muted-foreground shadow-sm ring-1 ring-ring/20 backdrop-blur-2xl">
      <div className="flex size-full gap-4">
        <div className="grid flex-1">
          <span className="text-xs text-muted-foreground uppercase">
            Selected
          </span>
          <span className="font-semibold text-primary">
            {selected.length} Items
          </span>
        </div>
        <Button
          variant="link"
          className="text-foreground underline"
          onClick={() => setSelecting(false)}
        >
          Cancel
        </Button>
        <GuideDialog
          values={{
            name: "",
            description: "",
            productIds: selected,
          }}
        >
          <Button disabled={selected.length <= 0} className="min-w-28">
            Save Guide
          </Button>
        </GuideDialog>
      </div>
    </div>
  )
}
