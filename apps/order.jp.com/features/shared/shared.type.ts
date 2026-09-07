export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination
}

export type PermissionProps = {
  children: (disabled: boolean, isPending?: boolean) => React.ReactNode
  fallback?: React.ReactNode
}
