// features/auth/use-presence-heartbeat.ts
import { useEffect } from "react"
import { authClient } from "@jp/auth/client"
import { presenceApiClient } from "@/lib/api-client"

const HEARTBEAT_INTERVAL = 2 * 60 * 1000

const postPresence = async () => {
  await presenceApiClient.post<{ success: boolean }>("/presence")
}

export const usePostPresence = () => {
  const { data: sessionData, isPending } = authClient.useSession()

  const sessionId = sessionData?.session?.id

  useEffect(() => {
    if (isPending || !sessionId) return

    let intervalId: number | null = null

    const start = () => {
      if (intervalId !== null) return
      postPresence()
      intervalId = window.setInterval(() => postPresence(), HEARTBEAT_INTERVAL)
    }

    const stop = () => {
      if (intervalId === null) return
      window.clearInterval(intervalId)
      intervalId = null
    }

    // Already focused on mount / login
    if (document.hasFocus()) start()

    window.addEventListener("focus", start)
    window.addEventListener("blur", stop)

    return () => {
      stop()
      window.removeEventListener("focus", start)
      window.removeEventListener("blur", stop)
    }
  }, [isPending, sessionId])
}
