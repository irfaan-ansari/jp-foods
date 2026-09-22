"use client"

import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import {
  Buildings,
  CheckCircle,
  CloseCircle,
  Global,
  Letter,
  Notes,
  Smartphone,
  TrashBinTrash,
  User,
} from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { CopyButton } from "@jp/ui/components/jp"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { IconTile } from "@jp/ui/components/icon-tile"
import { formatDate } from "@jp/utils"
import { UserAccess } from "@/features/auth/components/user-permission"
import { deleteCatalogInquiry, updateCatalogInquiry } from "../catalog.action"
import { CatalogInquiry } from "../catalog.type"
import { CatalogInquiryBadge } from "./catalog-card"

export const CatalogDetailsClient = ({ data }: { data: CatalogInquiry }) => {
  return (
    <div className="grid grid-cols-1 gap-6 @5xl:grid-cols-3">
      <div className="space-y-6 @5xl:col-span-2">
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <div className="flex items-center gap-2">
              <IconTile variant="elevated">
                <Buildings className="size-5 text-blue-500" />
              </IconTile>
              <div className="grid">
                <CardTitle>{data.companyName}</CardTitle>
                <CardDescription>{data.companyType}</CardDescription>
              </div>
            </div>
            <CardAction>
              <CatalogInquiryBadge status={data.status} />
            </CardAction>
          </CardHeader>
          <CardContent className="grid grid-cols-1">
            <div className="flex items-center gap-1">
              <User className="size-4" />
              {data.firstName} {data.lastName}
            </div>

            <CopyButton
              prefix={<Letter className="size-4" />}
              value={data.email}
              className="*:data-[slot=copy-value]:text-foreground"
            />
            <CopyButton
              prefix={<Smartphone className="size-4" />}
              value={data.phone ?? ""}
              className="*:data-[slot=copy-value]:text-foreground"
            />
          </CardContent>
        </Card>

        {(data.message || data.statusReason || data.statusDetails) && (
          <Card size="sm">
            <CardHeader className="border-b border-dashed">
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {data.message && (
                <div className="grid gap-1">
                  <div className="text-xs text-muted-foreground">Message</div>
                  <div className="flex items-start gap-1">
                    <Notes className="mt-0.5 size-4 shrink-0" />
                    <span>{data.message}</span>
                  </div>
                </div>
              )}
              {data.statusReason && (
                <div className="grid gap-1">
                  <div className="text-xs text-muted-foreground">
                    Status Reason
                  </div>
                  <div>{data.statusReason}</div>
                </div>
              )}
              {data.statusDetails && (
                <div className="grid gap-1">
                  <div className="text-xs text-muted-foreground">
                    Status Details
                  </div>
                  <div>{data.statusDetails}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid">
              <div className="mb-1 text-xs text-muted-foreground">
                Created At
              </div>
              <div>{formatDate(data.createdAt)}</div>
            </div>
            <div className="grid">
              <div className="mb-1 text-xs text-muted-foreground">
                Updated At
              </div>
              <div>{formatDate(data.updatedAt)}</div>
            </div>
            {data.reviewedAt && (
              <div className="grid">
                <div className="mb-1 text-xs text-muted-foreground">
                  Reviewed At
                </div>
                <div>{formatDate(data.reviewedAt)}</div>
              </div>
            )}
            {data.ipAddress && (
              <div className="grid">
                <div className="mb-1 text-xs text-muted-foreground">
                  IP & User Agent
                </div>
                <div>{data.ipAddress}</div>
                <div>{data.userAgent}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card size="sm" className="sticky top-20 bg-secondary/40">
          <CardHeader className="border-b border-dashed">
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <CatalogDetailActions data={data} />
            {data.status === "approved" && data.url ? (
              <CopyButton
                prefix={<Global className="size-4" />}
                value={data.url}
                className="*:data-[slot=copy-value]:text-foreground"
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                Approve this inquiry to generate a catalog access link.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const CatalogDetailActions = ({ data }: { data: CatalogInquiry }) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const { id } = data

  const invalidateInquiries = () => {
    queryClient.invalidateQueries({
      queryKey: ["catalog-inquiry"],
    })
    queryClient.invalidateQueries({
      queryKey: ["/crm/catalog-inquiries/count"],
    })
  }

  const handleStatus = (status: string) => {
    const isApprove = status === "approved"

    open({
      variant: isApprove ? "default" : "destructive",
      title: isApprove
        ? "Approve this catalog inquiry?"
        : "Reject this catalog inquiry?",
      description: isApprove
        ? "Approving this inquiry will give the customer access to all catalogs."
        : "Rejecting this inquiry will deny the customer access to the catalogs.",
      action: {
        action: async () => {
          const { serverError } = await updateCatalogInquiry({
            id,
            data: { status },
          })

          if (serverError) {
            toast.error(serverError.message)
            return
          }

          invalidateInquiries()
        },
      },
    })
  }

  const handleDelete = () => {
    open({
      variant: "destructive",
      title: "Delete this catalog inquiry?",
      description:
        "This inquiry will be deleted and can no longer be processed.",
      action: {
        action: async () => {
          const { serverError } = await deleteCatalogInquiry({ id })

          if (serverError) {
            toast.error(serverError.message)
            return
          }

          invalidateInquiries()
        },
      },
    })
  }

  return (
    <div className="grid gap-2">
      <UserAccess permission={{ "catalog-inquiry": ["update"] }}>
        {(disabled) => (
          <Button
            size="sm"
            onClick={() => handleStatus("approved")}
            disabled={disabled || data.status === "approved"}
          >
            <CheckCircle /> Approve
          </Button>
        )}
      </UserAccess>
      <UserAccess permission={{ "catalog-inquiry": ["update"] }}>
        {(disabled) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatus("rejected")}
            disabled={disabled || data.status === "rejected"}
          >
            <CloseCircle /> Reject
          </Button>
        )}
      </UserAccess>
      <UserAccess permission={{ "catalog-inquiry": ["delete"] }}>
        {(disabled) => (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={disabled}
          >
            <TrashBinTrash /> Delete
          </Button>
        )}
      </UserAccess>
    </div>
  )
}
