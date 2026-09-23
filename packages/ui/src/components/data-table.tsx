"use client"

import React from "react"
import {
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table"
import { Skeleton } from "@jp/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jp/ui/components/table"
import { EmptyState, ErrorState, Pagination } from "@jp/ui/components/jp"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

export const dataTableFeatures = tableFeatures({})
export type DataTableFeatures = typeof dataTableFeatures

export type DataTablePagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  pagination?: DataTablePagination | undefined
  getRowId?: (row: TData) => string
  empty?: {
    isEmpty?: boolean
    title: string | undefined
    description?: string | undefined
  }
  error?: {
    isError: boolean
    title: string | undefined
    description?: string | undefined
  }
  isLoading?: boolean
  className?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  pagination,
  getRowId,
  empty,
  error,
  isLoading = false,
  className,
}: DataTableProps<TData>) {
  const { queryParams } = useRouterStuff()
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
  })

  const rows = table.getRowModel().rows

  return (
    <React.Fragment>
      <div className="h-full">
        <Table className={className}>
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 border-b-2 border-primary/50 px-3 py-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index} className="hover:transparent">
                  {columns.map((_, columnIndex) => (
                    <TableCell key={columnIndex} className="py-4">
                      <Skeleton className="h-5 w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error?.isError ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <ErrorState
                    title={error.title ?? "Unable to load data"}
                    description={error.description ?? "Please try again."}
                  />
                </TableCell>
              </TableRow>
            ) : rows.length && !empty?.isEmpty ? (
              rows.map((row) => (
                <TableRow key={row.id} className="relative hover:bg-muted/50">
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-sm text-muted-foreground"
                >
                  <EmptyState
                    title={empty?.title ?? "No results found."}
                    description={
                      empty?.description ??
                      "Try adjusting your search or filters."
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && !isLoading && !error?.isError && (
        <Pagination
          page={pagination.page}
          total={pagination.total}
          limit={pagination.limit}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            queryParams({ set: { page: String(page) }, scroll: false })
          }
        />
      )}
    </React.Fragment>
  )
}
