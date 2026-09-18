export type Catalog = {
  id: number
  title: string
  image: string
  description?: string | null
  categories?: string[] | null
  itemCode?: string
}

export type CatalogPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type CatalogResponse = {
  success: boolean
  authorized: boolean
  data: Catalog[]
  pagination: CatalogPagination
}
