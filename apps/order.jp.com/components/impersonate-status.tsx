"use client"

import React from "react"
import { authClient } from "@jp/auth/client"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@jp/ui/components/alert"
import { TriangleAlert } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { useLoader } from "@jp/ui/components/jp"

const ImpersonateStatus = () => {
  const { show, hide } = useLoader()
  const { data } = authClient.useSession()

  const hanldeStopImpersonate = async () => {
    show()
    const { error } = await authClient.admin.stopImpersonating()
    if (error) {
      hide()
    }
  }

  if (!data || !data?.session?.impersonatedBy) {
    return null
  }

  return (
    <Alert
      variant="destructive"
      className="sticky top-0 z-3 rounded-none border-b! border-none py-3.5 backdrop-blur-3xl has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] lg:px-7"
    >
      <TriangleAlert className="size-5 shrink-0" />
      <AlertTitle>
        You are viewing this account as <strong>{data?.user?.name}</strong>
      </AlertTitle>
      <AlertDescription>
        Changes made during this session may affect this account.
      </AlertDescription>
      <AlertAction className="row-start-1 row-end-3 self-center max-sm:col-start-3 max-sm:mt-0 max-sm:justify-end">
        <Button size="sm" variant="outline" onClick={hanldeStopImpersonate}>
          Exit
        </Button>
      </AlertAction>
    </Alert>
  )
}

export default ImpersonateStatus
