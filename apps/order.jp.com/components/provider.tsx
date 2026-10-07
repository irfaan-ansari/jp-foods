"use client"
import React, { useEffect, useState } from "react"
import { authClient } from "@jp/auth/client"
import { Toaster } from "@jp/ui/components/sonner"
import { TooltipProvider } from "@jp/ui/components/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfirmDialogProvider } from "@jp/ui/components/jp"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { presenceApiClient } from "@/lib/api-client"

const HEARTBEAT_INTERVAL = 30 * 1000

const postPresence = async () => {
  await presenceApiClient.post<{ success: boolean }>("/presence")
}

const PresenceHeartbeat = () => {
  const { data, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending || !data?.session) return

    const heartbeat = () => {
      void postPresence().catch(() => undefined)
    }

    heartbeat()
    const intervalId = window.setInterval(heartbeat, HEARTBEAT_INTERVAL)

    return () => window.clearInterval(intervalId)
  }, [data?.session?.id, isPending])

  return null
}

export const Provider = ({
  children,
}: {
  children: Readonly<React.ReactNode>
}) => {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: (failureCount, error: any) => {
            const status = error?.status ?? error?.response?.status
            if (status === 403 || status === 404) {
              return false
            }
            return failureCount < 3
          },
        },
        mutations: {
          retry: false,
        },
      },
    })
    return client
  })

  return (
    <QueryClientProvider client={queryClient}>
      <PresenceHeartbeat />
      <TooltipProvider>
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </TooltipProvider>
      <Toaster position="top-center" />
    </QueryClientProvider>
  )
}
