import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { fetcher } from "@jp/utils"
import { useInfiniteQuery } from "@tanstack/react-query"
import { PaginatedResponse } from "../shared/shared.type"
import { Guide } from "./guide.type"

export const useInfiniteGuides = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()

  return useInfiniteQuery({
    queryKey: ["guides", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const queryString = getQueryString({
        ...kv,
        page: pageParam,
      })

      return fetcher<PaginatedResponse<Guide>>(
        `/api/v1/team/guides${queryString}`
      )
    },

    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined
    },

    staleTime: 1000 * 60 * 5,
  })
}
