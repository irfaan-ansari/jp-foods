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
import { CandidateApplication } from "../candidate.type"
import { CandidateApplicationNotesDialog } from "./candidate-notes-dialog"
import { CandidateApplicationStatusDialog } from "./candidate-status-dialog"
import { updateCandidateApplication } from "../candidate.action"

export const CandidateApplicationActions = ({
  data,
}: {
  data: CandidateApplication
}) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [showActionDialog, setShowActionDialog] = React.useState(false)

  const updateData = {
    statusReason: "",
    statusDetails: "",
    internalNotes: data.internalNotes ?? "",
  }

  const handleAction = (action: string) => {
    switch (action) {
      case "hired":
        open({
          variant: "default",
          title: "Hire Candidate",
          description:
            "Hiring this candidate will start their onboarding in Gusto and Connecteam.",
          action: {
            action: async () => {
              const { serverError } = await updateCandidateApplication({
                id: data.id,
                data: { ...updateData, status: "hired" },
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

      case "verification_in_progress":
        open({
          variant: "warning",
          title: "Start Verification",
          description:
            "This will start the applicant verification process through Verified First.",
          action: {
            action: async () => {
              const { serverError } = await updateCandidateApplication({
                id: data.id,
                data: { ...updateData, status: "verification_in_progress" },
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
      case "rejected":
        setShowActionDialog(true)
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
          <CandidateApplicationNotesDialog id={data.id} data={data}>
            <Button size="icon-sm" variant="outline" className="shrink-0">
              <PenNewSquare />
            </Button>
          </CandidateApplicationNotesDialog>
        </div>
      </CardContent>
      <CardContent className="border-t border-dashed">
        <div className="mt-4 grid gap-2">
          <Button
            disabled={data.status === "hired"}
            onClick={() => handleAction("hired")}
          >
            Hire Candidate
          </Button>
          <Button
            variant="outline"
            disabled={
              data.status === "hired" ||
              data.status === "verification_in_progress"
            }
            onClick={() => handleAction("verification_in_progress")}
          >
            Start Verification
          </Button>
          <Button
            variant="destructive"
            disabled={data.status === "rejected"}
            onClick={() => handleAction("rejected")}
          >
            Reject Candidate
          </Button>
        </div>
      </CardContent>
      <CandidateApplicationStatusDialog
        id={data.id}
        data={{ ...data, status: "rejected" }}
        open={showActionDialog}
        onOpenChange={(open) => {
          setShowActionDialog(open)
        }}
      />
    </Card>
  )
}
