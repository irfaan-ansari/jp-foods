"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@jp/ui/components/button"

import { useQueryClient } from "@tanstack/react-query"
import type { Order } from "@/features/org/order/order.type"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { cancelOrder, completeOrder } from "@/features/org/order/order.action"
import {
  Bill,
  BillCheck,
  CalendarMark,
  CheckCircle,
  CloseCircle,
  MenuDots,
} from "@solar-icons/react"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { OrderScheduleDialog } from "./order-schedule-dialog"

export const OrderDropdown = ({
  data,
  children,
}: {
  data: Order
  children: React.ReactNode
}) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { id, deliveryDate = "", deliveryWindow = "", status } = data

  const handleAction = (action: string) => {
    switch (action) {
      case "completed":
        open({
          title: "Mark as completed",
          description:
            "This will mark the order as completed and update its status.",
          action: {
            action: async () => {
              const { serverError } = await completeOrder({
                id,
              })
              if (serverError) {
                toast.error(serverError.message)
              } else {
                queryClient.invalidateQueries({
                  queryKey: ["orders"],
                })
              }
            },
          },
        })
        break
      case "cancel":
        open({
          variant: "warning",
          title: "Cancel this order?",
          description:
            "This order will be marked as canceled and can no longer be processed.",
          action: {
            action: async () => {
              const { serverError } = await cancelOrder({ id })
              if (serverError) {
                toast.error(serverError.message)
              } else {
                queryClient.invalidateQueries({
                  queryKey: ["orders"],
                })
              }
            },
          },
        })
        break
    }
  }

  return (
    <PopDrawer
      open={isOpen}
      setOpen={setIsOpen}
      trigger={children}
      className="*:data-[slot=button]:justify-start"
    >
      <Button variant="ghost" asChild>
        <a href={`/api/v1/org/orders/${id}/estimate`} target="_blank">
          <BillCheck /> Estimate
        </a>
      </Button>

      <Button variant="ghost" asChild>
        <a href={`/api/v1/org/orders/${id}/slip`} target="_blank">
          <Bill /> Packing Slip
        </a>
      </Button>

      {status !== "completed" && (
        <>
          <OrderScheduleDialog
            id={id}
            defaultValues={{
              deliveryDate: deliveryDate!,
              deliveryWindow: deliveryWindow!,
            }}
          >
            <Button variant="ghost" className="justify-start">
              <CalendarMark /> Edit Schedule
            </Button>
          </OrderScheduleDialog>
          <Button variant="ghost" onClick={() => handleAction("completed")}>
            <CheckCircle /> Mark as Completed
            <div className="-mx-4 my-1 border-t md:-mx-2"></div>
          </Button>
          <div className="-mx-4 my-1 border-t md:-mx-2" />
          <OrgAccess permission={{ order: ["cancel"] }}>
            {(disabled) => (
              <Button
                variant="ghost"
                className="hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleAction("cancel")}
                disabled={disabled}
              >
                <CloseCircle /> Cancel
              </Button>
            )}
          </OrgAccess>
        </>
      )}
    </PopDrawer>
  )
}
