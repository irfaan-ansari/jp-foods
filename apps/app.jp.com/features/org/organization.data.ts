import { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import { Organization } from "./organization.types"

import { apiClient } from "@/lib/api-client"

export const useOrganization = () => {
  return useQuery<ApiResponse<Organization>, AppError>({
    queryKey: ["organization"],
    queryFn: () => apiClient.get("/org/"),
    staleTime: 50 * 100 * 5,
  })
}
