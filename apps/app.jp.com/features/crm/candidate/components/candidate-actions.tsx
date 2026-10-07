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
import { DocumentText, PenNewSquare } from "@solar-icons/react"
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

      case "under_verification":
        open({
          variant: "warning",
          title: "Start Verification",
          description:
            "Send the application and documents to a background check agency.",
          action: {
            action: async () => {
              const { serverError } = await updateCandidateApplication({
                id: data.id,
                data: { ...updateData, status: "under_verification" },
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
      case "agreement_sent":
        open({
          variant: "warning",
          title: "Send Agreement",
          description: "Send an email with agreement to candidate.",
          action: {
            action: async () => {
              const { serverError } = await updateCandidateApplication({
                id: data.id,
                data: { ...updateData, status: "agreement_sent" },
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

      <CardContent className="border-t border-dashed pt-4">
        <div className="grid gap-2">
          <Button
            disabled={data.status === "hired"}
            onClick={() => handleAction("hired")}
          >
            Hire Candidate
          </Button>
          <Button
            variant="outline"
            disabled={
              data.status === "hired" || data.status === "under_verification"
            }
            onClick={() => handleAction("under_verification")}
          >
            Start Verification
          </Button>
          <Button
            variant="outline"
            disabled={
              data.status === "hired" || data.status === "agreement_sent"
            }
            onClick={() => handleAction("agreement_sent")}
          >
            Send Agreement
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
      <CardContent className="grid gap-2 border-t border-dashed pt-4">
        <CardTitle>PDF</CardTitle>
        <Button asChild variant="outline">
          <a
            href={`/api/v1/crm/candidates/${data.id}/pdf?includeSSN=true`}
            rel="noreferrer"
            target="_blank"
          >
            <DocumentText /> PDF with SSN
          </a>
        </Button>
        <Button asChild variant="outline">
          <a
            href={`/api/v1/crm/candidates/${data.id}/pdf`}
            rel="noreferrer"
            target="_blank"
          >
            <DocumentText />
            PDF Without SSN
          </a>
        </Button>
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
