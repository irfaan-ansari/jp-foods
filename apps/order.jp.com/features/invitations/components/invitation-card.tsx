import React from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { CalendarMark, Letter, TrashBinMinimalistic } from "@solar-icons/react"
import { Avatar, AvatarFallback } from "@jp/ui/components/avatar"
import { formatDate } from "@jp/utils"
import { Skeleton } from "@jp/ui/components/skeleton"
import { authClient } from "@jp/auth/client"
import { Button } from "@jp/ui/components/button"
import { Tooltip, useConfirm } from "@jp/ui/components/jp"
import { Invitation } from "../invitation.type"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const InvitationCard = ({ data }: { data: Invitation }) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()

  const handleCancel = () => {
    open({
      variant: "warning",
      title: "Cancel Invitation?",
      description:
        "The recipient will no longer be able to use the invitation link.",
      action: {
        action: async () => {
          const { error } = await authClient.organization.cancelInvitation({
            invitationId: data.id,
          })
          if (error) toast.error(error.message)
          else {
            toast.success("Invitation cancelled successfully.")
            queryClient.invalidateQueries({ queryKey: ["invitations"] })
          }
        },
      },
    })
  }
  return (
    <Card
      className={`h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm`}
      size="sm"
    >
      <CardHeader className="relative">
        <CardAction className="absolute top-0 right-4 flex items-center gap-2">
          {data.status}
          <Tooltip content="Cancel">
            <Button size="icon-sm" variant="destructive" onClick={handleCancel}>
              <TrashBinMinimalistic />
            </Button>
          </Tooltip>
        </CardAction>
        <div className="flex items-center gap-2">
          <Avatar size="lg" className="overflow-hidden rounded-xl *:rounded-md">
            <AvatarFallback>
              <Letter className="size-4 text-sky-500" />
            </AvatarFallback>
          </Avatar>

          <CardTitle>{data.email}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-t border-dashed" />
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="line-clamp-1 inline-flex flex-1 items-center gap-3 space-x-4 text-sm text-muted-foreground">
            <CalendarMark className="size-4" /> {formatDate(data.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export const MemberSkeleton = () => {
  return (
    <Card size="sm" className="gap-6 shadow-xs">
      <CardHeader className="flex items-center gap-4">
        <Skeleton className="size-10" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="ml-auto size-9" />
      </CardHeader>
      <CardContent className="flex items-center">
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )
}
