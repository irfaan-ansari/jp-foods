import React from "react"
import { toast } from "sonner"
import { APPLICATION_ACTIONS } from "../customer.const"
import { CustomerApplication } from "../customer.type"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { Button } from "@jp/ui/components/button"
import { useConfirm } from "@jp/ui/components/jp"
import { PenNewSquare } from "@solar-icons/react"
import { useQueryClient } from "@tanstack/react-query"
import { processCustomerApplication } from "../customer.action"
import { CustomerApplicationNotesDialog } from "./customer-notes-dialog"
import { CustomerApplicationStatusDialog } from "./customer-status-dialog"

type Action =
  (typeof APPLICATION_ACTIONS)[keyof typeof APPLICATION_ACTIONS][number]["action"]

const CustomerApplicationActions = ({
  data,
}: {
  data: CustomerApplication
}) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [actionDialog, setActionDialog] = React.useState<
    "hold" | "reject" | null
  >(null)
  const actions =
    APPLICATION_ACTIONS[data.status as keyof typeof APPLICATION_ACTIONS] ?? []

  const handleAction = (action: Action) => {
    switch (action) {
      case "approve":
        open({
          variant: "default",
          title: "Approve Application",
          description:
            "Confirm approval of this application. The applicant will be notified and allowed to proceed to the next stage.",
          action: {
            label: "Approve",
            action: async () => {
              const { serverError } = await processCustomerApplication({
                id: data.id,
                data: { status: "active" },
              })
              if (serverError) toast.message(serverError.message)
              else {
                queryClient.invalidateQueries({
                  queryKey: ["customer-application", data.id],
                })
                queryClient.invalidateQueries({
                  queryKey: ["/api/v1/crm/customers/count"],
                })
              }
            },
          },
        })
        return
      case "review":
        open({
          variant: "info",
          title: "Mark Application as Under Review",
          description:
            "Move this application to the review queue. The applicant may be notified that additional assessment is in progress.",
          action: {
            action: async () => {
              const { serverError } = await processCustomerApplication({
                id: data.id,
                data: { status: "under_review" },
              })
              if (serverError) toast.message(serverError.message)
              else {
                queryClient.invalidateQueries({
                  queryKey: ["customer-application", data.id],
                })
                queryClient.invalidateQueries({
                  queryKey: ["/api/v1/crm/customers/count"],
                })
              }
            },
          },
        })
        return
      case "hold":
        setActionDialog("hold")
        return
      case "reject":
        setActionDialog("reject")
        return
    }
  }

  return (
    <Card size="sm" className="bg-secondary/40">
      <CardHeader className="border-b border-dashed">
        <CardTitle>Notes & Actions</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-start gap-3">
          <p className="flex-1 text-muted-foreground">
            {data?.internalNotes ?? "No notes"}
          </p>
          <CustomerApplicationNotesDialog
            id={data.id}
            values={{ internalNotes: data.internalNotes ?? "" }}
          >
            <Button size="icon-sm" variant="outline" className="shrink-0">
              <PenNewSquare />
            </Button>
          </CustomerApplicationNotesDialog>
        </div>
      </CardContent>
      <CardContent className="border-t border-dashed">
        <div className="mt-4 grid grid-cols-2 gap-3">
          {actions.map(({ variant, label, className, action }) => (
            <Button
              variant={variant}
              className={className}
              onClick={() => handleAction(action)}
            >
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
      <CustomerApplicationStatusDialog
        id={data.id}
        action={actionDialog ?? "hold"}
        open={actionDialog !== null}
        onOpenChange={(open) => {
          if (!open) setActionDialog(null)
        }}
      />
    </Card>
  )
}

export default CustomerApplicationActions
