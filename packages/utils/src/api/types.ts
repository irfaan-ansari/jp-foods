export type GetOptions = {
  params?: Record<string, string | number | boolean | undefined>
  headers?: HeadersInit
  signal?: AbortSignal
}

export type PostOptions<TBody = unknown> = {
  body?: TBody
  headers?: HeadersInit
  signal?: AbortSignal
}

export type ApiClientOptions = {
  baseURL: string
  basePath?: string
}
