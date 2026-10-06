"use client"

import React, { useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { Badge } from "@jp/ui/components/badge"
import { Button } from "@jp/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import { Alert, AlertDescription, AlertTitle } from "@jp/ui/components/alert"
import { Download, FileSpreadsheet, Loader2, Upload } from "lucide-react"
import { Input } from "@jp/ui/components/input"
import { importProductPrices } from "@/features/org/product/product.action"
import {
  parseProductPriceImportCsv,
  PRODUCT_PRICE_IMPORT_PREVIEW_LIMIT,
  type ProductPriceImportState,
} from "../product.utils"

export const ProductPriceImportDialog = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<ProductPriceImportState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const previewRows = useMemo(
    () => state?.rows.slice(0, PRODUCT_PRICE_IMPORT_PREVIEW_LIMIT) ?? [],
    [state?.rows]
  )

  const handleFile = async (file: File | undefined) => {
    setError(null)
    setState(null)

    if (!file) return

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please choose a CSV file.")
      return
    }

    try {
      const text = await file.text()
      setState(parseProductPriceImportCsv(text, file.name))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to parse CSV.")
    }
  }

  const handleImport = async () => {
    if (!state) return

    const toastId = toast.loading("Importing product updates...")
    setIsImporting(true)

    try {
      const result = await importProductPrices({
        rows: state.rows.map(({ rowNumber, ...row }) => row),
      })

      if (result?.serverError || result?.validationErrors || !result?.data) {
        toast.error(
          result?.serverError?.message ??
            "Unable to import products. Check the CSV values.",
          { id: toastId }
        )
        return
      }

      const { updated, notFound, skipped, total } = result.data
      toast.success(
        `Updated ${updated} of ${total} rows${skipped ? `, skipped ${skipped}` : ""}${notFound.length ? `, ${notFound.length} not found` : ""}.`,
        { id: toastId }
      )

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["count", "/org/products/count"] }),
      ])

      if (notFound.length === 0) {
        setOpen(false)
        setState(null)
        if (inputRef.current) inputRef.current.value = ""
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to import products.",
        { id: toastId }
      )
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-4xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-bold">
            Bulk Price Import
          </AppDialogTitle>
        </AppDialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="csv-file"
              className="flex flex-col gap-3 rounded-2xl border border-dashed bg-secondary/40 p-4"
            >
              <div className="flex size-12 items-center justify-center rounded-lg border bg-background">
                <Upload className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1 text-center">
                <div className="text-sm font-medium">Upload product CSV</div>
                <div className="text-sm text-muted-foreground">
                  Required: item code. Optional: price, stock, stock UOM, sell
                  UOM.
                </div>
              </div>
              <Input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                id="csv-file"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
              <Button type="button" variant="outline" asChild>
                <span>
                  <FileSpreadsheet />
                  Choose CSV
                </span>
              </Button>
            </FieldLabel>
            <FieldDescription>
              Accepted headers: item code, price, stock, stock UOM, sell UOM.
              Only columns present in the CSV will be updated.
            </FieldDescription>
          </Field>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Unable to preview CSV</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-2xl border bg-secondary/40 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">Import preview</div>
                <div className="text-sm text-muted-foreground">
                  Showing up to {PRODUCT_PRICE_IMPORT_PREVIEW_LIMIT} rows
                  before import.
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{state?.fileName ?? "No file"}</Badge>
                <Badge variant="secondary">
                  {state ? `${state.rows.length} records` : "0 records"}
                </Badge>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border bg-background">
              <div className="grid grid-cols-5 border-b text-sm font-medium">
                <div className="border-r px-3 py-2">Item Code</div>
                <div className="border-r px-3 py-2">Price</div>
                <div className="border-r px-3 py-2">Stock</div>
                <div className="border-r px-3 py-2">Stock UOM</div>
                <div className="px-3 py-2">Sell UOM</div>
              </div>
              {previewRows.length > 0 ? (
                previewRows.map((row) => (
                  <div
                    key={`${row.rowNumber}-${row.itemCode}`}
                    className="grid grid-cols-5 border-b text-sm last:border-b-0"
                  >
                    <div className="border-r px-3 py-2 font-medium">
                      {row.itemCode}
                    </div>
                    <div className="border-r px-3 py-2 text-muted-foreground">
                      {row.price ?? "-"}
                    </div>
                    <div className="border-r px-3 py-2 text-muted-foreground">
                      {row.stock ?? "-"}
                    </div>
                    <div className="border-r px-3 py-2 text-muted-foreground">
                      {row.stockUOM ?? "-"}
                    </div>
                    <div className="px-3 py-2 text-muted-foreground">
                      {row.sellUOM ?? "-"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Rows will appear here after a file is selected.
                </div>
              )}
            </div>

            {state && state.rows.length > PRODUCT_PRICE_IMPORT_PREVIEW_LIMIT && (
              <p className="mt-3 text-xs text-muted-foreground">
                Previewing {PRODUCT_PRICE_IMPORT_PREVIEW_LIMIT} of{" "}
                {state.rows.length} records.
              </p>
            )}
          </div>
        </FieldGroup>

        <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4">
          <AppDialogClose asChild>
            <Button type="button" variant="outline" className="sm:w-28">
              Cancel
            </Button>
          </AppDialogClose>
          <Button
            type="button"
            className="sm:w-36"
            disabled={!state || isImporting}
            onClick={handleImport}
          >
            {isImporting ? <Loader2 className="animate-spin" /> : <Download />}
            Import
          </Button>
        </Field>
      </AppDialogContent>
    </AppDialog>
  )
}
