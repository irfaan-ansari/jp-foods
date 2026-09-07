type PaginationQuery = {
  page?: string | number
  limit?: string | number
}

export const parsePagination = (query: PaginationQuery) => {
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Number(query.limit) || 24)

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  }
}
