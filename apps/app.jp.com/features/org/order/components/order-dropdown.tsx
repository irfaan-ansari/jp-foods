"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@jp/ui/components/button"

import { useQueryClient } from "@tanstack/react-query"
import type { Order } from "@/features/org/order/order.type"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { cancelOrder } from "@/features/org/order/order.action"
import { Bill, BillCheck, CalendarMark, CloseCircle } from "@solar-icons/react"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { OrderScheduleDialog } from "./order-schedule-dialog"
import { OrderInvoiceDialog } from "./order-invoice-dialog"

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

      {status === "in_progress" && (
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

          <div className="-mx-4 my-1 border-t md:-mx-2" />
          <OrgAccess permission={{ order: ["cancel"] }}>
            {(disabled) => (
              <Button
                variant="ghost"
                className="hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleAction("cancel")}
                disabled={disabled || data.status !== "in_progress"}
              >
                <CloseCircle /> Cancel
              </Button>
            )}
          </OrgAccess>
        </>
      )}
      {status === "completed" &&
        (data.invoiceStatus === "issued" ? (
          <Button variant="ghost" asChild>
            <a
              href={`/api/v1/org/orders/${id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BillCheck /> Download Invoice
            </a>
          </Button>
        ) : (
          <OrgAccess permission={{ order: ["update"] }}>
            {(disabled) => (
              <OrderInvoiceDialog id={id}>
                <Button variant="ghost" disabled={disabled}>
                  <BillCheck /> Generate Invoice
                </Button>
              </OrderInvoiceDialog>
            )}
          </OrgAccess>
        ))}
    </PopDrawer>
  )
}
