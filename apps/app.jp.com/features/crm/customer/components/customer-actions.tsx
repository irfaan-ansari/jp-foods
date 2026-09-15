import React from "react"
import { toast } from "sonner"
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
import { CustomerApplicationNotesDialog } from "./customer-notes-dialog"
import { CustomerApplicationStatusDialog } from "./customer-status-dialog"
import { updateCustomerApplication } from "../customer.action"
import { APPLICATION_ACTIONS } from "../customer.const"

const CustomerApplicationActions = ({
  data,
}: {
  data: CustomerApplication
}) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [actionDialog, setActionDialog] = React.useState<
    "on_hold" | "rejected" | null
  >(null)

  const updateData = {
    ...data,
    statusReason: "",
    statusDetails: "",
    internalNotes: data.internalNotes ?? "",
  }

  const handleAction = (action: string) => {
    switch (action) {
      case "approved":
        open({
          variant: "default",
          title: "Approve Application",
          description:
            "Confirm approval of this application. The applicant will be notified and allowed to proceed to the next stage.",
          action: {
            label: "Approve",
            action: async () => {
              const { serverError } = await updateCustomerApplication({
                id: data.id,
                data: {
                  ...updateData,
                  status: "active",
                },
              })
              if (serverError) toast.message(serverError.message)
              else {
                queryClient.invalidateQueries({
                  queryKey: ["customer-application", data.id],
                })
                queryClient.invalidateQueries({
                  queryKey: ["/crm/customers/count"],
                })
              }
            },
          },
        })
        return
      case "under_review":
        open({
          variant: "info",
          title: "Mark as Under Review",
          description:
            "Move this application to the review queue. The applicant may be notified that additional assessment is in progress.",
          action: {
            action: async () => {
              const { serverError } = await updateCustomerApplication({
                id: data.id,
                data: {
                  ...updateData,
                  status: action,
                },
              })
              if (serverError) toast.message(serverError.message)
              else {
                queryClient.invalidateQueries({
                  queryKey: ["customer-application", data.id],
                })
                queryClient.invalidateQueries({
                  queryKey: ["/crm/customers/count"],
                })
              }
            },
          },
        })
        return
      case "on_hold":
        setActionDialog("on_hold")
        return
      case "rejected":
        setActionDialog("rejected")
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
          <CustomerApplicationNotesDialog id={data.id} data={{ ...data }}>
            <Button size="icon-sm" variant="outline" className="shrink-0">
              <PenNewSquare />
            </Button>
          </CustomerApplicationNotesDialog>
        </div>
      </CardContent>
      <CardContent className="border-t border-dashed">
        <div className="mt-4 grid gap-2">
          {APPLICATION_ACTIONS.map((action) => (
            <Button
              variant={action.variant}
              disabled={data.status === action.status}
              onClick={() => handleAction(action.status)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
      <CustomerApplicationStatusDialog
        id={data.id}
        data={{ ...data, status: actionDialog ?? "on_hold" }}
        open={actionDialog !== null}
        onOpenChange={(open) => {
          if (!open) setActionDialog(null)
        }}
      />
    </Card>
  )
}

export default CustomerApplicationActions
