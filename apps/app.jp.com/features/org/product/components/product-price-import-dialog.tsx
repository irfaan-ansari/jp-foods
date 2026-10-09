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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@jp/ui/components/select"
import { importProductPrices } from "@/features/org/product/product.action"
import {
  parseProductPriceImportCsv,
  readProductPriceImportHeaders,
  autoMapProductPriceColumns,
  PRODUCT_PRICE_IMPORT_FIELDS,
  type ProductPriceColumnMapping,
  PRODUCT_PRICE_IMPORT_PREVIEW_LIMIT,
} from "../product.utils"

export const ProductPriceImportDialog = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<{
    text: string
    fileName: string
    headers: string[]
  } | null>(null)

  const [mapping, setMapping] = useState<ProductPriceColumnMapping>({})
  const [error, setError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { state, mappingError } = useMemo(() => {
    if (!source) return { state: null, mappingError: null }
    try {
      return {
        state: parseProductPriceImportCsv(
          source.text,
          source.fileName,
          mapping
        ),
        mappingError: null,
      }
    } catch (error) {
      return {
        state: null,
        mappingError:
          error instanceof Error ? error.message : "Unable to preview CSV.",
      }
    }
  }, [source, mapping])

  const handleFile = async (file: File | undefined) => {
    setError(null)
    setSource(null)
    setMapping({})

    if (!file) return

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please choose a CSV file.")
      return
    }

    try {
      const text = await file.text()
      const headers = readProductPriceImportHeaders(text)
      setMapping(autoMapProductPriceColumns(headers))
      setSource({ text, fileName: file.name, headers })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to parse CSV.")
    }
  }

  const handleImport = async () => {
    if (!state) return

    const toastId = toast.loading("Importing products...")
    setIsImporting(true)

    const result = await importProductPrices({
      rows: state.rows.map(({ itemCode, price }) => ({ itemCode, price })),
    })

    if (result?.serverError || result?.validationErrors || !result?.data) {
      toast.error(
        result?.serverError?.message ??
          "Unable to import products. Check the CSV values.",
        { id: toastId }
      )
      return
    }

    toast.success(`Price imported successfully.`, { id: toastId })

    queryClient.invalidateQueries({ queryKey: ["products"] })
    queryClient.invalidateQueries({
      queryKey: ["count", "/org/products/count"],
    })
    setIsImporting(false)
    setOpen(false)
    setSource(null)
    setMapping({})
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="max-h-[90svh] overflow-hidden md:max-w-2xl">
        <AppDialogHeader className="shrink-0">
          <AppDialogTitle className="text-base font-bold">
            Bulk Price Import
          </AppDialogTitle>
        </AppDialogHeader>

        <FieldGroup className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
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
                  Required: item code and price.
                </div>
              </div>
              <Input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                id="csv-file"
                disabled={isImporting}
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
              Match your item code and price columns below. Rows without an item
              code or price are ignored.
            </FieldDescription>
          </Field>

          {source && (
            <div className="space-y-3 rounded-2xl border p-4">
              <div>
                <div className="text-sm font-medium">Map CSV columns</div>
                <p className="text-sm text-muted-foreground">
                  Item code and price are required. Review the automatic matches
                  before importing.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {PRODUCT_PRICE_IMPORT_FIELDS.map(({ key, label, required }) => (
                  <Field key={key}>
                    <FieldLabel htmlFor={`csv-map-${key}`}>
                      {label}
                      {required ? " *" : ""}
                    </FieldLabel>
                    <Select
                      value={
                        mapping[key] === undefined
                          ? "unmapped"
                          : String(mapping[key])
                      }
                      disabled={isImporting}
                      required={required}
                      onValueChange={(value) => {
                        setMapping((current) => {
                          const next = { ...current }
                          if (value === "unmapped") delete next[key]
                          else next[key] = Number(value)
                          return next
                        })
                      }}
                    >
                      <SelectTrigger id={`csv-map-${key}`} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" className="no-scrollbar">
                        <SelectItem value="unmapped">
                          {required ? "Select a column" : "Do not import"}
                        </SelectItem>
                        {source.headers.map((header, index) => (
                          <SelectItem
                            key={index}
                            value={String(index)}
                            disabled={PRODUCT_PRICE_IMPORT_FIELDS.some(
                              (field) =>
                                field.key !== key &&
                                mapping[field.key] === index
                            )}
                          >
                            {header || "Unnamed column"} (column {index + 1})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                ))}
              </div>
            </div>
          )}

          {(error || mappingError) && (
            <Alert variant="destructive">
              <AlertTitle>Unable to preview CSV</AlertTitle>
              <AlertDescription>{error || mappingError}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-2xl border bg-secondary/40 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-medium">Import preview</div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{source?.fileName ?? "No file"}</Badge>
                <Badge variant="secondary">
                  {state ? `${state.rows.length} records` : "0 records"}
                </Badge>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border bg-background">
              <div className="grid grid-cols-2 border-b text-sm font-medium">
                <div className="border-r px-3 py-2">Item Code</div>
                <div className="px-3 py-2">Price</div>
              </div>
              {(state?.rows?.length ?? 0) > 0 ? (
                state?.rows.map((row) => (
                  <div
                    key={`${row.rowNumber}-${row.itemCode}`}
                    className="grid grid-cols-2 border-b text-sm last:border-b-0"
                  >
                    <div className="border-r px-3 py-2 font-medium">
                      {row.itemCode}
                    </div>
                    <div className="px-3 py-2 text-muted-foreground">
                      {row.price ?? "-"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Rows will appear here after a file is selected.
                </div>
              )}
            </div>

            {state &&
              state.rows.length > PRODUCT_PRICE_IMPORT_PREVIEW_LIMIT && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Previewing {PRODUCT_PRICE_IMPORT_PREVIEW_LIMIT} of{" "}
                  {state.rows.length} records.
                </p>
              )}
          </div>
        </FieldGroup>

        <Field className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4">
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
