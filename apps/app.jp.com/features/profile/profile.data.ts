"use client"
import { authClient } from "@jp/auth/client"
import { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"

export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { error, data } = await authClient.listSessions()
      if (error) throw new AppError("UNAUTHORIZED", { message: error.message })
      return data
    },
  })
}
