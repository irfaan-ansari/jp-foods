"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@jp/ui/components/dialog"
import React, { useState } from "react"

import { useQueryClient } from "@tanstack/react-query"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@jp/ui/components/alert"
import { Button } from "@jp/ui/components/button"
import { ArrowRight, RefreshCcw } from "lucide-react"
import {
  Download,
  InfoCircle,
  Letter,
  LinkMinimalistic2,
} from "@solar-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@jp/ui/components/input-group"
import { CopyButton } from "@jp/ui/components/jp"
import { createPriceList, emailPriceList } from "../price-list.action"
import { toast } from "sonner"
import { useOrganization } from "../../organization.data"
import { formatDate } from "@jp/utils"

export const PriceListDialog = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [listState, setListState] = useState({
    email: "",
    sending: false,
    refreshing: false,
  })
  const { data, isPending } = useOrganization()

  const handleRefresh = async () => {
    setListState((prev) => ({ ...prev, refreshing: true }))
    const { serverError } = await createPriceList({
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    if (serverError) {
      toast.error("Failed to refresh price list. Please try again later.")
      return
    }
    setListState((prev) => ({ ...prev, refreshing: false }))
    queryClient.invalidateQueries({ queryKey: ["organization"] })
  }

  const handleSend = async () => {
    setListState((prev) => ({ ...prev, sending: true }))
    const { serverError } = await emailPriceList({
      email: listState.email,
    })

    if (serverError) {
      toast.error("Failed to send price list. Please try again later.")
      return
    }
    setListState((prev) => ({ ...prev, sending: false }))
    toast.success("Price list sent successfully!")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Price List</DialogTitle>
          <DialogDescription>
            Download a copy or send it to your inbox.
          </DialogDescription>
        </DialogHeader>
        <Alert variant="warning">
          <InfoCircle />
          <AlertTitle>Weekly Price List</AlertTitle>
          <AlertDescription>
            Last updated: {formatDate(data?.data?.priceList?.updatedAt)}
          </AlertDescription>
          <AlertAction>
            <Button
              size="xs"
              disabled={listState.refreshing}
              onClick={handleRefresh}
            >
              <RefreshCcw
                className={listState.refreshing ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </AlertAction>
        </Alert>

        <Button size="lg" asChild>
          {data?.data?.priceList?.url ? (
            <a href={data?.data?.priceList?.url} target="_blank">
              <Download /> Download
            </a>
          ) : (
            <span className="opacity-50">
              <Download /> Download
            </span>
          )}
        </Button>

        <div className="relative my-3 border-b text-center text-muted-foreground">
          <span className="absolute top-1/2 left-1/2 -translate-1/2 bg-background px-2 text-sm">
            or email a copy
          </span>
        </div>
        <div className="space-y-2">
          <InputGroup className="h-12">
            <InputGroupAddon align="inline-start">
              <Letter className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                disabled={listState.sending}
                onClick={handleSend}
                variant="default"
                className="h-8 bg-sidebar-accent px-3 hover:bg-sidebar-accent/80"
              >
                Send <ArrowRight />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupInput
              placeholder="name@email.com"
              disabled={listState.sending || !listState.email}
              value={listState.email}
              onChange={(e) =>
                setListState({ ...listState, email: e.target.value })
              }
            />
          </InputGroup>
          <div className="text-muted-foreground">
            We'll send the price list to this email address.
          </div>
        </div>

        {data?.data?.priceList?.url && (
          <div className="min-w-0 rounded-xl border px-3 py-3">
            <CopyButton
              className="w-full"
              value={data?.data?.priceList?.url}
              prefix={
                <LinkMinimalistic2 className="size-4 shrink-0 text-muted-foreground" />
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
