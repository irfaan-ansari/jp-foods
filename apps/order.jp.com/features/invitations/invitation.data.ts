"use client"

import { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { authClient } from "@jp/auth/client"

export const useTeamInvitations = () => {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listInvitations()
      if (error) throw new AppError("INVALID_REQUEST")
      return { data }
    },
    staleTime: 1000 * 60 * 5,
  })
}

export const STATUS = {
  accepted: { label: "Accepted", color: "#22C55E" },
  pending: { label: "Pending", color: "#F59E0B" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
}
