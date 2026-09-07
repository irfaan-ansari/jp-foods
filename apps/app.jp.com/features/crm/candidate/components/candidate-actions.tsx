import React from "react"
import { toast } from "sonner"

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
import { APPLICATION_ACTIONS } from "../candidate.const"
import { CandidateApplication } from "../candidate.type"
import { CandidateApplicationNotesDialog } from "./candidate-notes-dialog"
import { CandidateApplicationStatusDialog } from "./candidate-status-dialog"
import { processCandidateApplication } from "../candidate.action"

type Action =
  (typeof APPLICATION_ACTIONS)[keyof typeof APPLICATION_ACTIONS][number]["action"]

export const CandidateApplicationActions = ({
  data,
}: {
  data: CandidateApplication
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
      case "accept":
        open({
          variant: "default",
          title: "Accept Application",
          description:
            "Accepting this application will start the Gusto and Connecteam onboarding process.",
          action: {
            action: async () => {
              const { serverError } = await processCandidateApplication({
                id: data.id,
                data: { status: "accepted" },
              })
              if (serverError) toast.message(serverError.message)
              else {
                queryClient.invalidateQueries({
                  queryKey: ["candidate-application"],
                })
                queryClient.invalidateQueries({
                  queryKey: ["/crm/candidates/count"],
                })
              }
            },
          },
        })
        return

      case "start_verification":
        open({
          variant: "warning",
          title: "Start Verification",
          description:
            "This will start the applicant verification process through Verified First.",
          action: {
            action: async () => {
              const { serverError } = await processCandidateApplication({
                id: data.id,
                data: { status: "verification_in_progress" },
              })
              if (serverError) toast.message(serverError.message)
              else {
                queryClient.invalidateQueries({
                  queryKey: ["candidate-application"],
                })
                queryClient.invalidateQueries({
                  queryKey: ["/crm/candidates/count"],
                })
              }
            },
          },
        })
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
          <CandidateApplicationNotesDialog
            id={data.id}
            values={{ internalNotes: data.internalNotes ?? "" }}
          >
            <Button size="icon-sm" variant="outline" className="shrink-0">
              <PenNewSquare />
            </Button>
          </CandidateApplicationNotesDialog>
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
      <CandidateApplicationStatusDialog
        id={data.id}
        action={actionDialog ?? "reject"}
        open={actionDialog !== null}
        onOpenChange={(open) => {
          if (!open) setActionDialog(null)
        }}
      />
    </Card>
  )
}
