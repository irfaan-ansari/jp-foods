"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useQueryClient } from "@tanstack/react-query"

import {
  CheckCircle,
  CloseCircle,
  MenuDots,
  TrashBinTrash,
} from "@solar-icons/react"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"

import { CatalogInquiry } from "../catalog.type"
import { UserAccess } from "@/features/auth/components/user-permission"
import { deleteCatalogInquiry, updateCatalogInquiry } from "../catalog.action"

export const CatalogDropdown = ({ data }: { data: CatalogInquiry }) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { id } = data

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

          queryClient.invalidateQueries({
            queryKey: ["catalog-inquiry"],
          })

          queryClient.invalidateQueries({
            queryKey: ["/api/v1/crm/catalog-inquiries/count"],
          })
        },
      },
    })
  }

  const handleAction = (action: "approve" | "reject") => {
    const isApprove = action === "approve"

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
            data: { status: isApprove ? "approved" : "rejected" },
          })

          if (serverError) {
            toast.error(serverError.message)
            return
          }

          queryClient.invalidateQueries({
            queryKey: ["catalog-inquiry"],
          })

          queryClient.invalidateQueries({
            queryKey: ["/api/v1/crm/catalog-inquiries/count"],
          })
        },
      },
    })
  }

  return (
    <PopDrawer
      open={isOpen}
      setOpen={setIsOpen}
      trigger={
        <Button size="icon-sm" variant="outline" className="relative z-1">
          <MenuDots />
        </Button>
      }
      className="*:data-[slot=button]:justify-start"
    >
      {data.status !== "approved" && (
        <UserAccess permission={{ "catalog-inquiry": ["update"] }}>
          {(disabled) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("approve")}
              disabled={disabled}
            >
              <CheckCircle /> Approve
            </Button>
          )}
        </UserAccess>
      )}

      {data.status !== "rejected" && (
        <UserAccess permission={{ "catalog-inquiry": ["update"] }}>
          {(disabled) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("reject")}
              disabled={disabled}
            >
              <CloseCircle /> Reject
            </Button>
          )}
        </UserAccess>
      )}

      <UserAccess permission={{ "catalog-inquiry": ["delete"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
            disabled={disabled}
          >
            <TrashBinTrash /> Delete
          </Button>
        )}
      </UserAccess>
    </PopDrawer>
  )
}
