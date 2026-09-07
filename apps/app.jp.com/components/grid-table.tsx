"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jp/ui/components/table"
import { cn } from "@jp/ui/lib/utils"
import {
  EmptyState,
  ErrorState,
  Spinner,
} from "@jp/ui/components/jp/empty-state"
import { Pagination } from "@jp/ui/components/jp/pagination"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import type { AppError } from "@jp/utils"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string
  }
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: any | undefined
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data?: PaginatedResponse<TData>
  isPending: boolean
  isError: boolean
  error: AppError | null
}

export function GridTable<TData, TValue>({
  columns,
  isPending,
  isError,
  error,
  data: tableData,
}: DataTableProps<TData, TValue>) {
  const { queryParams } = useRouterStuff()
  const {
    pagination = {
      page: 1,
      limit: 24,
      total: 0,
      totalPages: 1,
    },
    data = [],
  } = tableData || {}

  const paginationState: PaginationState = {
    pageIndex: pagination.page - 1,
    pageSize: pagination.limit,
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: paginationState,
    },
    pageCount: pagination.totalPages,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border **:data-[slot=table-container]:no-scrollbar">
        <Table className="bg-background">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      `px-4 py-2 text-sm font-medium text-muted-foreground uppercase ${header.column.columnDef.meta?.className}`
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {data?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-background">
                <TableCell colSpan={columns.length} className="p-0 text-center">
                  {isPending ? (
                    <Spinner className="h-64" />
                  ) : isError ? (
                    <ErrorState
                      title={error?.message ?? "Unable to load data"}
                      description={
                        error?.description ??
                        "Please refresh the page and try again."
                      }
                    />
                  ) : (
                    <EmptyState
                      title="No results found"
                      description="There are no items to display. Adjust your search or filters to see more results."
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isPending && !isError && (
        <Pagination
          page={pagination.page}
          total={pagination.total}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          onPageChange={(page) =>
            queryParams({ set: { page: page.toString() } })
          }
        />
      )}
    </div>
  )
}
