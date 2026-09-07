import { apiClient } from "@/lib/api-client"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Guide } from "./guide.type"
import { PaginatedResponse } from "../shared/shared.type"

export const useInfiniteGuides = (kv?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ["guides", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return apiClient.get<PaginatedResponse<Guide>>("/guides", {
        params: { ...kv, page: pageParam },
      })
    },

    getNextPageParam: (lastPage: Record<string, any>) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined
    },

    staleTime: 1000 * 60 * 5,
  })
}
