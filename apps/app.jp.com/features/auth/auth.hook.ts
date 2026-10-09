import { authClient } from "@jp/auth/client"
import { useEffect } from "react"
import { usePostPresence } from "./auth.data"

const HEARTBEAT_INTERVAL = 2 * 60 * 1000

export const usePresenceHeartbeat = () => {
  const { data: sessionData, isPending } = authClient.useSession()
  const { mutate } = usePostPresence()
  const sessionId = sessionData?.session?.id

  useEffect(() => {
    if (isPending || !sessionId) return

    let intervalId: number | null = null

    const start = () => {
      if (intervalId !== null) return
      mutate()
      intervalId = window.setInterval(() => mutate(), HEARTBEAT_INTERVAL)
    }

    const stop = () => {
      if (intervalId === null) return
      window.clearInterval(intervalId)
      intervalId = null
    }

    if (document.hasFocus()) start()

    window.addEventListener("focus", start)
    window.addEventListener("blur", stop)

    return () => {
      stop()
      window.removeEventListener("focus", start)
      window.removeEventListener("blur", stop)
    }
  }, [isPending, mutate, sessionId])
}
